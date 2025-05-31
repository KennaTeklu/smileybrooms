"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Trash2, Settings, ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getRoomTiers } from "@/lib/room-tiers"
import { EnhancedRoomCustomizationPanel } from "./enhanced-room-customization-panel"
import { MultiStepCustomizationWizard } from "./multi-step-customization-wizard"
import { SimpleCustomizationPanel } from "./simple-customization-panel"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"
import { RoomCategory } from "./room-category"

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
}

interface RoomConfiguratorProps {
  initialRooms?: any[]
  onRoomsChange?: (rooms: any[]) => void
  panelType?: "simple" | "enhanced" | "wizard"
}

export function RoomConfigurator({ initialRooms = [], onRoomsChange, panelType = "enhanced" }: RoomConfiguratorProps) {
  const [isCustomizationPanelOpen, setIsCustomizationPanelOpen] = useState(false)
  const [currentRoomToCustomize, setCurrentRoomToCustomize] = useState<string | null>(null)
  const { addItem } = useCart()

  // Define all available room types
  const availableRoomTypes = useMemo(
    () => [
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
    ],
    [],
  )

  // Initialize room counts for ALL room types
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>(() => {
    const initialCounts: Record<string, number> = {}
    availableRoomTypes.forEach((roomType) => {
      initialCounts[roomType] = 0
    })
    return initialCounts
  })

  // Initialize room configs for ALL room types
  const [roomConfigs, setRoomConfigs] = useState<Record<string, RoomConfig>>(() => {
    const initialConfigs: Record<string, RoomConfig> = {}
    availableRoomTypes.forEach((roomType) => {
      initialConfigs[roomType] = {
        roomName: roomType.charAt(0).toUpperCase() + roomType.slice(1).replace("_", " "),
        selectedTier: "ESSENTIAL CLEAN",
        selectedAddOns: [],
        basePrice: getRoomTiers(roomType)[0]?.price || 0,
        tierUpgradePrice: 0,
        addOnsPrice: 0,
        totalPrice: getRoomTiers(roomType)[0]?.price || 0,
      }
    })
    return initialConfigs
  })

  // Calculate how many room types have count > 0
  const numberOfSelectedRoomTypes = useMemo(() => {
    return Object.values(roomCounts).filter((count) => count > 0).length
  }, [roomCounts])

  // Determine if we're in multi-room selection mode
  const isMultiRoomSelection = numberOfSelectedRoomTypes > 1

  // Calculate total price
  const totalPrice = useMemo(() => {
    return Object.entries(roomCounts).reduce((total, [roomType, count]) => {
      if (count > 0) {
        return total + roomConfigs[roomType].totalPrice * count
      }
      return total
    }, 0)
  }, [roomCounts, roomConfigs])

  // Handle room count changes
  const handleRoomCountChange = useCallback((roomType: string, newCount: number) => {
    setRoomCounts((prev) => ({
      ...prev,
      [roomType]: Math.max(0, newCount),
    }))
  }, [])

  // Handle room config changes
  const handleRoomConfigChange = useCallback((roomType: string, newConfig: RoomConfig) => {
    setRoomConfigs((prev) => ({
      ...prev,
      [roomType]: newConfig,
    }))
  }, [])

  // Get room config for a specific room type
  const getRoomConfig = useCallback(
    (roomType: string) => {
      return roomConfigs[roomType]
    },
    [roomConfigs],
  )

  // Handle opening customization panel
  const handleOpenCustomization = useCallback((roomType: string) => {
    setCurrentRoomToCustomize(roomType)
    setIsCustomizationPanelOpen(true)
  }, [])

  // Handle closing customization panel
  const handleCloseCustomization = useCallback(() => {
    setCurrentRoomToCustomize(null)
    setIsCustomizationPanelOpen(false)
  }, [])

  // Handle adding all items to cart
  const handleAddAllToCart = useCallback(() => {
    try {
      let addedCount = 0

      Object.entries(roomCounts).forEach(([roomType, count]) => {
        if (count > 0) {
          const config = roomConfigs[roomType]
          addItem({
            id: `custom-cleaning-${roomType}-${Date.now()}`,
            name: `${config.roomName} Cleaning`,
            price: config.totalPrice,
            priceId: "price_custom_cleaning",
            quantity: count,
            image: `/images/${roomType}-professional.png`,
            metadata: {
              roomType: roomType,
              roomConfig: config,
              isRecurring: false,
              frequency: "one_time",
            },
          })
          addedCount++
        }
      })

      // Reset all room counts after adding to cart
      const resetCounts: Record<string, number> = {}
      availableRoomTypes.forEach((roomType) => {
        resetCounts[roomType] = 0
      })
      setRoomCounts(resetCounts)

      if (addedCount > 0) {
        toast({
          title: "Items added to cart",
          description: `${addedCount} room type(s) have been added to your cart.`,
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
  }, [roomCounts, roomConfigs, availableRoomTypes, addItem])

  // Handle adding single room to cart
  const handleAddSingleRoomToCart = useCallback(
    (roomType: string) => {
      try {
        const count = roomCounts[roomType]
        const config = roomConfigs[roomType]

        if (count > 0) {
          addItem({
            id: `custom-cleaning-${roomType}-${Date.now()}`,
            name: `${config.roomName} Cleaning`,
            price: config.totalPrice,
            priceId: "price_custom_cleaning",
            quantity: count,
            image: `/images/${roomType}-professional.png`,
            metadata: {
              roomType: roomType,
              roomConfig: config,
              isRecurring: false,
              frequency: "one_time",
            },
          })

          // Reset this room's count after adding to cart
          setRoomCounts((prev) => ({
            ...prev,
            [roomType]: 0,
          }))

          toast({
            title: "Item added to cart",
            description: `${config.roomName} has been added to your cart.`,
            duration: 3000,
          })
        }
      } catch (error) {
        console.error("Error adding item to cart:", error)
        toast({
          title: "Failed to add to cart",
          description: "There was an error adding the item to your cart. Please try again.",
          variant: "destructive",
          duration: 3000,
        })
      }
    },
    [roomCounts, roomConfigs, addItem],
  )

  const CustomizationPanelComponent = useMemo(() => {
    if (panelType === "enhanced") return EnhancedRoomCustomizationPanel
    if (panelType === "wizard") return MultiStepCustomizationWizard
    return SimpleCustomizationPanel
  }, [panelType])

  // Debug logging
  useEffect(() => {
    console.log("Room counts:", roomCounts)
    console.log("Number of selected room types:", numberOfSelectedRoomTypes)
    console.log("Is multi-room selection:", isMultiRoomSelection)
  }, [roomCounts, numberOfSelectedRoomTypes, isMultiRoomSelection])

  return (
    <div className="container mx-auto p-4 pb-32">
      <h2 className="text-2xl font-bold mb-6">Configure Your Cleaning Service</h2>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <RoomCategory
          title="Common Areas"
          description="Select and customize your living spaces."
          rooms={["living_room", "dining_room", "hallway", "entryway", "stairs"]}
          roomCounts={roomCounts}
          onRoomCountChange={handleRoomCountChange}
          onRoomConfigChange={handleRoomConfigChange}
          getRoomConfig={getRoomConfig}
          isMultiRoomSelection={isMultiRoomSelection}
          onAddSingleRoomToCart={handleAddSingleRoomToCart}
          onOpenCustomization={handleOpenCustomization}
        />

        <RoomCategory
          title="Private Spaces"
          description="Customize your bedrooms and bathrooms."
          rooms={["bedroom", "bathroom", "home_office", "laundry_room"]}
          roomCounts={roomCounts}
          onRoomCountChange={handleRoomCountChange}
          onRoomConfigChange={handleRoomConfigChange}
          getRoomConfig={getRoomConfig}
          isMultiRoomSelection={isMultiRoomSelection}
          onAddSingleRoomToCart={handleAddSingleRoomToCart}
          onOpenCustomization={handleOpenCustomization}
        />

        <RoomCategory
          title="Specialty Areas"
          description="For kitchens and other unique spaces."
          rooms={["kitchen"]}
          roomCounts={roomCounts}
          onRoomCountChange={handleRoomCountChange}
          onRoomConfigChange={handleRoomConfigChange}
          getRoomConfig={getRoomConfig}
          isMultiRoomSelection={isMultiRoomSelection}
          onAddSingleRoomToCart={handleAddSingleRoomToCart}
          onOpenCustomization={handleOpenCustomization}
        />
      </div>

      {/* Selected Rooms Summary */}
      {numberOfSelectedRoomTypes > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Selected Rooms</h3>
          <div className="space-y-4">
            {Object.entries(roomCounts)
              .filter(([_, count]) => count > 0)
              .map(([roomType, count]) => {
                const config = roomConfigs[roomType]
                return (
                  <Card key={roomType}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">🏠</span>
                        <div>
                          <CardTitle className="text-lg">{config.roomName}</CardTitle>
                          <p className="text-sm text-gray-600">
                            {config.selectedTier}
                            {config.selectedAddOns.length > 0 && ` + ${config.selectedAddOns.length} add-on(s)`}
                          </p>
                          <p className="text-sm font-medium">
                            {formatCurrency(config.totalPrice)} x {count} = {formatCurrency(config.totalPrice * count)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRoomCountChange(roomType, count - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium w-6 text-center">{count}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRoomCountChange(roomType, count + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleOpenCustomization(roomType)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleRoomCountChange(roomType, 0)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-2xl font-bold mb-8">
        <span>Total Estimated Price:</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>

      {/* Floating Add All to Cart Button */}
      {isMultiRoomSelection && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            id="floating-add-all-to-cart"
            variant="default"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 hover:scale-105"
            onClick={handleAddAllToCart}
            aria-label="Add all selected rooms to cart"
          >
            <ShoppingCart className="h-6 w-6 mr-3" aria-hidden="true" />
            Add All to Cart ({numberOfSelectedRoomTypes} rooms) - {formatCurrency(totalPrice)}
          </Button>
        </div>
      )}

      {/* Customization Panel */}
      {currentRoomToCustomize && (
        <CustomizationPanelComponent
          isOpen={isCustomizationPanelOpen}
          onClose={handleCloseCustomization}
          roomType={currentRoomToCustomize}
          roomName={roomConfigs[currentRoomToCustomize].roomName}
          roomIcon="🏠"
          roomCount={roomCounts[currentRoomToCustomize]}
          config={roomConfigs[currentRoomToCustomize]}
          onConfigChange={(config: RoomConfig) => handleRoomConfigChange(currentRoomToCustomize, config)}
        />
      )}
    </div>
  )
}
