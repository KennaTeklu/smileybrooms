"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShoppingCart, Info, Plus, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Minus } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { roomConfigs } from "@/lib/room-config"
import { ServiceDetailsModal } from "@/components/service-details-modal"
import { roomDisplayNames, getRoomTiers, roomIcons } from "@/lib/room-tiers" // Added roomIcons
import { useCart } from "@/lib/cart-context"
import { Input } from "@/components/ui/input" // Import Input component

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
const roomTypes = roomConfigs.map((cfg) => ({
  id: cfg.id,
  name: cfg.name,
  basePrice: cfg.basePrice,
  icon: roomIcons[cfg.id] ?? "➕",
}))

// Define the frequency options and their discounts
const frequencyOptions = [
  { id: "one_time", label: "One-Time", discount: 0, isRecurring: false, recurringInterval: null },
  { id: "weekly", label: "Weekly", discount: 0.2, isRecurring: true, recurringInterval: "week" }, // Updated discount to 20%
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

// Define the cleanliness level multipliers (reverted to 5 levels)
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
  isDisabled: boolean // New prop to disable controls
}

const RoomConfigurator: React.FC<RoomConfiguratorProps> = ({
  selectedRooms,
  setSelectedRooms,
  serviceType,
  isDisabled,
}) => {
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
    <fieldset disabled={isDisabled} className={cn(isDisabled && "opacity-50 cursor-not-allowed")}>
      <div className="border-b pb-2 mb-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">CORE ROOMS</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {roomTypes
          .filter((room) => ["bedroom", "bathroom", "kitchen", "livingRoom", "diningRoom"].includes(room.id))
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
                    disabled={selectedRooms[room.id] === 0 || isDisabled}
                    className="h-7 w-7"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center">{selectedRooms[room.id] || 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => incrementRoom(room.id)}
                    disabled={isDisabled}
                    className="h-7 w-7"
                  >
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
          .filter((room) => !["bedroom", "bathroom", "kitchen", "livingRoom", "diningRoom"].includes(room.id))
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
                    disabled={selectedRooms[room.id] === 0 || isDisabled}
                    className="h-7 w-7"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-6 text-center">{selectedRooms[room.id] || 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => incrementRoom(room.id)}
                    disabled={isDisabled}
                    className="h-7 w-7"
                  >
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
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-transparent"
          disabled={isDisabled}
        >
          <Plus className="h-4 w-4" /> Request Custom Space
        </Button>
      </div>
    </fieldset>
  )
}

