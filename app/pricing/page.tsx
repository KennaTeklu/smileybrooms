"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus } from "lucide-react"
import { BuySubscribeButtons } from "@/components/buy-subscribe-buttons"

interface RoomSelection {
  roomType: string
  roomName: string
  roomCount: number
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  totalPrice: number
  frequency: string
  frequencyDiscount: number
}

const roomTypes = [
  { id: "bedroom", name: "Bedrooms", basePrice: 45 },
  { id: "bathroom", name: "Bathrooms", basePrice: 35 },
  { id: "kitchen", name: "Kitchen", basePrice: 55 },
  { id: "living_room", name: "Living Room", basePrice: 50 },
  { id: "dining_room", name: "Dining Room", basePrice: 40 },
  { id: "office", name: "Home Office", basePrice: 35 },
  { id: "laundry", name: "Laundry Room", basePrice: 30 },
  { id: "entryway", name: "Entryway", basePrice: 25 },
]

const frequencyOptions = [
  { id: "one_time", name: "One-time Service", discount: 0 },
  { id: "weekly", name: "Weekly Service", discount: 15 },
  { id: "bi_weekly", name: "Bi-weekly Service", discount: 10 },
  { id: "monthly", name: "Monthly Service", discount: 5 },
]

export default function PricingPage() {
  const [roomCounts, setRoomCounts] = useState<{ [key: string]: number }>({})
  const [selectedFrequency, setSelectedFrequency] = useState("one_time")

  const updateRoomCount = (roomId: string, change: number) => {
    setRoomCounts((prev) => ({
      ...prev,
      [roomId]: Math.max(0, (prev[roomId] || 0) + change),
    }))
  }

  const getSelectedRooms = (): RoomSelection[] => {
    return Object.entries(roomCounts)
      .filter(([_, count]) => count > 0)
      .map(([roomId, count]) => {
        const roomType = roomTypes.find((r) => r.id === roomId)
        const frequency = frequencyOptions.find((f) => f.id === selectedFrequency)

        return {
          roomType: roomId,
          roomName: roomType?.name || roomId,
          roomCount: count,
          selectedTier: "ESSENTIAL CLEAN",
          selectedAddOns: [],
          selectedReductions: [],
          totalPrice: roomType?.basePrice || 0,
          frequency: selectedFrequency,
          frequencyDiscount: frequency?.discount || 0,
        }
      })
  }

  const getTotalPrice = () => {
    const subtotal = Object.entries(roomCounts).reduce((total, [roomId, count]) => {
      const roomType = roomTypes.find((r) => r.id === roomId)
      return total + (roomType?.basePrice || 0) * count
    }, 0)

    const frequency = frequencyOptions.find((f) => f.id === selectedFrequency)
    const discount = frequency?.discount || 0
    const discountAmount = subtotal * (discount / 100)

    return subtotal - discountAmount
  }

  const handlePurchase = (type: "buy" | "subscribe") => {
    console.log(`${type} clicked with frequency: ${selectedFrequency}`)
    console.log("Selected rooms:", getSelectedRooms())
    // This would typically redirect to Stripe checkout
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Cleaning Service</h1>
        <p className="text-xl text-gray-600">Select rooms and frequency for your perfect cleaning plan</p>
      </div>

      {/* Frequency Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Service Frequency</CardTitle>
          <CardDescription>Choose how often you'd like your cleaning service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {frequencyOptions.map((option) => (
              <Button
                key={option.id}
                variant={selectedFrequency === option.id ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center"
                onClick={() => setSelectedFrequency(option.id)}
              >
                <span className="font-medium">{option.name}</span>
                {option.discount > 0 && (
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                    {option.discount}% off
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Your Rooms</CardTitle>
          <CardDescription>Choose which rooms you'd like cleaned</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomTypes.map((room) => (
              <div key={room.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-medium">{room.name}</h3>
                    <p className="text-sm text-gray-600">${room.basePrice} each</p>
                  </div>
                  <Badge variant="outline">{roomCounts[room.id] || 0}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateRoomCount(room.id, -1)}
                    disabled={(roomCounts[room.id] || 0) === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => updateRoomCount(room.id, 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Buy/Subscribe Buttons */}
      {getSelectedRooms().length > 0 && (
        <BuySubscribeButtons
          selectedRooms={getSelectedRooms()}
          totalPrice={getTotalPrice()}
          frequency={selectedFrequency}
          frequencyDiscount={frequencyOptions.find((f) => f.id === selectedFrequency)?.discount || 0}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  )
}
