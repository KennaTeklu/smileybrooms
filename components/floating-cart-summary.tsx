"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Settings,
  Trash2,
  Eye,
  Zap,
  ArrowRight,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { AdvancedSidePanel } from "@/components/sidepanel/advanced-sidepanel"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"

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

interface FloatingCartSummaryProps {
  rooms: RoomItem[]
  totalPrice: number
  onAddAllToCart: () => void
  onRoomCountChange: (id: string, count: number) => void
  onRemoveRoom: (id: string) => void
  onCustomizeRoom: (room: RoomItem) => void
  className?: string
}

export function FloatingCartSummary({
  rooms,
  totalPrice,
  onAddAllToCart,
  onRoomCountChange,
  onRemoveRoom,
  onCustomizeRoom,
  className,
}: FloatingCartSummaryProps) {
  const [scrollY, setScrollY] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const { addItem } = useCart()
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll position with smooth updates
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const selectedRoomsCount = rooms.filter((room) => room.count > 0).length
  const totalItems = rooms.reduce((sum, room) => sum + room.count, 0)

  const handleAddToCart = () => {
    if (selectedRoomsCount === 0) {
      toast({
        title: "No rooms selected",
        description: "Please select rooms before adding to cart.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    onAddAllToCart()
    setIsExpanded(false)
    setIsPanelOpen(false)

    // Success feedback with haptic-like animation
    const button = document.getElementById("floating-add-to-cart")
    if (button) {
      button.style.transform = "scale(0.95)"
      setTimeout(() => {
        button.style.transform = "scale(1)"
      }, 150)
    }
  }

  const handleRoomIncrement = (id: string, currentCount: number) => {
    onRoomCountChange(id, currentCount + 1)
  }

  const handleRoomDecrement = (id: string, currentCount: number) => {
    if (currentCount > 1) {
      onRoomCountChange(id, currentCount - 1)
    } else {
      onRemoveRoom(id)
    }
  }

  if (selectedRoomsCount === 0) {
    return null
  }

  return (
    <>
      <motion.div
        ref={containerRef}
        className={cn("fixed right-4 z-50 transition-all duration-300 ease-out", className)}
        style={{
          top: `${Math.max(100 + scrollY * 0.08, 100)}px`, // Smoother scroll following
        }}
        initial={{ opacity: 0, x: 100, scale: 0.9 }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
          y: isMinimized ? -10 : 0,
        }}
        exit={{ opacity: 0, x: 100, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <Card
          className={cn(
            "bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950",
            "shadow-xl border-2 border-blue-200 dark:border-blue-800",
            "backdrop-blur-sm max-w-xs transition-all duration-300",
            isMinimized ? "scale-95 opacity-90" : "scale-100 opacity-100",
          )}
        >
          <CardContent className="p-4">
            {/* Header with minimize option */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {totalItems}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Cart Summary</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {selectedRoomsCount} room type{selectedRoomsCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-blue-100 dark:hover:bg-blue-900"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Eye className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-blue-100 dark:hover:bg-blue-900"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Quick preview when collapsed */}
                {!isExpanded && selectedRoomsCount <= 3 && (
                  <div className="mb-3 space-y-1">
                    {rooms
                      .filter((room) => room.count > 0)
                      .slice(0, 3)
                      .map((room) => (
                        <div
                          key={room.id}
                          className="flex items-center justify-between text-xs bg-blue-50 dark:bg-blue-950 rounded-md p-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{room.roomIcon}</span>
                            <span className="font-medium truncate">{room.roomName}</span>
                            <Badge variant="secondary" className="text-xs px-1">
                              {room.count}
                            </Badge>
                          </div>
                          <span className="text-xs font-semibold text-blue-600">
                            {formatCurrency(room.config.totalPrice * room.count)}
                          </span>
                        </div>
                      ))}
                    {selectedRoomsCount > 3 && (
                      <div className="text-xs text-center text-gray-500 py-1">
                        +{selectedRoomsCount - 3} more room{selectedRoomsCount - 3 !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded detailed view */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-800">
                        {rooms
                          .filter((room) => room.count > 0)
                          .map((room) => (
                            <motion.div
                              key={room.id}
                              className="flex items-center justify-between text-xs bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-3 border border-blue-100 dark:border-blue-800"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-lg">{room.roomIcon}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate text-gray-900 dark:text-white">{room.roomName}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {room.config.selectedTier}
                                  </p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  ×{room.count}
                                </Badge>
                              </div>
                              <div className="text-right ml-2">
                                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                                  {formatCurrency(room.config.totalPrice * room.count)}
                                </p>
                                <p className="text-xs text-gray-500">{formatCurrency(room.config.totalPrice)} each</p>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Total price display */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Total:</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900"
                    onClick={() => setIsPanelOpen(true)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                  <Button
                    id="floating-add-to-cart"
                    variant="default"
                    size="sm"
                    className="flex-1 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AdvancedSidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Cart Details"
        subtitle={`${totalItems} item${totalItems !== 1 ? "s" : ""} in ${selectedRoomsCount} room type${selectedRoomsCount !== 1 ? "s" : ""}`}
        width="md"
        position="right"
        primaryAction={{
          label: "Add All to Cart",
          onClick: handleAddToCart,
          disabled: selectedRoomsCount === 0,
          icon: ShoppingCart,
        }}
        secondaryAction={{
          label: "Close",
          onClick: () => setIsPanelOpen(false),
        }}
        priceDisplay={{
          label: "Total",
          amount: totalPrice,
          currency: "$",
        }}
      >
        <div className="px-4 space-y-4 max-h-96 overflow-y-auto">
          {rooms
            .filter((room) => room.count > 0)
            .map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-3xl">{room.roomIcon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate text-gray-900 dark:text-white">{room.roomName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {room.config.selectedTier}
                          {room.config.selectedAddOns.length > 0 && (
                            <span className="ml-1">
                              + {room.config.selectedAddOns.length} add-on
                              {room.config.selectedAddOns.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatCurrency(room.config.totalPrice)} each
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            × {room.count} = {formatCurrency(room.config.totalPrice * room.count)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950"
                        onClick={() => handleRoomDecrement(room.id, room.count)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-semibold w-8 text-center bg-blue-100 dark:bg-blue-900 rounded px-2 py-1">
                        {room.count}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950"
                        onClick={() => handleRoomIncrement(room.id, room.count)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 ml-1 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
                        onClick={() => onCustomizeRoom(room)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950"
                        onClick={() => onRemoveRoom(room.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>
      </AdvancedSidePanel>
    </>
  )
}
