"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useMemo } from "react"

// Define types for RoomConfig and RoomCounts
export interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  reductionsPrice: number
  totalPrice: number
}

export interface RoomCounts {
  [key: string]: number
}

export interface RoomConfigMap {
  [key: string]: RoomConfig
}

interface RoomContextType {
  roomCounts: RoomCounts
  roomConfigs: RoomConfigMap
  selectedRoomForMap: string | null
  updateRoomCount: (roomType: string, count: number) => void
  updateRoomConfig: (roomType: string, config: RoomConfig) => void
  setSelectedRoomForMap: (roomType: string | null) => void
  getTotalPrice: () => number
  getSelectedRoomTypes: () => string[]
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [roomCounts, setRoomCounts] = useState<RoomCounts>({})
  const [roomConfigs, setRoomConfigs] = useState<RoomConfigMap>({})
  const [selectedRoomForMap, setSelectedRoomForMap] = useState<string | null>(null)

  const updateRoomCount = useCallback((roomType: string, count: number) => {
    setRoomCounts((prev) => {
      const newCounts = { ...prev, [roomType]: count }
      // If count becomes 0, ensure it's removed from roomConfigs as well
      if (count === 0) {
        setRoomConfigs((prevConfigs) => {
          const updatedConfigs = { ...prevConfigs }
          delete updatedConfigs[roomType]
          return updatedConfigs
        })
      } else if (!prev[roomType] && count > 0) {
        // If a room is added for the first time, add a default config with PREMIUM CLEAN
        setRoomConfigs((prevConfigs) => ({
          ...prevConfigs,
          [roomType]: {
            roomName: roomType,
            selectedTier: "PREMIUM CLEAN", // Default to PREMIUM CLEAN
            selectedAddOns: [],
            selectedReductions: [],
            basePrice: 50, // Assuming a base price for PREMIUM CLEAN
            tierUpgradePrice: 0,
            addOnsPrice: 0,
            reductionsPrice: 0,
            totalPrice: 50, // Assuming a total price for PREMIUM CLEAN
          },
        }))
      }
      return newCounts
    })
  }, [])

  const updateRoomConfig = useCallback((roomType: string, config: RoomConfig) => {
    setRoomConfigs((prev) => ({ ...prev, [roomType]: config }))
  }, [])

  const getTotalPrice = useCallback(() => {
    return Object.entries(roomCounts).reduce((sum, [roomType, count]) => {
      const config = roomConfigs[roomType]
      return sum + (config ? config.totalPrice * count : 0)
    }, 0)
  }, [roomCounts, roomConfigs])

  const getSelectedRoomTypes = useCallback(() => {
    return Object.keys(roomCounts).filter((roomType) => roomCounts[roomType] > 0)
  }, [roomCounts])

  const value = useMemo(
    () => ({
      roomCounts,
      roomConfigs,
      selectedRoomForMap,
      updateRoomCount,
      updateRoomConfig,
      setSelectedRoomForMap,
      getTotalPrice,
      getSelectedRoomTypes,
    }),
    [
      roomCounts,
      roomConfigs,
      selectedRoomForMap,
      updateRoomCount,
      updateRoomConfig,
      setSelectedRoomForMap,
      getTotalPrice,
      getSelectedRoomTypes,
    ],
  )

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}

export function useRoomContext() {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRoomContext must be used within a RoomProvider")
  }
  return context
}
