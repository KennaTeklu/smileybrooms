"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, X, Package, Trash2 } from "lucide-react"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { roomImages, roomDisplayNames } from "@/lib/room-tiers"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function AddAllToCartModal() {
  const { roomCounts, roomConfigs, updateRoomCount, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  // Smooth scroll position with spring physics (same as share panel)
  const smoothScrollY = useSpring(0, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  })

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()

  // Track scroll position with smooth animation (same as share panel)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      smoothScrollY.set(window.scrollY)
    }

    // Use passive: true for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial position setting
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [smoothScrollY])

  // Show modal when multi-selection becomes active
  useEffect(() => {
    if (isMultiSelection) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [isMultiSelection])

  // Close modal when clicking outside (same as share panel)
  useClickOutside(modalRef, () => {
    if (isOpen) setIsOpen(false)
  })

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
    <motion.div
      className="fixed right-0 z-50"
      style={{
        top: scrollY > 100 ? "auto" : "50%",
        bottom: scrollY > 100 ? "20px" : "auto",
        y: scrollY > 100 ? 0 : "-50%",
        transition: "top 0.3s ease, bottom 0.3s ease, transform 0.3s ease",
      }}
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={modalRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 shadow-2xl rounded-l-lg overflow-hidden flex"
          >
            <div className="w-80 sm:w-96 max-h-[80vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Ready to Add</CardTitle>
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
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                {/* Room List */}
                <div className="space-y-3 mb-4">
                  {selectedRoomTypes.map((roomType) => {
                    const config = roomConfigs[roomType]
                    const count = roomCounts[roomType]
                    const roomTotal = (config?.totalPrice || 0) * count

                    return (
                      <div
                        key={roomType}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={roomImages[roomType] || "/placeholder.svg"}
                            alt={roomDisplayNames[roomType] || roomType}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                            {roomDisplayNames[roomType] || roomType}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {config?.selectedTier || "Essential Clean"}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-500">Qty: {count}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{formatCurrency(config?.totalPrice || 0)}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-sm text-gray-900 dark:text-gray-100">
                            {formatCurrency(roomTotal)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRoom(roomType)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1 h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Total Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Total</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {Object.values(roomCounts).reduce((sum, count) => sum + count, 0)} rooms
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button onClick={handleAddAllToCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add All to Cart
                  </Button>
                  <Button variant="outline" onClick={handleClose} className="w-full text-sm">
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "flex items-center justify-center p-3 bg-blue-600 text-white",
              "rounded-l-lg shadow-lg hover:bg-blue-700",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
            )}
            aria-label="Open cart summary"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <div className="text-left">
                <div className="text-sm font-semibold">{selectedRoomTypes.length} Items</div>
                <div className="text-xs">{formatCurrency(totalPrice)}</div>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
