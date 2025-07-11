"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { roomConfigs } from "@/lib/room-config"
import { roomIcons } from "@/lib/room-tiers"

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
  originalPrice: number // Added original price for display
  basePrice: number // This is the advertised package price (already discounted)
  includedRooms: string[]
  tier: "essential" | "premium" | "luxury"
}

const fullHousePackages: FullHousePackage[] = [
  {
    id: "essential-full-house",
    name: "Essential Full House Clean",
    description: "Basic cleaning for your entire home - perfect for maintenance cleaning",
    originalPrice: 1620,
    basePrice: 1458, // Discounted price from guide
    includedRooms: [
      "bedroom",
      "bedroom",
      "bedroom",
      "bathroom",
      "bathroom",
      "kitchen",
      "livingRoom",
      "diningRoom",
      "entryway",
    ],
    tier: "essential",
  },
  {
    id: "premium-full-house",
    name: "Premium Full House Clean",
    description: "Thorough cleaning with attention to detail for every room",
    originalPrice: 2880,
    basePrice: 2592, // Discounted price from guide
    includedRooms: [
      "bedroom",
      "bedroom",
      "bedroom",
      "bathroom",
      "bathroom",
      "kitchen",
      "livingRoom",
      "diningRoom",
      "homeOffice",
      "laundryRoom",
    ],
    tier: "premium",
  },
  {
    id: "luxury-full-house",
    name: "Luxury Full House Clean",
    description: "Comprehensive deep cleaning with premium treatments throughout",
    originalPrice: 4680,
    basePrice: 4212, // Discounted price from guide
    includedRooms: [
      "bedroom",
      "bedroom",
      "bedroom",
      "bathroom",
      "bathroom",
      "kitchen",
      "livingRoom",
      "diningRoom",
      "homeOffice",
      "laundryRoom",
      "entryway",
      "hallway",
      "stairs",
    ],
    tier: "luxury",
  },
]

// Define the room types and their base prices
// OLD — causes undefined.filter error
// const roomTypes = roomConfig.roomTypes

// NEW — derive room types from the existing roomConfigs array
const roomTypes = roomConfigs.map((cfg) => ({
  id: cfg.id,
  name: cfg.name,
  basePrice: cfg.basePrice,
  icon: roomIcons[cfg.id] ?? "➕",
}))

