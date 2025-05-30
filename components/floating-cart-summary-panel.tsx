"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Trash2, Settings, Plus, Minus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

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

interface FloatingCartSummaryPanelProps {
  rooms: RoomItem[]
  overallTotalPrice: number
  onAddAllToCart: () => void
  onRemoveRoom: (id: string) => void
  onDecrementRoomCount: (id: string) => void
  onIncrementRoomCount: (id: string) => void
  onOpenCustomizationPanel: (room: RoomItem) => void
}

export function FloatingCartSummaryPanel({
  rooms,
  overallTotalPrice,
  onAddAllToCart,
  onRemoveRoom,
  onDecrementRoomCount,
  onIncrementRoomCount,
  onOpenCustomizationPanel,
}: FloatingCartSummaryPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Control visibility based on whether there are any selected rooms
  useEffect(() => {
    if (rooms.length > 0) {
      setIsVisible(true)
    } else {
      // Delay hiding to allow exit animation to complete
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [rooms])

  const totalSelectedItems = useMemo(() => {
    return rooms.reduce((total, room) => total + room.count, 0)
  }, [rooms])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50" // Increased bottom/right for more prominence
        >
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="rounded-full shadow-xl h-20 w-20 md:h-24 md:w-24 flex flex-col items-center justify-center text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
                aria-label="Open selected rooms summary"
              >
                <ShoppingCart className="h-8 w-8 md:h-10 md:w-10" />
                <motion.span
                  key={overallTotalPrice} // Key to trigger animation on price change
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm md:text-base font-semibold mt-1"
                >
                  {formatCurrency(overallTotalPrice)}
                </motion.span>
                {totalSelectedItems > 0 && (
                  <motion.span
                    key={totalSelectedItems} // Key to trigger animation on count change
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 400 }}
                    className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white border-2 border-white"
                  >
                    {totalSelectedItems}
                  </motion.span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
                  <ShoppingCart className="h-6 w-6" /> Your Selected Rooms
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {rooms.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No rooms selected yet.</p>
                    <p>Start adding rooms to see them here!</p>
                  </div>
                ) : (
                  (
                    rooms.map((room) => (
                    <Card key={room.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {room.roomIcon && <span className="text-4xl">{room.roomIcon}</span>}
                          <div>
                            <CardTitle className="text-lg font-semibold">{room.roomName}</CardTitle>
                            <p className="text-sm text-gray-600">
                              {room.config.selectedTier}
                              {room.config.selectedAddOns.length > 0 &&
                                ` + ${room.config.selectedAddOns.length} add-on(s)`}
                            </p>
                            <p className="text-base font-bold mt-1">
                              {formatCurrency(room.config.totalPrice)} x {room.count} ={" "}
                              {formatCurrency(room.config.totalPrice * room.count)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => onDecrementRoomCount(room.id)} className="h-8 w-8">
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium w-8 text-center text-lg">{room.count}</span>
                            <Button variant="outline" size="icon" onClick={() => onIncrementRoomCount(room.id)} className="h-8 w-8">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => onOpenCustomizationPanel(room)} className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => onRemoveRoom(room.id)} className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>\
                  )
                  )
                )}
              </div>
              <div className="border-t pt-4 mt-auto">
                <div className="flex justify-between items-center text-2xl font-bold mb-4">
                  <span>Total Estimated Price:</span>
                  <span>{formatCurrency(overallTotalPrice)}</span>
                </div>
                <Button
                  id="add-all-to-cart"
                  variant="default"
                  size="lg"
                  className="w-full py-3 text-lg"
                  onClick={() => {
                    onAddAllToCart()
                    setIsOpen(false) // Close the sheet after adding to cart
                  }}
                  disabled={totalSelectedItems === 0}
                >
                  <ShoppingCart className="h-6 w-6 mr-2" />
                  Add All Selected Rooms to Cart
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
