"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { AdvancedSidePanel } from "@/components/sidepanel/advanced-sidepanel"
import { SidepanelHeader } from "@/components/sidepanel/sidepanel-header"
import { SidepanelContent } from "@/components/sidepanel/sidepanel-content"
import { SidepanelFooter } from "@/components/sidepanel/sidepanel-footer"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import type { CartItem } from "@/lib/cart-context"

interface RoomCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function RoomCustomizationPanel({ isOpen, onClose }: RoomCustomizationPanelProps) {
  const { addToCart } = useCart()
  const [rooms, setRooms] = useState({
    bedrooms: 0,
    bathrooms: 0,
    kitchens: 0,
    livingRooms: 0,
  })
  const [addOns, setAddOns] = useState({
    ovenCleaning: false,
    fridgeCleaning: false,
    windowCleaning: false,
    laundryService: false,
  })

  const roomPrices = {
    bedrooms: 30,
    bathrooms: 40,
    kitchens: 50,
    livingRooms: 35,
  }

  const addOnPrices = {
    ovenCleaning: 25,
    fridgeCleaning: 20,
    windowCleaning: 50,
    laundryService: 30,
  }

  const calculateTotal = () => {
    let total = 0
    for (const roomType in rooms) {
      total += rooms[roomType as keyof typeof rooms] * roomPrices[roomType as keyof typeof roomPrices]
    }
    for (const addOnType in addOns) {
      if (addOns[addOnType as keyof typeof addOns]) {
        total += addOnPrices[addOnType as keyof typeof addOns]
      }
    }
    return total
  }

  const handleRoomChange = (roomType: keyof typeof rooms, value: number) => {
    setRooms((prev) => ({ ...prev, [roomType]: Math.max(0, value) }))
  }

  const handleAddOnChange = (addOnType: keyof typeof addOns, checked: boolean) => {
    setAddOns((prev) => ({ ...prev, [addOnType]: checked }))
  }

  const handleAddToCart = () => {
    const total = calculateTotal()
    const itemsToAdd: Omit<CartItem, "quantity">[] = []

    for (const roomType in rooms) {
      if (rooms[roomType as keyof typeof rooms] > 0) {
        itemsToAdd.push({
          id: `room-${roomType}`,
          name: `${rooms[roomType as keyof typeof rooms]} ${roomType.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          price: rooms[roomType as keyof typeof rooms] * roomPrices[roomType as keyof typeof roomPrices],
        })
      }
    }

    for (const addOnType in addOns) {
      if (addOns[addOnType as keyof typeof addOns]) {
        itemsToAdd.push({
          id: `add-on-${addOnType}`,
          name: addOnType.replace(/([A-Z])/g, " $1").toLowerCase(),
          price: addOnPrices[addOnType as keyof typeof addOns],
        })
      }
    }

    if (itemsToAdd.length > 0) {
      itemsToAdd.forEach((item) => addToCart(item, 1)) // Add each item individually
    }

    onClose()
  }

  const total = calculateTotal()

  return (
    <AdvancedSidePanel isOpen={isOpen} onClose={onClose} side="right">
      <SidepanelHeader title="Customize Your Cleaning" onClose={onClose} />
      <SidepanelContent className="flex flex-col gap-6 p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Rooms</h3>
          {Object.keys(rooms).map((roomType) => (
            <div key={roomType} className="flex items-center justify-between">
              <Label htmlFor={roomType} className="capitalize">
                {roomType.replace(/([A-Z])/g, " $1")}
              </Label>
              <Input
                id={roomType}
                type="number"
                min="0"
                value={rooms[roomType as keyof typeof rooms]}
                onChange={(e) => handleRoomChange(roomType as keyof typeof rooms, Number.parseInt(e.target.value))}
                className="w-20 text-center"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add-ons</h3>
          {Object.keys(addOns).map((addOnType) => (
            <div key={addOnType} className="flex items-center justify-between">
              <Label htmlFor={addOnType} className="flex items-center gap-2 capitalize">
                <Checkbox
                  id={addOnType}
                  checked={addOns[addOnType as keyof typeof addOns]}
                  onCheckedChange={(checked) => handleAddOnChange(addOnType as keyof typeof addOns, checked as boolean)}
                />
                {addOnType.replace(/([A-Z])/g, " $1")} ({formatCurrency(addOnPrices[addOnType as keyof typeof addOns])})
              </Label>
            </div>
          ))}
        </div>
      </SidepanelContent>
      <SidepanelFooter className="flex flex-col gap-2 p-4">
        <div className="flex justify-between font-bold">
          <span>Estimated Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <Button className="w-full" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </SidepanelFooter>
    </AdvancedSidePanel>
  )
}
