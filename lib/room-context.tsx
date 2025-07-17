"use client"

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect, useRef } from "react"
import { getRoomTiers, getRoomAddOns, getRoomReductions, requiresEmailPricing } from "@/lib/room-tiers"
import { useToast } from "@/components/ui/use-toast"

export interface RoomConfig {
  roomName: string
  count: number
  selectedTier: string // ID of the selected tier
  selectedAddOns: string[] // IDs of selected add-ons
  selectedReductions: string[] // IDs of selected reductions
  totalPrice: number
  detailedTasks: string[]
  notIncludedTasks: string[]
  upsellMessage: string
  isPriceTBD: boolean
  timeEstimate?: string // e.g., "2-3 hours"
  paymentType?: "online" | "in_person"
}

interface RoomContextType {
  roomCounts: Record<string, number>
  roomConfigs: Record<string, RoomConfig>
  updateRoomCount: (roomType: string, count: number) => void
  updateRoomConfig: (roomType: string, config: Partial<RoomConfig>) => void
  getSelectedRoomTypes: () => string[]
  getCalculatedRoomPrice: (roomType: string, config: Partial<RoomConfig>) => number // New function
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>({})
  const [roomConfigs, setRoomConfigs] = useState<Record<string, RoomConfig>>({})
  const roomConfigsRef = useRef(roomConfigs) // Ref to hold the latest roomConfigs for useEffect

  const { toast } = useToast()

  // Update ref whenever roomConfigs state changes
  useEffect(() => {
    roomConfigsRef.current = roomConfigs
  }, [roomConfigs])

  // Helper to calculate price for a given config
  const calculatePriceForConfig = useCallback((roomType: string, config: Partial<RoomConfig>): number => {
    const currentConfig = roomConfigsRef.current[roomType] || config
    const selectedTier = getRoomTiers(roomType).find((tier) => tier.id === currentConfig.selectedTier)
    let calculatedPrice = selectedTier ? selectedTier.price : 0
    ;(currentConfig.selectedAddOns || []).forEach((addOnId) => {
      const addOn = getRoomAddOns(roomType).find((a) => a.id === addOnId)
      if (addOn) {
        calculatedPrice += addOn.price
      }
    })
    ;(currentConfig.selectedReductions || []).forEach((reductionId) => {
      const reduction = getRoomReductions(roomType).find((r) => r.id === reductionId)
      if (reduction) {
        calculatedPrice -= reduction.discount
      }
    })

    return Math.max(0, calculatedPrice)
  }, [])

  // New function to expose calculated price
  const getCalculatedRoomPrice = useCallback(
    (roomType: string, config: Partial<RoomConfig>): number => {
      return calculatePriceForConfig(roomType, config)
    },
    [calculatePriceForConfig],
  )

  const updateRoomCount = useCallback((roomType: string, count: number) => {
    setRoomCounts((prevCounts) => {
      const newCounts = { ...prevCounts, [roomType]: count }
      return newCounts
    })

    setRoomConfigs((prevConfigs) => {
      const newRoomConfigs = { ...prevConfigs }
      const currentRoomConfig = prevConfigs[roomType]

      if (count > 0) {
        if (!currentRoomConfig || (currentRoomConfig.count === 0 && count > 0)) {
          // Initialize config for newly added room type or if count was 0
          const defaultTier = getRoomTiers(roomType)[0]
          if (defaultTier) {
            newRoomConfigs[roomType] = {
              roomName: roomType,
              count: count,
              selectedTier: defaultTier.id,
              selectedAddOns: [],
              selectedReductions: [],
              totalPrice: 0, // Will be calculated in the useEffect below
              detailedTasks: defaultTier.detailedTasks,
              notIncludedTasks: defaultTier.notIncludedTasks,
              upsellMessage: defaultTier.upsellMessage,
              isPriceTBD: defaultTier.isPriceTBD,
              paymentType: defaultTier.paymentType,
            }
          }
        } else {
          // Update count for existing config
          newRoomConfigs[roomType] = { ...currentRoomConfig, count: count }
        }
      } else {
        // Remove config if count is 0
        delete newRoomConfigs[roomType]
      }
      return newRoomConfigs
    })
  }, [])

  const updateRoomConfig = useCallback((roomType: string, newConfig: Partial<RoomConfig>) => {
    setRoomConfigs((prevConfigs) => {
      const updated = {
        ...prevConfigs,
        [roomType]: {
          ...(prevConfigs[roomType] || {
            roomName: roomType,
            count: 0, // Default count for new config
            selectedTier: getRoomTiers(roomType)[0]?.id || "default-essential", // Ensure default tier is set
            selectedAddOns: [],
            selectedReductions: [],
            totalPrice: 0, // Will be calculated in the useEffect below
            detailedTasks: [],
            notIncludedTasks: [],
            upsellMessage: "",
            isPriceTBD: false,
          }),
          ...newConfig,
        },
      }
      return updated
    })
  }, [])

  const getSelectedRoomTypes = useCallback(() => {
    return Object.keys(roomCounts).filter((roomType) => roomCounts[roomType] > 0)
  }, [roomCounts])

  // Effect to calculate total prices whenever roomConfigs or roomCounts change
  useEffect(() => {
    const newRoomConfigs = { ...roomConfigsRef.current } // Use ref for latest state
    let hasChanges = false

    Object.keys(newRoomConfigs).forEach((roomType) => {
      const config = newRoomConfigs[roomType]
      if (config) {
        const newCalculatedPrice = calculatePriceForConfig(roomType, config)
        const newIsPriceTBD =
          requiresEmailPricing(roomType) ||
          (getRoomTiers(roomType).find((tier) => tier.id === config.selectedTier)?.isPriceTBD ?? false)

        if (config.totalPrice !== newCalculatedPrice || config.isPriceTBD !== newIsPriceTBD) {
          newRoomConfigs[roomType] = {
            ...config,
            totalPrice: newCalculatedPrice,
            isPriceTBD: newIsPriceTBD,
          }
          hasChanges = true
        }
      }
    })

    if (hasChanges) {
      setRoomConfigs(newRoomConfigs)
    }
  }, [roomCounts, roomConfigsRef, calculatePriceForConfig]) // Depend on roomCounts and the ref

  return (
    <RoomContext.Provider
      value={{
        roomCounts,
        roomConfigs,
        updateRoomCount,
        updateRoomConfig,
        getSelectedRoomTypes,
        getCalculatedRoomPrice,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export const useRoomContext = () => {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRoomContext must be used within a RoomProvider")
  }
  return context
}
