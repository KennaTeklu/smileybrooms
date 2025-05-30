"use client"

import { useState, useMemo, useCallback } from "react"
import { RoomConfigurator } from "@/components/room-configurator"
import { FloatingCartSummaryPanel } from "@/components/floating-cart-summary-panel"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"
import { roomImages, getRoomTiers } from "@/lib/room-tiers" // Ensure these are imported

// Define RoomConfig and RoomItem interfaces here or import from a shared types file
interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
}

interface RoomItem {
  id: string
  roomType: string
  roomName: string
  roomIcon: string
  count: number
  config: RoomConfig
}

export default function HomePage() {
  const [rooms, setRooms] = useState<RoomItem[]>([])
  const [currentRoomToCustomize, setCurrentRoomToCustomize] = useState<RoomItem | null>(null)
  const [isCustomizationPanelOpen, setIsCustomizationPanelOpen] = useState(false)
  const { addItem } = useCart()

  const overallTotalPrice = useMemo(() => {
    return rooms.reduce((total, room) => total + room.config.totalPrice * room.count, 0)
  }, [rooms])

  const handleRoomsChange = useCallback((updatedRooms: RoomItem[]) => {
    setRooms(updatedRooms)
  }, [])

  const handleAddAllToCartClick = useCallback(() => {
    try {
      let addedCount = 0
      const updatedRoomsAfterAdd = rooms.map((room) => {
        if (room.count > 0) {
          addItem({
            id: `custom-cleaning-${room.roomType}-${Date.now()}`,
            name: `${room.roomName} Cleaning`,
            price: room.config.totalPrice,
            priceId: "price_custom_cleaning",
            quantity: room.count,
            image: roomImages[room.roomType] || "/placeholder.svg", // Use actual image path
            metadata: {
              roomType: room.roomType,
              roomConfig: room.config,
              isRecurring: false,
              frequency: "one_time",
            },
          })
          addedCount++
          return { ...room, count: 0 } // Reset count after adding to cart
        }
        return room
      })

      setRooms(updatedRoomsAfterAdd.filter((room) => room.count > 0)) // Filter out rooms with 0 count

      if (addedCount > 0) {
        toast({
          title: "Items added to cart",
          description: `${addedCount} room type(s) have been added to your cart.`,
          duration: 3000,
        })
      } else {
        toast({
          title: "No items to add",
          description: "Please select rooms before adding to cart.",
          variant: "info",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error adding all items to cart:", error)
      toast({
        title: "Failed to add all to cart",
        description: "An error occurred while adding items to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }, [rooms, addItem])

  const handleRemoveRoom = useCallback((id: string) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id))
  }, [])

  const handleDecrementRoomCount = useCallback((id: string) => {
    setRooms((prevRooms) =>
      prevRooms
        .map((room) => (room.id === id ? { ...room, count: Math.max(0, room.count - 1) } : room))
        .filter((room) => room.count > 0),
    )
  }, [])

  const handleIncrementRoomCount = useCallback((id: string) => {
    setRooms((prevRooms) => prevRooms.map((room) => (room.id === id ? { ...room, count: room.count + 1 } : room)))
  }, [])

  const handleOpenCustomizationPanel = useCallback((room: RoomItem) => {
    setCurrentRoomToCustomize(room)
    setIsCustomizationPanelOpen(true)
  }, [])

  const handleConfigChange = useCallback(
    (updatedConfig: RoomConfig) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) =>
          room.id === currentRoomToCustomize?.id ? { ...room, config: updatedConfig } : room,
        )
        return updatedRooms
      })
      setIsCustomizationPanelOpen(false)
      setCurrentRoomToCustomize(null)
    },
    [currentRoomToCustomize],
  )

  const availableRoomTypes = useMemo(
    () => [
      {
        type: "bedroom",
        name: "Bedroom",
        icon: "🛏️",
        defaultConfig: {
          roomName: "Bedroom",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("bedroom")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("bedroom")[0]?.price || 0,
        },
      },
      {
        type: "bathroom",
        name: "Bathroom",
        icon: "🛁",
        defaultConfig: {
          roomName: "Bathroom",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("bathroom")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("bathroom")[0]?.price || 0,
        },
      },
      {
        type: "kitchen",
        name: "Kitchen",
        icon: "🍳",
        defaultConfig: {
          roomName: "Kitchen",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("kitchen")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("kitchen")[0]?.price || 0,
        },
      },
      {
        type: "living_room",
        name: "Living Room",
        icon: "🛋️",
        defaultConfig: {
          roomName: "Living Room",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("living_room")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("living_room")[0]?.price || 0,
        },
      },
      {
        type: "dining_room",
        name: "Dining Room",
        icon: "🍽️",
        defaultConfig: {
          roomName: "Dining Room",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("dining_room")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("dining_room")[0]?.price || 0,
        },
      },
      {
        type: "hallway",
        name: "Hallway",
        icon: "🚶",
        defaultConfig: {
          roomName: "Hallway",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("hallway")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("hallway")[0]?.price || 0,
        },
      },
      {
        type: "home_office",
        name: "Home Office",
        icon: "🖥️",
        defaultConfig: {
          roomName: "Home Office",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("home_office")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("home_office")[0]?.price || 0,
        },
      },
      {
        type: "laundry_room",
        name: "Laundry Room",
        icon: "🧺",
        defaultConfig: {
          roomName: "Laundry Room",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("laundry_room")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("laundry_room")[0]?.price || 0,
        },
      },
      {
        type: "stairs",
        name: "Stairs",
        icon: "🪜",
        defaultConfig: {
          roomName: "Stairs",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("stairs")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("stairs")[0]?.price || 0,
        },
      },
      {
        type: "entryway",
        name: "Entryway",
        icon: "🚪",
        defaultConfig: {
          roomName: "Entryway",
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          basePrice: getRoomTiers("entryway")[0]?.price || 0,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          totalPrice: getRoomTiers("entryway")[0]?.price || 0,
        },
      },
    ],
    [],
  )

  const getRoomConfigForCategory = useCallback(
    (roomType: string) => {
      const roomItem = rooms.find((r) => r.roomType === roomType)
      return roomItem ? roomItem.config : availableRoomTypes.find((r) => r.type === roomType)?.defaultConfig
    },
    [rooms, availableRoomTypes],
  )

  return (
    <div className="relative min-h-screen">
      <RoomConfigurator
        rooms={rooms}
        onRoomsChange={handleRoomsChange}
        panelType="enhanced" // Or "wizard" or "simple"
        currentRoomToCustomize={currentRoomToCustomize}
        isCustomizationPanelOpen={isCustomizationPanelOpen}
        onCloseCustomizationPanel={() => setIsCustomizationPanelOpen(false)}
        onConfigChange={handleConfigChange}
        onOpenCustomizationPanel={handleOpenCustomizationPanel}
        availableRoomTypes={availableRoomTypes} // Pass availableRoomTypes
        getRoomConfigForCategory={getRoomConfigForCategory} // Pass the getter
      />
      <FloatingCartSummaryPanel
        rooms={rooms}
        overallTotalPrice={overallTotalPrice}
        onAddAllToCart={handleAddAllToCartClick}
        onRemoveRoom={handleRemoveRoom}
        onDecrementRoomCount={handleDecrementRoomCount}
        onIncrementRoomCount={handleIncrementRoomCount}
        onOpenCustomizationPanel={handleOpenCustomizationPanel}
      />
    </div>
  )
}
