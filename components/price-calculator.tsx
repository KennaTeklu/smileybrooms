"use client"

import type React from "react"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Home, Calendar, Sparkles } from "lucide-react"
import { roomConfig } from "@/lib/room-config"
import { cn } from "@/lib/utils"
import { Minus, Plus } from "lucide-react"
import { usePricing } from "@/contexts/pricing-context" // Import the context
import { BASE_ROOM_RATES, SERVICE_TIERS, CLEANLINESS_DIFFICULTY } from "@/lib/pricing-config" // Import pricing data
import type { ServiceTierId, CleanlinessLevelId } from "@/lib/pricing-config" // Import types

// Define the types for the calculator props
interface PriceCalculatorProps {
  onCalculationComplete?: (data: {
    rooms: Record<string, number>
    frequency: string
    firstServicePrice: number
    recurringServicePrice: number
    serviceType: ServiceTierId // Changed to ServiceTierId
    cleanlinessLevel: CleanlinessLevelId // Changed to CleanlinessLevelId
    priceMultiplier: number
    isServiceAvailable: boolean
    addressId: string
    paymentFrequency: "per_service" | "monthly" | "yearly"
    isRecurring: boolean
    recurringInterval: "week" | "month" | "year"
  }) => void
  onAddToCart?: () => void
}

// Define the room types (simplified as prices come from pricing-config)
const roomTypes = roomConfig.roomTypes

// Define the frequency options and their discounts (kept local for now as per plan)
const frequencyOptions = [
  { id: "one_time", label: "One-Time", discount: 0, isRecurring: false, recurringInterval: null },
  { id: "weekly", label: "Weekly", discount: 0.15, isRecurring: true, recurringInterval: "week" },
  { id: "biweekly", label: "Biweekly", discount: 0.1, isRecurring: true, recurringInterval: "week" },
  { id: "monthly", label: "Monthly", discount: 0.05, isRecurring: true, recurringInterval: "month" },
  { id: "semi_annual", label: "Semi-Annual", discount: 0.02, isRecurring: true, recurringInterval: "month" },
  { id: "annually", label: "Annual", discount: 0.01, isRecurring: true, recurringInterval: "year" },
  { id: "vip_daily", label: "VIP Daily", discount: 0.25, isRecurring: true, recurringInterval: "week" },
]

// Define the payment frequency options (kept local for now as per plan)
const paymentFrequencyOptions = [
  { id: "per_service", label: "Pay Per Service" },
  { id: "monthly", label: "Monthly Subscription" },
  { id: "yearly", label: "Annual Subscription (Save 10%)" },
]

interface RoomConfiguratorProps {
  selectedRooms: Record<string, number>
  serviceTier: ServiceTierId // Changed to serviceTier
  dispatch: ReturnType<typeof usePricing>["dispatch"] // Pass dispatch from context
}

