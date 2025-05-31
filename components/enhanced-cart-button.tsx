"use client"

import { useState, useEffect, useMemo } from "react"
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
  const roomContext = useRoomContext() // Call hook at the top level
  const { addItem } = useCart()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false) // Start as false
  const [hasScrolled, setHasScrolled] = useState(false)

  // If context is not available (e.g., RoomProvider is missing higher up), do not render.
  if (!roomContext) {
    console.warn("EnhancedCartButton: RoomContext not found. Ensure this component is rendered within a RoomProvider.")
    // Optionally, render a small debug indicator if needed for diagnostics, but for production, null is better.
    // return <div className="fixed top-0 left-0 bg-red-500 text-white p-2 z-[9999]">RoomContext Missing!</div>;
    return null
  }

  const { roomCounts, roomConfigs, resetAllRooms, getTotalPrice, getSelectedRoomTypes } = roomContext

  const selectedRoomTypes = useMemo(() => getSelectedRoomTypes(), [roomCounts]) // Memoize to prevent unnecessary re-renders
  const totalPrice = useMemo(() => getTotalPrice(), [roomConfigs, roomCounts]) // Memoize
  const itemCount = selectedRoomTypes.length

  useEffect(() => {
    // console.log("EnhancedCartButton: itemCount =", itemCount); // For debugging
    const shouldBeVisible = itemCount > 0
    if (isVisible !== shouldBeVisible) {
      setIsVisible(shouldBeVisible)
    }

    if (shouldBeVisible) {
      // If it becomes visible and was previously not expanded or minimized, expand it.
      if (itemCount === 1 && !isExpanded && !isMinimized) {
        setIsExpanded(true)
        setIsMinimized(false) // Ensure not minimized
      }
    } else {
      // If it becomes not visible, reset states
      setIsExpanded(false)
      setIsMinimized(false)
    }
  }, [itemCount, isVisible, isExpanded, isMinimized])

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50) // Adjust scroll threshold if needed
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleAddAllToCart = () => {
    if (itemCount === 0) return // Should not happen if button is visible

    try {
      let addedCount = 0
      selectedRoomTypes.forEach((roomType) => {
        const count = roomCounts[roomType]
        const config = roomConfigs[roomType]
        if (count > 0 && config) {
          addItem({
            id: `custom-cleaning-${roomType}-${Date.now()}`,
            name: `${config.roomName} Cleaning`,
            price: config.totalPrice,
            priceId: "price_custom_cleaning", // Ensure this is a valid Stripe Price ID or placeholder
            quantity: count,
            image: roomImages[roomType] || "/placeholder.svg?width=100&height=100",
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

      if (addedCount > 0) {
        resetAllRooms() // Reset rooms after adding to cart
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

  const toggleExpandAndMinimize = () => {
    if (isExpanded) {
      // If expanded, minimize it
      setIsExpanded(false)
      setIsMinimized(true)
    } else {
      // If minimized or compact, expand it
      setIsExpanded(true)
      setIsMinimized(false)
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

  // Main visibility gate
  if (!isVisible && !itemCount) return null // Only render if items are selected

  // Determine current state for rendering
  let currentDisplayState = "compact" // Default to compact bar
  if (isExpanded) currentDisplayState = "expanded"
  if (isMinimized) currentDisplayState = "minimized"

  return (
    <AnimatePresence>
      {isVisible && ( // Ensure motion component only mounts when isVisible is true
        <motion.div
          key="enhanced-cart-button-container"
          className={cn(
            "fixed z-[60] left-1/2 transform -translate-x-1/2", // Increased z-index
            "transition-all duration-300 ease-out",
            hasScrolled ? "top-4" : "top-[70px]", // Adjusted top position slightly
          )}
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 250 }}
        >
          <div className="relative">
            {/* Minimized state - Click to expand */}
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

            {/* Expanded state - Full bubble */}
            {currentDisplayState === "expanded" && (
              <motion.div
                key="expanded"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-w-xs" // Fixed width
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
                      onClick={handleMinimize}
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
                            {formatCurrency(roomConfigs[roomType]?.totalPrice * roomCounts[roomType] || 0)}
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
                  >
                    Add All to Cart ({itemCount})
                  </Button>
                </div>
                {/* Speech bubble pointer */}
                <div className="absolute -bottom-[7px] left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700"></div>
              </motion.div>
            )}

            {/* Compact Notification Bar - Click to expand */}
            {currentDisplayState === "compact" && (
              <motion.div
                key="compact"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-blue-600 text-white rounded-lg shadow-xl px-4 py-3 flex items-center justify-between cursor-pointer min-w-[300px]"
                onClick={handleExpand}
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
                  <span className="text-sm mr-2 hidden sm:inline">View Details</span>
                  <ChevronUp className="h-5 w-5 transform transition-transform duration-200 group-hover:rotate-180" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
