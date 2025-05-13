"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Room configuration
const ROOMS = {
  master_bedroom: { name: "Master Bedroom", standard: 35, detailing: 55 },
  bedroom: { name: "Bedroom", standard: 25, detailing: 40 },
  bathroom: { name: "Bathroom", standard: 30, detailing: 50 },
  kitchen: { name: "Kitchen", standard: 50, detailing: 75 },
  living_room: { name: "Living Room", standard: 40, detailing: 60 },
  dining_room: { name: "Dining Room", standard: 30, detailing: 45 },
  office: { name: "Office", standard: 35, detailing: 55 },
  playroom: { name: "Playroom", standard: 30, detailing: 45 },
  mudroom: { name: "Mudroom", standard: 20, detailing: 30 },
  laundry_room: { name: "Laundry Room", standard: 25, detailing: 40 },
  sunroom: { name: "Sunroom", standard: 30, detailing: 45 },
  guest_room: { name: "Guest Room", standard: 25, detailing: 40 },
  garage: { name: "Garage", standard: 45, detailing: 70 },
}

// Frequency configuration
const FREQUENCIES = {
  one_time: { name: "One-time", surcharge: 0, discount: 0 },
  weekly: { name: "Weekly", surcharge: 0.05, discount: 0.12 },
  biweekly: { name: "Bi-weekly", surcharge: 0.03, discount: 0.08 },
  monthly: { name: "Monthly", surcharge: 0, discount: 0.05 },
  semi_annual: { name: "Semi-annual", surcharge: 0.1, discount: 0.15 },
  annually: { name: "Annual", surcharge: 0.15, discount: 0.2 },
}

// Payment frequency configuration
const PAYMENT_FREQUENCIES = {
  per_service: { name: "Per Service", discount: 0 },
  monthly: { name: "Monthly", discount: 0.05 },
  yearly: { name: "Yearly", discount: 0.18 },
}

// Cleanliness level multipliers
const CLEANLINESS_MULTIPLIERS = [1.0, 1.3, 1.7, 2.5]

// Service fee
const SERVICE_FEE = 15

// Video recording discount
const VIDEO_DISCOUNT = 25

interface PriceCalculatorProps {
  onCalculationComplete?: (data: any) => void
}

