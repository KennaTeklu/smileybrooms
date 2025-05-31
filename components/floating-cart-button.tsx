"use client"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

export const FloatingCartButton = () => {
  const { roomCounts, roomConfigs, resetAllRooms, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()

  const handleAddAllToCart = () => {
    try {
      const selectedRoomTypes = getSelectedRoomTypes()
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
            image: `/images/${roomType}-professional.png`,
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

      // Reset all room counts after adding to cart
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

  // Only show if multiple room types are selected
  if (!isMultiSelection) return null

  const totalPrice = getTotalPrice()
  const selectedCount = getSelectedRoomTypes().length

  return (
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
        Add All to Cart ({selectedCount} rooms) - {formatCurrency(totalPrice)}
      </Button>
    </div>
  )
}
