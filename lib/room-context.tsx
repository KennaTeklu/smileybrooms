"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useMemo } from "react"
import { getRoomTiers } from "@/lib/room-tiers"

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
}

interface RoomContextType {
  roomCounts: Record<string, number>
  roomConfigs: Record<string, RoomConfig>
  updateRoomCount: (roomType: string, count: number) => void
  updateRoomConfig: (roomType: string, config: RoomConfig) => void
  resetAllRooms: () => void
  getTotalPrice: () => number
  getSelectedRoomTypes: () => string[]
}

const RoomContext = createContext<RoomContextType | null>(null)

const AVAILABLE_ROOM_TYPES = [
  "bedroom",
  "bathroom",
  "kitchen",
  "living_room",
  "dining_room",
  "hallway",
  "entryway",
  "stairs",
  "home_office",
  "laundry_room",
]

const createDefaultConfig = (roomType: string): RoomConfig => {
  try {
    const tiers = getRoomTiers(roomType)
    const defaultTier = tiers && tiers.length > 0 ? tiers[0] : null
    const basePrice = defaultTier?.price || 50 // Fallback price

    return {
      roomName: roomType.charAt(0).toUpperCase() + roomType.slice(1).replace("_", " "),
      selectedTier: defaultTier?.name || "ESSENTIAL CLEAN",
      selectedAddOns: [],
      basePrice: basePrice,
      tierUpgradePrice: 0,
      addOnsPrice: 0,
      totalPrice: basePrice,
    }
  } catch (error) {
    console.error(`Error creating default config for ${roomType}:`, error)
    // Fallback config if getRoomTiers fails
    return {
      roomName: roomType.charAt(0).toUpperCase() + roomType.slice(1).replace("_", " "),
      selectedTier: "ESSENTIAL CLEAN",
      selectedAddOns: [],
      basePrice: 50,
      tierUpgradePrice: 0,
      addOnsPrice: 0,
      totalPrice: 50,
    }
  }
}

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize room counts for all room types
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>(() => {
    const initialCounts: Record<string, number> = {}
    AVAILABLE_ROOM_TYPES.forEach((roomType) => {
      initialCounts[roomType] = 0
    })
    return initialCounts
  })

  // Initialize room configs for all room types
  const [roomConfigs, setRoomConfigs] = useState<Record<string, RoomConfig>>(() => {
    const initialConfigs: Record<string, RoomConfig> = {}
    AVAILABLE_ROOM_TYPES.forEach((roomType) => {
      initialConfigs[roomType] = createDefaultConfig(roomType)
    })
    return initialConfigs
  })

  const updateRoomCount = useCallback((roomType: string, count: number) => {
    setRoomCounts((prev) => ({
      ...prev,
      [roomType]: Math.max(0, count),
    }))
  }, [])

  const updateRoomConfig = useCallback((roomType: string, config: RoomConfig) => {
    setRoomConfigs((prev) => ({
      ...prev,
      [roomType]: config,
    }))
  }, [])

  const resetAllRooms = useCallback(() => {
    const resetCounts: Record<string, number> = {}
    AVAILABLE_ROOM_TYPES.forEach((roomType) => {
      resetCounts[roomType] = 0
    })
    setRoomCounts(resetCounts)
  }, [])

  const getTotalPrice = useCallback(() => {
    return Object.entries(roomCounts).reduce((total, [roomType, count]) => {
      if (count > 0 && roomConfigs[roomType]) {
        return total + (roomConfigs[roomType].totalPrice || 0) * count
      }
      return total
    }, 0)
  }, [roomCounts, roomConfigs])

  const getSelectedRoomTypes = useCallback(() => {
    return Object.entries(roomCounts)
      .filter(([_, count]) => count > 0)
      .map(([roomType, _]) => roomType)
  }, [roomCounts])

  const contextValue = useMemo(
    () => ({
      roomCounts,
      roomConfigs,
      updateRoomCount,
      updateRoomConfig,
      resetAllRooms,
      getTotalPrice,
      getSelectedRoomTypes,
    }),
    [roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, resetAllRooms, getTotalPrice, getSelectedRoomTypes],
  )

  return <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>
}

export const useRoomContext = () => {
  const context = useContext(RoomContext)
  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider")
  }
  return context
}