export function PriceCalculator({ onCalculationComplete }: PriceCalculatorProps) {
  // Room selection state
  const [rooms, setRooms] = useState<Record<string, number>>({
    master_bedroom: 0,
    bedroom: 0,
    bathroom: 0,
    kitchen: 0,
    living_room: 0,
    dining_room: 0,
    office: 0,
    playroom: 0,
    mudroom: 0,
    laundry_room: 0,
    sunroom: 0,
    guest_room: 0,
    garage: 0,
  })

  // Service configuration state
  const [frequency, setFrequency] = useState<keyof typeof FREQUENCIES>("one_time")
  const [serviceType, setServiceType] = useState<"standard" | "detailing">("standard")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(1)
  const [paymentFrequency, setPaymentFrequency] = useState<keyof typeof PAYMENT_FREQUENCIES>("per_service")
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [activeTab, setActiveTab] = useState("rooms")

  // Calculation results
  const [totalPrice, setTotalPrice] = useState(0)
  const [isServiceAvailable, setIsServiceAvailable] = useState(true)
  const [hasRooms, setHasRooms] = useState(false)
  const [highlightedOption, setHighlightedOption] = useState<string | null>(null)

  const { toast } = useToast()

  // Check if any rooms are selected
  useEffect(() => {
    const roomCount = Object.values(rooms).reduce((sum, count) => sum + count, 0)
    setHasRooms(roomCount > 0)
  }, [rooms])

  // Calculate price whenever inputs change
  useEffect(() => {
    try {
      // Check if any rooms are selected
      const roomCount = Object.values(rooms).reduce((sum, count) => sum + count, 0)
      if (roomCount === 0) {
        setTotalPrice(0)
        setIsServiceAvailable(true)

        if (onCalculationComplete) {
          onCalculationComplete({
            rooms,
            frequency,
            totalPrice: 0,
            serviceType,
            cleanlinessLevel,
            isServiceAvailable: true,
            paymentFrequency,
            allowVideoRecording,
          })
        }
        return
      }

      // Check service availability
      const serviceAvailable = !(cleanlinessLevel === 4 || (serviceType === "standard" && cleanlinessLevel > 2))

      // 1. Calculate base price
      const basePrice = Object.entries(rooms).reduce((total, [roomType, count]) => {
        if (count <= 0) return total
        const roomConfig = ROOMS[roomType as keyof typeof ROOMS]
        if (!roomConfig) return total
        return total + count * roomConfig[serviceType]
      }, 0)

      // 2. Apply cleanliness level multiplier
      let price = basePrice * CLEANLINESS_MULTIPLIERS[cleanlinessLevel - 1]

      // 3. Apply frequency adjustments
      const freqConfig = FREQUENCIES[frequency]
      price = price * (1 + freqConfig.surcharge) * (1 - freqConfig.discount)

      // 4. Apply payment frequency discount
      price *= 1 - PAYMENT_FREQUENCIES[paymentFrequency].discount

      // 5. Apply video discount
      if (allowVideoRecording) {
        price -= VIDEO_DISCOUNT
      }

      // 6. Add service fee
      price += SERVICE_FEE

      // Ensure proper currency formatting
      const finalPrice = Math.max(0, Math.round(price * 100) / 100)

      // Update state
      setTotalPrice(finalPrice)
      setIsServiceAvailable(serviceAvailable)

      // Call the onCalculationComplete callback if provided
      if (onCalculationComplete) {
        onCalculationComplete({
          rooms,
          frequency,
          totalPrice: finalPrice,
          serviceType,
          cleanlinessLevel,
          isServiceAvailable: serviceAvailable,
          paymentFrequency,
          allowVideoRecording,
        })
      }
    } catch (error) {
      console.error("Error calculating price:", error)
      toast({
        title: "Calculation Error",
        description: "There was an error calculating the price. Please try again.",
        variant: "destructive",
      })
    }
  }, [rooms, frequency, serviceType, cleanlinessLevel, paymentFrequency, allowVideoRecording, onCalculationComplete])

  const handleRoomChange = (room: string, value: number) => {
    setRooms((prev) => ({
      ...prev,
      [room]: Math.max(0, Math.floor(value)), // Ensure integer values
    }))

    // Highlight the changed option briefly
    setHighlightedOption(room)
    setTimeout(() => setHighlightedOption(null), 1500)

    // If this is the first room added, move to the next tab after a delay
    const currentRoomCount = Object.values(rooms).reduce((sum, count) => sum + count, 0)
    if (currentRoomCount === 0 && value > 0) {
      setTimeout(() => setActiveTab("service"), 1000)
    }
  }

  const getCleanlinessDescription = (level: number) => {
    if (level === 1) {
      return "Lightly Soiled - Standard cleaning"
    } else if (level === 2) {
      return "Moderately Soiled - Additional attention needed"
    } else if (level === 3) {
      return "Heavily Soiled - Intensive cleaning required"
    } else if (level === 4) {
      return "Extremely Soiled - Special services required, contact us"
    }
    return ""
  }

  // Group rooms by type for better organization
  const roomGroups = {
    Bedrooms: ["master_bedroom", "bedroom", "guest_room"],
    "Common Areas": ["living_room", "dining_room", "office", "playroom", "sunroom"],
    "Utility Rooms": ["kitchen", "bathroom", "laundry_room", "mudroom", "garage"],
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rooms" className="relative">
            Rooms
            {hasRooms && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                {Object.values(rooms).reduce((sum, count) => sum + count, 0)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="service">Service Type</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="pt-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Select Rooms to Clean</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Room selection help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Select the number of each room type you want cleaned. Prices vary by room type.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {Object.entries(roomGroups).map(([groupName, roomKeys]) => (
              <div key={groupName} className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">{groupName}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {roomKeys.map((roomKey) => {
                    const room = ROOMS[roomKey as keyof typeof ROOMS]
                    if (!room) return null

                    return (
                      <motion.div
                        key={roomKey}
                        animate={{
                          scale: highlightedOption === roomKey ? [1, 1.03, 1] : 1,
                          borderColor: highlightedOption === roomKey ? ["#e2e8f0", "#3b82f6", "#e2e8f0"] : "#e2e8f0",
                        }}
                        transition={{ duration: 1.5 }}
                      >
                        <Card
                          className={`overflow-hidden transition-all ${
                            rooms[roomKey] > 0 ? "ring-1 ring-primary" : ""
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{room.name}</span>
                              <span className="text-sm text-gray-500">{formatCurrency(room[serviceType])}</span>
                            </div>
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRoomChange(roomKey, rooms[roomKey] - 1)}
                                disabled={rooms[roomKey] <= 0}
                                aria-label={`Decrease ${room.name} count`}
                              >
                                -
                              </Button>
                              <span className="mx-4 min-w-[20px] text-center">{rooms[roomKey]}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRoomChange(roomKey, rooms[roomKey] + 1)}
                                aria-label={`Increase ${room.name} count`}
                              >
                                +
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}

            {!hasRooms && (
              <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-center">
                <p className="text-sm">Select at least one room to calculate your cleaning price</p>
              </div>
            )}

            {hasRooms && (
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setActiveTab("service")}>
                  Continue to Service Type <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="service" className="pt-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Service Type</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Service type help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Standard cleaning covers basic cleaning tasks. Premium detailing includes deep cleaning of
                      fixtures, appliances, and hard-to-reach areas.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <motion.div
                animate={{
                  scale: highlightedOption === "service-standard" ? [1, 1.03, 1] : 1,
                  borderColor: highlightedOption === "service-standard" ? ["#e2e8f0", "#3b82f6", "#e2e8f0"] : "#e2e8f0",
                }}
                transition={{ duration: 1.5 }}
              >
                <Card
                  className={`cursor-pointer transition-all h-full ${
                    serviceType === "standard" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    setServiceType("standard")
                    setHighlightedOption("service-standard")
                    setTimeout(() => setHighlightedOption(null), 1500)
                  }}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <h4 className="text-xl font-semibold mb-2">Standard Cleaning</h4>
                    <p className="text-sm text-gray-500 mb-4 flex-grow">
                      Our standard cleaning service covers all the basics: dusting, vacuuming, mopping, and surface
                      cleaning.
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-primary/10">
                        Base Rate
                      </Badge>
                      <Check
                        className={`h-5 w-5 text-primary ${serviceType === "standard" ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                animate={{
                  scale: highlightedOption === "service-detailing" ? [1, 1.03, 1] : 1,
                  borderColor:
                    highlightedOption === "service-detailing" ? ["#e2e8f0", "#3b82f6", "#e2e8f0"] : "#e2e8f0",
                }}
                transition={{ duration: 1.5 }}
              >
                <Card
                  className={`cursor-pointer transition-all h-full ${
                    serviceType === "detailing" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => {
                    setServiceType("detailing")
                    setHighlightedOption("service-detailing")
                    setTimeout(() => setHighlightedOption(null), 1500)
                  }}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <h4 className="text-xl font-semibold mb-2">Premium Detailing</h4>
                    <p className="text-sm text-gray-500 mb-4 flex-grow">
                      Our premium service includes everything in standard cleaning plus deep cleaning of fixtures,
                      appliances, and hard-to-reach areas.
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      >
                        +80% Rate
                      </Badge>
                      <Check
                        className={`h-5 w-5 text-primary ${serviceType === "detailing" ? "opacity-100" : "opacity-0"}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Cleanliness Level</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Cleanliness level help</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Select the current cleanliness level of your space. Higher levels of soil require more intensive
                        cleaning.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={[cleanlinessLevel]}
                    min={1}
                    max={4}
                    step={1}
                    onValueChange={(value) => {
                      setCleanlinessLevel(value[0])
                      setHighlightedOption("cleanliness")
                      setTimeout(() => setHighlightedOption(null), 1500)
                    }}
                    className={highlightedOption === "cleanliness" ? "ring-2 ring-primary rounded-lg" : ""}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Light</span>
                    <span>Moderate</span>
                    <span>Heavy</span>
                    <span>Extreme</span>
                  </div>
                </div>

                <motion.div
                  animate={{
                    scale: highlightedOption === "cleanliness" ? [1, 1.03, 1] : 1,
                    borderColor: highlightedOption === "cleanliness" ? ["#e2e8f0", "#3b82f6", "#e2e8f0"] : "#e2e8f0",
                  }}
                  transition={{ duration: 1.5 }}
                  className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md"
                >
                  <p className="text-sm">{getCleanlinessDescription(cleanlinessLevel)}</p>
                  {(cleanlinessLevel === 4 || (serviceType === "standard" && cleanlinessLevel > 2)) && (
                    <p className="text-sm text-red-500 mt-2">
                      This combination is not available for online booking. Please contact us for a custom quote.
                    </p>
                  )}
                </motion.div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("rooms")}>
                Back to Rooms
              </Button>
              <Button onClick={() => setActiveTab("frequency")}>
                Continue to Frequency <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="frequency" className="pt-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Cleaning Frequency</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Frequency help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Regular cleaning schedules receive discounts. Some frequencies have surcharges for scheduling
                      complexity.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(FREQUENCIES).map(([freq, config]) => (
                <motion.div
                  key={freq}
                  animate={{
                    scale: highlightedOption === `freq-${freq}` ? [1, 1.03, 1] : 1,
                    borderColor: highlightedOption === `freq-${freq}` ? ["#e2e8f0", "#3b82f6", "#e2e8f0"] : "#e2e8f0",
                  }}
                  transition={{ duration: 1.5 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${frequency === freq ? "ring-2 ring-primary" : ""}`}
                    onClick={() => {
                      setFrequency(freq as keyof typeof FREQUENCIES)
                      setHighlightedOption(`freq-${freq}`)
                      setTimeout(() => setHighlightedOption(null), 1500)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{config.name}</h4>
                        <Check className={`h-5 w-5 text-primary ${frequency === freq ? "opacity-100" : "opacity-0"}`} />
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {config.discount > 0 && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Save {Math.round(config.discount * 100)}%
                          </Badge>
                        )}

                        {config.surcharge > 0 && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            +{Math.round(config.surcharge * 100)}% Surcharge
                          </Badge>
                        )}

                        {freq === "one_time" && <Badge variant="outline">No commitment</Badge>}

                        {freq === "weekly" && <Badge variant="outline">Best value</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Payment Frequency</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">Payment frequency help</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Choose how often you want to be billed. Monthly and yearly payment options offer additional
                        discounts.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(PAYMENT_FREQUENCIES).map(([payFreq, config]) => (
                  <motion.div
                    key={payFreq}
                    animate={{
                      scale: highlightedOption === `pay-${payFreq}` ? [1, 1.03, 1] : 1,
                      borderColor:
                        highlightedOption === `pay-${payFreq}` ? ["#e2e8f0", "#3b82f6", "#e2e8f0"] : "#e2e8f0",
                    }}
                    transition={{ duration: 1.5 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        paymentFrequency === payFreq ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => {
                        setPaymentFrequency(payFreq as keyof typeof PAYMENT_FREQUENCIES)
                        setHighlightedOption(`pay-${payFreq}`)
                        setTimeout(() => setHighlightedOption(null), 1500)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{config.name}</h4>
                          <Check
                            className={`h-5 w-5 text-primary ${paymentFrequency === payFreq ? "opacity-100" : "opacity-0"}`}
                          />
                        </div>

                        {config.discount > 0 && (
                          <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Save {Math.round(config.discount * 100)}%
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("service")}>
                Back to Service Type
              </Button>
              <Button onClick={() => setActiveTab("options")}>
                Continue to Options <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="options" className="pt-4">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Additional Options</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <HelpCircle className="h-4 w-4" />
                      <span className="sr-only">Options help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Customize your cleaning service with additional options and discounts.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <motion.div
              animate={{
                scale: highlightedOption === "video-recording" ? [1, 1.03, 1] : 1,
                borderColor: highlightedOption === "video-recording" ? ["#e2e8f0", "#3b82f6", "#e2e8f0"] : "#e2e8f0",
              }}
              transition={{ duration: 1.5 }}
              className="mb-6"
            >
              <Card className={`${highlightedOption === "video-recording" ? "ring-2 ring-primary" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="allow-video"
                      checked={allowVideoRecording}
                      onChange={(e) => {
                        setAllowVideoRecording(e.target.checked)
                        setHighlightedOption("video-recording")
                        setTimeout(() => setHighlightedOption(null), 1500)
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="allow-video"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        Allow video recording of cleaning for quality control
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        We may record parts of the cleaning process for training and quality control purposes.
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Save ${VIDEO_DISCOUNT}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Price Summary</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={totalPrice}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-2xl font-bold text-primary"
                  >
                    {formatCurrency(totalPrice)}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="space-y-2 text-sm">
                {/* Base price */}
                <div className="flex justify-between">
                  <span>Base Room Costs:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      Object.entries(rooms).reduce((sum, [roomType, count]) => {
                        if (count <= 0) return sum
                        const roomConfig = ROOMS[roomType as keyof typeof ROOMS]
                        if (!roomConfig) return sum
                        return sum + count * roomConfig[serviceType]
                      }, 0),
                    )}
                  </span>
                </div>

                {/* Service type adjustment */}
                {serviceType === "detailing" && (
                  <div className="flex justify-between">
                    <span>Premium Service:</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">+80%</span>
                  </div>
                )}

                {/* Cleanliness level */}
                {cleanlinessLevel > 1 && (
                  <div className="flex justify-between">
                    <span>Cleanliness Level ({cleanlinessLevel}):</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      +{Math.round((CLEANLINESS_MULTIPLIERS[cleanlinessLevel - 1] - 1) * 100)}%
                    </span>
                  </div>
                )}

                {/* Frequency discount */}
                {FREQUENCIES[frequency].discount > 0 && (
                  <div className="flex justify-between">
                    <span>Frequency Discount ({FREQUENCIES[frequency].name}):</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -{Math.round(FREQUENCIES[frequency].discount * 100)}%
                    </span>
                  </div>
                )}

                {/* Frequency surcharge */}
                {FREQUENCIES[frequency].surcharge > 0 && (
                  <div className="flex justify-between">
                    <span>Frequency Surcharge ({FREQUENCIES[frequency].name}):</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">
                      +{Math.round(FREQUENCIES[frequency].surcharge * 100)}%
                    </span>
                  </div>
                )}

                {/* Payment frequency discount */}
                {PAYMENT_FREQUENCIES[paymentFrequency].discount > 0 && (
                  <div className="flex justify-between">
                    <span>Payment Plan ({PAYMENT_FREQUENCIES[paymentFrequency].name}):</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -{Math.round(PAYMENT_FREQUENCIES[paymentFrequency].discount * 100)}%
                    </span>
                  </div>
                )}

                {/* Video recording discount */}
                {allowVideoRecording && (
                  <div className="flex justify-between">
                    <span>Video Recording Discount:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -${VIDEO_DISCOUNT.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Service fee */}
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span className="font-medium">${SERVICE_FEE.toFixed(2)}</span>
                </div>

                <Separator className="my-2" />

                {/* Total */}
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("frequency")}>
                Back to Frequency
              </Button>
              <Button
                onClick={() => {
                  // Simulate completion animation
                  setHighlightedOption("complete")
                  setTimeout(() => setHighlightedOption(null), 1500)

                  // Scroll to top of page
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                disabled={!hasRooms || !isServiceAvailable}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Complete Configuration
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
