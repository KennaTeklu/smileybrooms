"use client"

import { useState, useEffect } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { roomTiers } from "@/lib/room-tiers"

interface SimpleCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  roomType: string
  roomName: string
}

export default function SimpleCustomizationPanel({
  isOpen,
  onClose,
  roomType,
  roomName,
}: SimpleCustomizationPanelProps) {
  const { addToCart } = useCart()
  const [selectedTier, setSelectedTier] = useState("standard")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  const roomData = roomTiers[roomType as keyof typeof roomTiers]

  useEffect(() => {
    if (!roomData) return

    const tierPrice = roomData.tiers.find((t) => t.id === selectedTier)?.price || 0
    const addOnPrice = selectedAddOns.reduce((sum, addOnId) => {
      const addOn = roomData.addOns.find((a) => a.id === addOnId)
      return sum + (addOn?.price || 0)
    }, 0)

    setTotalPrice(tierPrice + addOnPrice)
  }, [selectedTier, selectedAddOns, roomData])

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) => (prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]))
  }

  const handleAddToCart = () => {
    const tier = roomData?.tiers.find((t) => t.id === selectedTier)
    const addOns = roomData?.addOns.filter((a) => selectedAddOns.includes(a.id)) || []

    if (tier) {
      addToCart({
        id: `${roomType}-${Date.now()}`,
        name: `${roomName} - ${tier.name}`,
        price: totalPrice,
        quantity: 1,
        roomType,
        tier: tier.name,
        addOns: addOns.map((a) => a.name),
      })
      onClose()
    }
  }

  if (!isOpen || !roomData) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Customize {roomName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Cleaning Tiers */}
          <div>
            <h3 className="font-medium mb-3">Cleaning Level</h3>
            <div className="space-y-2">
              {roomData.tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTier === tier.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{tier.name}</div>
                      <div className="text-sm text-gray-600">{tier.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${tier.price}</div>
                      {selectedTier === tier.id && <Check className="h-4 w-4 text-blue-500 ml-auto mt-1" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <h3 className="font-medium mb-3">Add-ons</h3>
            <div className="space-y-2">
              {roomData.addOns.map((addOn) => (
                <div
                  key={addOn.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddOns.includes(addOn.id)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleAddOn(addOn.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{addOn.name}</div>
                      <div className="text-sm text-gray-600">{addOn.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">+${addOn.price}</div>
                      {selectedAddOns.includes(addOn.id) && <Check className="h-4 w-4 text-green-500 ml-auto mt-1" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
          <Button onClick={handleAddToCart} className="w-full" size="lg">
            Add to Cart
          </Button>
        </div>
      </div>
    </>
  )
}
