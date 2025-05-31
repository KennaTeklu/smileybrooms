"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Trash2, Settings } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getRoomTiers } from "@/lib/room-tiers"
import { EnhancedRoomCustomizationPanel } from "./enhanced-room-customization-panel"
import { MultiStepCustomizationWizard } from "./multi-step-customization-wizard"
import { SimpleCustomizationPanel } from "./simple-customization-panel"
import { useCart } from "@/lib/cart-context" // Import useCart
import { toast } from "@/components/ui/use-toast" // Import toast
import { RoomCategory } from "./room-category" // Import RoomCategory
import { FloatingCartSummary } from "./floating-cart-summary"

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

interface RoomConfiguratorProps {
  initialRooms?: RoomItem[]
  onRoomsChange?: (rooms: RoomItem[]) => void
  panelType?: "simple" | "enhanced" | "wizard"
}

export function RoomConfigurator({ initialRooms = [], onRoomsChange, panelType = "enhanced" }: RoomConfiguratorProps) {
  const [rooms, setRooms] = useState<RoomItem[]>(initialRooms)
  const [isCustomizationPanelOpen, setIsCustomizationPanelOpen] = useState(false)
  const [currentRoomToCustomize, setCurrentRoomToCustomize] = useState<RoomItem | null>(null)
  const { addItem } = useCart() // Use the cart context

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

  const overallTotalPrice = useMemo(() => {
    return rooms.reduce((total, room) => total + room.config.totalPrice * room.count, 0)
  }, [rooms])

  const roomCountsMap = useMemo(() => {
    return rooms.reduce(
      (acc, room) => {
        acc[room.roomType] = room.count
        return acc
      },
      {} as Record<string, number>,
    )
  }, [rooms])

  const numberOfDistinctSelectedRoomTypes = useMemo(() => {
    return rooms.filter((room) => room.count > 0).length
  }, [rooms])

  const addRoom = useCallback(
    (roomType: string) => {
      const roomInfo = availableRoomTypes.find((r) => r.type === roomType)
      if (roomInfo) {
        setRooms((prevRooms) => {
          const existingRoomIndex = prevRooms.findIndex((r) => r.roomType === roomType)
          if (existingRoomIndex > -1) {
            const updatedRooms = [...prevRooms]
            updatedRooms[existingRoomIndex] = {
              ...updatedRooms[existingRoomIndex],
              count: updatedRooms[existingRoomIndex].count + 1,
            }
            onRoomsChange?.(updatedRooms)
            return updatedRooms
          } else {
            const newRoom: RoomItem = {
              id: `room-${Date.now()}`,
              roomType: roomInfo.type,
              roomName: roomInfo.name,
              roomIcon: roomInfo.icon,
              count: 1,
              config: roomInfo.defaultConfig,
            }
            const updatedRooms = [...prevRooms, newRoom]
            onRoomsChange?.(updatedRooms)
            return updatedRooms
          }
        })
      }
    },
    [availableRoomTypes, onRoomsChange],
  )

  const removeRoom = useCallback(
    (id: string) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.filter((room) => room.id !== id)
        onRoomsChange?.(updatedRooms)
        return updatedRooms
      })
    },
    [onRoomsChange],
  )

  const decrementRoomCount = useCallback(
    (id: string) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms
          .map((room) => {
            if (room.id === id) {
              return { ...room, count: room.count - 1 }
            }
            return room
          })
          .filter((room) => room.count > 0)
        onRoomsChange?.(updatedRooms)
        return updatedRooms
      })
    },
    [onRoomsChange],
  )

  const incrementRoomCount = useCallback(
    (id: string) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) => {
          if (room.id === id) {
            return { ...room, count: room.count + 1 }
          }
          return room
        })
        onRoomsChange?.(updatedRooms)
        return updatedRooms
      })
    },
    [onRoomsChange],
  )

  const openCustomizationPanel = useCallback((room: RoomItem) => {
    setCurrentRoomToCustomize(room)
    setIsCustomizationPanelOpen(true)
  }, [])

  const handleConfigChange = useCallback(
    (updatedConfig: RoomConfig) => {
      setRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) =>
          room.id === currentRoomToCustomize?.id ? { ...room, config: updatedConfig } : room,
        )
        onRoomsChange?.(updatedRooms)
        return updatedRooms
      })
      setIsCustomizationPanelOpen(false)
      setCurrentRoomToCustomize(null)
    },
    [currentRoomToCustomize, onRoomsChange],
  )

  const CustomizationPanelComponent = useMemo(() => {
    if (panelType === "enhanced") return EnhancedRoomCustomizationPanel
    if (panelType === "wizard") return MultiStepCustomizationWizard
    return SimpleCustomizationPanel
  }, [panelType])

  const handleAddAllToCartClick = () => {
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
            image: room.roomIcon, // Using roomIcon as a placeholder for image
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
      onRoomsChange?.(updatedRoomsAfterAdd.filter((room) => room.count > 0))

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
        description: "There was an error adding all items to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const getRoomConfigForCategory = useCallback(
    (roomType: string) => {
      const roomItem = rooms.find((r) => r.roomType === roomType)
      return roomItem ? roomItem.config : availableRoomTypes.find((r) => r.type === roomType)?.defaultConfig
    },
    [rooms, availableRoomTypes],
  )

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Configure Your Cleaning Service</h2>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Example of how you might group rooms into categories */}
        <RoomCategory
          title="Common Areas"
          description="Select and customize your living spaces."
          rooms={["living_room", "dining_room", "hallway", "entryway", "stairs"]}
          roomCounts={roomCountsMap}
          onRoomCountChange={(roomType, count) => {
            const roomInfo = availableRoomTypes.find((r) => r.type === roomType)
            if (roomInfo) {
              setRooms((prevRooms) => {
                const existingRoomIndex = prevRooms.findIndex((r) => r.roomType === roomType)
                if (existingRoomIndex > -1) {
                  const updatedRooms = [...prevRooms]
                  updatedRooms[existingRoomIndex] = {
                    ...updatedRooms[existingRoomIndex],
                    count: count,
                  }
                  onRoomsChange?.(updatedRooms.filter((r) => r.count > 0))
                  return updatedRooms.filter((r) => r.count > 0)
                } else if (count > 0) {
                  const newRoom: RoomItem = {
                    id: `room-${Date.now()}`,
                    roomType: roomInfo.type,
                    roomName: roomInfo.name,
                    roomIcon: roomInfo.icon,
                    count: count,
                    config: roomInfo.defaultConfig,
                  }
                  const updatedRooms = [...prevRooms, newRoom]
                  onRoomsChange?.(updatedRooms)
                  return updatedRooms
                }
                return prevRooms
              })
            }
          }}
          onRoomConfigChange={handleConfigChange}
          getRoomConfig={getRoomConfigForCategory}
          isMultiRoomSelection={numberOfDistinctSelectedRoomTypes > 1} // Pass the prop
        />

        <RoomCategory
          title="Private Spaces"
          description="Customize your bedrooms and bathrooms."
          rooms={["bedroom", "bathroom", "home_office", "laundry_room"]}
          roomCounts={roomCountsMap}
          onRoomCountChange={(roomType, count) => {
            const roomInfo = availableRoomTypes.find((r) => r.type === roomType)
            if (roomInfo) {
              setRooms((prevRooms) => {
                const existingRoomIndex = prevRooms.findIndex((r) => r.roomType === roomType)
                if (existingRoomIndex > -1) {
                  const updatedRooms = [...prevRooms]
                  updatedRooms[existingRoomIndex] = {
                    ...updatedRooms[existingRoomIndex],
                    count: count,
                  }
                  onRoomsChange?.(updatedRooms.filter((r) => r.count > 0))
                  return updatedRooms.filter((r) => r.count > 0)
                } else if (count > 0) {
                  const newRoom: RoomItem = {
                    id: `room-${Date.now()}`,
                    roomType: roomInfo.type,
                    roomName: roomInfo.name,
                    roomIcon: roomInfo.icon,
                    count: count,
                    config: roomInfo.defaultConfig,
                  }
                  const updatedRooms = [...prevRooms, newRoom]
                  onRoomsChange?.(updatedRooms)
                  return updatedRooms
                }
                return prevRooms
              })
            }
          }}
          onRoomConfigChange={handleConfigChange}
          getRoomConfig={getRoomConfigForCategory}
          isMultiRoomSelection={numberOfDistinctSelectedRoomTypes > 1} // Pass the prop
        />

        <RoomCategory
          title="Specialty Areas"
          description="For kitchens and other unique spaces."
          rooms={["kitchen"]}
          roomCounts={roomCountsMap}
          onRoomCountChange={(roomType, count) => {
            const roomInfo = availableRoomTypes.find((r) => r.type === roomType)
            if (roomInfo) {
              setRooms((prevRooms) => {
                const existingRoomIndex = prevRooms.findIndex((r) => r.roomType === roomType)
                if (existingRoomIndex > -1) {
                  const updatedRooms = [...prevRooms]
                  updatedRooms[existingRoomIndex] = {
                    ...updatedRooms[existingRoomIndex],
                    count: count,
                  }
                  onRoomsChange?.(updatedRooms.filter((r) => r.count > 0))
                  return updatedRooms.filter((r) => r.count > 0)
                } else if (count > 0) {
                  const newRoom: RoomItem = {
                    id: `room-${Date.now()}`,
                    roomType: roomInfo.type,
                    roomName: roomInfo.name,
                    roomIcon: roomInfo.icon,
                    count: count,
                    config: roomInfo.defaultConfig,
                  }
                  const updatedRooms = [...prevRooms, newRoom]
                  onRoomsChange?.(updatedRooms)
                  return updatedRooms
                }
                return prevRooms
              })
            }
          }}
          onRoomConfigChange={handleConfigChange}
          getRoomConfig={getRoomConfigForCategory}
          isMultiRoomSelection={numberOfDistinctSelectedRoomTypes > 1} // Pass the prop
        />
      </div>

      {rooms.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Selected Rooms</h3>
          <div className="space-y-4">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{room.roomIcon}</span>
                    <div>
                      <CardTitle className="text-lg">{room.roomName}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {room.config.selectedTier}
                        {room.config.selectedAddOns.length > 0 && ` + ${room.config.selectedAddOns.length} add-on(s)`}
                      </p>
                      <p className="text-sm font-medium">
                        {formatCurrency(room.config.totalPrice)} x {room.count} ={" "}
                        {formatCurrency(room.config.totalPrice * room.count)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => decrementRoomCount(room.id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium w-6 text-center">{room.count}</span>
                    <Button variant="outline" size="icon" onClick={() => incrementRoomCount(room.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openCustomizationPanel(room)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => removeRoom(room.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-2xl font-bold mb-8">
        <span>Total Estimated Price:</span>
        <span>{formatCurrency(overallTotalPrice)}</span>
      </div>

      <FloatingCartSummary
        rooms={rooms}
        totalPrice={overallTotalPrice}
        onAddAllToCart={handleAddAllToCartClick}
        onRoomCountChange={(id, count) => {
          setRooms((prevRooms) => {
            const updatedRooms = prevRooms
              .map((room) => {
                if (room.id === id) {
                  return { ...room, count: count }
                }
                return room
              })
              .filter((room) => room.count > 0)
            onRoomsChange?.(updatedRooms)
            return updatedRooms
          })
        }}
        onRemoveRoom={removeRoom}
        onCustomizeRoom={openCustomizationPanel}
      />

      {currentRoomToCustomize && (
        <CustomizationPanelComponent
          isOpen={isCustomizationPanelOpen}
          onClose={() => setIsCustomizationPanelOpen(false)}
          roomType={currentRoomToCustomize.roomType}
          roomName={currentRoomToCustomize.roomName}
          roomIcon={currentRoomToCustomize.roomIcon}
          roomCount={currentRoomToCustomize.count}
          config={currentRoomToCustomize.config}
          onConfigChange={handleConfigChange}
        />
      )}
    </div>
  )
}
