"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ChevronLeft, Package, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { useClickOutside } from "@/hooks/use-click-outside"

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
}

interface RoomItem {
  id: string
  roomType: string
  roomName: string
  roomIcon: string
  count: number
  config: RoomConfig
}

interface FloatingAddToCartProps {
  rooms: RoomItem[]
  totalPrice: number
  onAddAllToCart: () => void
  className?: string
}

export function FloatingAddToCart({ rooms, totalPrice, onAddAllToCart, className }: FloatingAddToCartProps) {
  const [scrollY, setScrollY] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close panel when clicking outside
  useClickOutside(panelRef, () => {
    if (isExpanded) setIsExpanded(false)
  })

  const selectedRoomsCount = rooms.filter((room) => room.count > 0).length
  const totalItems = rooms.reduce((sum, room) => sum + room.count, 0)

  const handleAddToCart = () => {
    onAddAllToCart()
    setIsExpanded(false)

    // Success feedback with haptic-like animation
    const button = document.getElementById("floating-cart-button")
    if (button) {
      button.style.transform = "scale(0.95)"
      setTimeout(() => {
        button.style.transform = "scale(1)"
      }, 150)
    }
  }

  // Only show when MORE THAN 1 room type is selected
  if (selectedRoomsCount <= 1) {
    return null
  }

  return (
    <motion.div
      className={cn("fixed right-0 z-50", className)}
      style={{
        top: scrollY > 100 ? "auto" : "50%",
        bottom: scrollY > 100 ? "80px" : "auto",
        y: scrollY > 100 ? 0 : "-50%",
        transition: "top 0.3s ease, bottom 0.3s ease, transform 0.3s ease",
      }}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
    >
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-900 shadow-lg rounded-l-lg overflow-hidden flex"
          >
            <div className="w-72 sm:w-80 max-h-[80vh] overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Multi-Room Selection
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <Zap className="h-4 w-4 inline mr-1" />
                  {selectedRoomsCount} room types selected with {totalItems} total rooms
                </p>
              </div>

              <div className="space-y-3 mb-4">
                {rooms
                  .filter((room) => room.count > 0)
                  .map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-100 dark:border-blue-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{room.roomIcon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{room.roomName}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {room.config.selectedTier}
                            {room.config.selectedAddOns.length > 0 && ` + ${room.config.selectedAddOns.length} add-ons`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">
                          ×{room.count}
                        </Badge>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(room.config.totalPrice * room.count)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg border border-blue-200 dark:border-blue-700">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalPrice)}</span>
              </div>

              <Button
                id="floating-cart-button"
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add All to Cart
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setIsExpanded(true)}
            className={cn(
              "flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600",
              "rounded-l-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 text-white",
              "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
            )}
            aria-label="Open multi-room cart"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              </div>
              <span className="text-xs font-medium">Add All</span>
              <span className="text-xs opacity-90">{formatCurrency(totalPrice)}</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
