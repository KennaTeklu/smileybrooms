"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PlusCircle, ChevronRight, X, CheckCircle, Maximize2, Minimize2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { RoomCategory } from "@/components/room-category"
import { RoomConfig } from "@/lib/room-config"

export function CollapsibleAddAllPanel() {
  const { cart, addRoomToCart, removeRoomFromCart } = useCart()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [panelHeight, setPanelHeight] = useState(0)
  const [isScrollPaused, setIsScrollPaused] = useState(false) // State for pausing panel's scroll-following
  const panelRef = useRef<HTMLDivElement>(null)

  // Define configurable scroll range values
  const minTopOffset = 20 // Minimum distance from the top of the viewport
  const initialScrollOffset = 50 // How far down the panel starts relative to scroll
  const minBottomOffset = 100 // Minimum distance from the bottom of the viewport (increased for more scroll range)
  const bottomPageMargin = 20 // Margin from the very bottom of the document

  // Handle mounting for SSR
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Pause panel's scroll-following when expanded or in full screen
  useEffect(() => {
    setIsScrollPaused(isExpanded || isFullScreen)
  }, [isExpanded, isFullScreen])

  // Track scroll position and panel height after mounting
  useEffect(() => {
    if (!isMounted || isScrollPaused) return // Don't track scroll when panel's position is paused

    const updatePositionAndHeight = () => {
      setScrollPosition(window.scrollY)
      if (panelRef.current) {
        setPanelHeight(panelRef.current.offsetHeight)
      }
    }

    // No setTimeout here, attach listeners immediately
    window.addEventListener("scroll", updatePositionAndHeight, { passive: true })
    window.addEventListener("resize", updatePositionAndHeight, { passive: true })
    updatePositionAndHeight() // Initial call

    return () => {
      window.removeEventListener("scroll", updatePositionAndHeight)
      window.removeEventListener("resize", updatePositionAndHeight)
    }
  }, [isMounted, isScrollPaused])

  // Handle click outside to collapse panel
  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isExpanded && !isFullScreen) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isExpanded, isFullScreen, isMounted])

  // Determine if the panel should be visible
  const showPanel = cart.rooms.length >= 2

  // Don't render until mounted to prevent SSR issues
  if (!isMounted) {
    return null
  }

  // Calculate panel position based on scroll and document height
  const documentHeight = document.documentElement.scrollHeight // Total scrollable height of the page
  const viewportHeight = window.innerHeight // Height of the viewport

  // Calculate the maximum top position the panel can reach
  const maxPanelTop = documentHeight - panelHeight - bottomPageMargin

  // Calculate the dynamic top position based on scroll
  const dynamicTop = window.scrollY + initialScrollOffset

  // Ensure the panel doesn't go above minTopOffset or below minBottomOffset from viewport bottom
  const panelTopPosition = isScrollPaused
    ? `${Math.max(minTopOffset, Math.min(scrollPosition + initialScrollOffset, maxPanelTop))}px`
    : `${Math.max(
        minTopOffset,
        Math.min(
          dynamicTop,
          viewportHeight - panelHeight - minBottomOffset, // Ensure it doesn't go too low in viewport
          maxPanelTop, // Ensure it doesn't go off the bottom of the document
        ),
      )}px`

  const handleAddAllToCart = useCallback(() => {
    // Logic to add all remaining rooms to cart
    const roomsToAdd = RoomConfig.filter((room) => !cart.rooms.some((cartRoom) => cartRoom.id === room.id))
    roomsToAdd.forEach((room) => addRoomToCart(room))
    setIsExpanded(false) // Collapse after adding
    setIsFullScreen(false) // Exit full screen if active
  }, [cart.rooms, addRoomToCart, setIsExpanded, setIsFullScreen])

  const handleRemoveAllFromCart = useCallback(() => {
    // Logic to remove all rooms from cart
    cart.rooms.forEach((room) => removeRoomFromCart(room.id))
    setIsExpanded(false) // Collapse after removing
    setIsFullScreen(false) // Exit full screen if active
  }, [cart.rooms, removeRoomFromCart, setIsExpanded, setIsFullScreen])

  const totalRooms = RoomConfig.length
  const roomsInCart = cart.rooms.length
  const roomsRemaining = totalRooms - roomsInCart

  if (!showPanel) {
    return null
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed right-0 z-50 flex transition-all duration-300 ease-in-out",
        isFullScreen ? "inset-0 w-full h-full" : "w-[380px]", // Increased width
      )}
      style={{ top: isFullScreen ? "0" : panelTopPosition }}
    >
      <AnimatePresence initial={false}>
        {isExpanded || isFullScreen ? (
          <motion.div
            key="expanded"
            initial={{ width: 0, opacity: 0, x: isFullScreen ? 0 : 320 }}
            animate={{ width: isFullScreen ? "100%" : "380px", opacity: 1, x: 0 }} // Increased width
            exit={{ width: 0, opacity: 0, x: isFullScreen ? 0 : 320 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "bg-white dark:bg-gray-900 rounded-l-lg shadow-lg overflow-hidden border-l border-t border-b border-gray-200 dark:border-gray-800",
              isFullScreen ? "rounded-none" : "",
            )}
          >
            <Card className="h-full flex flex-col rounded-none border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add All to Cart
                  {isScrollPaused && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded ml-2">
                      Scroll Fixed
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    aria-label={isFullScreen ? "Minimize panel" : "Maximize panel"}
                  >
                    {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsExpanded(false)
                      setIsFullScreen(false)
                    }}
                    aria-label="Close panel"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4 overflow-auto">
                {/* Content inside this div is scrollable */}
                <p className="text-sm text-muted-foreground mb-4">
                  You have selected {roomsInCart} out of {totalRooms} rooms. Add the remaining {roomsRemaining} rooms to
                  your cart with one click!
                </p>
                <div className="space-y-4">
                  {RoomConfig.map((room) => {
                    const isInCart = cart.rooms.some((cartRoom) => cartRoom.id === room.id)
                    return (
                      <div
                        key={room.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border",
                          isInCart ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" : "",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <RoomCategory category={room.category} className="h-6 w-6" />
                          <span className="font-medium">{room.name}</span>
                        </div>
                        {isInCart ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm">
                            <CheckCircle className="h-4 w-4" /> Added
                          </span>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => addRoomToCart(room)} className="text-xs">
                            Add
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t flex flex-col gap-2">
                <Button className="w-full" onClick={handleAddAllToCart} disabled={roomsRemaining === 0}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add All Remaining ({roomsRemaining})
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRemoveAllFromCart}
                  disabled={roomsInCart === 0}
                >
                  Remove All from Cart
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ width: 0, opacity: 0, x: 320 }}
            animate={{ width: "auto", opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: 320 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={() => setIsExpanded(true)}
            className={cn(
              "flex items-center gap-2 py-3 px-4 bg-white dark:bg-gray-900",
              "rounded-l-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800",
              "border-l border-t border-b border-gray-200 dark:border-gray-800",
              "transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Open add all to cart panel"
          >
            <ChevronRight className="h-4 w-4" />
            <PlusCircle className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
