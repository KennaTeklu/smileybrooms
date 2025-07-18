"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Plus, Minus, ShoppingCart } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { useRoom } from "@/lib/room-context"
import { useCart } from "@/lib/cart-context"
import { roomTiers } from "@/lib/room-tiers"
import { CollapsibleAddAllPanel } from "@/components/collapsible-add-all-panel"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PricingContent() {
  const {
    selectedRooms,
    addRoom,
    removeRoom,
    updateRoomQuantity,
    getRoomQuantity,
    getDetailedPricingBreakdown,
    clearRooms,
  } = useRoom()
  const { addItem: addItemToCart } = useCart()

  const [activeRoomType, setActiveRoomType] = useState<string>("bedroom")

  const roomTypes = useMemo(() => {
    const types = new Set<string>()
    roomTiers.forEach((tier) => types.add(tier.roomType))
    return Array.from(types)
  }, [])

  const tiersForActiveRoom = useMemo(() => {
    return roomTiers.filter((tier) => tier.roomType === activeRoomType)
  }, [activeRoomType])

  const pricingBreakdown = getDetailedPricingBreakdown()

  const handleAddToCart = (roomType: string, tierId: string) => {
    const roomConfig = roomTiers.find((tier) => tier.roomType === roomType && tier.id === tierId)
    if (roomConfig) {
      const quantity = getRoomQuantity(roomType, tierId)
      if (quantity > 0) {
        // If item already in cart, update quantity. Otherwise, add new item.
        addItemToCart({
          id: `${roomType}-${tierId}`,
          name: `${roomConfig.name} ${roomType}`,
          price: roomConfig.basePrice,
          quantity: quantity,
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
    }
  }

  const handleClearAllRooms = () => {
    clearRooms()
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-50 mb-4">
          Flexible Pricing for Every Home
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Choose the perfect cleaning package for your needs. Our transparent pricing ensures you know exactly what
          you're paying for.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Room Selection and Pricing */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Select Your Rooms</h2>

          {/* Room Type Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {roomTypes.map((type) => (
                <Button
                  key={type}
                  variant={activeRoomType === type ? "default" : "outline"}
                  onClick={() => setActiveRoomType(type)}
                  className={cn(
                    "capitalize",
                    activeRoomType === type
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200",
                  )}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Room Tiers */}
          <div className="grid gap-6">
            {tiersForActiveRoom.map((tier) => (
              <Card
                key={tier.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
              >
                <div className="flex-1 mb-4 md:mb-0">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {tier.name} {activeRoomType}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mb-3">
                    {tier.timeEstimate}
                  </CardDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" /> Included:
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-0.5">
                        {tier.detailedTasks.map((task, i) => (
                          <li key={i}>{task.replace(/ $$.*?$$/, "")}</li>
                        ))}
                      </ul>
                    </div>
                    {tier.notIncludedTasks && tier.notIncludedTasks.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1 mb-1">
                          <XCircle className="h-4 w-4 text-red-500" /> Not Included:
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-0.5">
                          {tier.notIncludedTasks.map((task, i) => (
                            <li key={i}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {tier.upsellMessage && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-3">{tier.upsellMessage}</p>
                  )}
                </div>
                <div className="flex flex-col items-center md:items-end gap-3">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(tier.basePrice)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeRoom(activeRoomType, tier.id)}
                      disabled={getRoomQuantity(activeRoomType, tier.id) === 0}
                      aria-label={`Decrease quantity of ${tier.name} ${activeRoomType}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {getRoomQuantity(activeRoomType, tier.id)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addRoom(activeRoomType, tier.id)}
                      aria-label={`Increase quantity of ${tier.name} ${activeRoomType}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(activeRoomType, tier.id)}
                    disabled={getRoomQuantity(activeRoomType, tier.id) === 0}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <CollapsibleAddAllPanel roomType={activeRoomType} />
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-24 self-start">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Your Estimate</h2>
          <ScrollArea className="h-[calc(100vh-300px)] pr-4">
            {pricingBreakdown.roomBreakdowns.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No rooms selected yet. Add rooms to see your estimate!
              </p>
            ) : (
              <div className="space-y-4">
                {pricingBreakdown.roomBreakdowns.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.quantity} x {item.roomType} ({item.basePrice})
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.roomTotal)}
                    </span>
                  </div>
                ))}
                <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between font-semibold text-gray-900 dark:text-gray-100">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(pricingBreakdown.subtotal)}</span>
                </div>
                {pricingBreakdown.discounts.length > 0 && (
                  <div className="space-y-1">
                    {pricingBreakdown.discounts.map((discount, index) => (
                      <div key={index} className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>{discount.name}:</span>
                        <span>-{formatCurrency(discount.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
                <div className="flex justify-between text-xl font-bold text-blue-600 dark:text-blue-400">
                  <span>Total Estimate:</span>
                  <span>{formatCurrency(pricingBreakdown.total)}</span>
                </div>
              </div>
            )}
          </ScrollArea>
          <CardFooter className="flex flex-col gap-3 mt-6 p-0">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={pricingBreakdown.roomBreakdowns.length === 0}
            >
              Proceed to Checkout
            </Button>
            <Button variant="outline" className="w-full bg-transparent" onClick={handleClearAllRooms}>
              Clear All Rooms
            </Button>
          </CardFooter>
        </div>
      </div>
    </div>
  )
}