export function PriceCalculator({ initialSelectedRooms = {}, initialServiceType = "standard" }: PriceCalculatorProps) {
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(initialSelectedRooms)
  const [serviceType, setServiceType] = useState<"standard" | "detailing">(initialServiceType)
  const [frequency, setFrequency] = useState("one_time")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(2) // Default to Average (level 2)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const { addToCart } = useCart()

  // Coupon states
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Update state when initial props change (e.g., from tier selection)
  useEffect(() => {
    setSelectedRooms(initialSelectedRooms)
    setServiceType(initialServiceType)
    setSelectedPackage(null) // Reset package selection when initial rooms change
    setAppliedCoupon(null) // Reset coupon when initial props change
    setCouponCode("")
    setCouponError(null)
  }, [initialSelectedRooms, initialServiceType])

  const handleRoomCountChange = useCallback((roomType: string, change: number) => {
    setSelectedRooms((prev) => {
      const newCount = (prev[roomType] || 0) + change
      if (newCount < 0) return prev // Prevent negative counts
      setSelectedPackage(null) // Deselect package if individual rooms are adjusted
      return { ...prev, [roomType]: newCount }
    })
  }, [])

  const handleSelectPackage = useCallback((packageId: string) => {
    setSelectedPackage(packageId)
    setSelectedRooms({}) // Clear individual room selections when a package is chosen
    setAppliedCoupon(null) // Clear coupon when package is selected
    setCouponCode("")
    setCouponError(null)
    const pkg = fullHousePackages.find((p) => p.id === packageId)
    if (pkg) {
      // Set service type based on package tier
      if (pkg.tier === "essential") {
        setServiceType("standard")
      } else {
        setServiceType("detailing") // Premium and Luxury packages are considered detailing
      }
    }
  }, [])

  const handleClearPackageSelection = useCallback(() => {
    setSelectedPackage(null)
    setSelectedRooms({}) // Clear any lingering room counts
    setServiceType("standard") // Reset to default service type
    setAppliedCoupon(null) // Clear coupon
    setCouponCode("")
    setCouponError(null)
  }, [])

  const handleApplyCoupon = useCallback(() => {
    setCouponError(null)
    // Simulate coupon validation
    if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 0.1 }) // 10% off
    } else if (couponCode.toUpperCase() === "FREECLEAN") {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 1.0 }) // 100% off
    } else {
      setCouponError("Invalid coupon code.")
      setAppliedCoupon(null)
    }
  }, [couponCode])

  const calculateTotalPrice = useMemo(() => {
    let total = 0

    if (selectedPackage) {
      const pkg = fullHousePackages.find((p) => p.id === selectedPackage)
      if (pkg) {
        total = pkg.basePrice // Use the already discounted basePrice from the package
      }
    } else {
      Object.entries(selectedRooms).forEach(([roomType, count]) => {
        if (count > 0) {
          const roomConfigItem = roomConfigs.find((config) => config.id === roomType)
          if (roomConfigItem) {
            const tiers = getRoomTiers(roomType)
            let tierPrice = 0
            if (serviceType === "standard") {
              tierPrice = tiers.find((t) => t.name === "ESSENTIAL CLEAN")?.price || 0
            } else {
              tierPrice = tiers.find((t) => t.name === "PREMIUM CLEAN")?.price || 0
            }
            total += tierPrice * count
          }
        }
      })
    }

    // Apply frequency discount/premium (applies to both individual rooms and packages)
    const selectedFrequency = frequencyOptions.find((opt) => opt.id === frequency)
    if (selectedFrequency) {
      total *= 1 - selectedFrequency.discount
    }

    // Apply cleanliness level modifier (applies to both individual rooms and packages)
    const cleanlinessModifier = cleanlinessMultipliers.find((c) => c.level === cleanlinessLevel)?.multiplier || 1.0
    total *= cleanlinessModifier

    // Apply coupon discount
    if (appliedCoupon) {
      total *= 1 - appliedCoupon.discount
    }

    return Math.max(0, total) // Ensure total doesn't go below zero
  }, [selectedRooms, serviceType, frequency, cleanlinessLevel, selectedPackage, appliedCoupon])

  const handleAddToCart = () => {
    let serviceName: string
    let serviceDescription: string
    let roomsInCart: Record<string, number> = {}

    if (selectedPackage) {
      const pkg = fullHousePackages.find((p) => p.id === selectedPackage)
      if (pkg) {
        serviceName = pkg.name
        serviceDescription = pkg.description
        // Populate roomsInCart based on includedRooms for the package
        pkg.includedRooms.forEach((room) => {
          roomsInCart[room] = (roomsInCart[room] || 0) + 1
        })
      } else {
        serviceName = "Custom Cleaning Service"
        serviceDescription = "No package selected."
      }
    } else {
      serviceName = serviceType === "standard" ? "Standard Cleaning Service" : "Premium Detailing Service"
      serviceDescription = `Frequency: ${frequency.replace("_", " ")}. Rooms: ${Object.entries(selectedRooms)
        .filter(([, count]) => count > 0)
        .map(([roomType, count]) => `${count} ${roomDisplayNames[roomType]}`)
        .join(", ")}`
      roomsInCart = selectedRooms
    }

    addToCart(
      {
        id: selectedPackage || `${serviceType}-${frequency}-${Object.keys(selectedRooms).join("-")}`,
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
    const serviceName = selectedPackage
      ? fullHousePackages.find((p) => p.id === selectedPackage)?.name || "Full House Package"
      : serviceType === "standard"
        ? "Standard Cleaning Service"
        : "Premium Detailing Service"
    return {
      name: serviceName,
      price: calculateTotalPrice,
      type: serviceType,
    }
  }, [serviceType, calculateTotalPrice, selectedPackage])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Build Your Custom Plan</CardTitle>
        <CardDescription>Select your rooms, service type, and frequency to get an instant quote.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full House Packages */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Full House Packages</h3>
          <RadioGroup
            value={selectedPackage || ""}
            onValueChange={handleSelectPackage}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {fullHousePackages.map((pkg) => (
              <Label
                key={pkg.id}
                htmlFor={pkg.id}
                className={cn(
                  "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                  selectedPackage === pkg.id ? "border-primary" : "",
                )}
              >
                <RadioGroupItem id={pkg.id} value={pkg.id} className="sr-only" />
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-base font-medium">{pkg.name}</span>
                  <span className="text-sm text-gray-500 text-center">{pkg.description}</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm text-gray-400 line-through">{formatCurrency(pkg.originalPrice)}</span>
                    <span className="text-lg font-bold">{formatCurrency(pkg.basePrice)}</span>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Save {formatCurrency(pkg.originalPrice - pkg.basePrice)}!
                  </span>
                </div>
              </Label>
            ))}
          </RadioGroup>
          {selectedPackage && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={handleClearPackageSelection} className="gap-2 bg-transparent">
                <XCircle className="h-4 w-4" /> Clear Package Selection
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Room Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Custom Room Selection</h3>
          <RoomConfigurator
            selectedRooms={selectedRooms}
            setSelectedRooms={handleRoomCountChange}
            serviceType={serviceType}
            isDisabled={selectedPackage !== null} // Pass disabled state to RoomConfigurator
          />
        </div>

        <Separator />

        {/* Service Type */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Service Type</h3>
          <RadioGroup
            value={serviceType}
            onValueChange={(value: "standard" | "detailing") => setServiceType(value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            disabled={selectedPackage !== null} // Disable if a package is selected
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
          {serviceType === "standard" && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Consider **Premium Detailing** for a more comprehensive and intensive clean!
            </p>
          )}
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
              <SelectItem value="biweekly">Bi-Weekly (10% off)</SelectItem>
              <SelectItem value="monthly">Monthly (5% off)</SelectItem>
              <SelectItem value="semi_annual">Semi-Annual (2% off)</SelectItem>
              <SelectItem value="annually">Annual (1% off)</SelectItem>
              <SelectItem value="vip_daily">VIP Daily (25% off)</SelectItem>
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
            max={5} // Max changed to 5 for 5 levels
            step={1}
            value={[cleanlinessLevel]}
            onValueChange={(val) => setCleanlinessLevel(val[0])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Mostly Clean (1)</span>
            <span>Extremely Dirty (5)</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            {cleanlinessMultipliers.find((c) => c.level === cleanlinessLevel)?.label} (Multiplier:{" "}
            {cleanlinessMultipliers.find((c) => c.level === cleanlinessLevel)?.multiplier.toFixed(1)})
          </p>
        </div>

        <Separator />

        {/* Coupon Code Input */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Have a Coupon Code?</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApplyCoupon} disabled={!couponCode.trim()}>
              Apply
            </Button>
          </div>
          {appliedCoupon && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              Coupon "{appliedCoupon.code}" applied! You saved{" "}
              {formatCurrency((calculateTotalPrice / (1 - appliedCoupon.discount)) * appliedCoupon.discount)}.
            </p>
          )}
          {couponError && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{couponError}</p>}
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
        rooms={
          selectedPackage
            ? fullHousePackages
                .find((p) => p.id === selectedPackage)
                ?.includedRooms.reduce((acc, room) => ({ ...acc, [room]: (acc[room] || 0) + 1 }), {}) || {}
            : selectedRooms
        }
        addToCart={handleAddToCart}
        service={currentService}
      />
    </Card>
  )
}
