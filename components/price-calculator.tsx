"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Home, Calendar, Sparkles } from "lucide-react"
import CleanlinessSlider from "./cleanliness-slider"
import { roomConfig } from "@/lib/room-config"
import { Plus } from "lucide-react"
import { CompactRoomSelector } from "./compact-room-selector"
import type { RoomConfiguration } from "./room-customization-drawer"

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
}

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

// Sample room tiers, add-ons, and reductions for the customization drawer
const sampleRoomTiers = {
  bedroom: [
    {
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning of visible surfaces",
      price: 49.99,
      features: ["Dusting surfaces", "Vacuuming floors", "Making bed", "Emptying trash"],
    },
    {
      name: "ADVANCED CLEAN",
      description: "Deeper cleaning including hard-to-reach areas",
      price: 89.99,
      features: ["Everything in Essential Clean", "Under bed cleaning", "Baseboards", "Window sills", "Light fixtures"],
    },
    {
      name: "PREMIUM CLEAN",
      description: "Complete top-to-bottom cleaning",
      price: 129.99,
      features: [
        "Everything in Advanced Clean",
        "Inside closets",
        "Behind furniture",
        "Wall spot cleaning",
        "Ceiling fans",
      ],
    },
  ],
  bathroom: [
    {
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning of main surfaces",
      price: 39.99,
      features: ["Sink and counter", "Toilet", "Shower/tub surfaces", "Floor"],
    },
    {
      name: "ADVANCED CLEAN",
      description: "Deeper cleaning of all surfaces",
      price: 69.99,
      features: [
        "Everything in Essential Clean",
        "Tile grout",
        "Cabinet exteriors",
        "Detailed fixtures",
        "Mirror cleaning",
      ],
    },
    {
      name: "PREMIUM CLEAN",
      description: "Complete sanitizing clean",
      price: 99.99,
      features: [
        "Everything in Advanced Clean",
        "Cabinet interiors",
        "Exhaust fan",
        "Scale removal",
        "Deep disinfection",
      ],
    },
  ],
}

const sampleAddOns = {
  bedroom: [
    {
      id: "windows",
      name: "Window Cleaning",
      price: 15,
      description: "Interior window cleaning including tracks and sills",
    },
    { id: "blinds", name: "Blinds/Curtains", price: 20, description: "Detailed cleaning of window treatments" },
    { id: "walls", name: "Wall Washing", price: 35, description: "Spot cleaning and full wall washing as needed" },
    {
      id: "mattress",
      name: "Mattress Treatment",
      price: 45,
      description: "Vacuum, spot clean, and deodorize mattress",
    },
  ],
  bathroom: [
    { id: "deep_grout", name: "Deep Grout Cleaning", price: 30, description: "Intensive grout cleaning and sealing" },
    {
      id: "shower_doors",
      name: "Shower Door Treatment",
      price: 25,
      description: "Hard water stain and soap scum removal",
    },
    { id: "mold", name: "Mold Treatment", price: 40, description: "Mold and mildew removal and prevention" },
    { id: "cabinet_org", name: "Cabinet Organization", price: 35, description: "Clean and organize bathroom cabinets" },
  ],
}

const sampleReductions = {
  bedroom: [
    {
      id: "no_dusting",
      name: "No Dusting",
      discount: 10,
      description: "Skip dusting of surfaces and decorative items",
    },
    { id: "no_vacuum", name: "No Vacuuming", discount: 15, description: "Skip vacuuming of floors and rugs" },
    { id: "no_bed", name: "No Bed Making", discount: 5, description: "Skip making the bed" },
  ],
  bathroom: [
    { id: "no_shower", name: "No Shower/Tub", discount: 15, description: "Skip cleaning the shower or bathtub" },
    { id: "no_floor", name: "No Floor", discount: 10, description: "Skip cleaning the bathroom floor" },
    { id: "no_mirror", name: "No Mirrors", discount: 5, description: "Skip cleaning mirrors and glass surfaces" },
  ],
}

