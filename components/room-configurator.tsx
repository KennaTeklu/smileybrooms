"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, Plus, Repeat } from "lucide-react"
import { useRouter } from "next/navigation"

interface Room {
  name: string
  basePrice: number
  cleaningTime: number
  selected: boolean
}

const RoomConfigurator = () => {
  const [rooms, setRooms] = useState<Room[]>([
    { name: "Kitchen", basePrice: 50, cleaningTime: 30, selected: false },
    { name: "Living Room", basePrice: 75, cleaningTime: 45, selected: false },
    { name: "Bedroom", basePrice: 60, cleaningTime: 40, selected: false },
    { name: "Bathroom", basePrice: 40, cleaningTime: 25, selected: false },
    { name: "Office", basePrice: 55, cleaningTime: 35, selected: false },
  ])

  const [frequency, setFrequency] = useState<"one_time" | "weekly" | "bi_weekly" | "monthly">("one_time")
  const [surfaceArea, setSurfaceArea] = useState(50)
  const [numberOfWindows, setNumberOfWindows] = useState(0)
  const [ovenCleaning, setOvenCleaning] = useState(false)
  const [fridgeCleaning, setFridgeCleaning] = useState(false)
  const [windowCleaning, setWindowCleaning] = useState(false)

  const router = useRouter()

  const handleRoomToggle = (roomName: string) => {
    setRooms(rooms.map((room) => (room.name === roomName ? { ...room, selected: !room.selected } : room)))
  }

  const handleSurfaceAreaChange = (value: number[]) => {
    setSurfaceArea(value[0])
  }

  const handleNumberOfWindowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfWindows(Number.parseInt(e.target.value))
  }

  const handleOvenCleaningChange = (checked: boolean) => {
    setOvenCleaning(checked)
  }

  const handleFridgeCleaningChange = (checked: boolean) => {
    setFridgeCleaning(checked)
  }

  const handleWindowCleaningChange = (checked: boolean) => {
    setWindowCleaning(checked)
  }

  const calculateRoomCost = (room: Room) => {
    return room.selected ? room.basePrice : 0
  }

  const calculateAdditionalServicesCost = () => {
    let additionalCost = 0
    if (ovenCleaning) additionalCost += 30
    if (fridgeCleaning) additionalCost += 25
    if (windowCleaning) additionalCost += numberOfWindows * 5
    return additionalCost
  }

  const calculateSubtotal = () => {
    const roomCost = rooms.reduce((acc, room) => acc + calculateRoomCost(room), 0)
    const additionalServicesCost = calculateAdditionalServicesCost()
    return roomCost + additionalServicesCost + surfaceArea * 0.5
  }

  const getFrequencyDiscount = () => {
    switch (frequency) {
      case "weekly":
        return 15
      case "bi_weekly":
        return 10
      case "monthly":
        return 5
      default:
        return 0
    }
  }

  const calculateDiscount = () => {
    const discountRate = getFrequencyDiscount() / 100
    return calculateSubtotal() * discountRate
  }

  const calculateTaxes = () => {
    return calculateSubtotal() * 0.08 // Assuming 8% tax rate
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    const taxes = calculateTaxes()
    return subtotal - discount + taxes
  }

  const totalPrice = calculateTotal()
  const hasSelectedRooms = rooms.some((room) => room.selected)

  const handleAddToCart = () => {
    // Implement your add to cart logic here
    console.log("Adding to cart:", {
      rooms: rooms.filter((room) => room.selected).map((room) => room.name),
      frequency,
      surfaceArea,
      numberOfWindows,
      ovenCleaning,
      fridgeCleaning,
      windowCleaning,
      totalPrice,
    })
    alert("Added to cart!")
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Rooms</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {rooms.map((room) => (
            <div key={room.name} className="flex items-center space-x-2">
              <Checkbox id={room.name} checked={room.selected} onCheckedChange={() => handleRoomToggle(room.name)} />
              <Label htmlFor={room.name}>
                {room.name} (${room.basePrice})
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={frequency} onValueChange={(value) => setFrequency(value as typeof frequency)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one_time">One Time</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="bi_weekly">Bi-Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Additional Services</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="oven" checked={ovenCleaning} onCheckedChange={handleOvenCleaningChange} />
            <Label htmlFor="oven">Oven Cleaning (+ $30)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="fridge" checked={fridgeCleaning} onCheckedChange={handleFridgeCleaningChange} />
            <Label htmlFor="fridge">Fridge Cleaning (+ $25)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="windows" checked={windowCleaning} onCheckedChange={handleWindowCleaningChange} />
            <Label htmlFor="windows">Window Cleaning (+ ${numberOfWindows * 5})</Label>
          </div>
          {windowCleaning && (
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="windows-number">Number of Windows</Label>
              <Input
                type="number"
                id="windows-number"
                value={numberOfWindows}
                onChange={handleNumberOfWindowsChange}
                className="col-span-3"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Surface Area (sq ft)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Slider defaultValue={[surfaceArea]} max={200} step={10} onValueChange={handleSurfaceAreaChange} />
            <Input type="number" value={surfaceArea} readOnly />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Service Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Rooms:</span>
              <span>
                {rooms
                  .filter((room) => room.selected)
                  .map((room) => room.name)
                  .join(", ") || "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Surface Area:</span>
              <span>{surfaceArea} sq ft</span>
            </div>
            <div className="flex justify-between">
              <span>Oven Cleaning:</span>
              <span>{ovenCleaning ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span>Fridge Cleaning:</span>
              <span>{fridgeCleaning ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span>Window Cleaning:</span>
              <span>
                {windowCleaning ? "Yes" : "No"} ({numberOfWindows} windows)
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            {frequency !== "one_time" && (
              <div className="flex justify-between">
                <span>Discount ({getFrequencyDiscount()}%)</span>
                <span>-${calculateDiscount().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes:</span>
              <span>${calculateTaxes().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buy/Subscribe Buttons */}
      {hasSelectedRooms && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Ready to Book?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {frequency === "one_time"
                    ? "Purchase your one-time cleaning service"
                    : `Subscribe to ${frequency.replace("_", "-")} cleaning service`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {frequency === "one_time" ? (
                  <Button
                    className="flex-1 py-6 text-lg bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    onClick={() => {
                      // Add to cart and redirect to checkout
                      handleAddToCart()
                      router.push("/checkout")
                    }}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now - ${totalPrice.toFixed(2)}
                  </Button>
                ) : (
                  <Button
                    className="flex-1 py-6 text-lg bg-green-600 hover:bg-green-700"
                    size="lg"
                    onClick={() => {
                      // Add to cart as subscription and redirect to checkout
                      handleAddToCart()
                      router.push("/checkout?type=subscription")
                    }}
                  >
                    <Repeat className="mr-2 h-5 w-5" />
                    Subscribe - ${totalPrice.toFixed(2)}/
                    {frequency === "weekly" ? "week" : frequency === "bi_weekly" ? "2 weeks" : "month"}
                  </Button>
                )}

                <Button variant="outline" className="flex-1 py-6 text-lg" size="lg" onClick={handleAddToCart}>
                  <Plus className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>

              {frequency !== "one_time" && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Cancel anytime • No long-term commitment • {getFrequencyDiscount()}% savings
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RoomConfigurator