const RoomConfigurator: React.FC<RoomConfiguratorProps> = ({ selectedRooms, serviceTier, dispatch }) => {
  const incrementRoom = (roomId: string) => {
    dispatch({ type: "SET_ROOM_COUNT", payload: { roomId, count: (selectedRooms[roomId] || 0) + 1 } })
  }

  const decrementRoom = (roomId: string) => {
    if (selectedRooms[roomId] > 0) {
      dispatch({ type: "SET_ROOM_COUNT", payload: { roomId, count: selectedRooms[roomId] - 1 } })
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
                {/* Dynamically fetch price based on serviceTier */}$
                {BASE_ROOM_RATES[room.id as keyof typeof BASE_ROOM_RATES][serviceTier]} per room
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
                {/* Dynamically fetch price based on serviceTier */}$
                {BASE_ROOM_RATES[room.id as keyof typeof BASE_ROOM_RATES][serviceTier]} per room
              </p>
            </div>
          ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" /> Request Custom Space
        </Button>
      </div>
    </>
  )
}

export default function PriceCalculator({ onCalculationComplete, onAddToCart }: PriceCalculatorProps) {
  const { state, dispatch } = usePricing()
  const {
    serviceTier,
    rooms,
    cleanlinessLevel,
    frequency,
    paymentFrequency,
    calculatedPrice,
    nextRecurringPrice,
    isServiceAvailable,
    enforcedTierReason,
  } = state

  // Media query for responsive design (kept for potential future use, though not directly used in this phase's logic)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Effect to call onCalculationComplete when relevant state changes
  useEffect(() => {
    if (onCalculationComplete) {
      const selectedFrequencyOption = frequencyOptions.find((f) => f.id === frequency)
      onCalculationComplete({
        rooms: rooms,
        frequency,
        firstServicePrice: calculatedPrice.totalPrice,
        recurringServicePrice: nextRecurringPrice,
        serviceType: serviceTier, // Use serviceTier from context
        cleanlinessLevel: cleanlinessLevel, // Use cleanlinessLevel from context
        priceMultiplier: CLEANLINESS_DIFFICULTY[cleanlinessLevel].multipliers[serviceTier], // Get actual multiplier
        isServiceAvailable: isServiceAvailable,
        addressId: "custom", // This would be replaced with actual address ID in a real implementation
        paymentFrequency: paymentFrequency as "per_service" | "monthly" | "yearly",
        isRecurring: selectedFrequencyOption?.isRecurring || false,
        recurringInterval: selectedFrequencyOption?.recurringInterval as "week" | "month" | "year",
      })
    }
  }, [
    rooms,
    frequency,
    paymentFrequency,
    serviceTier,
    cleanlinessLevel,
    calculatedPrice,
    nextRecurringPrice,
    isServiceAvailable,
    onCalculationComplete,
  ])

  // Function to check if any rooms are selected
  const hasSelectedRooms = () => {
    return Object.values(rooms).some((count) => count > 0)
  }

  // Get cleanliness level options from pricing-config
  const cleanlinessOptions = Object.values(CLEANLINESS_DIFFICULTY).map((level) => ({
    id: level.level,
    label: level.name,
    multiplier: level.multipliers[serviceTier],
  }))

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs
        value={serviceTier}
        onValueChange={(value) => dispatch({ type: "SET_SERVICE_TIER", payload: value as ServiceTierId })}
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          {" "}
          {/* Changed to 3 columns */}
          {Object.values(SERVICE_TIERS).map((tier) => (
            <TabsTrigger key={tier.id} value={tier.id} className="text-sm md:text-base">
              {tier.name} Cleaning
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.values(SERVICE_TIERS).map((tier) => (
          <TabsContent key={tier.id} value={tier.id} className="space-y-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">{tier.name} Cleaning Service</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tier.id === "standard" &&
                  "Our standard cleaning covers all the basics to keep your space clean and tidy."}
                {tier.id === "premium" &&
                  "Our premium service includes deep sanitization and premium products for a superior clean."}
                {tier.id === "elite" &&
                  "Our white-glove service offers unparalleled attention to detail and comprehensive guarantees."}
              </p>
            </div>

            {/* Room Selection - Always visible */}
            <Card
              className={cn(
                "border-2",
                tier.id === "standard" && "border-blue-100 dark:border-blue-900",
                tier.id === "premium" && "border-purple-100 dark:border-purple-900",
                tier.id === "elite" && "border-green-100 dark:border-green-900",
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Home
                    className={cn(
                      "h-5 w-5 mr-2",
                      tier.id === "standard" && "text-blue-600",
                      tier.id === "premium" && "text-purple-600",
                      tier.id === "elite" && "text-green-600",
                    )}
                  />
                  <h3 className="text-lg font-medium">Select Rooms</h3>
                </div>

                <RoomConfigurator
                  selectedRooms={rooms}
                  setSelectedRooms={(newRooms) => dispatch({ type: "SET_ROOM_COUNTS", payload: newRooms })}
                  serviceTier={serviceTier} // Pass serviceTier from context
                  dispatch={dispatch} // Pass dispatch to RoomConfigurator
                />
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
                    onValueChange={(value) => dispatch({ type: "SET_FREQUENCY", payload: value })}
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
                        onValueChange={(value) => dispatch({ type: "SET_PAYMENT_FREQUENCY", payload: value })}
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
                    {/* Replaced CleanlinessSlider with RadioGroup */}
                    <RadioGroup
                      value={cleanlinessLevel.toString()} // RadioGroup expects string value
                      onValueChange={(value) =>
                        dispatch({
                          type: "SET_CLEANLINESS_LEVEL",
                          payload: Number.parseInt(value) as CleanlinessLevelId,
                        })
                      }
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      {cleanlinessOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id.toString()} id={`cleanliness-${option.id}`} />
                          <Label htmlFor={`cleanliness-${option.id}`} className="flex items-center">
                            {option.label}
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                              {option.multiplier}x
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="text-center">
                      <p className="font-medium">{cleanlinessOptions.find((c) => c.id === cleanlinessLevel)?.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Price multiplier: {cleanlinessOptions.find((c) => c.id === cleanlinessLevel)?.multiplier}x
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>

      {/* Price Summary */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">
              {frequency !== "one_time" ? "First Service Price" : "Estimated Price"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {SERVICE_TIERS[serviceTier].name} Cleaning
              {hasSelectedRooms() && ` • ${Object.values(rooms).reduce((a, b) => a + b, 0)} rooms`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${calculatedPrice.totalPrice.toFixed(2)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {frequency !== "one_time" ? "One-time charge" : "One-time service"}
            </p>
          </div>
        </div>

        {frequency !== "one_time" && nextRecurringPrice > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h4 className="text-base font-medium">Subsequent Services</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {frequencyOptions.find((f) => f.id === frequency)?.label}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">${nextRecurringPrice.toFixed(2)}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {paymentFrequency === "per_service" ? "per service" : `per ${paymentFrequency.replace("ly", "")}`}
              </p>
            </div>
          </div>
        )}

        {!isServiceAvailable && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 text-sm">
            For extremely dirty conditions, we recommend our Premium Detailing service. Please contact us for a custom
            quote.
          </div>
        )}

        {enforcedTierReason && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-300 text-sm">
            {enforcedTierReason}
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
