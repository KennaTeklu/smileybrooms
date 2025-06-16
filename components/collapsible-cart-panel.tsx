"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ChevronRight, X, Trash2, Minus, Plus, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/cart/utils"
import { RoomCategory } from "@/components/room-category"
import type { Room } from "@/lib/cart/types"

export function CollapsibleCartPanel() {
  const { cart, addRoomToCart, removeRoomFromCart, updateRoomQuantity } = useCart()
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

  const handleUpdateQuantity = useCallback(
    (room: Room, delta: number) => {
      const newQuantity = room.quantity + delta
      if (newQuantity <= 0) {
        removeRoomFromCart(room.id)
      } else {
        updateRoomQuantity(room.id, newQuantity)
      }
    },
    [updateRoomQuantity, removeRoomFromCart],
  )

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

    window.addEventListener("scroll", updatePositionAndHeight, { passive: true })
    window.addEventListener("resize", updatePositionAndHeight, { passive: true })
    updatePositionAndHeight() // Initial call

    return () => {
      window.removeEventListener("scroll", updatePositionAndHeight)
      window.removeEventListener("resize", updatePositionAndHeight)
    }
  }, [isMounted, isScrollPaused]) // Added isScrollPaused dependency

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

  const totalItems = cart.rooms.reduce((sum, room) => sum + room.quantity, 0)
  const totalPrice = cart.rooms.reduce((sum, room) => sum + room.price * room.quantity, 0)

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
                  Your Cart ({totalItems})
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
                {cart.rooms.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Your cart is empty.</p>
                    <p className="text-sm">Add some rooms to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <RoomCategory category={room.category} className="h-6 w-6" />
                          <div>
                            <p className="font-medium">{room.name}</p>
                            <p className="text-sm text-muted-foreground">{formatPrice(room.price)} each</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(room, -1)}
                            aria-label={`Decrease quantity of ${room.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold w-6 text-center">{room.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(room, 1)}
                            aria-label={`Increase quantity of ${room.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRoomFromCart(room.id)}
                            className="text-destructive hover:bg-destructive/10"
                            aria-label={`Remove ${room.name} from cart`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 border-t flex flex-col gap-2">
                <div className="flex justify-between w-full text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <Button className="w-full" disabled={cart.rooms.length === 0}>
                  Proceed to Checkout
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
            aria-label="Open cart panel"
          >
            <ChevronRight className="h-4 w-4" />
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {totalItems}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
