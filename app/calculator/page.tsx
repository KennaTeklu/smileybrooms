"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Home, Bed, Bath, Square, Plus, Minus, DollarSign, Calculator, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface Room {
  type: string
  count: number
  pricePerUnit: number
}

interface AddOn {
  name: string
  price: number
  selected: boolean
}

export default function CalculatorPage() {
  const [rooms, setRooms] = useState<Room[]>([
    { type: "Bedroom", count: 1, pricePerUnit: 30 },
    { type: "Bathroom", count: 1, pricePerUnit: 40 },
    { type: "Living Room", count: 1, pricePerUnit: 35 },
    { type: "Kitchen", count: 1, pricePerUnit: 50 },
  ])
  const [squareFootage, setSquareFootage] = useState<number | string>("")
  const [frequency, setFrequency] = useState("one-time")
  const [addOns, setAddOns] = useState<AddOn[]>([
    { name: "Deep Cleaning", price: 75, selected: false },
    { name: "Window Cleaning", price: 50, selected: false },
    { name: "Carpet Shampoo", price: 60, selected: false },
    { name: "Oven Cleaning", price: 30, selected: false },
    { name: "Fridge Cleaning", price: 25, selected: false },
  ])

  const handleRoomCountChange = (index: number, delta: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) => (i === index ? { ...room, count: Math.max(0, room.count + delta) } : room)),
    )
  }

  const handleAddOnToggle = (index: number) => {
    setAddOns((prevAddOns) =>
      prevAddOns.map((addOn, i) => (i === index ? { ...addOn, selected: !addOn.selected } : addOn)),
    )
  }

  const calculateSubtotal = () => {
    const roomTotal = rooms.reduce((sum, room) => sum + room.count * room.pricePerUnit, 0)
    const addOnTotal = addOns.reduce((sum, addOn) => sum + (addOn.selected ? addOn.price : 0), 0)
    return roomTotal + addOnTotal
  }

  const calculateDiscount = (subtotal: number) => {
    switch (frequency) {
      case "weekly":
        return subtotal * 0.2 // 20% discount
      case "bi-weekly":
        return subtotal * 0.15 // 15% discount
      case "monthly":
        return subtotal * 0.1 // 10% discount
      default:
        return 0
    }
  }

  const subtotal = calculateSubtotal()
  const discount = calculateDiscount(subtotal)
  const total = subtotal - discount
  const estimatedTime = Math.ceil(total / 50) * 60 // Assuming $50/hour, convert to minutes

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="h-6 w-6" />
            Cleaning Service Price Calculator
          </CardTitle>
          <CardDescription>Estimate the cost of your cleaning service based on your needs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Room Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Home className="h-5 w-5" />
              Rooms to be Cleaned
            </h3>
            {rooms.map((room, index) => (
              <div key={room.type} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  {room.type === "Bedroom" && <Bed className="h-5 w-5 text-blue-500" />}
                  {room.type === "Bathroom" && <Bath className="h-5 w-5 text-green-500" />}
                  {room.type === "Living Room" && <Home className="h-5 w-5 text-purple-500" />}
                  {room.type === "Kitchen" && <Home className="h-5 w-5 text-red-500" />}
                  <Label className="text-base">{room.type}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRoomCountChange(index, -1)}
                    disabled={room.count === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={room.count}
                    onChange={(e) =>
                      setRooms((prevRooms) =>
                        prevRooms.map((r, i) =>
                          i === index ? { ...r, count: Math.max(0, Number.parseInt(e.target.value) || 0) } : r,
                        ),
                      )
                    }
                    className="w-16 text-center"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleRoomCountChange(index, 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="font-medium">{`$${(room.count * room.pricePerUnit).toFixed(2)}`}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Square Footage (Optional) */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Square className="h-5 w-5" />
              Approx. Square Footage (Optional)
            </h3>
            <Input
              type="number"
              placeholder="e.g., 1500 sq ft"
              value={squareFootage}
              onChange={(e) => setSquareFootage(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Providing square footage helps us give a more accurate estimate.
            </p>
          </div>

          <Separator />

          {/* Cleaning Frequency */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Cleaning Frequency
            </h3>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time Cleaning</SelectItem>
                <SelectItem value="weekly">Weekly (20% off)</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly (15% off)</SelectItem>
                <SelectItem value="monthly">Monthly (10% off)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Add-on Services */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add-on Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addOns.map((addOn, index) => (
                <div key={addOn.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor={`addon-${index}`} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      id={`addon-${index}`}
                      checked={addOn.selected}
                      onCheckedChange={() => handleAddOnToggle(index)}
                    />
                    <span>{addOn.name}</span>
                  </Label>
                  <span className="font-medium">{`$${addOn.price.toFixed(2)}`}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Your Estimate
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>{`$${subtotal.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Discount ({frequency.replace("-", " ")} cleaning)</span>
                  <span>-{`$${discount.toFixed(2)}`}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total Estimate</span>
                <span>{`$${total.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg text-muted-foreground">
                <span>Estimated Time</span>
                <span>
                  {Math.floor(estimatedTime / 60)}h {estimatedTime % 60}m
                </span>
              </div>
            </div>
            <Button size="lg" className="w-full mt-6">
              Book Now
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              This is an estimate. Final price may vary based on actual service needs.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
