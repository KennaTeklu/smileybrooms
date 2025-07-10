"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShoppingCart, Info, Plus } from "lucide-react"
import { roomConfig } from "@/lib/room-config"
import { cn } from "@/lib/utils"
import { Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { roomConfigs } from "@/lib/room-config"
import { ServiceDetailsModal } from "@/components/service-details-modal"
import { roomDisplayNames, getRoomTiers } from "@/lib/room-tiers"

// Define the types for the calculator props
interface PriceCalculatorProps {
  onCalculationComplete?: (data: {
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
    serviceType: "standard" | "detailing"
    cleanlinessLevel: number
    priceMultiplier: number
    isServiceAvailable: boolean
    addressId: string
    paymentFrequency: "per_service" | "monthly" | "yearly"
    isRecurring: boolean
    recurringInterval: "week" | "month" | "year"
  }) => void
  onAddToCart?: () => void
  initialSelectedRooms?: Record<string, number> // New prop for initial rooms
  initialServiceType?: "standard" | "detailing" // New prop for initial service type
}

interface FullHousePackage {
  id: string
  name: string
  description: string
  basePrice: number // This is the advertised package price
  includedRooms: string[]
  tier: "essential" | "premium" | "luxury"
}

const fullHousePackages: FullHousePackage[] = [
  {
    id: "essential-full-house",
    name: "Essential Full House Clean",
    description: "Basic cleaning for your entire home - perfect for maintenance cleaning",
    basePrice: 299,
    includedRooms: ["bedroom", "bathroom", "kitchen", "living_room", "dining_room"],
    tier: "essential",
  },
  {
    id: "premium-full-house",
    name: "Premium Full House Clean",
    description: "Thorough cleaning with attention to detail for every room",
    basePrice: 599,
    includedRooms: ["bedroom", "bathroom", "kitchen", "living_room", "dining_room", "home_office", "laundry_room"],
    tier: "premium",
  },
  {
    id: "luxury-full-house",
    name: "Luxury Full House Clean",
    description: "Comprehensive deep cleaning with premium treatments throughout",
    basePrice: 1199,
    includedRooms: [
      "bedroom",
      "bathroom",
      "kitchen",
      "living_room",
      "dining_room",
      "home_office",
      "laundry_room",
      "entryway",
      "hallway",
      "stairs",
    ],
    tier: "luxury",
  },
]

// Define the room types and their base prices
const roomTypes = roomConfig.roomTypes

// Define the frequency options and their discounts
const frequencyOptions = [
  { id: "one_time", label: "One-Time", discount: 0, isRecurring: false, recurringInterval: null },
  { id: "weekly", label: "Weekly", discount: 0.15, isRecurring: true, recurringInterval: "week" },
  { id: "biweekly", label: "Biweekly", discount: 0.1, isRecurring: true, recurringInterval: "week" },
  { id: "monthly", label: "Monthly", discount: 0.05, isRecurring: true, recurringInterval: "month" },
  { id: "semi_annual", label: "Semi-Annual", discount: 0.02, isRecurring: true, recurringInterval: "month" },
  { id: "annually", label: "Annual", discount: 0.01, isRecurring: true, recurringInterval: "year" },
  { id: "vip_daily", label: "VIP Daily", discount: 0.25, isRecurring: true, recurringInterval: "week" },
]

// Define the payment frequency options
const paymentFrequencyOptions = [
  { id: "per_service", label: "Pay Per Service" },
  { id: "monthly", label: "Monthly Subscription" },
  { id: "yearly", label: "Annual Subscription (Save 10%)" },
]

// Define the cleanliness level multipliers
const cleanlinessMultipliers = [
  { level: 1, multiplier: 0.8, label: "Mostly Clean" },
  { level: 2, multiplier: 1.0, label: "Average" },
  { level: 3, multiplier: 1.2, label: "Somewhat Dirty" },
  { level: 4, multiplier: 1.5, label: "Very Dirty" },
  { level: 5, multiplier: 2.0, label: "Extremely Dirty" },
]

interface RoomConfiguratorProps {
  selectedRooms: Record<string, number>
  setSelectedRooms: (rooms: Record<string, number>) => void
  serviceType: "standard" | "detailing"
}

const RoomConfigurator: React.FC<RoomConfiguratorProps> = ({ selectedRooms, setSelectedRooms, serviceType }) => {
  const incrementRoom = (roomId: string) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || 0) + 1,
    }))
  }

  const decrementRoom = (roomId: string) => {
    if (selectedRooms[roomId] > 0) {
      setSelectedRooms((prev) => ({
        ...prev,
        [roomId]: prev[roomId] - 1,
      }))
    }
  }

  return (
    <>
      <div className="border-b pb-2 mb-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">CORE ROOMS</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {roomTypes
          .filter((room) => ["bedroom", "bathroom", "kitchen", "living_room", "dining_room"].includes(room.id))
          .map((room) => (
            <div
              key={room.id}
              className={cn(
                "border rounded-lg p-3 transition-all",
                selectedRooms[room.id] > 0
                  ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-800",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "p-2 rounded-full mr-2",
                      selectedRooms[room.id] > 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800",
                    )}
                  >
                    {room.icon}
                  </div>
                  <p className="font-medium">{room.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decrementRoom(room.id)}
                    disabled={selectedRooms[room.id] === 0}
                    className="h-7 w-7"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center">{selectedRooms[room.id] || 0}</span>
                  <Button variant="outline" size="icon" onClick={() => incrementRoom(room.id)} className="h-7 w-7">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ${serviceType === "standard" ? room.basePrice : room.basePrice * 1.8} per room
              </p>
            </div>
          ))}
      </div>

      <div className="border-b pb-2 mb-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ADDITIONAL SPACES</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {roomTypes
          .filter((room) => !["bedroom", "bathroom", "kitchen", "living_room", "dining_room"].includes(room.id))
          .map((room) => (
            <div
              key={room.id}
              className={cn(
                "border rounded-lg p-3 transition-all",
                selectedRooms[room.id] > 0
                  ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-800",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "p-2 rounded-full mr-2",
                      selectedRooms[room.id] > 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800",
                    )}
                  >
                    {room.icon}
                  </div>
                  <p className="font-medium">{room.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decrementRoom(room.id)}
                    disabled={selectedRooms[room.id] === 0}
                    className="h-7 w-7"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center">{selectedRooms[room.id] || 0}</span>
                  <Button variant="outline" size="icon" onClick={() => incrementRoom(room.id)} className="h-7 w-7">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ${serviceType === "standard" ? room.basePrice : room.basePrice * 1.8} per room
              </p>
            </div>
          ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-transparent">
          <Plus className="h-4 w-4" /> Request Custom Space
        </Button>
      </div>
    </>
  )
}

export function PriceCalculator({ initialSelectedRooms = {}, initialServiceType = "standard" }: PriceCalculatorProps) {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(initialSelectedRooms)
  const [serviceType, setServiceType] = useState<"standard" | "detailing">(initialServiceType)
  const [frequency, setFrequency] = useState("one_time")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(5) // 1-10 scale
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addToCart } = useCart()

  // Update state when initial props change (e.g., from tier selection)
  useEffect(() => {
    setSelectedRooms(initialSelectedRooms)
    setServiceType(initialServiceType)
  }, [initialSelectedRooms, initialServiceType])

  const handleRoomCountChange = useCallback((roomType: string, change: number) => {
    setSelectedRooms((prev) => {
      const newCount = (prev[roomType] || 0) + change
      if (newCount < 0) return prev // Prevent negative counts
      return { ...prev, [roomType]: newCount }
    })
  }, [])

  const calculateTotalPrice = useMemo(() => {
    let total = 0
    Object.entries(selectedRooms).forEach(([roomType, count]) => {
      if (count > 0) {
        const roomConfig = roomConfigs.find((config) => config.id === roomType)
        if (roomConfig) {
          // Find the price for the selected service type
          const tiers = getRoomTiers(roomType)
          let tierPrice = 0
          if (serviceType === "standard") {
            tierPrice = tiers.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 0
          } else {
            // For 'detailing', use the 'PREMIUM CLEAN' price as it's the highest tier
            tierPrice = tiers.find((t) => t.name === "PREMIUM CLEAN")?.price || 0
          }
          total += tierPrice * count
        }
      }
    })

    // Apply frequency discount/premium (example logic)
    switch (frequency) {
      case "weekly":
        total *= 0.8 // 20% discount
        break
      case "bi_weekly":
        total *= 0.9 // 10% discount
        break
      case "monthly":
        total *= 0.95 // 5% discount
        break
      default:
        // one_time, no discount
        break
    }

    // Apply cleanliness level modifier (example logic)
    if (cleanlinessLevel < 4) {
      total *= 1.5 // 50% premium for very dirty
    } else if (cleanlinessLevel < 7) {
      total *= 1.2 // 20% premium for moderately dirty
    }

    return total
  }, [selectedRooms, serviceType, frequency, cleanlinessLevel])

  const handleAddToCart = () => {
    const serviceName = serviceType === "standard" ? "Standard Cleaning Service" : "Premium Detailing Service"
    const serviceDescription = `Frequency: ${frequency.replace("_", " ")}. Rooms: ${Object.entries(selectedRooms)
      .filter(([, count]) => count > 0)
      .map(([roomType, count]) => `${count} ${roomDisplayNames[roomType]}`)
      .join(", ")}`

    addToCart(
      {
        id: `${serviceType}-${frequency}-${Object.keys(selectedRooms).join("-")}`,
        name: serviceName,
        price: calculateTotalPrice,
        quantity: 1,
        description: serviceDescription,
        image: "/placeholder.svg?height=100&width=100&text=Cleaning Service",
      },
      "Price Calculator",
    )
    setIsModalOpen(false) // Close modal after adding to cart
  }

  const currentService = useMemo(() => {
    const serviceName = serviceType === "standard" ? "Standard Cleaning Service" : "Premium Detailing Service"
    return {
      name: serviceName,
      price: calculateTotalPrice,
      type: serviceType,
    }
  }, [serviceType, calculateTotalPrice])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Build Your Custom Plan</CardTitle>
        <CardDescription>Select your rooms, service type, and frequency to get an instant quote.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Room Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Select Rooms</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {roomConfigs.map((room) => (
              <div key={room.id} className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor={`room-${room.id}`} className="flex items-center gap-2">
                  {room.icon && <span className="text-xl">{room.icon}</span>}
                  {room.name}
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 bg-transparent"
                    onClick={() => handleRoomCountChange(room.id, -1)}
                    disabled={(selectedRooms[room.id] || 0) === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium w-6 text-center">{selectedRooms[room.id] || 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 bg-transparent"
                    onClick={() => handleRoomCountChange(room.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Service Type */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Service Type</h3>
          <RadioGroup
            value={serviceType}
            onValueChange={(value: "standard" | "detailing") => setServiceType(value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Label
              htmlFor="standard"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem id="standard" value="standard" className="sr-only" />
              <div className="flex flex-col items-center space-y-1">
                <span className="text-base font-medium">Standard Cleaning</span>
                <span className="text-sm text-gray-500 text-center">
                  Ideal for regular maintenance and light cleaning.
                </span>
              </div>
            </Label>
            <Label
              htmlFor="detailing"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem id="detailing" value="detailing" className="sr-only" />
              <div className="flex flex-col items-center space-y-1">
                <span className="text-base font-medium">Premium Detailing</span>
                <span className="text-sm text-gray-500 text-center">
                  Comprehensive deep clean, perfect for initial or intensive cleaning.
                </span>
              </div>
            </Label>
          </RadioGroup>
        </div>

        <Separator />

        {/* Cleaning Frequency */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Cleaning Frequency</h3>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one_time">One-time Clean</SelectItem>
              <SelectItem value="weekly">Weekly (20% off)</SelectItem>
              <SelectItem value="bi_weekly">Bi-Weekly (10% off)</SelectItem>
              <SelectItem value="monthly">Monthly (5% off)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Cleanliness Level */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            Current Cleanliness Level
            <Info className="h-4 w-4 ml-2 text-gray-400" />
          </h3>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[cleanlinessLevel]}
            onValueChange={(val) => setCleanlinessLevel(val[0])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Very Dirty (1)</span>
            <span>Moderately Dirty (5)</span>
            <span>Lightly Soiled (10)</span>
          </div>
        </div>

        <Separator />

        {/* Total Price & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <div className="text-2xl font-bold">Total: {formatCurrency(calculateTotalPrice)}</div>
          <Button className="w-full sm:w-auto gap-2" onClick={() => setIsModalOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </CardContent>

      <ServiceDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        serviceType={serviceType}
        frequency={frequency}
        cleanlinessLevel={cleanlinessLevel}
        totalPrice={calculateTotalPrice}
        rooms={selectedRooms}
        addToCart={handleAddToCart}
        service={currentService}
      />
    </Card>
  )
}