export default function PriceCalculator({ onCalculationComplete, onAddToCart }: PriceCalculatorProps) {
  // State for selected rooms
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>(() => {
    const initialRooms: Record<string, number> = {}
    roomTypes.forEach((room) => {
      initialRooms[room.id] = 0
    })
    return initialRooms
  })

  // State for room configurations
  const [roomConfigurations, setRoomConfigurations] = useState<Record<string, RoomConfiguration>>({})

  // State for other selections
  const [serviceType, setServiceType] = useState<"standard" | "detailing">("standard")
  const [frequency, setFrequency] = useState("one_time")
  const [paymentFrequency, setPaymentFrequency] = useState("per_service")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(2) // Default to average
  const [totalPrice, setTotalPrice] = useState(0)
  const [isServiceAvailable, setIsServiceAvailable] = useState(true)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  // Media query for responsive design
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Calculate the total price whenever selections change
  useEffect(() => {
    calculatePrice()
  }, [selectedRooms, roomConfigurations, serviceType, frequency, cleanlinessLevel, paymentFrequency])

  // Function to handle room count changes
  const handleRoomCountChange = (roomId: string, count: number) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: count,
    }))
  }

  // Function to handle room configuration changes
  const handleRoomConfigChange = (roomId: string, config: RoomConfiguration) => {
    setRoomConfigurations((prev) => ({
      ...prev,
      [roomId]: config,
    }))
  }

  // Function to calculate the total price
  const calculatePrice = () => {
    // Calculate base price from selected rooms and their configurations
    let basePrice = 0
    Object.entries(selectedRooms).forEach(([roomId, count]) => {
      if (count > 0) {
        const roomConfig = roomConfigurations[roomId]
        if (roomConfig) {
          basePrice += roomConfig.totalPrice * count
        } else {
          const room = roomTypes.find((r) => r.id === roomId)
          if (room) {
            basePrice += room.basePrice * count
          }
        }
      }
    })

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

  // Function to check if any rooms are selected
  const hasSelectedRooms = () => {
    return Object.values(selectedRooms).some((count) => count > 0)
  }

  // Function to toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  // Check if a section is expanded
  const isSectionExpanded = (section: string) => {
    return expandedSections.includes(section)
  }

  // Get room tiers for a specific room type
  const getRoomTiers = (roomId: string) => {
    return sampleRoomTiers[roomId as keyof typeof sampleRoomTiers] || sampleRoomTiers.bedroom
  }

  // Get room add-ons for a specific room type
  const getRoomAddOns = (roomId: string) => {
    return sampleAddOns[roomId as keyof typeof sampleAddOns] || sampleAddOns.bedroom
  }

  // Get room reductions for a specific room type
  const getRoomReductions = (roomId: string) => {
    return sampleReductions[roomId as keyof typeof sampleReductions] || sampleReductions.bedroom
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="standard" onValueChange={(value) => setServiceType(value as "standard" | "detailing")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="standard" className="text-sm md:text-base">
            Residential Services
          </TabsTrigger>
          <TabsTrigger value="detailing" className="text-sm md:text-base">
            Commercial Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Residential Cleaning Services</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customize your home cleaning service with our flexible options
            </p>
          </div>

          {/* Room Selection - Always visible */}
          <Card className="border-2 border-blue-100 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Home className="h-5 w-5 mr-2 text-blue-600" />
                <h3 className="text-lg font-medium">Select Rooms</h3>
              </div>

              <div className="border-b pb-2 mb-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">CORE ROOMS</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {roomTypes
                  .filter((room) => ["bedroom", "bathroom", "kitchen", "living_room", "dining_room"].includes(room.id))
                  .map((room) => (
                    <CompactRoomSelector
                      key={room.id}
                      roomId={room.id}
                      roomName={room.name}
                      roomIcon={room.icon}
                      basePrice={serviceType === "standard" ? room.basePrice : room.basePrice * 1.8}
                      count={selectedRooms[room.id] || 0}
                      onCountChange={handleRoomCountChange}
                      baseTier={getRoomTiers(room.id)[0]}
                      tiers={getRoomTiers(room.id)}
                      addOns={getRoomAddOns(room.id)}
                      reductions={getRoomReductions(room.id)}
                      onConfigChange={handleRoomConfigChange}
                      initialConfig={roomConfigurations[room.id]}
                    />
                  ))}
              </div>

              <div className="border-b pb-2 mb-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ADDITIONAL SPACES</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {roomTypes
                  .filter((room) => !["bedroom", "bathroom", "kitchen", "living_room", "dining_room"].includes(room.id))
                  .map((room) => (
                    <CompactRoomSelector
                      key={room.id}
                      roomId={room.id}
                      roomName={room.name}
                      roomIcon={room.icon}
                      basePrice={serviceType === "standard" ? room.basePrice : room.basePrice * 1.8}
                      count={selectedRooms[room.id] || 0}
                      onCountChange={handleRoomCountChange}
                      baseTier={getRoomTiers(room.id)[0]}
                      tiers={getRoomTiers(room.id)}
                      addOns={getRoomAddOns(room.id)}
                      reductions={getRoomReductions(room.id)}
                      onConfigChange={handleRoomConfigChange}
                      initialConfig={roomConfigurations[room.id]}
                    />
                  ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> Request Custom Space
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Collapsible Sections */}
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

        <TabsContent value="detailing" className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Commercial Cleaning Services</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Professional cleaning services for businesses and commercial properties
            </p>
          </div>

          {/* Room Selection - Always visible */}
          <Card className="border-2 border-purple-100 dark:border-purple-900">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Home className="h-5 w-5 mr-2 text-purple-600" />
                <h3 className="text-lg font-medium">Select Areas</h3>
              </div>

              <div className="border-b pb-2 mb-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">CORE AREAS</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {roomTypes
                  .filter((room) => ["bedroom", "bathroom", "kitchen", "living_room", "dining_room"].includes(room.id))
                  .map((room) => (
                    <CompactRoomSelector
                      key={room.id}
                      roomId={room.id}
                      roomName={room.name}
                      roomIcon={room.icon}
                      basePrice={serviceType === "standard" ? room.basePrice : room.basePrice * 1.8}
                      count={selectedRooms[room.id] || 0}
                      onCountChange={handleRoomCountChange}
                      baseTier={getRoomTiers(room.id)[0]}
                      tiers={getRoomTiers(room.id)}
                      addOns={getRoomAddOns(room.id)}
                      reductions={getRoomReductions(room.id)}
                      onConfigChange={handleRoomConfigChange}
                      initialConfig={roomConfigurations[room.id]}
                    />
                  ))}
              </div>

              <div className="border-b pb-2 mb-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ADDITIONAL SPACES</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {roomTypes
                  .filter((room) => !["bedroom", "bathroom", "kitchen", "living_room", "dining_room"].includes(room.id))
                  .map((room) => (
                    <CompactRoomSelector
                      key={room.id}
                      roomId={room.id}
                      roomName={room.name}
                      roomIcon={room.icon}
                      basePrice={serviceType === "standard" ? room.basePrice : room.basePrice * 1.8}
                      count={selectedRooms[room.id] || 0}
                      onCountChange={handleRoomCountChange}
                      baseTier={getRoomTiers(room.id)[0]}
                      tiers={getRoomTiers(room.id)}
                      addOns={getRoomAddOns(room.id)}
                      reductions={getRoomReductions(room.id)}
                      onConfigChange={handleRoomConfigChange}
                      initialConfig={roomConfigurations[room.id]}
                    />
                  ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> Request Custom Space
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Collapsible Sections */}
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
              {serviceType === "standard" ? "Residential Services" : "Commercial Services"}
              {hasSelectedRooms() && ` • ${Object.values(selectedRooms).reduce((a, b) => a + b, 0)} rooms`}
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
            For extremely dirty conditions, we recommend our Commercial Services. Please contact us for a custom quote.
          </div>
        )}

        {onAddToCart && (
          <div className="mt-4">
            <Button onClick={onAddToCart} disabled={!hasSelectedRooms() || !isServiceAvailable} className="w-full">
              Add to Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
