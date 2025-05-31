"use client"

import { useState, useEffect, useMemo } from "react" // Removed useContext as useCart will be used
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ChevronUp, X } from "lucide-react"
import { useRoomContext } from "@/lib/room-context"
import { useCart } from "@/lib/cart-context" // Changed import
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { roomImages } from "@/lib/room-tiers"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function EnhancedCartButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  const roomContext = useRoomContext()
  const { addItem } = useCart() // Use the useCart hook

  if (!roomContext) {
    console.warn("EnhancedCartButton: RoomContext not found. Ensure this component is rendered within a RoomProvider.")
    return null
  }

  const { roomCounts, roomConfigs, resetAllRooms, getTotalPrice, getSelectedRoomTypes } = roomContext

  const selectedRoomTypes = useMemo(() => getSelectedRoomTypes(), [roomCounts, getSelectedRoomTypes])
  const totalPrice = useMemo(() => getTotalPrice(), [roomConfigs, roomCounts, getTotalPrice])
  const itemCount = selectedRoomTypes.length

  useEffect(() => {
    const shouldBeVisible = itemCount > 0
    if (isVisible !== shouldBeVisible) {
      setIsVisible(shouldBeVisible)
    }

    if (shouldBeVisible) {
      if (itemCount > 0 && !isExpanded && !isMinimized) {
        // Simplified condition: if items exist and not already in a specific state, default to compact or expand
        // Default to compact bar when new items are added unless it's the very first item
        if (itemCount === 1 && !isExpanded && !isMinimized) {
          setIsExpanded(true) // Expand for the first item
          setIsMinimized(false)
        } else if (!isExpanded && !isMinimized) {
          // For subsequent items, if it's not expanded or minimized, it implies it's in compact state or becoming visible
          // No specific state change needed here, it will render the compact bar by default if not expanded/minimized
        }
      }
    } else {
      setIsExpanded(false)
      setIsMinimized(false)
    }
  }, [itemCount, isVisible, isExpanded, isMinimized])

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAddAllToCart = () => {
    if (itemCount === 0) return

    try {
      let addedCount = 0
      selectedRoomTypes.forEach((roomType) => {
        const count = roomCounts[roomType]
        const config = roomConfigs[roomType]
        if (count > 0 && config) {
          addItem({
            id: `custom-cleaning-${roomType}-${Date.now()}`,
            name: `${config.roomName} Cleaning`,
            price: config.totalPrice, // This should be unit price, quantity handles total
            priceId: "price_custom_cleaning",
            quantity: count,
            image: roomImages[roomType] || `/placeholder.svg?width=100&height=100&query=${config.roomName}`,
            metadata: {
              roomType,
              roomConfig: config, // contains unit price, total price for one unit, etc.
              isRecurring: false,
              frequency: "one_time",
            },
          })
          addedCount++
        }
      })

      if (addedCount > 0) {
        resetAllRooms()
        toast({
          title: "Items added to cart",
          description: `${addedCount} room type(s) have been added to your cart.`,
          duration: 3000,
        })
      } else {
        toast({
          title: "No items to add",
          description: "Please select rooms to add them to the cart.",
          variant: "default",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Error adding all items to cart:", error)
      toast({
        title: "Failed to add to cart",
        description: "There was an error adding items to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleMinimize = () => {
    setIsExpanded(false)
    setIsMinimized(true)
  }

  const handleExpand = () => {
    setIsExpanded(true)
    setIsMinimized(false)
  }

  const handleToggleCompactExpand = () => {
    if (isExpanded) {
      // If expanded, go to compact (or minimize if preferred)
      setIsExpanded(false)
      setIsMinimized(false) // Go to compact bar
    } else {
      // If compact or minimized, expand
      setIsExpanded(true)
      setIsMinimized(false)
    }
  }

  if (!isVisible && !itemCount) return null

  let currentDisplayState = "compact"
  if (isExpanded) currentDisplayState = "expanded"
  if (isMinimized) currentDisplayState = "minimized"

  // If visible but no specific state, default to compact
  if (isVisible && !isExpanded && !isMinimized) {
    currentDisplayState = "compact"
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="enhanced-cart-button-container"
          className={cn(
            "fixed z-[60] left-1/2 transform -translate-x-1/2",
            "transition-all duration-300 ease-out",
            hasScrolled ? "top-4" : "top-[70px]",
          )}
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 250 }}
        >
          <div className="relative group">
            {" "}
            {/* Added group for hover effects on compact bar */}
            {currentDisplayState === "minimized" && (
              <motion.div
                key="minimized"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-xl cursor-pointer flex items-center"
                onClick={handleExpand}
                role="button"
                tabIndex={0}
                aria-label="Expand cart summary"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="ml-2 font-bold">{itemCount}</span>
              </motion.div>
            )}
            {currentDisplayState === "expanded" && (
              <motion.div
                key="expanded"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-w-xs"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Your Selections
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleMinimize} // Changed to minimize
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-7 w-7"
                      aria-label="Minimize cart summary"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto pr-1">
                    {selectedRoomTypes.length > 0 ? (
                      selectedRoomTypes.map((roomType) => (
                        <div key={roomType} className="flex justify-between text-sm items-center">
                          <span className="text-gray-700 dark:text-gray-300 capitalize truncate max-w-[150px]">
                            {roomConfigs[roomType]?.roomName || roomType.replace(/_/g, " ")} ({roomCounts[roomType]})
                          </span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {formatCurrency((roomConfigs[roomType]?.totalPrice || 0) * (roomCounts[roomType] || 0))}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No rooms selected.</p>
                    )}
                  </div>

                  {selectedRoomTypes.length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">Scroll for more</p>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Total:</span>
                      <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddAllToCart}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    disabled={itemCount === 0}
                  >
                    Add All to Cart ({itemCount})
                  </Button>
                </div>
                <div className="absolute -bottom-[7px] left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700"></div>
              </motion.div>
            )}
            {currentDisplayState === "compact" && (
              <motion.div
                key="compact"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-blue-600 text-white rounded-lg shadow-xl px-4 py-3 flex items-center justify-between cursor-pointer min-w-[300px] hover:bg-blue-700 transition-colors"
                onClick={handleExpand} // Click to expand
                role="button"
                tabIndex={0}
                aria-label="Expand cart summary"
              >
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span className="font-medium mr-3">
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </span>
                  <span className="font-bold text-lg">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm mr-2 opacity-80 group-hover:opacity-100 hidden sm:inline">View Details</span>
                  <ChevronUp className="h-5 w-5 transform transition-transform duration-200 group-hover:scale-110" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
