"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RoomCategory } from "@/components/room-category"
import { useRoomContext } from "@/lib/room-context"
import { formatCurrency } from "@/lib/utils"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { useCart } from "@/lib/cart-context"
import { createCartItemFromRoomConfig } from "@/lib/cart/item-utils"
import type { RoomConfig } from "@/lib/room-context"

export default function PricingContent() {
  const { roomConfigs, calculateRoomPrice, calculateTotalPrice, roomCounts } = useRoomContext()
  const { addMultipleItems, addItem } = useCart()
  const [showAddAllPanel, setShowAddAllPanel] = useState(false)

  const totalRoomsSelected = useMemo(() => {
    return Object.values(roomCounts).reduce((sum, count) => sum + count, 0)
  }, [roomCounts])

  const handleAddAllToCart = () => {
    const itemsToAdd: RoomConfig[] = []
    Object.entries(roomConfigs).forEach(([roomType, config]) => {
      if (config.selectedTier) {
        itemsToAdd.push(config)
      }
    })

    if (itemsToAdd.length > 0) {
      const cartItems = itemsToAdd.map((config) => {
        const price = calculateRoomPrice(
          config.roomType,
          config.selectedTier,
          config.selectedAddOns,
          config.selectedReductions,
        )
        return createCartItemFromRoomConfig(config, price)
      })
      addMultipleItems(cartItems)
    }
  }

  const handleAddIndividualRoomToCart = (roomType: string) => {
    const config = roomConfigs[roomType]
    if (config && config.selectedTier) {
      const price = calculateRoomPrice(
        config.roomType,
        config.selectedTier,
        config.selectedAddOns,
        config.selectedReductions,
      )
      const cartItem = createCartItemFromRoomConfig(config, price)
      addItem(cartItem)
    }
  }

  const totalPrice = useMemo(() => {
    return calculateTotalPrice()
  }, [calculateTotalPrice])

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Select Your Rooms</CardTitle>
              <CardDescription>Choose the rooms you want cleaned and customize your service.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {Object.keys(roomConfigs).map((roomType) => (
                  <RoomCategory
                    key={roomType}
                    roomType={roomType}
                    onAddToCart={() => handleAddIndividualRoomToCart(roomType)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {totalRoomsSelected > 0 && (
            <CollapsibleAddAllPanel
              totalRoomsSelected={totalRoomsSelected}
              onAddAllToCart={handleAddAllToCart}
              totalPrice={totalPrice}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Your Estimate</CardTitle>
              <CardDescription>Review your selected services and estimated cost.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {totalRoomsSelected === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No rooms selected yet.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(roomConfigs).map(([roomType, config]) => {
                    if (config.selectedTier) {
                      const price = calculateRoomPrice(
                        config.roomType,
                        config.selectedTier,
                        config.selectedAddOns,
                        config.selectedReductions,
                      )
                      return (
                        <div key={roomType} className="flex justify-between items-center">
                          <span className="font-medium">
                            {config.roomType} - {config.selectedTier}
                          </span>
                          <span className="font-semibold">{formatCurrency(price)}</span>
                        </div>
                      )
                    }
                    return null
                  })}
                  <Separator />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Estimated Total:</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={totalRoomsSelected === 0}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
