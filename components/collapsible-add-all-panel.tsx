"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ShoppingCart, Plus, Package, Trash2, X, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRoomContext } from "@/lib/room-context"
import { useMultiSelection } from "@/hooks/use-multi-selection"
import { useCart } from "@/lib/cart-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useVibration } from "@/hooks/use-vibration"
import { useNetworkStatus } from "@/hooks/use-network-status"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { roomImages, roomDisplayNames } from "@/lib/room-tiers"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function CollapsibleAddAllPanel() {
  const { roomCounts, roomConfigs, updateRoomCount, getTotalPrice, getSelectedRoomTypes } = useRoomContext()
  const isMultiSelection = useMultiSelection(roomCounts)
  const { addItem } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { vibrate } = useVibration()
  const { isOnline } = useNetworkStatus()
  const controls = useAnimation()

  // State for dynamic positioning
  const [panelTopPosition, setPanelTopPosition] = useState<string>("auto")

  const selectedRoomTypes = getSelectedRoomTypes()
  const totalPrice = getTotalPrice()
  const totalItems = Object.values(roomCounts).reduce((sum, count) => sum + count, 0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Calculate panel position based on scroll and viewport
  const calculatePanelPosition = useCallback(() => {
    if (!panelRef.current) return

    const panelHeight = panelRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight

    // Start position: 150px from top of viewport (below share panel)
    const initialViewportTopOffset = 150
    const bottomPadding = 20 // Distance from bottom of document

    // Calculate desired top position
    const desiredTopFromScroll = scrollY + initialViewportTopOffset
    const maxTopAtDocumentBottom = documentHeight - panelHeight - bottomPadding

    // Use the minimum to ensure it doesn't go past the document bottom
    const finalTop = Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)

    setPanelTopPosition(`${finalTop}px`)
  }, [])

  useEffect(() => {
    const handleScrollAndResize = () => {
      calculatePanelPosition()
    }

    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })

    // Initial calculation
    const timeoutId = setTimeout(calculatePanelPosition, 0)

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize)
      window.removeEventListener("resize", handleScrollAndResize)
      clearTimeout(timeoutId)
    }
  }, [calculatePanelPosition])

  // Show panel when multi-selection is active
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
      setIsExpanded(false)
      controls.stop()
    }
  }, [isMultiSelection, totalItems, controls, vibrate])

  // Close panel when clicking outside
  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return // Click was on the button, don't close panel
    }
    setIsExpanded(false)
  })

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "alt+a": () => isMultiSelection && setIsExpanded((prev) => !prev),
    Escape: () => setIsExpanded(false),
  })

  const handleAddAllToCart = useCallback(() => {
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
        setIsExpanded(false)
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
  }, [selectedRoomTypes, roomCounts, roomConfigs, addItem, updateRoomCount, vibrate])

  const handleRemoveRoom = useCallback(
    (roomType: string) => {
      updateRoomCount(roomType, 0)
      vibrate(50) // Light feedback
    },
    [updateRoomCount, vibrate],
  )

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
  }, [selectedRoomTypes, roomConfigs, roomCounts, handleRemoveRoom])

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return null
  }

  // Don't show if no multi-selection is active
  if (!isMultiSelection || totalItems === 0) {
    return null
  }

  return (
    <TooltipProvider>
      <motion.div
        ref={panelRef}
        className="fixed z-[997]"
        style={{
          top: panelTopPosition,
          right: "clamp(1rem, 3vw, 2rem)",
          width: "fit-content",
        }}
        initial={{ x: "150%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Trigger Button */}
        <motion.button
          ref={buttonRef}
          animate={controls}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white",
            "rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800",
            "transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50",
            "border border-blue-500/20 backdrop-blur-sm relative",
          )}
          aria-label="Toggle add all to cart panel"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5" />
                <Plus className="h-3 w-3 -ml-1 -mt-1 text-white/80" />
              </div>
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white">
                {selectedRoomTypes.length}
              </Badge>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold">Add All</div>
              <div className="text-xs opacity-90">{formatCurrency(totalPrice)}</div>
            </div>
            <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isExpanded && "rotate-90")} />
          </div>
        </motion.button>

        {/* Expandable Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-white dark:bg-gray-900 shadow-2xl rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-800"
              style={{ maxHeight: "70vh" }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Ready to Add</h3>
                      <p className="text-blue-100 text-sm">
                        {selectedRoomTypes.length} room type{selectedRoomTypes.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                    className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1" style={{ maxHeight: "400px" }}>
                <div className="p-4">
                  <div className="space-y-3 mb-4">{roomList}</div>
                </div>
              </ScrollArea>

              {/* Footer */}
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
                  <Button variant="outline" onClick={() => setIsExpanded(false)} className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TooltipProvider>
  )
}
