"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Trash2, Settings, Plus, Minus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

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

  const totalSelectedItems = useMemo(() => {
    return rooms.reduce((total, room) => total + room.count, 0)
  }, [rooms])

  const numberOfDistinctSelectedRoomTypes = useMemo(() => {
    return rooms.filter((room) => room.count > 0).length
  }, [rooms])

  if (rooms.length === 0) {
    return null // Don't render if no rooms are selected
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 h-16 w-16 md:h-20 md:w-20 flex flex-col items-center justify-center text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
          aria-label="Open selected rooms summary"
        >
          <ShoppingCart className="h-6 w-6 md:h-8 md:w-8" />
          <span className="text-xs md:text-sm font-semibold mt-1">{formatCurrency(overallTotalPrice)}</span>
          {totalSelectedItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {totalSelectedItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" /> Your Selected Rooms
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {room.roomIcon && <span className="text-3xl">{room.roomIcon}</span>}
                  <div>
                    <CardTitle className="text-lg">{room.roomName}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {room.config.selectedTier}
                      {room.config.selectedAddOns.length > 0 && ` + ${room.config.selectedAddOns.length} add-on(s)`}
                    </p>
                    <p className="text-sm font-medium">
                      {formatCurrency(room.config.totalPrice)} x {room.count} ={" "}
                      {formatCurrency(room.config.totalPrice * room.count)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => onDecrementRoomCount(room.id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium w-6 text-center">{room.count}</span>
                    <Button variant="outline" size="icon" onClick={() => onIncrementRoomCount(room.id)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => onOpenCustomizationPanel(room)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => onRemoveRoom(room.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="border-t pt-4 mt-auto">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total Estimated Price:</span>
            <span>{formatCurrency(overallTotalPrice)}</span>
          </div>
          <Button
            id="add-all-to-cart"
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => {
              onAddAllToCart()
              setIsOpen(false) // Close the sheet after adding to cart
            }}
            disabled={totalSelectedItems === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add All Selected Rooms to Cart
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
