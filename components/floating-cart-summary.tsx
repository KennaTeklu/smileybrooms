"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, ChevronUp, ChevronDown, Plus, Minus, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  const { addItem } = useCart()
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
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
        className={cn("fixed right-4 z-40 transition-all duration-200 ease-out", className)}
        style={{
          top: `${Math.max(120 + scrollY * 0.1, 120)}px`, // Moves slightly with scroll but stays near top
        }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
      >
        <Card className="bg-white dark:bg-gray-900 shadow-lg border-2 border-blue-200 dark:border-blue-800 max-w-xs">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">
                  {totalItems} room{totalItems !== 1 ? "s" : ""} selected
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                    {rooms
                      .filter((room) => room.count > 0)
                      .map((room) => (
                        <div key={room.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 flex-1 min-w-0">
                            <span className="text-sm">{room.roomIcon}</span>
                            <span className="truncate">{room.roomName}</span>
                            <span className="text-gray-500">×{room.count}</span>
                          </div>
                          <span className="text-xs font-medium whitespace-nowrap ml-1">
                            {formatCurrency(room.config.totalPrice * room.count)}
                          </span>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Total:</span>
              <span className="text-sm font-bold text-blue-600">{formatCurrency(totalPrice)}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setIsPanelOpen(true)}>
                Details
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1 text-xs bg-blue-600 hover:bg-blue-700"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AdvancedSidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Selected Rooms"
        subtitle={`${totalItems} room${totalItems !== 1 ? "s" : ""} selected`}
        width="md"
        position="right"
        primaryAction={{
          label: "Add All to Cart",
          onClick: handleAddToCart,
          disabled: selectedRoomsCount === 0,
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
            .map((room) => (
              <Card key={room.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{room.roomIcon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{room.roomName}</h4>
                      <p className="text-xs text-gray-600 truncate">
                        {room.config.selectedTier}
                        {room.config.selectedAddOns.length > 0 && ` + ${room.config.selectedAddOns.length} add-on(s)`}
                      </p>
                      <p className="text-xs font-medium">
                        {formatCurrency(room.config.totalPrice)} × {room.count} ={" "}
                        {formatCurrency(room.config.totalPrice * room.count)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRoomDecrement(room.id, room.count)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium w-6 text-center">{room.count}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRoomIncrement(room.id, room.count)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 ml-1"
                      onClick={() => onCustomizeRoom(room)}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => onRemoveRoom(room.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </AdvancedSidePanel>
    </>
  )
}
