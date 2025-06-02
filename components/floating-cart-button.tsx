"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Package } from "lucide-react"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { roomImages } from "@/lib/room-tiers"
import { useScrollTriggeredAnimation } from "@/hooks/use-scroll-triggered-animation"

export function FloatingCartButton() {
  const { roomCounts, roomConfigs, resetAllRooms, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()

  // Scroll-triggered animation configuration
  const { animationStyles, scrollProgress, deviceType, isScrolling } = useScrollTriggeredAnimation({
    basePosition: {
      bottom: 20,
      right: 16,
    },
    enableVerticalMovement: true,
    enableHorizontalMovement: false,
  })

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()

  const handleAddAllToCart = () => {
    try {
      let addedCount = 0

      selectedRoomTypes.forEach((roomType) => {
        const count = roomCounts[roomType]
        const config = roomConfigs[roomType]

        if (count > 0) {
          addItem({
            id: `custom-cleaning-${roomType}-${Date.now()}`,
            name: `${config.roomName} Cleaning`,
            price: config.totalPrice,
            priceId: "price_custom_cleaning",
            quantity: count,
            image: roomImages[roomType] || "/placeholder.svg",
            metadata: {
              roomType,
              roomConfig: config,
              isRecurring: false,
              frequency: "one_time",
            },
          })
          addedCount++
        }
      })

      resetAllRooms()

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
  }

  if (!isMultiSelection) return null

  return (
    <div
      style={animationStyles}
      className={`
        transition-all duration-200 ease-out
        ${isScrolling ? "shadow-2xl" : "shadow-xl"}
      `}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div className="p-4 max-w-xs">
          {/* Progress indicator */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-3 mb-3 pt-2">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Ready to Add</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {selectedRoomTypes.length} room{selectedRoomTypes.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {selectedRoomTypes.slice(0, 3).map((roomType) => (
              <div key={roomType} className="flex justify-between items-center text-xs">
                <span className="text-gray-600 dark:text-gray-300 capitalize">
                  {roomType.replace(/([A-Z])/g, " $1").trim()} ({roomCounts[roomType]})
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(roomConfigs[roomType]?.totalPrice || 0)}
                </span>
              </div>
            ))}
            {selectedRoomTypes.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{selectedRoomTypes.length - 3} more room{selectedRoomTypes.length - 3 !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Total:</span>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <Button
            variant="default"
            size="sm"
            className={`
              w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
              transition-all duration-200 hover:scale-105
              ${isScrolling ? "ring-2 ring-blue-300 ring-opacity-50" : ""}
            `}
            onClick={handleAddAllToCart}
            aria-label="Add all selected rooms to cart"
          >
            <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
            Add All to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FloatingCartButton
