"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react"
import { getRoomTiers, getRoomReductions, roomDisplayNames, roomIcons, RoomTierEnum } from "@/lib/room-tiers"

// Define the structure for a room's configuration
export interface RoomConfig {
  roomType: string
  roomName: string
  roomIcon: string
  count: number
  selectedTier: RoomTierEnum
  selectedReductions: string[]
  totalPrice: number // Price for this specific room configuration (per unit)
}

// Define the shape of the RoomContext
interface RoomContextType {
  roomCounts: Record<string, number>
  roomConfigs: Record<string, RoomConfig>
  updateRoomCount: (roomType: string, count: number) => void
  updateRoomConfig: (roomType: string, newConfig: Partial<RoomConfig>) => void
  calculateRoomPrice: (roomType: string, selectedTier: RoomTierEnum, selectedReductions: string[]) => number
  calculateTotalPrice: () => number
  getSelectedRoomTypes: () => string[]
  resetRoomConfigs: () => void
}

// Create the context
const RoomContext = createContext<RoomContextType | undefined>(undefined)

// Initial state for room configurations
const initialRoomConfigs: Record<string, RoomConfig> = {
  bedroom: {
    roomType: "bedroom",
    roomName: roomDisplayNames.bedroom,
    roomIcon: roomIcons.bedroom,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  bathroom: {
    roomType: "bathroom",
    roomName: roomDisplayNames.bathroom,
    roomIcon: roomIcons.bathroom,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  kitchen: {
    roomType: "kitchen",
    roomName: roomDisplayNames.kitchen,
    roomIcon: roomIcons.kitchen,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  livingRoom: {
    roomType: "livingRoom",
    roomName: roomDisplayNames.livingRoom,
    roomIcon: roomIcons.livingRoom,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  diningRoom: {
    roomType: "diningRoom",
    roomName: roomDisplayNames.diningRoom,
    roomIcon: roomIcons.diningRoom,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  homeOffice: {
    roomType: "homeOffice",
    roomName: roomDisplayNames.homeOffice,
    roomIcon: roomIcons.homeOffice,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  laundryRoom: {
    roomType: "laundryRoom",
    roomName: roomDisplayNames.laundryRoom,
    roomIcon: roomIcons.laundryRoom,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  entryway: {
    roomType: "entryway",
    roomName: roomDisplayNames.entryway,
    roomIcon: roomIcons.entryway,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  hallway: {
    roomType: "hallway",
    roomName: roomDisplayNames.hallway,
    roomIcon: roomIcons.hallway,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  stairs: {
    roomType: "stairs",
    roomName: roomDisplayNames.stairs,
    roomIcon: roomIcons.stairs,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
  other: {
    roomType: "other",
    roomName: roomDisplayNames.other,
    roomIcon: roomIcons.other,
    count: 0,
    selectedTier: RoomTierEnum.Essential,
    selectedReductions: [],
    totalPrice: 0,
  },
}

// RoomProvider component
export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [roomConfigs, setRoomConfigs] = useState<Record<string, RoomConfig>>(() => {
    if (typeof window !== "undefined") {
      const savedConfigs = localStorage.getItem("smileyBroomsRoomConfigs")
      if (savedConfigs) {
        const parsedConfigs = JSON.parse(savedConfigs)
        // Merge saved configs with initial to ensure all rooms are present and new fields are added
        return Object.keys(initialRoomConfigs).reduce(
          (acc, roomType) => {
            acc[roomType] = { ...initialRoomConfigs[roomType], ...parsedConfigs[roomType] }
            return acc
          },
          {} as Record<string, RoomConfig>,
        )
      }
    }
    return initialRoomConfigs
  })

  // Persist room configurations to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("smileyBroomsRoomConfigs", JSON.stringify(roomConfigs))
    }
  }, [roomConfigs])

  const calculateRoomPrice = useCallback(
    (roomType: string, selectedTier: RoomTierEnum, selectedReductions: string[]): number => {
      const tiers = getRoomTiers(roomType)
      const selectedTierObj = tiers.find((tier) => tier.name === selectedTier)

      if (!selectedTierObj) {
        console.warn(`Tier ${selectedTier} not found for room type ${roomType}. Using default price.`)
        return 0 // Or throw an error, or use a fallback price
      }

      let price = selectedTierObj.price

      // Apply reductions
      const reductions = getRoomReductions(roomType)
      selectedReductions.forEach((reductionId) => {
        const reduction = reductions.find((r) => r.id === reductionId)
        if (reduction) {
          price -= reduction.discount
        }
      })

      return Math.max(0, price) // Ensure price doesn't go below zero
    },
    [],
  )

  const updateRoomCount = useCallback(
    (roomType: string, count: number) => {
      setRoomConfigs((prevConfigs) => {
        const updatedConfig = { ...prevConfigs[roomType], count: Math.max(0, count) }
        // Recalculate total price for this room based on its new count and existing config
        updatedConfig.totalPrice =
          updatedConfig.count > 0
            ? calculateRoomPrice(updatedConfig.roomType, updatedConfig.selectedTier, updatedConfig.selectedReductions)
            : 0
        return {
          ...prevConfigs,
          [roomType]: updatedConfig,
        }
      })
    },
    [calculateRoomPrice],
  )

  const updateRoomConfig = useCallback(
    (roomType: string, newConfig: Partial<RoomConfig>) => {
      setRoomConfigs((prevConfigs) => {
        const currentConfig = prevConfigs[roomType]
        const updatedConfig = { ...currentConfig, ...newConfig }

        // Recalculate price based on potentially new tier/add-ons/reductions
        updatedConfig.totalPrice = calculateRoomPrice(
          updatedConfig.roomType,
          updatedConfig.selectedTier,
          updatedConfig.selectedReductions,
        )

        return {
          ...prevConfigs,
          [roomType]: updatedConfig,
        }
      })
    },
    [calculateRoomPrice],
  )

  const calculateTotalPrice = useCallback(() => {
    return Object.values(roomConfigs).reduce((total, config) => {
      if (config.count > 0 && !config.isPriceTBD) {
        return total + config.totalPrice * config.count
      }
      return total
    }, 0)
  }, [roomConfigs])

  const getSelectedRoomTypes = useCallback(() => {
    return Object.keys(roomConfigs).filter((roomType) => roomConfigs[roomType].count > 0)
  }, [roomConfigs])

  const resetRoomConfigs = useCallback(() => {
    setRoomConfigs(initialRoomConfigs)
    if (typeof window !== "undefined") {
      localStorage.removeItem("smileyBroomsRoomConfigs")
    }
  }, [])

  const roomCounts = useMemo(() => {
    return Object.keys(roomConfigs).reduce(
      (acc, roomType) => {
        acc[roomType] = roomConfigs[roomType].count
        return acc
      },
      {} as Record<string, number>,
    )
  }, [roomConfigs])

  const value = useMemo(
    () => ({
      roomCounts,
      roomConfigs,
      updateRoomCount,
      updateRoomConfig,
      calculateRoomPrice,
      calculateTotalPrice,
      getSelectedRoomTypes,
      resetRoomConfigs,
    }),
    [
      roomCounts,
      roomConfigs,
      updateRoomCount,
      updateRoomConfig,
      calculateRoomPrice,
      calculateTotalPrice,
      getSelectedRoomTypes,
      resetRoomConfigs,
    ],
  )

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}

// Custom hook to use the room context
export const useRoomContext = () => {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRoomContext must be used within a RoomProvider")
  }
  return context
}
