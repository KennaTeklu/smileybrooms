"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Home, Calendar, Sparkles, ShoppingCart } from "lucide-react"
import CleanlinessSlider from "./cleanliness-slider"
import { roomConfig } from "@/lib/room-config"
import { cn } from "@/lib/utils"
import { Minus, PlusIcon } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "@/components/ui/use-toast"

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
                    <PlusIcon className="h-3 w-3" />
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
                    <PlusIcon className="h-3 w-3" />
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
          <PlusIcon className="h-4 w-4" /> Request Custom Space
        </Button>
      </div>
    </>
  )
}

export default function PriceCalculator({
  onCalculationComplete,
  onAddToCart,
  initialSelectedRooms = {},
  initialServiceType = "standard",
}: PriceCalculatorProps) {
  // State for selected rooms
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(() => {
    if (Object.keys(initialSelectedRooms).length > 0) {
      return initialSelectedRooms
    }
    const initialRooms: Record<string, number> = {}
    roomTypes.forEach((room) => {
      initialRooms[room.id] = 0
    })
    return initialRooms
  })

  // State for other selections
  const [serviceType, setServiceType] = useState<"standard" | "detailing">(initialServiceType)
  const [frequency, setFrequency] = useState("one_time")
  const [paymentFrequency, setPaymentFrequency] = useState("per_service")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(2) // Default to average
  const [totalPrice, setTotalPrice] = useState(0)
  const [isServiceAvailable, setIsServiceAvailable] = useState(true)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isAddingToCart, setIsAddingToCart] = useState(false) // New loading state for add to cart
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [showRoomDetails, setShowRoomDetails] = useState<Record<string, boolean>>({})

  const { addItem } = useCart() // Use the cart context

  // Media query for responsive design
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Effect to update state when initial props change (e.g., from tier selection)
  useEffect(() => {
    if (Object.keys(initialSelectedRooms).length > 0) {
      setSelectedRooms(initialSelectedRooms)
      setSelectedPackage(null) // Clear package selection if individual rooms are set
    }
    setServiceType(initialServiceType)
  }, [initialSelectedRooms, initialServiceType])

  // Calculate the total price whenever selections change
  useEffect(() => {
    calculatePrice()
  }, [selectedRooms, serviceType, frequency, cleanlinessLevel, paymentFrequency, selectedPackage])

  // Function to increment room count
  const incrementRoom = (roomId: string) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || 0) + 1,
    }))
  }

  // Function to decrement room count
  const decrementRoom = (roomId: string) => {
    if (selectedRooms[roomId] > 0) {
      setSelectedRooms((prev) => ({
        ...prev,
        [roomId]: prev[roomId] - 1,
      }))
    }
  }

  // Function to calculate the total price
  const calculatePrice = () => {
    let basePrice = 0

    if (selectedPackage) {
      const pkg = fullHousePackages.find((p) => p.id === selectedPackage)
      if (pkg) {
        // Calculate base price by summing the prices of included rooms
        pkg.includedRooms.forEach((roomId) => {
          const room = roomTypes.find((r) => r.id === roomId)
          if (room) {
            basePrice += room.basePrice // Add base price for each included room
          }
        })
      }
    } else {
      // Existing logic for individual room selection
      Object.entries(selectedRooms).forEach(([roomId, count]) => {
        const room = roomTypes.find((r) => r.id === roomId)
        if (room) {
          basePrice += room.basePrice * count
        }
      })
    }

    // Apply service type multiplier
    const serviceMultiplier = serviceType === "standard" ? 1 : 1.5

    // Apply frequency discount
    const selectedFrequency = frequencyOptions.find((f) => f.id === frequency)
    const frequencyDiscount = selectedFrequency ? selectedFrequency.discount : 0

    // Apply cleanliness level multiplier
    const cleanlinessMultiplier = cleanlinessMultipliers.find((c) => c.level === cleanlinessLevel)?.multiplier || 1

    // Apply payment frequency discount
    let paymentDiscount = 0
    if (paymentFrequency === "yearly") {
      paymentDiscount = 0.1 // 10% discount for annual subscription
    }

    // Calculate total price
    let calculatedPrice =
      basePrice * serviceMultiplier * (1 - frequencyDiscount) * cleanlinessMultiplier * (1 - paymentDiscount)

    // Round to 2 decimal places
    calculatedPrice = Math.round(calculatedPrice * 100) / 100

    // Check if service is available (e.g., for extremely dirty conditions)
    const isAvailable = !(cleanlinessLevel === 5 && serviceType === "standard")

    setTotalPrice(calculatedPrice)
    setIsServiceAvailable(isAvailable)

    // Call the onCalculationComplete callback if provided
    if (onCalculationComplete) {
      const selectedFrequencyOption = frequencyOptions.find((f) => f.id === frequency)
      onCalculationComplete({
        rooms: selectedRooms,
        frequency,
        totalPrice: calculatedPrice,
        serviceType,
        cleanlinessLevel,
        priceMultiplier: cleanlinessMultiplier,
        isServiceAvailable: isAvailable,
        addressId: "custom", // This would be replaced with actual address ID in a real implementation
        paymentFrequency: paymentFrequency as "per_service" | "monthly" | "yearly",
        isRecurring: selectedFrequencyOption?.isRecurring || false,
        recurringInterval: selectedFrequencyOption?.recurringInterval as "week" | "month" | "year",
      })
    }
  }

  // Function to check if any rooms are selected or package is selected
  const hasSelectedRooms = () => {
    return selectedPackage !== null || Object.values(selectedRooms).some((count) => count > 0)
  }

  // Function to toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  // Check if a section is expanded
  const isSectionExpanded = (section: string) => {
    return expandedSections.includes(section)
  }

  // Function to toggle room details
  const toggleRoomDetails = (packageId: string) => {
    setShowRoomDetails((prev) => ({
      ...prev,
      [packageId]: !prev[packageId],
    }))
  }

  // Function to handle package selection
  const handlePackageSelect = (packageId: string) => {
    const selectedPackageItem = fullHousePackages.find((p) => p.id === packageId)
    if (selectedPackageItem) {
      setSelectedPackage(packageId)
      // Auto-select rooms based on package
      const newRooms: Record<string, number> = {}
      roomTypes.forEach((room) => {
        newRooms[room.id] = selectedPackageItem.includedRooms.includes(room.id) ? 1 : 0
      })
      setSelectedRooms(newRooms)
    }
  }

  const handleAddToCartClick = async () => {
    setIsAddingToCart(true)
    try {
      // Simulate an async operation
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Construct item details for the cart
      const selectedRoomNames = Object.entries(selectedRooms)
        .filter(([, count]) => count > 0)
        .map(([roomId, count]) => {
          const room = roomTypes.find((r) => r.id === roomId)
          return `${count} ${room?.name || roomId}`
        })
        .join(", ")

      const serviceDescription = `${serviceType === "standard" ? "Standard" : "Premium"} Cleaning`
      const frequencyLabel = frequencyOptions.find((opt) => opt.id === frequency)?.label || "One-Time"

      addItem({
        id: `calculated-service-${Date.now()}`, // Unique ID for this specific configuration
        name: `${selectedPackage ? fullHousePackages.find((p) => p.id === selectedPackage)?.name : serviceDescription} (${frequencyLabel})`,
        price: totalPrice, // Use the calculated total price
        priceId: "price_calculated_service", // Placeholder price ID
        quantity: 1, // This represents one service booking
        image: "/placeholder.svg?height=100&width=100",
        sourceSection: "Price Calculator",
        metadata: {
          rooms: selectedRooms,
          frequency,
          serviceType,
          cleanlinessLevel,
          paymentFrequency,
          selectedPackage, // Include selected package ID in metadata
        },
      })

      toast({
        title: "Service added to cart",
        description: "Your customized cleaning service has been added to your cart.",
        duration: 3000,
      })

      if (onAddToCart) {
        onAddToCart()
      }
    } catch (error) {
      console.error("Error adding calculated service to cart:", error)
      toast({
        title: "Failed to add to cart",
        description: "There was an error adding the service to your cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs
        defaultValue={initialServiceType}
        value={serviceType}
        onValueChange={(value) => setServiceType(value as "standard" | "detailing")}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="standard" className="text-sm md:text-base">
            Standard Cleaning
          </TabsTrigger>
          <TabsTrigger value="detailing" className="text-sm md:text-base">
            Premium Detailing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Standard Cleaning Service</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose from our full house packages or customize individual rooms
            </p>
          </div>

          {/* Full House Packages */}
          <Card className="border-2 border-green-100 dark:border-green-900">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Home className="h-5 w-5 mr-2 text-green-600" />
                <h3 className="text-lg font-medium">Full House Cleaning Packages</h3>
              </div>

              <div className="space-y-4">
                {fullHousePackages.map((pkg) => (
                  <div key={pkg.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          id={pkg.id}
                          name="fullHousePackage"
                          checked={selectedPackage === pkg.id}
                          onChange={() => handlePackageSelect(pkg.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor={pkg.id} className="cursor-pointer">
                            <h4 className="font-semibold text-lg">{pkg.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{pkg.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-green-600">${pkg.basePrice}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleRoomDetails(pkg.id)}
                                className="text-xs"
                              >
                                {showRoomDetails[pkg.id] ? "Hide Details" : "Show Details"}
                              </Button>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Room Details Dropdown */}
                    {showRoomDetails[pkg.id] && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-3">Included Rooms & Services:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {pkg.includedRooms.map((roomId) => {
                            const room = roomTypes.find((r) => r.id === roomId)
                            if (!room) return null

                            return (
                              <div
                                key={roomId}
                                className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedPackage === pkg.id}
                                  readOnly
                                  className="text-green-600"
                                />
                                <div className="flex items-center space-x-2">
                                  <div className="p-1 rounded bg-green-100 dark:bg-green-900/30">{room.icon}</div>
                                  <div>
                                    <span className="font-medium">{room.name}</span>
                                    <div className="text-xs text-gray-500">
                                      {pkg.tier === "essential" && "Essential Clean"}
                                      {pkg.tier === "premium" && "Premium Clean"}
                                      {pkg.tier === "luxury" && "Luxury Clean"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Package Benefits */}
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{pkg.name} Benefits:</h6>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            {pkg.tier === "essential" && (
                              <>
                                <li>• Surface cleaning and basic maintenance</li>
                                <li>• Floor vacuuming and light mopping</li>
                                <li>• Bathroom and kitchen essentials</li>
                                <li>• Trash removal and basic tidying</li>
                              </>
                            )}
                            {pkg.tier === "premium" && (
                              <>
                                <li>• Everything in Essential plus:</li>
                                <li>• Detailed cleaning of all surfaces</li>
                                <li>• Appliance exterior cleaning</li>
                                <li>• Baseboard and window sill attention</li>
                                <li>• Under-furniture cleaning</li>
                              </>
                            )}
                            {pkg.tier === "luxury" && (
                              <>
                                <li>• Everything in Premium plus:</li>
                                <li>• Deep cleaning and sanitization</li>
                                <li>• Interior appliance cleaning</li>
                                <li>• Detailed organization services</li>
                                <li>• Premium finishing touches</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedPackage(null)
                    setSelectedRooms((prev) => {
                      const newRooms: Record<string, number> = {}
                      roomTypes.forEach((room) => {
                        newRooms[room.id] = 0
                      })
                      return newRooms
                    })
                  }}
                >
                  Or Customize Individual Rooms Below
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Individual Room Selection - Only show if no package selected */}
          {!selectedPackage && (
            <Card className="border-2 border-blue-100 dark:border-blue-900">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Home className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-medium">Custom Room Selection</h3>
                </div>

                <RoomConfigurator
                  selectedRooms={selectedRooms}
                  setSelectedRooms={setSelectedRooms}
                  serviceType={serviceType}
                />
              </CardContent>
            </Card>
          )}

          {/* Show selected package summary */}
          {selectedPackage && (
            <Card className="border-2 border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-900/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                      {fullHousePackages.find((p) => p.id === selectedPackage)?.name} Selected
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {fullHousePackages.find((p) => p.id === selectedPackage)?.includedRooms.length} rooms included
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPackage(null)}
                    className="text-green-700 border-green-300"
                  >
                    Change Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rest of the existing collapsible sections remain the same */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {/* Frequency Selection - existing code */}
            <AccordionItem value="frequency" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-medium">Cleaning Frequency</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <RadioGroup
                  value={frequency}
                  onValueChange={setFrequency}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {frequencyOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={`frequency-${option.id}`} />
                      <Label htmlFor={`frequency-${option.id}`} className="flex items-center">
                        {option.label}
                        {option.discount > 0 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Save {option.discount * 100}%
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {frequency !== "one_time" && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Payment Frequency</h4>
                    <RadioGroup
                      value={paymentFrequency}
                      onValueChange={setPaymentFrequency}
                      className="grid grid-cols-1 gap-2"
                    >
                      {paymentFrequencyOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`payment-${option.id}`} />
                          <Label htmlFor={`payment-${option.id}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Cleanliness Level - existing code */}
            <AccordionItem value="cleanliness" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-medium">Cleanliness Level</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <CleanlinessSlider value={cleanlinessLevel} onChange={(value) => setCleanlinessLevel(value[0])} />
                  <div className="text-center">
                    <p className="font-medium">
                      {cleanlinessMultipliers.find((c) => c.level === cleanlinessLevel)?.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Price multiplier: {cleanlinessMultipliers.find((c) => c.level === cleanlinessLevel)?.multiplier}x
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="detailing" className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Premium Detailing Service</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose from our full house packages or customize individual rooms
            </p>
          </div>

          {/* Full House Packages */}
          <Card className="border-2 border-purple-100 dark:border-purple-900">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Home className="h-5 w-5 mr-2 text-purple-600" />
                <h3 className="text-lg font-medium">Full House Cleaning Packages</h3>
              </div>

              <div className="space-y-4">
                {fullHousePackages.map((pkg) => (
                  <div key={pkg.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          id={pkg.id}
                          name="fullHousePackage"
                          checked={selectedPackage === pkg.id}
                          onChange={() => handlePackageSelect(pkg.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor={pkg.id} className="cursor-pointer">
                            <h4 className="font-semibold text-lg">{pkg.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{pkg.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-purple-600">${pkg.basePrice}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleRoomDetails(pkg.id)}
                                className="text-xs"
                              >
                                {showRoomDetails[pkg.id] ? "Hide Details" : "Show Details"}
                              </Button>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Room Details Dropdown */}
                    {showRoomDetails[pkg.id] && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium mb-3">Included Rooms & Services:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {pkg.includedRooms.map((roomId) => {
                            const room = roomTypes.find((r) => r.id === roomId)
                            if (!room) return null

                            return (
                              <div
                                key={roomId}
                                className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedPackage === pkg.id}
                                  readOnly
                                  className="text-purple-600"
                                />
                                <div className="flex items-center space-x-2">
                                  <div className="p-1 rounded bg-purple-100 dark:bg-purple-900/30">{room.icon}</div>
                                  <div>
                                    <span className="font-medium">{room.name}</span>
                                    <div className="text-xs text-gray-500">
                                      {pkg.tier === "essential" && "Essential Clean"}
                                      {pkg.tier === "premium" && "Premium Clean"}
                                      {pkg.tier === "luxury" && "Luxury Clean"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Package Benefits */}
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <h6 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{pkg.name} Benefits:</h6>
                          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            {pkg.tier === "essential" && (
                              <>
                                <li>• Surface cleaning and basic maintenance</li>
                                <li>• Floor vacuuming and light mopping</li>
                                <li>• Bathroom and kitchen essentials</li>
                                <li>• Trash removal and basic tidying</li>
                              </>
                            )}
                            {pkg.tier === "premium" && (
                              <>
                                <li>• Everything in Essential plus:</li>
                                <li>• Detailed cleaning of all surfaces</li>
                                <li>• Appliance exterior cleaning</li>
                                <li>• Baseboard and window sill attention</li>
                                <li>• Under-furniture cleaning</li>
                              </>
                            )}
                            {pkg.tier === "luxury" && (
                              <>
                                <li>• Everything in Premium plus:</li>
                                <li>• Deep cleaning and sanitization</li>
                                <li>• Interior appliance cleaning</li>
                                <li>• Detailed organization services</li>
                                <li>• Premium finishing touches</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedPackage(null)
                    setSelectedRooms((prev) => {
                      const newRooms: Record<string, number> = {}
                      roomTypes.forEach((room) => {
                        newRooms[room.id] = 0
                      })
                      return newRooms
                    })
                  }}
                >
                  Or Customize Individual Rooms Below
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Individual Room Selection - Only show if no package selected */}
          {!selectedPackage && (
            <Card className="border-2 border-purple-100 dark:border-purple-900">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Home className="h-5 w-5 mr-2 text-purple-600" />
                  <h3 className="text-lg font-medium">Custom Room Selection</h3>
                </div>

                <RoomConfigurator
                  selectedRooms={selectedRooms}
                  setSelectedRooms={setSelectedRooms}
                  serviceType={serviceType}
                />
              </CardContent>
            </Card>
          )}

          {/* Show selected package summary */}
          {selectedPackage && (
            <Card className="border-2 border-purple-100 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-purple-800 dark:text-purple-200">
                      {fullHousePackages.find((p) => p.id === selectedPackage)?.name} Selected
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      {fullHousePackages.find((p) => p.id === selectedPackage)?.includedRooms.length} rooms included
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPackage(null)}
                    className="text-purple-700 border-purple-300"
                  >
                    Change Package
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rest of the existing collapsible sections remain the same */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {/* Frequency Selection */}
            <AccordionItem value="frequency" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-medium">Cleaning Frequency</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <RadioGroup
                  value={frequency}
                  onValueChange={setFrequency}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {frequencyOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={`frequency-${option.id}`} />
                      <Label htmlFor={`frequency-${option.id}`} className="flex items-center">
                        {option.label}
                        {option.discount > 0 && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Save {option.discount * 100}%
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {frequency !== "one_time" && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Payment Frequency</h4>
                    <RadioGroup
                      value={paymentFrequency}
                      onValueChange={setPaymentFrequency}
                      className="grid grid-cols-1 gap-2"
                    >
                      {paymentFrequencyOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`payment-${option.id}`} />
                          <Label htmlFor={`payment-${option.id}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Cleanliness Level */}
            <AccordionItem value="cleanliness" className="border rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-medium">Cleanliness Level</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  <CleanlinessSlider value={cleanlinessLevel} onChange={(value) => setCleanlinessLevel(value[0])} />
                  <div className="text-center">
                    <p className="font-medium">
                      {cleanlinessMultipliers.find((c) => c.level === cleanlinessLevel)?.label}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Price multiplier: {cleanlinessMultipliers.find((c) => c.level === cleanlinessLevel)?.multiplier}x
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>

      {/* Price Summary */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Estimated Price</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedPackage ? (
                <>
                  {fullHousePackages.find((p) => p.id === selectedPackage)?.name}
                  {serviceType === "detailing" && " (Premium Detailing)"}
                  {" • "}
                  {fullHousePackages.find((p) => p.id === selectedPackage)?.includedRooms.length} rooms
                </>
              ) : (
                <>
                  {serviceType === "standard" ? "Standard Cleaning" : "Premium Detailing"}
                  {hasSelectedRooms() && ` • ${Object.values(selectedRooms).reduce((a, b) => a + b, 0)} rooms`}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${totalPrice.toFixed(2)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {frequency !== "one_time" ? "Recurring" : "One-time"} service
            </p>
          </div>
        </div>

        {!isServiceAvailable && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 text-sm">
            For extremely dirty conditions, we recommend our Premium Detailing service. Please contact us for a custom
            quote.
          </div>
        )}

        {onAddToCart && (
          <div className="mt-4">
            <Button
              onClick={handleAddToCartClick}
              disabled={!hasSelectedRooms() || !isServiceAvailable || isAddingToCart}
              className="w-full"
            >
              {isAddingToCart ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
