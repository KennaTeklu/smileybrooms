"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useMemo } from "react"
import { defaultTiers, getRoomTiers, getRoomAddOns, getRoomReductions } from "@/lib/room-tiers"

export type RoomConfig = {
  roomName: string
  selectedTier: string // e.g., "bedroom-essential"
  selectedAddOns: string[] // e.g., ["bed-1", "bed-2"]
  selectedReductions: string[] // e.g., ["bed-r1"]
  totalPrice: number
  detailedTasks: string[]
  notIncludedTasks: string[]
  upsellMessage: string
}

type RoomCounts = Record<string, number> // e.g., { "bedroom": 2, "bathroom": 1 }
type RoomConfigs = Record<string, RoomConfig> // e.g., { "bedroom": { ...config }, "bathroom": { ...config } }

type RoomContextType = {
  roomCounts: RoomCounts
  roomConfigs: RoomConfigs
  updateRoomCount: (roomType: string, count: number) => void
  updateRoomConfig: (roomType: string, config: Partial<RoomConfig>) => void // New function
  getTotalPrice: () => number
  getSelectedRoomTypes: () => string[]
  getRoomConfig: (roomType: string) => RoomConfig | undefined
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomCounts, setRoomCounts] = useState<RoomCounts>({})
  const [roomConfigs, setRoomConfigs] = useState<RoomConfigs>({})

  const calculateRoomPrice = useCallback((roomType: string, config: RoomConfig): number => {
    const baseTier =
      defaultTiers[roomType]?.find((tier) => tier.id === config.selectedTier) ||
      defaultTiers.default.find((tier) => tier.id === config.selectedTier) // Fallback to default tiers
    let price = baseTier ? baseTier.price : 0

    const roomAddOns = getRoomAddOns(roomType)
    config.selectedAddOns.forEach((addOnId) => {
      const addOn = roomAddOns.find((ao) => ao.id === addOnId)
      if (addOn) price += addOn.price
    })

    const roomReductions = getRoomReductions(roomType)
    config.selectedReductions.forEach((reductionId) => {
      const reduction = roomReductions.find((red) => red.id === reductionId)
      if (reduction) price -= reduction.discount
    })

    return Math.max(0, price) // Ensure price doesn't go below zero
  }, [])

  const generateDetailedTasks = useCallback((roomType: string, config: RoomConfig) => {
    const tier =
      defaultTiers[roomType]?.find((t) => t.id === config.selectedTier) ||
      defaultTiers.default.find((t) => t.id === config.selectedTier)
    const addOns = getRoomAddOns(roomType).filter((ao) => config.selectedAddOns.includes(ao.id))
    const reductions = getRoomReductions(roomType).filter((red) => config.selectedReductions.includes(red.id))

    // Corrected from tier.features to tier.detailedTasks
    const includedTasks = tier ? [...tier.detailedTasks, ...addOns.map((ao) => ao.name)] : []
    const notIncludedTasks = reductions.map((red) => red.name)

    // Simple upsell message logic (can be expanded)
    const upsellMessage =
      tier?.id.includes("essential") && addOns.length === 0 && reductions.length === 0
        ? `Consider upgrading to a ${roomType}-premium clean for more comprehensive service!`
        : ""

    return { detailedTasks: includedTasks, notIncludedTasks, upsellMessage }
  }, [])

  const updateRoomCount = useCallback(
    (roomType: string, count: number) => {
      setRoomCounts((prevCounts) => {
        const newCounts = { ...prevCounts, [roomType]: count }
        if (count <= 0) {
          delete newCounts[roomType]
          setRoomConfigs((prevConfigs) => {
            const newConfigs = { ...prevConfigs }
            delete newConfigs[roomType]
            return newConfigs
          })
        } else if (!prevCounts[roomType] || prevCounts[roomType] === 0) {
          // If adding a new room type or increasing from zero, set a default config
          const defaultTier = getRoomTiers(roomType)[0] // Get the first tier as default
          if (defaultTier) {
            const initialConfig: RoomConfig = {
              roomName: roomType, // Will be overwritten by updateRoomConfig if custom
              selectedTier: defaultTier.id,
              selectedAddOns: [],
              selectedReductions: [],
              totalPrice: defaultTier.price,
              detailedTasks: defaultTier.detailedTasks, // Corrected here as well for initial config
              notIncludedTasks: [],
              upsellMessage: "",
            }
            const { detailedTasks, notIncludedTasks, upsellMessage } = generateDetailedTasks(roomType, initialConfig)
            setRoomConfigs((prevConfigs) => ({
              ...prevConfigs,
              [roomType]: {
                ...initialConfig,
                totalPrice: calculateRoomPrice(roomType, initialConfig),
                detailedTasks,
                notIncludedTasks,
                upsellMessage,
              },
            }))
          }
        }
        return newCounts
      })
    },
    [calculateRoomPrice, generateDetailedTasks],
  )

  const updateRoomConfig = useCallback(
    (roomType: string, partialConfig: Partial<RoomConfig>) => {
      setRoomConfigs((prevConfigs) => {
        const currentConfig = prevConfigs[roomType] || {
          roomName: roomType,
          selectedTier: getRoomTiers(roomType)[0]?.id || "default-essential",
          selectedAddOns: [],
          selectedReductions: [],
          totalPrice: 0,
          detailedTasks: [],
          notIncludedTasks: [],
          upsellMessage: "",
        }

        const updatedConfig = { ...currentConfig, ...partialConfig }

        // Recalculate price and tasks if tier, add-ons, or reductions change
        const needsRecalculation =
          partialConfig.selectedTier !== undefined ||
          partialConfig.selectedAddOns !== undefined ||
          partialConfig.selectedReductions !== undefined

        if (needsRecalculation) {
          updatedConfig.totalPrice = calculateRoomPrice(roomType, updatedConfig)
          const { detailedTasks, notIncludedTasks, upsellMessage } = generateDetailedTasks(roomType, updatedConfig)
          updatedConfig.detailedTasks = detailedTasks
          updatedConfig.notIncludedTasks = notIncludedTasks
          updatedConfig.upsellMessage = upsellMessage
        }

        return {
          ...prevConfigs,
          [roomType]: updatedConfig,
        }
      })
    },
    [calculateRoomPrice, generateDetailedTasks],
  )

  const getTotalPrice = useCallback(() => {
    return Object.entries(roomCounts).reduce((total, [roomType, count]) => {
      const config = roomConfigs[roomType]
      return total + (config ? config.totalPrice * count : 0)
    }, 0)
  }, [roomCounts, roomConfigs])

  const getSelectedRoomTypes = useCallback(() => {
    return Object.keys(roomCounts).filter((roomType) => roomCounts[roomType] > 0)
  }, [roomCounts])

  const getRoomConfig = useCallback(
    (roomType: string) => {
      return roomConfigs[roomType]
    },
    [roomConfigs],
  )

  const contextValue = useMemo(
    () => ({
      roomCounts,
      roomConfigs,
      updateRoomCount,
      updateRoomConfig, // Expose the new function
      getTotalPrice,
      getSelectedRoomTypes,
      getRoomConfig,
    }),
    [roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, getTotalPrice, getSelectedRoomTypes, getRoomConfig],
  )

  return <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>
}

export const useRoomContext = () => {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRoomContext must be used within a RoomProvider")
  }
  return context
}
