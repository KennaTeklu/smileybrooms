"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoomConfigurator } from "@/components/room-configurator"
import { useRoomContext, type RoomConfig } from "@/lib/room-context"
import { formatCurrency } from "@/lib/utils"
import { getDisplayPrice, roomDisplayNames, roomIcons } from "@/lib/room-tiers"
import { createCartItemFromRoomConfig } from "@/lib/cart/item-utils"
import { useCart } from "@/lib/cart-context"
import { PlusCircle, ShoppingCart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { CollapsibleAddAllPanel } from "./collapsible-add-all-panel"
import { RoomCategory } from "./room-category"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PricingContent() {
  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, resetRoomConfigs } = useRoomContext()
  const { addMultipleItems, addItem } = useCart()
  const { toast } = useToast()

  const [isAddAllPanelOpen, setIsAddAllPanelOpen] = useState(false)

  const totalRoomsSelected = useMemo(() => {
    return Object.values(roomCounts).reduce((sum, count) => sum + count, 0)
  }, [roomCounts])

  const totalEstimatedPrice = useMemo(() => {
    return Object.values(roomConfigs).reduce((sum, config) => sum + config.totalPrice * config.roomCount, 0)
  }, [roomConfigs])

  const handleAddAllToCart = () => {
    const itemsToAdd = Object.values(roomConfigs)
      .filter((config) => config.roomCount > 0 && config.totalPrice > 0) // Only add configured rooms with a price
      .map((config) => createCartItemFromRoomConfig(config, config.roomCount))

    if (itemsToAdd.length > 0) {
      addMultipleItems(itemsToAdd)
      toast({
        title: "Rooms Added to Cart",
        description: `Successfully added ${itemsToAdd.length} unique room configurations to your cart.`,
        action: (
          <Button
            variant="outline"
            className="whitespace-nowrap bg-transparent"
            onClick={() => (window.location.href = "/cart")}
          >
            View Cart
          </Button>
        ),
        duration: 3000,
      })
      resetRoomConfigs() // Optionally reset configurations after adding to cart
    } else {
      toast({
        title: "No Rooms to Add",
        description: "Please configure at least one room with a price to add to cart.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleAddRoomToCart = (roomConfig: RoomConfig) => {
    if (roomConfig.roomCount > 0 && roomConfig.totalPrice > 0) {
      const itemToAdd = createCartItemFromRoomConfig(roomConfig, roomConfig.roomCount)
      addItem(itemToAdd)
      toast({
        title: "Room Added to Cart",
        description: `${roomConfig.roomName} (${roomConfig.roomCount}) added to your cart.`,
        action: (
          <Button
            variant="outline"
            className="whitespace-nowrap bg-transparent"
            onClick={() => (window.location.href = "/cart")}
          >
            View Cart
          </Button>
        ),
        duration: 3000,
      })
      // Optionally reset this specific room's config after adding to cart
      updateRoomCount(roomConfig.roomType, 0)
      updateRoomConfig(roomConfig.roomType, {
        ...roomConfig,
        roomCount: 0,
        selectedTier: "ESSENTIAL CLEAN", // Reset to default tier
        selectedAddOns: [],
        selectedReductions: [],
        basePrice: 0,
        tierUpgradePrice: 0,
        addOnsPrice: 0,
        totalPrice: 0,
      })
    } else {
      toast({
        title: "Cannot Add Room",
        description: "Please configure the room with a quantity and a valid price.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const roomCategories = useMemo(() => {
    const categories = {
      "Living Spaces": ["livingRoom", "diningRoom", "homeOffice"],
      "Bed & Bath": ["bedroom", "bathroom"],
      "Utility & Other": ["kitchen", "laundryRoom", "entryway", "hallway", "stairs", "other"],
    }
    return categories
  }, [])

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Room Selection */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Select Your Rooms</CardTitle>
              <CardDescription>
                Choose the rooms you&apos;d like us to clean and customize their services.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-6">
                {Object.entries(roomCategories).map(([categoryName, roomTypes]) => (
                  <RoomCategory key={categoryName} title={categoryName}>
                    {roomTypes.map((roomType) => (
                      <RoomConfigurator
                        key={roomType}
                        roomType={roomType}
                        roomName={roomDisplayNames[roomType]}
                        roomIcon={roomIcons[roomType]}
                        count={roomCounts[roomType]}
                        onCountChange={(count) => updateRoomCount(roomType, count)}
                        config={roomConfigs[roomType]}
                        onConfigChange={(config) => updateRoomConfig(roomType, config)}
                      />
                    ))}
                  </RoomCategory>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="lg:col-span-1 space-y-8">
          {/* Selected Rooms Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Your Selected Rooms</CardTitle>
              <CardDescription>Review your chosen rooms and their configurations.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[400px] lg:max-h-[calc(100vh-300px)]">
                <div className="space-y-4 p-6">
                  {totalRoomsSelected === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <ShoppingCart className="mx-auto h-12 w-12 mb-4" />
                      <p>No rooms selected yet.</p>
                      <p>Add rooms from the left panel to see them here.</p>
                    </div>
                  ) : (
                    Object.entries(roomConfigs)
                      .filter(([, config]) => config.roomCount > 0)
                      .map(([roomType, config]) => (
                        <div
                          key={roomType}
                          className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{roomIcons[roomType]}</span>
                            <div>
                              <p className="font-medium">
                                {roomDisplayNames[roomType]} ({config.roomCount})
                              </p>
                              <p className="text-sm text-muted-foreground">{config.selectedTier}</p>
                              {config.selectedAddOns.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  +{config.selectedAddOns.length} Add-on{config.selectedAddOns.length > 1 ? "s" : ""}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-semibold">{getDisplayPrice(roomType, config)}</span>
                            {config.totalPrice > 0 && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="mt-2"
                                onClick={() => handleAddRoomToCart(config)}
                              >
                                <PlusCircle className="h-4 w-4 mr-2" /> Add to Cart
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            {totalRoomsSelected > 0 && (
              <CardContent className="p-6 border-t">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Estimated Price:</span>
                  <span>{formatCurrency(totalEstimatedPrice)}</span>
                </div>
                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={handleAddAllToCart}
                  disabled={totalRoomsSelected === 0 || totalEstimatedPrice === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" /> Add All Selected Rooms to Cart
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Collapsible Add All Panel */}
          <CollapsibleAddAllPanel
            isOpen={isAddAllPanelOpen}
            onOpenChange={setIsAddAllPanelOpen}
            roomCounts={roomCounts}
            roomConfigs={roomConfigs}
            onAddAllToCart={handleAddAllToCart}
          />
        </div>
      </div>
    </div>
  )
}
