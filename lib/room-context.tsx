"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useMemo } from "react"
import type { RoomContextType, RoomConfig, PricingBreakdown } from "@/lib/types"
import { roomTiers } from "@/lib/room-tiers"
import { useCart } from "@/lib/cart-context"

const RoomContext = createContext<RoomContextType | undefined>(undefined)

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: number }>({})
  const { addItem, removeItem, updateQuantity, clearCart } = useCart()

  // Initialize room configurations from lib/room-tiers.ts
  const roomConfigs = useMemo(() => {
    const configs: { [key: string]: RoomConfig[] } = {}
    roomTiers.forEach((tier) => {
      if (!configs[tier.roomType]) {
        configs[tier.roomType] = []
      }
      configs[tier.roomType].push(tier)
    })
    return configs
  }, [])

  const getRoomConfig = useCallback(
    (roomType: string, tierId: string): RoomConfig | undefined => {
      return roomConfigs[roomType]?.find((config) => config.id === tierId)
    },
    [roomConfigs],
  )

  const addRoom = useCallback(
    (roomType: string, tierId: string) => {
      setSelectedRooms((prev) => {
        const newRooms = { ...prev }
        const key = `${roomType}-${tierId}`
        newRooms[key] = (newRooms[key] || 0) + 1

        const roomConfig = getRoomConfig(roomType, tierId)
        if (roomConfig) {
          addItem({
            id: key,
            name: `${roomConfig.name} ${roomType}`,
            price: roomConfig.basePrice,
            quantity: 1,
            sourceSection: "rooms",
            metadata: {
              roomType: roomType,
              roomConfig: roomConfig,
              detailedTasks: roomConfig.detailedTasks,
              notIncludedTasks: roomConfig.notIncludedTasks,
              upsellMessage: roomConfig.upsellMessage,
            },
          })
        }
        return newRooms
      })
    },
    [addItem, getRoomConfig],
  )

  const removeRoom = useCallback(
    (roomType: string, tierId: string) => {
      setSelectedRooms((prev) => {
        const newRooms = { ...prev }
        const key = `${roomType}-${tierId}`
        if (newRooms[key] && newRooms[key] > 0) {
          newRooms[key] -= 1
          if (newRooms[key] === 0) {
            delete newRooms[key]
          }
          removeItem(key)
        }
        return newRooms
      })
    },
    [removeItem],
  )

  const updateRoomQuantity = useCallback(
    (roomType: string, tierId: string, quantity: number) => {
      setSelectedRooms((prev) => {
        const newRooms = { ...prev }
        const key = `${roomType}-${tierId}`
        if (quantity <= 0) {
          delete newRooms[key]
          removeItem(key)
        } else {
          newRooms[key] = quantity
          const roomConfig = getRoomConfig(roomType, tierId)
          if (roomConfig) {
            updateQuantity(key, quantity)
          }
        }
        return newRooms
      })
    },
    [getRoomConfig, removeItem, updateQuantity],
  )

  const getRoomQuantity = useCallback(
    (roomType: string, tierId: string) => {
      const key = `${roomType}-${tierId}`
      return selectedRooms[key] || 0
    },
    [selectedRooms],
  )

  const getDetailedPricingBreakdown = useCallback((): PricingBreakdown => {
    let subtotal = 0
    const roomBreakdowns: PricingBreakdown["roomBreakdowns"] = []
    const discounts: PricingBreakdown["discounts"] = []

    Object.entries(selectedRooms).forEach(([key, quantity]) => {
      const [roomType, tierId] = key.split("-")
      const roomConfig = getRoomConfig(roomType, tierId)

      if (roomConfig) {
        const basePrice = roomConfig.basePrice
        const tierAdjustment = 0 // Assuming no additional tier adjustments beyond basePrice for now
        const addOnTotal = 0 // Assuming no add-ons managed here for now
        const roomTotal = (basePrice + tierAdjustment + addOnTotal) * quantity
        subtotal += roomTotal

        roomBreakdowns.push({
          roomType,
          basePrice,
          tierAdjustment,
          addOnTotal,
          quantity,
          roomTotal,
        })
      }
    })

    // Example discount: 10% off if subtotal > 500
    if (subtotal > 500) {
      const discountAmount = subtotal * 0.1
      discounts.push({ name: "Bulk Discount (10%)", amount: discountAmount })
      subtotal -= discountAmount
    }

    // For simplicity, taxes and shipping are 0 for this breakdown,
    // as they are typically calculated at the cart level.
    const total = subtotal

    return {
      subtotal,
      discounts,
      total,
      roomBreakdowns,
    }
  }, [selectedRooms, getRoomConfig])

  const getTotalPrice = useCallback(() => {
    const breakdown = getDetailedPricingBreakdown()
    return breakdown.total
  }, [getDetailedPricingBreakdown])

  const clearRooms = useCallback(() => {
    setSelectedRooms({})
    clearCart()
  }, [clearCart])

  const contextValue = useMemo(
    () => ({
      selectedRooms,
      roomConfigs,
      addRoom,
      removeRoom,
      updateRoomQuantity,
      getRoomQuantity,
      getRoomConfig,
      getDetailedPricingBreakdown,
      getTotalPrice,
      clearRooms,
    }),
    [
      selectedRooms,
      roomConfigs,
      addRoom,
      removeRoom,
      updateRoomQuantity,
      getRoomQuantity,
      getRoomConfig,
      getDetailedPricingBreakdown,
      getTotalPrice,
      clearRooms,
    ],
  )

  return <RoomContext.Provider value={contextValue}>{children}</RoomContext.Provider>
}

export const useRoom = () => {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider")
  }
  return context
}
