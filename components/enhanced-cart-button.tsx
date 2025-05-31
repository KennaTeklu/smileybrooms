"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ChevronUp, X } from "lucide-react"
import { useRoomContext } from "@/lib/room-context"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { roomImages } from "@/lib/room-tiers"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function EnhancedCartButton() {
  // Add try-catch for room context
  const [roomContext, setRoomContext] = useState(null)

  useEffect(() => {
    try {
      setRoomContext(useRoomContext())
    } catch (error) {
      // If room context is not available, don't render the component
      console.warn("EnhancedCartButton: Room context not available")
    }
  }, [])

  if (!roomContext) {
    return null
  }

  const { roomCounts, roomConfigs, resetAllRooms, getTotalPrice, getSelectedRoomTypes } = roomContext
  const { addItem } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()
  const itemCount = selectedRoomTypes.length

  // Show button when rooms are selected
  useEffect(() => {
    setIsVisible(itemCount > 0)

    // Auto-expand when first item is added
    if (itemCount === 1) {
      setIsExpanded(true)
      setIsMinimized(false)
    }
  }, [itemCount])

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

      // Reset all room counts after adding to cart
      resetAllRooms()
      setIsVisible(false)

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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    setIsMinimized(false)
  }

  const minimize = () => {
    setIsMinimized(true)
    setIsExpanded(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className={cn("fixed z-50 left-1/2 transform -translate-x-1/2", hasScrolled ? "top-4" : "top-20")}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Speech bubble notification style */}
        <div className="relative">
          {/* Minimized state - just badge */}
          {isMinimized && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-blue-600 text-white rounded-full p-3 shadow-lg cursor-pointer"
              onClick={toggleExpanded}
            >
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5" />
                <span className="ml-2 font-bold">{itemCount}</span>
              </div>
            </motion.div>
          )}

          {/* Expanded state - full bubble */}
          {isExpanded && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-xs"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" />
                    Selected Rooms
                  </h3>
                  <button
                    onClick={minimize}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {selectedRoomTypes.slice(0, 3).map((roomType) => (
                    <div key={roomType} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300 capitalize">
                        {roomType.replace(/([A-Z])/g, " $1").trim()} ({roomCounts[roomType]})
                      </span>
                      <span className="font-medium">{formatCurrency(roomConfigs[roomType]?.totalPrice || 0)}</span>
                    </div>
                  ))}
                  {selectedRoomTypes.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{selectedRoomTypes.length - 3} more room{selectedRoomTypes.length - 3 !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-gray-100">Total:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <Button onClick={handleAddAllToCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Add All to Cart
                </Button>
              </div>

              {/* Speech bubble pointer */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700"></div>
            </motion.div>
          )}

          {/* Bottom notification bar - slides up */}
          {!isExpanded && !isMinimized && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="bg-blue-600 text-white rounded-lg shadow-lg px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span className="font-medium mr-2">
                  {itemCount} room{itemCount !== 1 ? "s" : ""} selected
                </span>
                <span className="font-bold">{formatCurrency(totalPrice)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleExpanded}
                  className="text-white hover:text-blue-100 p-1"
                  aria-label="Show details"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <Button size="sm" onClick={handleAddAllToCart} className="bg-white text-blue-600 hover:bg-blue-50">
                  Add All
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
