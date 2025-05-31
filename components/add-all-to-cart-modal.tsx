"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, X, Package, Trash2 } from "lucide-react"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { roomImages, roomDisplayNames } from "@/lib/room-tiers"
import Image from "next/image"

export function AddAllToCartModal() {
  const { roomCounts, roomConfigs, updateRoomCount, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()

  // Show modal when multi-selection becomes active
  useEffect(() => {
    if (isMultiSelection) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [isMultiSelection])

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

          // Reset this room's count after adding to cart
          updateRoomCount(roomType, 0)
          addedCount++
        }
      })

      if (addedCount > 0) {
        toast({
          title: "All items added to cart",
          description: `${addedCount} room type(s) have been added to your cart.`,
          duration: 3000,
        })
        setIsOpen(false)
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

  const handleRemoveRoom = (roomType: string) => {
    updateRoomCount(roomType, 0)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isMultiSelection) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
          >
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">Ready to Add to Cart</CardTitle>
                      <p className="text-blue-100 text-sm">
                        {selectedRoomTypes.length} room type{selectedRoomTypes.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Room List */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {selectedRoomTypes.map((roomType) => {
                    const config = roomConfigs[roomType]
                    const count = roomCounts[roomType]
                    const roomTotal = (config?.totalPrice || 0) * count

                    return (
                      <div
                        key={roomType}
                        className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={roomImages[roomType] || "/placeholder.svg"}
                            alt={roomDisplayNames[roomType] || roomType}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {roomDisplayNames[roomType] || roomType}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {config?.selectedTier || "Essential Clean"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">Quantity: {count}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500">
                              {formatCurrency(config?.totalPrice || 0)} each
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                            {formatCurrency(roomTotal)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRoom(roomType)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Total Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total Amount</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedRoomTypes.length} room type{selectedRoomTypes.length !== 1 ? "s" : ""} •{" "}
                        {Object.values(roomCounts).reduce((sum, count) => sum + count, 0)} total rooms
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Continue Shopping
                  </Button>
                  <Button onClick={handleAddAllToCart} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