// Define the frequency options and their discounts
const frequencyOptions = [
  { id: "one_time", label: "One-Time", discount: 0, isRecurring: false, recurringInterval: null },
  { id: "weekly", label: "Weekly", discount: 0.2, isRecurring: true, recurringInterval: "week" }, // Updated discount
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

// PriceCalculator component implementation goes here
const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  onCalculationComplete,
  onAddToCart,
  initialSelectedRooms,
  initialServiceType,
}) => {
  // State management for selected rooms, frequency, service type, cleanliness level, and payment frequency
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(initialSelectedRooms || {})
  const [frequency, setFrequency] = useState<string>(initialServiceType || "one_time")
  const [serviceType, setServiceType] = useState<"standard" | "detailing">("standard")
  const [cleanlinessLevel, setCleanlinessLevel] = useState<number>(2)
  const [paymentFrequency, setPaymentFrequency] = useState<"per_service" | "monthly" | "yearly">("per_service")

  // Calculate total price based on selected rooms, frequency, service type, cleanliness level, and payment frequency
  const totalPrice = useMemo(() => {
    let baseTotal = Object.entries(selectedRooms).reduce((total, [roomId, count]) => {
      const roomType = roomTypes.find((rt) => rt.id === roomId)
      return total + (roomType ? roomType.basePrice * count : 0)
    }, 0)

    const frequencyOption = frequencyOptions.find((fo) => fo.id === frequency)
    if (frequencyOption) {
      baseTotal *= 1 - frequencyOption.discount
    }

    const cleanlinessMultiplier = cleanlinessMultipliers.find((cm) => cm.level === cleanlinessLevel)
    if (cleanlinessMultiplier) {
      baseTotal *= cleanlinessMultiplier.multiplier
    }

    const paymentFrequencyOption = paymentFrequencyOptions.find((pfo) => pfo.id === paymentFrequency)
    if (paymentFrequencyOption && paymentFrequencyOption.id === "yearly") {
      baseTotal *= 0.9 // Apply 10% discount for annual subscription
    }

    return baseTotal
  }, [selectedRooms, frequency, cleanlinessLevel, paymentFrequency])

  // Handle room selection changes
  const handleRoomChange = useCallback((roomId: string, count: number) => {
    setSelectedRooms((prevRooms) => ({
      ...prevRooms,
      [roomId]: count,
    }))
  }, [])

  // Handle frequency selection changes
  const handleFrequencyChange = useCallback((value: string) => {
    setFrequency(value)
  }, [])

  // Handle service type selection changes
  const handleServiceTypeChange = useCallback((value: "standard" | "detailing") => {
    setServiceType(value)
  }, [])

  // Handle cleanliness level changes
  const handleCleanlinessLevelChange = useCallback((value: number) => {
    setCleanlinessLevel(value)
  }, [])

  // Handle payment frequency changes
  const handlePaymentFrequencyChange = useCallback((value: "per_service" | "monthly" | "yearly") => {
    setPaymentFrequency(value)
  }, [])

  // Handle calculation completion
  const handleCalculationComplete = useCallback(() => {
    if (onCalculationComplete) {
      const frequencyOption = frequencyOptions.find((fo) => fo.id === frequency)
      const cleanlinessMultiplier = cleanlinessMultipliers.find((cm) => cm.level === cleanlinessLevel)
      const paymentFrequencyOption = paymentFrequencyOptions.find((pfo) => pfo.id === paymentFrequency)

      onCalculationComplete({
        rooms: selectedRooms,
        frequency: frequencyOption?.label || "One-Time",
        totalPrice,
        serviceType,
        cleanlinessLevel,
        priceMultiplier: cleanlinessMultiplier?.multiplier || 1,
        isServiceAvailable: true,
        addressId: "",
        paymentFrequency,
        isRecurring: frequencyOption?.isRecurring || false,
        recurringInterval: frequencyOption?.recurringInterval || null,
      })
    }
  }, [selectedRooms, frequency, totalPrice, serviceType, cleanlinessLevel, paymentFrequency, onCalculationComplete])

  // Handle adding to cart
  const handleAddToCart = useCallback(() => {
    if (onAddToCart) {
      onAddToCart()
    }
  }, [onAddToCart])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Calculator</CardTitle>
        <CardDescription>Calculate your cleaning service cost</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Room selection section */}
        <div className="mb-4">
          <Label>Rooms</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {roomTypes.map((roomType) => (
              <div key={roomType.id} className="flex items-center">
                <span className="mr-2">{roomType.icon}</span>
                <Label>{roomType.name}</Label>
                <Slider
                  min={0}
                  max={5}
                  value={[selectedRooms[roomType.id] || 0]}
                  onChange={(value) => handleRoomChange(roomType.id, value[0])}
                  className="ml-4 flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Frequency selection section */}
        <div className="mb-4">
          <Label>Frequency</Label>
          <RadioGroup value={frequency} onValueChange={handleFrequencyChange} className="mt-2">
            {frequencyOptions.map((frequencyOption) => (
              <div key={frequencyOption.id} className="flex items-center space-x-2">
                <RadioGroupItem value={frequencyOption.id} id={frequencyOption.id} />
                <Label htmlFor={frequencyOption.id}>{frequencyOption.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Service type selection section */}
        <div className="mb-4">
          <Label>Service Type</Label>
          <RadioGroup value={serviceType} onValueChange={handleServiceTypeChange} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard">Standard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailing" id="detailing" />
              <Label htmlFor="detailing">Detailing</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Cleanliness level selection section */}
        <div className="mb-4">
          <Label>Cleanliness Level</Label>
          <Select
            value={cleanlinessLevel.toString()}
            onValueChange={(value) => handleCleanlinessLevelChange(Number.parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select cleanliness level" />
            </SelectTrigger>
            <SelectContent>
              {cleanlinessMultipliers.map((cleanlinessMultiplier) => (
                <SelectItem key={cleanlinessMultiplier.level} value={cleanlinessMultiplier.level.toString()}>
                  {cleanlinessMultiplier.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment frequency selection section */}
        <div className="mb-4">
          <Label>Payment Frequency</Label>
          <Select value={paymentFrequency} onValueChange={handlePaymentFrequencyChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment frequency" />
            </SelectTrigger>
            <SelectContent>
              {paymentFrequencyOptions.map((paymentFrequencyOption) => (
                <SelectItem key={paymentFrequencyOption.id} value={paymentFrequencyOption.id}>
                  {paymentFrequencyOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Total price display */}
        <div className="mb-4">
          <Label>Total Price</Label>
          <div className="mt-2 text-2xl font-bold">{formatCurrency(totalPrice)}</div>
        </div>

        {/* Buttons for calculation and adding to cart */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleCalculationComplete}>
            Calculate
          </Button>
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default PriceCalculator
export { PriceCalculator }
