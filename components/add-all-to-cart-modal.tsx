"use client"

import type React from "react"

// Animation and Motion
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

// UI Components
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

// Icons and Visual Elements
import { ShoppingCart, X, Package, Trash2, ChevronDown, Plus } from "lucide-react"
import { Sparkles } from "lucide-react"

// Hooks and Utilities
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useNetworkStatus } from "@/hooks/use-network-status"

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
  const isSmallScreen = useMediaQuery("(max-width: 640px)")
  const isMediumScreen = useMediaQuery("(max-width: 1024px)")
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()

  // Ref for the main container div to get its height
  const containerRef = useRef<HTMLDivElement>(null)
  const [calculatedTop, setCalculatedTop] = useState<string>("auto")
  const [calculatedRight, setCalculatedRight] = useState<string>("auto")

  // Motion values for interactive effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5])
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5])

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()
  const totalItems = Object.values(roomCounts).reduce((sum, count) => sum + count, 0)

  // --- Positioning logic for "sticky to page bottom" for this specific component ---
  const initialViewportTopOffset = 100 // How far from the top of the viewport it initially appears
  const bottomPadding = 100 // How far from the bottom of the document it should stop
  const rightPadding = "clamp(1rem, 3vw, 2rem)" // Right padding from viewport/document edge

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return

    const elementHeight = containerRef.current.offsetHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollY = window.scrollY

    // Calculate desired top position if it were to follow scroll
    const desiredTopFromScroll = scrollY + initialViewportTopOffset

    // Calculate the maximum top position to stick to the bottom of the document
    const maxTopAtDocumentBottom = documentHeight - elementHeight - bottomPadding

    // The final top position is the minimum of (following scroll) and (sticking to document bottom)
    const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)

    setCalculatedTop(`${finalTop}px`)
    setCalculatedRight(rightPadding) // Use the right padding directly
  }, [initialViewportTopOffset, bottomPadding, rightPadding])

  useEffect(() => {
    const handleScrollAndResize = () => {
      updatePosition()
    }

    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })
    window.addEventListener("orientationchange", handleScrollAndResize, { passive: true })

    // Initial calculation after component mounts and potentially renders
    // Use a timeout to ensure element height is calculated after initial render
    const timeoutId = setTimeout(updatePosition, 0)

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize)
      window.removeEventListener("resize", handleScrollAndResize)
      window.removeEventListener("orientationchange", handleScrollAndResize)
      clearTimeout(timeoutId)
    }
  }, [updatePosition])
  // --- End positioning logic ---

  // Show button when multi-selection is active
  useEffect(() => {
    if (isMultiSelection && totalItems > 0) {
      // Enhanced pulse animation for visibility
      controls.start({
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 4px 20px rgba(59, 130, 246, 0.3)",
          "0 8px 40px rgba(59, 130, 246, 0.6)",
          "0 4px 20px rgba(59, 130, 246, 0.3)",
        ],
        transition: { duration: 2, repeat: 3, repeatType: "reverse" },
      })

      // Haptic feedback when items are ready
      vibrate(100)
    } else {
      setIsOpen(false)
      controls.stop()
    }
  }, [isMultiSelection, totalItems, controls, vibrate])

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
          title: "🎉 All items added to cart!",
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

  // Memoized room list with enhanced styling
  const roomList = useMemo(() => {
    return selectedRoomTypes.map((roomType) => {
      const config = roomConfigs[roomType]
      const count = roomCounts[roomType]
      const roomTotal = (config?.totalPrice || 0) * count

      return (
        <motion.div
          key={roomType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl group hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 border border-gray-200 dark:border-gray-600"
        >
          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
            <Image
              src={roomImages[roomType] || "/placeholder.svg"}
              alt={roomDisplayNames[roomType] || roomType}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 truncate">
              {roomDisplayNames[roomType] || roomType}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {config?.selectedTier || "Essential Clean"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                Qty: {count}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {formatCurrency(config?.totalPrice || 0)}
              </Badge>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{formatCurrency(roomTotal)}</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRoom(roomType)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2 h-8 w-8 p-0 opacity-70 group-hover:opacity-100 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Remove from selection</TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      )
    })
  }, [selectedRoomTypes, roomConfigs, roomCounts])

  return (
    <TooltipProvider>
      <motion.div
        ref={containerRef} // Assign ref here
        className="absolute z-[999]" // Change from fixed to absolute
        style={{
          top: calculatedTop, // Use calculated top
          right: calculatedRight, // Use calculated right
          left: "auto",
          bottom: "auto",
          width: "fit-content",
        }}
        initial={{ x: "150%" }} // Start off-screen to the right
        animate={isMultiSelection && totalItems > 0 ? { x: 0 } : { x: "150%" }} // Animate based on condition
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 shadow-2xl rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-800"
              onMouseMove={handleMouseMove}
              style={{
                rotateX: isSmallScreen ? 0 : rotateX,
                rotateY: isSmallScreen ? 0 : rotateY,
                transformPerspective: 1000,
                width: isSmallScreen ? "90vw" : isMediumScreen ? "400px" : "450px",
                maxHeight: "70vh",
                maxWidth: "calc(100vw - 2rem)",
              }}
            >
              <div className="flex flex-col h-full">
                <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-4">
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
                      className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <ScrollArea className="flex-1">
                  <CardContent className="p-4">
                    <div className="space-y-3 mb-4">{roomList}</div>
                  </CardContent>
                </ScrollArea>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="space-y-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleAddAllToCart}
                          disabled={!isOnline}
                          size="lg"
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white group relative overflow-hidden h-12 text-base font-bold shadow-lg"
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
                    <Button variant="outline" onClick={handleClose} className="w-full">
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          ref={buttonRef}
          // Removed initial for opacity/scale as parent motion.div handles overall visibility
          animate={controls} // Still use controls for pulse animation
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white",
            "rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800",
            "transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50",
            "border border-blue-500/20 backdrop-blur-sm",
            pulseAnimation && "animate-pulse",
            isSmallScreen ? "min-w-[240px]" : "min-w-[280px]",
          )}
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          }}
          aria-label="Open cart summary"
        >
          <div className="flex items-center gap-3 relative">
            <div className="relative">
              <div className="p-1.5 bg-white/20 rounded-full">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5" />
                  <Plus className="h-3 w-3 -ml-1 -mt-1 text-white/80" />
                </div>
              </div>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white">
                {selectedRoomTypes.length}
              </Badge>
            </div>
            <div className="text-left flex-1">
              <div className="text-sm font-bold">
                Add All to Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
              </div>
              <div className="text-xs opacity-90">{formatCurrency(totalPrice)}</div>
            </div>
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
          </div>
        </motion.button>
      </motion.div>
    </TooltipProvider>
  )
}
