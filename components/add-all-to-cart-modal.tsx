"use client"

import type React from "react"

// Animation and Motion
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useInView } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

// UI Components
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

// Icons and Visual Elements
import { ShoppingCart, X, Package, Trash2, ChevronLeft } from "lucide-react"
import { Sparkles } from "lucide-react"

// Hooks and Utilities
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { useScrollTriggeredAnimation } from "@/hooks/use-scroll-triggered-animation"

// Feedback and Notifications
import { toast } from "@/components/ui/use-toast"
import { useVibration } from "@/hooks/use-vibration"

// Data and Formatting
import { formatCurrency } from "@/lib/utils"
import { roomImages, roomDisplayNames } from "@/lib/room-tiers"
import { cn } from "@/lib/utils"

// Media and Assets
import Image from "next/image"

export function AddAllToCartModal() {
  const { roomCounts, roomConfigs, updateRoomCount, getTotalPrice, getSelectedRoomTypes } = useRoomContext()

  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenSeen, setHasBeenSeen] = useLocalStorage("cart-modal-seen", false)
  const [pulseAnimation, setPulseAnimation] = useState(!hasBeenSeen)
  const modalRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isInView = useInView(buttonRef)
  const isSmallScreen = useMediaQuery("(max-width: 640px)")
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()

  // Use scroll-triggered animation for the floating button's position
  const { elementRef: scrollElementRef, debugStyles: scrollTriggeredStyles } = useScrollTriggeredAnimation({
    basePosition: {
      top: 20, // Starts 20px from the top of the viewport
      right: 20, // Keeps it 20px from the right side
    },
  })

  // Motion values for interactive effects (for the modal content itself)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()
  const totalItems = Object.values(roomCounts).reduce((sum, count) => sum + count, 0)

  // Performance monitoring
  usePerformanceMonitor({
    onSlowRendering: () => {
      console.log("Cart modal rendering slowly, optimizing...")
    },
  })

  // Show modal when multi-selection becomes active - show immediately when requirements are met
  useEffect(() => {
    if (isMultiSelection && totalItems > 0) {
      // Show immediately when selection requirements are completed
      if (!hasBeenSeen) {
        setIsOpen(true)
        setHasBeenSeen(true)
      }

      // Pulse animation for visibility
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 1.5, repeat: 2, repeatType: "reverse" },
      })

      // Haptic feedback when items are ready
      vibrate(100)
    } else {
      setIsOpen(false)
    }
  }, [isMultiSelection, totalItems, hasBeenSeen, controls, vibrate])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    c: () => isMultiSelection && setIsOpen(true),
    Escape: () => setIsOpen(false),
  })

  // Close modal when clicking outside
  useClickOutside(modalRef, () => {
    if (isOpen) setIsOpen(false)
  })

  // Handle mouse movement for 3D hover effect
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left - rect.width / 2)
      mouseY.set(e.clientY - rect.top - rect.height / 2)
    },
    [mouseX, mouseY],
  )

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

          updateRoomCount(roomType, 0)
          addedCount++
        }
      })

      if (addedCount > 0) {
        vibrate([100, 50, 100]) // Success pattern
        toast({
          title: "All items added to cart",
          description: `${addedCount} room type(s) have been added to your cart.`,
          duration: 3000,
        })
        setIsOpen(false)
      }
    } catch (error) {
      console.error("Error adding all items to cart:", error)
      vibrate(300) // Error pattern
      toast({
        title: "Failed to add to cart",
        description: "There was an error adding all items to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const handleRemoveRoom = (roomType: string) => {
    updateRoomCount(roomType, 0)
    vibrate(50) // Light feedback
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  // Memoized room list to prevent unnecessary re-renders
  const roomList = useMemo(() => {
    return selectedRoomTypes.map((roomType) => {
      const config = roomConfigs[roomType]
      const count = roomCounts[roomType]
      const roomTotal = (config?.totalPrice || 0) * count

      return (
        <div
          key={roomType}
          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
            <div className="font-bold text-sm text-gray-900 dark:text-gray-100">{formatCurrency(roomTotal)}</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRoom(roomType)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1 h-6 w-6 p-0 opacity-70 group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove from selection</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )
    })
  }, [selectedRoomTypes, roomConfigs, roomCounts])

  // Don't render if no multi-selection or no items
  if (!isMultiSelection || totalItems === 0) return null

  return (
    <TooltipProvider>
      <motion.div
        ref={scrollElementRef} // This ref connects to the useScrollTriggeredAnimation hook
        style={scrollTriggeredStyles} // These styles control the floating and scrolling behavior
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
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
              onMouseMove={handleMouseMove}
              style={{
                rotateX: isSmallScreen ? 0 : rotateX,
                rotateY: isSmallScreen ? 0 : rotateY,
                transformPerspective: 1000,
              }}
            >
              <div className="w-80 sm:w-96 max-h-[80vh] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10 p-4">
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

                <ScrollArea className="flex-1">
                  <CardContent className="p-4">
                    {/* Room List */}
                    <div className="space-y-3 mb-4">{roomList}</div>
                  </CardContent>
                </ScrollArea>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  {/* Total Section */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Total</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {totalItems} room{totalItems !== 1 ? "s" : ""}
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleAddAllToCart}
                          disabled={!isOnline}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white group relative overflow-hidden"
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative flex items-center justify-center">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add All to Cart
                            <Sparkles className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isOnline ? "Add all selected rooms to cart" : "Cannot add to cart while offline"}
                      </TooltipContent>
                    </Tooltip>
                    <Button variant="outline" onClick={handleClose} className="w-full text-sm">
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              ref={buttonRef}
              initial={{ opacity: 0 }}
              animate={controls}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setIsOpen(true)}
              className={cn(
                "flex items-center justify-center p-3 bg-blue-600 text-white",
                "rounded-l-lg shadow-lg hover:bg-blue-700",
                "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                pulseAnimation && "animate-pulse",
                !isInView && "animate-bounce",
              )}
              aria-label="Open cart summary"
            >
              <div className="flex items-center gap-2 relative">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-[10px]">
                    {selectedRoomTypes.length}
                  </Badge>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold flex items-center">
                    {totalItems} Item{totalItems !== 1 ? "s" : ""}
                    <ChevronLeft className="h-3 w-3 ml-1" />
                  </div>
                  <div className="text-xs">{formatCurrency(totalPrice)}</div>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
