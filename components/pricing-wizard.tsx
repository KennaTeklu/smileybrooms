"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  HelpCircle,
  Check,
  ChevronRight,
  ChevronLeft,
  Home,
  Calendar,
  Settings,
  Sparkles,
  Bath,
  CookingPotIcon as Kitchen,
  Sofa,
  Coffee,
  Briefcase,
  Bed,
  Plus,
  Minus,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"

// Define types
interface UserPreferences {
  lastSelectedRooms?: Record<string, number>
  preferredServiceType?: "standard" | "detailing"
  preferredFrequency?: string
  preferredPaymentFrequency?: "per_service" | "monthly" | "yearly"
}

interface PricingWizardProps {
  onCalculationComplete: (data: any) => void
  onStepChange: (step: number) => void
  userPreferences?: UserPreferences
  abTestVariant?: "A" | "B"
  initialStep?: number
}

// Room configuration with images and descriptions
const ROOMS = {
  master_bedroom: {
    name: "Master Bedroom",
    standard: 35,
    detailing: 55,
    icon: "/cozy-bedroom.png",
    description: "Includes dusting, vacuuming, and making the bed",
  },
  bedroom: {
    name: "Bedroom",
    standard: 25,
    detailing: 40,
    icon: "/placeholder.svg?key=7i9w1",
    description: "Includes dusting, vacuuming, and making the bed",
  },
  bathroom: {
    name: "Bathroom",
    standard: 30,
    detailing: 50,
    icon: "/modern-bathroom.png",
    description: "Includes cleaning toilet, shower, sink, and floors",
  },
  kitchen: {
    name: "Kitchen",
    standard: 50,
    detailing: 75,
    icon: "/modern-minimalist-kitchen.png",
    description: "Includes cleaning countertops, sink, appliance exteriors, and floors",
  },
  living_room: {
    name: "Living Room",
    standard: 40,
    detailing: 60,
    icon: "/cozy-eclectic-living-room.png",
    description: "Includes dusting, vacuuming, and surface cleaning",
  },
  dining_room: {
    name: "Dining Room",
    standard: 30,
    detailing: 45,
    icon: "/elegant-dining-room.png",
    description: "Includes dusting, vacuuming, and table cleaning",
  },
  office: {
    name: "Office",
    standard: 35,
    detailing: 55,
    icon: "/cozy-home-office.png",
    description: "Includes dusting, vacuuming, and desk cleaning",
  },
  playroom: {
    name: "Playroom",
    standard: 30,
    detailing: 45,
    icon: "/placeholder.svg?key=fgff0",
    description: "Includes dusting, vacuuming, and toy organization",
  },
  mudroom: {
    name: "Mudroom",
    standard: 20,
    detailing: 30,
    icon: "/placeholder.svg?key=icigq",
    description: "Includes sweeping, mopping, and surface cleaning",
  },
  laundry_room: {
    name: "Laundry Room",
    standard: 25,
    detailing: 40,
    icon: "/cozy-laundry-room.png",
    description: "Includes cleaning appliance exteriors and floors",
  },
  sunroom: {
    name: "Sunroom",
    standard: 30,
    detailing: 45,
    icon: "/placeholder.svg?key=z8sxl",
    description: "Includes dusting, vacuuming, and window sill cleaning",
  },
  guest_room: {
    name: "Guest Room",
    standard: 25,
    detailing: 40,
    icon: "/cozy-guest-room.png",
    description: "Includes dusting, vacuuming, and making the bed",
  },
  garage: {
    name: "Garage",
    standard: 45,
    detailing: 70,
    icon: "/placeholder.svg?key=t2qd8",
    description: "Includes sweeping and surface cleaning",
  },
}

// Room configuration
const ROOM_TYPES = {
  bedroom: { label: "Bedroom", icon: Bed, basePrice: { standard: 25, detailing: 40 } },
  bathroom: { label: "Bathroom", icon: Bath, basePrice: { standard: 30, detailing: 50 } },
  kitchen: { label: "Kitchen", icon: Kitchen, basePrice: { standard: 50, detailing: 75 } },
  living_room: { label: "Living Room", icon: Sofa, basePrice: { standard: 40, detailing: 60 } },
  dining_room: { label: "Dining Room", icon: Coffee, basePrice: { standard: 25, detailing: 40 } },
  office: { label: "Office", icon: Briefcase, basePrice: { standard: 35, detailing: 55 } },
}

// Home presets
const HOME_PRESETS = {
  studio: { label: "Studio", rooms: { bedroom: 1, bathroom: 1, kitchen: 1, living_room: 1 } },
  one_bedroom: { label: "1 Bedroom", rooms: { bedroom: 1, bathroom: 1, kitchen: 1, living_room: 1, dining_room: 1 } },
  two_bedroom: { label: "2 Bedroom", rooms: { bedroom: 2, bathroom: 1, kitchen: 1, living_room: 1, dining_room: 1 } },
  three_bedroom: { label: "3 Bedroom", rooms: { bedroom: 3, bathroom: 2, kitchen: 1, living_room: 1, dining_room: 1 } },
}

// Frequency configuration
const FREQUENCIES = {
  one_time: {
    name: "One-time",
    surcharge: 0,
    discount: 0,
    description: "Perfect for spring cleaning or special occasions",
    icon: "/placeholder.svg?key=2fbgf",
  },
  weekly: {
    name: "Weekly",
    surcharge: 0.05,
    discount: 0.12,
    description: "Our most popular option for busy households",
    icon: "/placeholder.svg?key=ym515",
  },
  biweekly: {
    name: "Bi-weekly",
    surcharge: 0.03,
    discount: 0.08,
    description: "A good balance of cleanliness and value",
    icon: "/placeholder.svg?key=sj5gx",
  },
  monthly: {
    name: "Monthly",
    surcharge: 0,
    discount: 0.05,
    description: "Great for maintaining a baseline of cleanliness",
    icon: "/placeholder.svg?key=w5746",
  },
  semi_annual: {
    name: "Semi-annual",
    surcharge: 0.1,
    discount: 0.15,
    description: "Deep cleaning twice a year",
    icon: "/placeholder.svg?key=1ap8i",
  },
  annually: {
    name: "Annual",
    surcharge: 0.15,
    discount: 0.2,
    description: "Annual deep cleaning service",
    icon: "/placeholder.svg?key=ixn7c",
  },
}

// Frequency options
const FREQUENCY_OPTIONS = [
  { value: "one_time", label: "One-time", discount: 0 },
  { value: "weekly", label: "Weekly", discount: 12 },
  { value: "biweekly", label: "Bi-weekly", discount: 8 },
  { value: "monthly", label: "Monthly", discount: 5 },
]

// Payment frequency configuration
const PAYMENT_FREQUENCIES = {
  per_service: {
    name: "Per Service",
    discount: 0,
    description: "Pay after each cleaning service",
  },
  monthly: {
    name: "Monthly",
    discount: 0.05,
    description: "Save 5% with convenient monthly billing",
  },
  yearly: {
    name: "Yearly",
    discount: 0.18,
    description: "Save 18% with annual payment",
  },
}

// Payment frequency options
const PAYMENT_OPTIONS = [
  { value: "per_service", label: "Pay per service", discount: 0 },
  { value: "monthly", label: "Monthly subscription", discount: 5 },
  { value: "yearly", label: "Annual subscription", discount: 18 },
]

// Cleanliness level descriptions
const CLEANLINESS_LEVELS = [
  {
    level: 1,
    name: "Lightly Soiled",
    description: "Regular maintenance cleaning for generally tidy spaces",
    multiplier: 1.0,
    image: "/placeholder.svg?key=lam21",
  },
  {
    level: 2,
    name: "Moderately Soiled",
    description: "Spaces that haven't been cleaned in a few weeks",
    multiplier: 1.3,
    image: "/placeholder.svg?key=43bfz",
  },
  {
    level: 3,
    name: "Heavily Soiled",
    description: "Spaces requiring intensive cleaning after long periods",
    multiplier: 1.7,
    image: "/placeholder.svg?key=5q7mn",
  },
  {
    level: 4,
    name: "Extremely Soiled",
    description: "Special services required, contact us for a custom quote",
    multiplier: 2.5,
    image: "/placeholder.svg?key=hete5",
  },
]

// Service types with detailed descriptions
const SERVICE_TYPES = {
  standard: {
    name: "Standard Cleaning",
    description:
      "Our standard cleaning service covers all the basics: dusting, vacuuming, mopping, and surface cleaning.",
    features: [
      "Dusting all accessible surfaces",
      "Vacuuming carpets and floors",
      "Mopping hard floors",
      "Cleaning bathroom fixtures",
      "Wiping kitchen counters and appliance exteriors",
      "Making beds (linens must be provided)",
      "Emptying trash bins",
    ],
    image: "/placeholder.svg?key=274s2",
  },
  detailing: {
    name: "Premium Detailing",
    description:
      "Our premium service includes everything in standard cleaning plus deep cleaning of fixtures, appliances, and hard-to-reach areas.",
    features: [
      "Everything in Standard Cleaning",
      "Deep cleaning of bathroom fixtures",
      "Inside of ovens and refrigerators",
      "Interior window cleaning",
      "Detailed baseboards and trim",
      "Cabinet fronts and drawer cleaning",
      "Light fixture cleaning",
      "Spot cleaning of walls",
    ],
    image: "/placeholder.svg?key=tjkx8",
  },
}

// Service fee
const SERVICE_FEE = 15

// Video recording discount
const VIDEO_DISCOUNT = 25

// Preset home configurations for quick selection
const HOME_PRESETS_OLD = [
  {
    id: "studio",
    name: "Studio Apartment",
    rooms: { bedroom: 1, bathroom: 1, kitchen: 1 },
    image: "/placeholder.svg?height=60&width=60&query=studio apartment floor plan",
  },
  {
    id: "one_bedroom",
    name: "1 Bedroom Apartment",
    rooms: { bedroom: 1, bathroom: 1, kitchen: 1, living_room: 1 },
    image: "/placeholder.svg?height=60&width=60&query=one bedroom apartment floor plan",
  },
  {
    id: "two_bedroom",
    name: "2 Bedroom Home",
    rooms: { bedroom: 2, bathroom: 1, kitchen: 1, living_room: 1, dining_room: 1 },
    image: "/placeholder.svg?height=60&width=60&query=two bedroom home floor plan",
  },
  {
    id: "family_home",
    name: "Family Home",
    rooms: { bedroom: 3, bathroom: 2, kitchen: 1, living_room: 1, dining_room: 1, office: 1 },
    image: "/placeholder.svg?height=60&width=60&query=family home floor plan",
  },
]

export function PricingWizard({
  onCalculationComplete,
  onStepChange,
  userPreferences = {},
  abTestVariant = "A",
  initialStep = 1,
}: PricingWizardProps) {
  // Wizard steps
  const [currentStep, setCurrentStep] = useState(initialStep)
  const totalSteps = 4

  // Room selection state
  const [rooms, setRooms] = useState<Record<string, number>>(
    userPreferences.lastSelectedRooms || {
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
    },
  )

  // Service configuration state
  const [frequency, setFrequency] = useState<keyof typeof FREQUENCIES>(
    (userPreferences.preferredFrequency as keyof typeof FREQUENCIES) || "one_time",
  )
  const [serviceType, setServiceType] = useState<"standard" | "detailing">(
    userPreferences.preferredServiceType || "standard",
  )
  const [cleanlinessLevel, setCleanlinessLevel] = useState(1)
  const [paymentFrequency, setPaymentFrequency] = useState<keyof typeof PAYMENT_FREQUENCIES>(
    (userPreferences.preferredPaymentFrequency as keyof typeof PAYMENT_FREQUENCIES) || "per_service",
  )
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  // UI state
  const [hasRooms, setHasRooms] = useState(false)
  const [highlightedOption, setHighlightedOption] = useState<string | null>(null)

  // Calculation results
  const [totalPrice, setTotalPrice] = useState(0)
  const [basePrice, setBasePrice] = useState(0)
  const [discounts, setDiscounts] = useState<Array<{ label: string; amount: number; percentage?: number }>>([])
  const [surcharges, setSurcharges] = useState<Array<{ label: string; amount: number; percentage?: number }>>([])
  const [isServiceAvailable, setIsServiceAvailable] = useState(true)

  const { toast } = useToast()

  // Refs to track if we need to call onStepChange
  const prevStepRef = useRef(currentStep)

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
        setBasePrice(0)
        setDiscounts([])
        setSurcharges([])
        setIsServiceAvailable(true)

        if (onCalculationComplete) {
          onCalculationComplete({
            rooms,
            frequency,
            totalPrice: 0,
            basePrice: 0,
            discounts: [],
            surcharges: [],
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
      const calculatedBasePrice = Object.entries(rooms).reduce((total, [roomType, count]) => {
        if (count <= 0) return total
        const roomConfig = ROOMS[roomType as keyof typeof ROOMS]
        if (!roomConfig) return total
        return total + count * roomConfig[serviceType]
      }, 0)

      setBasePrice(calculatedBasePrice)

      // Initialize price tracking variables
      let currentPrice = calculatedBasePrice
      const calculatedDiscounts: Array<{ label: string; amount: number; percentage?: number }> = []
      const calculatedSurcharges: Array<{ label: string; amount: number; percentage?: number }> = []

      // 2. Apply cleanliness level multiplier
      if (cleanlinessLevel > 1) {
        const multiplier = CLEANLINESS_LEVELS[cleanlinessLevel - 1].multiplier
        const surchargeAmount = calculatedBasePrice * (multiplier - 1)
        calculatedSurcharges.push({
          label: `${CLEANLINESS_LEVELS[cleanlinessLevel - 1].name} Cleanliness`,
          amount: surchargeAmount,
          percentage: Math.round((multiplier - 1) * 100),
        })
        currentPrice = calculatedBasePrice * multiplier
      }

      // 3. Apply frequency adjustments
      const freqConfig = FREQUENCIES[frequency]

      // Apply surcharge first
      if (freqConfig.surcharge > 0) {
        const surchargeAmount = currentPrice * freqConfig.surcharge
        calculatedSurcharges.push({
          label: `${freqConfig.name} Frequency Surcharge`,
          amount: surchargeAmount,
          percentage: Math.round(freqConfig.surcharge * 100),
        })
        currentPrice = currentPrice * (1 + freqConfig.surcharge)
      }

      // Then apply discount
      if (freqConfig.discount > 0) {
        const discountAmount = currentPrice * freqConfig.discount
        calculatedDiscounts.push({
          label: `${freqConfig.name} Frequency Discount`,
          amount: discountAmount,
          percentage: Math.round(freqConfig.discount * 100),
        })
        currentPrice = currentPrice * (1 - freqConfig.discount)
      }

      // 4. Apply payment frequency discount
      const paymentDiscount = PAYMENT_FREQUENCIES[paymentFrequency].discount
      if (paymentDiscount > 0) {
        const discountAmount = currentPrice * paymentDiscount
        calculatedDiscounts.push({
          label: `${PAYMENT_FREQUENCIES[paymentFrequency].name} Payment Discount`,
          amount: discountAmount,
          percentage: Math.round(paymentDiscount * 100),
        })
        currentPrice = currentPrice * (1 - paymentDiscount)
      }

      // 5. Apply video discount
      if (allowVideoRecording) {
        calculatedDiscounts.push({
          label: "Video Recording Discount",
          amount: VIDEO_DISCOUNT,
        })
        currentPrice -= VIDEO_DISCOUNT
      }

      // 6. Add service fee
      calculatedSurcharges.push({
        label: "Service Fee",
        amount: SERVICE_FEE,
      })
      currentPrice += SERVICE_FEE

      // Ensure proper currency formatting
      const finalPrice = Math.max(0, Math.round(currentPrice * 100) / 100)

      // Update state
      setTotalPrice(finalPrice)
      setDiscounts(calculatedDiscounts)
      setSurcharges(calculatedSurcharges)
      setIsServiceAvailable(serviceAvailable)

      // Call the onCalculationComplete callback if provided
      if (onCalculationComplete) {
        onCalculationComplete({
          rooms,
          frequency,
          totalPrice: finalPrice,
          basePrice: calculatedBasePrice,
          discounts: calculatedDiscounts,
          surcharges: calculatedSurcharges,
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
  }, [
    rooms,
    frequency,
    serviceType,
    cleanlinessLevel,
    paymentFrequency,
    allowVideoRecording,
    onCalculationComplete,
    toast,
  ])

  // Update parent component when step changes
  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      onStepChange(currentStep)
      prevStepRef.current = currentStep
    }
  }, [currentStep, onStepChange])

  const handleRoomChange = (room: string, value: number) => {
    setRooms((prev) => ({
      ...prev,
      [room]: Math.max(0, Math.floor(value)), // Ensure integer values
    }))

    // Highlight the changed option briefly
    setHighlightedOption(room)
    setTimeout(() => setHighlightedOption(null), 1500)

    // Track room selection for analytics
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track("Room Selected", {
        roomType: room,
        count: value,
        variant: abTestVariant,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Handle room count changes
  const handleRoomChange2 = (roomType: string, count: number) => {
    setRooms((prev) => ({
      ...prev,
      [roomType]: Math.max(0, count),
    }))

    // Clear preset selection when manually changing rooms
    setSelectedPreset(null)
  }

  const applyPreset = (presetId: string) => {
    const preset = HOME_PRESETS_OLD.find((p) => p.id === presetId)
    if (!preset) return

    // Reset all rooms first
    const resetRooms = Object.keys(rooms).reduce(
      (acc, room) => {
        acc[room] = 0
        return acc
      },
      {} as Record<string, number>,
    )

    // Apply preset rooms
    setRooms({
      ...resetRooms,
      ...preset.rooms,
    })

    setSelectedPreset(presetId)

    // Track preset selection for analytics
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track("Preset Selected", {
        presetId,
        presetName: preset.name,
        variant: abTestVariant,
        timestamp: new Date().toISOString(),
      })
    }

    toast({
      title: "Preset Applied",
      description: `${preset.name} configuration has been applied.`,
    })
  }

  // Handle preset selection
  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset)
    setRooms(HOME_PRESETS[preset as keyof typeof HOME_PRESETS].rooms)
  }

  // Calculate the price based on all selections
  const calculatePrice = () => {
    // Base price calculation
    let basePrice = 0
    Object.entries(rooms).forEach(([roomType, count]) => {
      const room = ROOM_TYPES[roomType as keyof typeof ROOM_TYPES]
      if (room) {
        basePrice += room.basePrice[serviceType] * count
      }
    })

    // Add service fee
    basePrice += 15

    // Initialize discounts and surcharges arrays
    const discounts = []
    const surcharges = []

    // Apply cleanliness level surcharge
    let cleanlinessMultiplier = 1
    if (cleanlinessLevel > 1) {
      const surchargePercentage = cleanlinessLevel === 2 ? 30 : cleanlinessLevel === 3 ? 70 : 150
      cleanlinessMultiplier = 1 + surchargePercentage / 100
      surcharges.push({
        label: `Cleanliness Level (${cleanlinessLevel})`,
        amount: basePrice * (surchargePercentage / 100),
        percentage: surchargePercentage,
      })
    }

    // Apply frequency discount
    const frequencyOption = FREQUENCY_OPTIONS.find((option) => option.value === frequency)
    let frequencyDiscount = 0
    if (frequencyOption && frequencyOption.discount > 0) {
      frequencyDiscount = frequencyOption.discount / 100
      discounts.push({
        label: `${frequencyOption.label} Frequency`,
        amount: basePrice * frequencyDiscount,
        percentage: frequencyOption.discount,
      })
    }

    // Apply payment frequency discount
    const paymentOption = PAYMENT_OPTIONS.find((option) => option.value === paymentFrequency)
    let paymentDiscount = 0
    if (paymentOption && paymentOption.discount > 0) {
      paymentDiscount = paymentOption.discount / 100
      discounts.push({
        label: `${paymentOption.label}`,
        amount: basePrice * paymentDiscount,
        percentage: paymentOption.discount,
      })
    }

    // Apply video recording discount
    if (allowVideoRecording) {
      discounts.push({
        label: "Video Recording Discount",
        amount: 25,
      })
    }

    // Calculate total price
    let totalPrice = basePrice * cleanlinessMultiplier

    // Apply frequency discount
    totalPrice *= 1 - frequencyDiscount

    // Apply payment discount
    totalPrice *= 1 - paymentDiscount

    // Apply video recording discount
    if (allowVideoRecording) {
      totalPrice -= 25
    }

    // Check if service is available (extreme soiling with standard cleaning is not available)
    const isServiceAvailable = !(cleanlinessLevel >= 3 && serviceType === "standard")

    // Round to 2 decimal places
    totalPrice = Math.round(totalPrice * 100) / 100

    // Send the calculated data to the parent component
    onCalculationComplete({
      rooms,
      frequency,
      totalPrice,
      basePrice,
      discounts,
      surcharges,
      serviceType,
      cleanlinessLevel,
      isServiceAvailable,
      paymentFrequency,
      allowVideoRecording,
    })
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)

      // Only notify parent component when step changes due to user interaction
      if (onStepChange) {
        onStepChange(newStep)
      }

      // Track step progression for analytics
      if (typeof window !== "undefined" && window.analytics) {
        window.analytics.track("Pricing Step Viewed", {
          step: newStep,
          variant: abTestVariant,
          timestamp: new Date().toISOString(),
        })
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)

      // Only notify parent component when step changes due to user interaction
      if (onStepChange) {
        onStepChange(newStep)
      }

      // Track step progression for analytics
      if (typeof window !== "undefined" && window.analytics) {
        window.analytics.track("Pricing Step Viewed", {
          step: newStep,
          variant: abTestVariant,
          timestamp: new Date().toISOString(),
        })
      }
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step)
    }
  }

  // Check if we can proceed to the next step
  const canProceed = () => {
    if (currentStep === 1) {
      // Can only proceed if at least one room is selected
      return Object.values(rooms).some((count) => count > 0)
    }
    return true
  }

  // Group rooms by type for better organization
  const roomGroups = {
    Bedrooms: ["master_bedroom", "bedroom", "guest_room"],
    "Common Areas": ["living_room", "dining_room", "office", "playroom", "sunroom"],
    "Utility Rooms": ["kitchen", "bathroom", "laundry_room", "mudroom", "garage"],
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Home className="mr-2 h-5 w-5 text-primary" />
              Step 1: Select Your Rooms
            </h3>

            {/* Home Presets */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">Quick Start with Home Presets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {HOME_PRESETS_OLD.map((preset) => (
                  <motion.div key={preset.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={`cursor-pointer transition-all h-full ${
                        selectedPreset === preset.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => applyPreset(preset.id)}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="mb-2 relative w-12 h-12">
                          <Image
                            src={preset.image || "/placeholder.svg"}
                            alt={preset.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <h5 className="font-medium text-sm">{preset.name}</h5>
                        <p className="text-xs text-gray-500 mt-1">
                          {Object.entries(preset.rooms)
                            .map(([room, count]) => `${count}× ${ROOMS[room as keyof typeof ROOMS]?.name || room}`)
                            .join(", ")}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Room Selection */}
            {Object.entries(roomGroups).map(([groupName, roomKeys]) => (
              <div key={groupName} className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">{groupName}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                            <div className="flex items-center mb-2">
                              <div className="relative w-8 h-8 mr-3 flex-shrink-0">
                                <Image
                                  src={room.icon || "/placeholder.svg"}
                                  alt={room.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <h5 className="font-medium">{room.name}</h5>
                                <p className="text-xs text-gray-500">{formatCurrency(room[serviceType])}</p>
                              </div>
                            </div>

                            <p className="text-xs text-gray-500 mb-3">{room.description}</p>

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
          </div>
        )

      case 2:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Step 2: Choose Service Type
            </h3>

            {/* Service Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {Object.entries(SERVICE_TYPES).map(([type, config]) => (
                <motion.div key={type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all h-full ${
                      serviceType === type ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => {
                      setServiceType(type as "standard" | "detailing")
                      setHighlightedOption(`service-${type}`)
                      setTimeout(() => setHighlightedOption(null), 1500)

                      // Track service type selection for analytics
                      if (typeof window !== "undefined" && window.analytics) {
                        window.analytics.track("Service Type Selected", {
                          serviceType: type,
                          variant: abTestVariant,
                          timestamp: new Date().toISOString(),
                        })
                      }
                    }}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="relative w-16 h-16 mr-4 flex-shrink-0">
                          <Image
                            src={config.image || "/placeholder.svg"}
                            alt={config.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold">{config.name}</h4>
                          {type === "standard" ? (
                            <Badge variant="outline" className="bg-primary/10">
                              Base Rate
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800">
                              +80% Rate
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mb-4">{config.description}</p>

                      <div className="mt-auto">
                        <h5 className="font-medium text-sm mb-2">Includes:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {config.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-3 w-3 text-green-500 mr-2 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-xs">
                                See all features
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="w-64">
                              <ul className="text-xs space-y-1">
                                {config.features.map((feature, index) => (
                                  <li key={index} className="flex items-start">
                                    <Check className="h-3 w-3 text-green-500 mr-2 mt-0.5" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Cleanliness Level Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-medium">Cleanliness Level</h4>
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {CLEANLINESS_LEVELS.map((level) => (
                  <motion.div key={level.level} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={`cursor-pointer transition-all h-full ${
                        cleanlinessLevel === level.level ? "ring-2 ring-primary" : ""
                      } ${level.level === 4 || (serviceType === "standard" && level.level > 2) ? "opacity-60" : ""}`}
                      onClick={() => {
                        setCleanlinessLevel(level.level)
                        setHighlightedOption(`cleanliness-${level.level}`)
                        setTimeout(() => setHighlightedOption(null), 1500)

                        // Track cleanliness level selection for analytics
                        if (typeof window !== "undefined" && window.analytics) {
                          window.analytics.track("Cleanliness Level Selected", {
                            level: level.level,
                            levelName: level.name,
                            variant: abTestVariant,
                            timestamp: new Date().toISOString(),
                          })
                        }
                      }}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="relative w-12 h-12 mb-2">
                          <Image
                            src={level.image || "/placeholder.svg"}
                            alt={level.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <h5 className="font-medium">{level.name}</h5>
                        <p className="text-xs text-gray-500 mt-1">{level.description}</p>

                        {level.multiplier > 1 && (
                          <Badge className="mt-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                            +{Math.round((level.multiplier - 1) * 100)}% Rate
                          </Badge>
                        )}

                        {(level.level === 4 || (serviceType === "standard" && level.level > 2)) && (
                          <p className="text-xs text-red-500 mt-2">Requires custom quote</p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {(cleanlinessLevel === 4 || (serviceType === "standard" && cleanlinessLevel > 2)) && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 text-sm rounded-r">
                  <p>This combination is not available for online booking. Please contact us for a custom quote.</p>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Step 3: Select Cleaning Frequency
            </h3>

            {/* Frequency Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(FREQUENCIES).map(([freq, config]) => (
                <motion.div key={freq} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all h-full ${frequency === freq ? "ring-2 ring-primary" : ""}`}
                    onClick={() => {
                      setFrequency(freq as keyof typeof FREQUENCIES)
                      setHighlightedOption(`freq-${freq}`)
                      setTimeout(() => setHighlightedOption(null), 1500)

                      // Track frequency selection for analytics
                      if (typeof window !== "undefined" && window.analytics) {
                        window.analytics.track("Frequency Selected", {
                          frequency: freq,
                          frequencyName: config.name,
                          variant: abTestVariant,
                          timestamp: new Date().toISOString(),
                        })
                      }
                    }}
                  >
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex items-center mb-3">
                        <div className="relative w-10 h-10 mr-3 flex-shrink-0">
                          <Image
                            src={config.icon || "/placeholder.svg"}
                            alt={config.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <h4 className="font-medium">{config.name}</h4>
                      </div>

                      <p className="text-xs text-gray-500 mb-4">{config.description}</p>

                      <div className="mt-auto flex flex-wrap gap-2">
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

            {/* Payment Frequency */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-medium">Payment Frequency</h4>
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

              <RadioGroup
                value={paymentFrequency}
                onValueChange={(value) => {
                  setPaymentFrequency(value as keyof typeof PAYMENT_FREQUENCIES)

                  // Track payment frequency selection for analytics
                  if (typeof window !== "undefined" && window.analytics) {
                    window.analytics.track("Payment Frequency Selected", {
                      paymentFrequency: value,
                      paymentFrequencyName: PAYMENT_FREQUENCIES[value as keyof typeof PAYMENT_FREQUENCIES].name,
                      variant: abTestVariant,
                      timestamp: new Date().toISOString(),
                    })
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {Object.entries(PAYMENT_FREQUENCIES).map(([payFreq, config]) => (
                  <div key={payFreq}>
                    <Card
                      className={`cursor-pointer transition-all ${paymentFrequency === payFreq ? "ring-2 ring-primary" : ""}`}
                    >
                      <CardContent className="p-4 flex items-start">
                        <RadioGroupItem value={payFreq} id={`payment-${payFreq}`} className="mt-1 mr-3" />
                        <div>
                          <Label htmlFor={`payment-${payFreq}`} className="font-medium cursor-pointer">
                            {config.name}
                          </Label>
                          <p className="text-xs text-gray-500 mt-1">{config.description}</p>

                          {config.discount > 0 && (
                            <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              Save {Math.round(config.discount * 100)}%
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Step 4: Additional Options
            </h3>

            {/* Video Recording Option */}
            <Card className={`mb-6 ${highlightedOption === "video-recording" ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Checkbox
                    id="allow-video"
                    checked={allowVideoRecording}
                    onCheckedChange={(checked) => {
                      setAllowVideoRecording(checked === true)
                      setHighlightedOption("video-recording")
                      setTimeout(() => setHighlightedOption(null), 1500)

                      // Track video recording option selection for analytics
                      if (typeof window !== "undefined" && window.analytics) {
                        window.analytics.track("Video Recording Option Selected", {
                          allowVideoRecording: checked === true,
                          variant: abTestVariant,
                          timestamp: new Date().toISOString(),
                        })
                      }
                    }}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <Label
                      htmlFor="allow-video"
                      className="text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      Allow video recording of cleaning for quality control
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      We may record parts of the cleaning process for training and quality control purposes. You'll
                      receive a discount for allowing this.
                    </p>

                    <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Save ${VIDEO_DISCOUNT}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card className="bg-gray-50 dark:bg-gray-800/50 mb-6">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Your Cleaning Service Summary</h4>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Rooms:</span>
                    <span className="font-medium">
                      {Object.entries(rooms)
                        .filter(([_, count]) => count > 0)
                        .map(([room, count]) => `${count}× ${ROOMS[room as keyof typeof ROOMS]?.name || room}`)
                        .join(", ") || "None selected"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Service Type:</span>
                    <span className="font-medium">
                      {serviceType === "standard" ? "Standard Cleaning" : "Premium Detailing"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Cleanliness Level:</span>
                    <span className="font-medium">{CLEANLINESS_LEVELS[cleanlinessLevel - 1].name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Frequency:</span>
                    <span className="font-medium">{FREQUENCIES[frequency].name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Payment Plan:</span>
                    <span className="font-medium">{PAYMENT_FREQUENCIES[paymentFrequency].name}</span>
                  </div>

                  {allowVideoRecording && (
                    <div className="flex justify-between items-center">
                      <span>Video Recording:</span>
                      <span className="font-medium text-green-600">Allowed (-${VIDEO_DISCOUNT})</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Completion Message */}
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium text-lg mb-1">Configuration Complete!</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your cleaning service has been configured. Review your selections and add to cart when ready.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {/* Progress Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4">
        <div className="flex justify-between items-center text-sm mb-2">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>
            {currentStep === 1
              ? "Rooms"
              : currentStep === 2
                ? "Service Type"
                : currentStep === 3
                  ? "Frequency"
                  : "Options"}
          </span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>

      {/* Step indicators */}
      <div className="flex border-b">
        {[1, 2, 3, 4].map((step) => (
          <button
            key={step}
            onClick={() => goToStep(step)}
            className={`flex-1 py-3 px-4 text-center relative ${
              currentStep === step
                ? "text-primary font-medium"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            disabled={step > 1 && !canProceed()}
          >
            <div className="flex items-center justify-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 ${
                  currentStep === step
                    ? "bg-primary text-white"
                    : step < currentStep
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              <span className="hidden sm:inline">
                {step === 1 ? "Rooms" : step === 2 ? "Service Type" : step === 3 ? "Cleanliness" : "Frequency"}
              </span>
            </div>
            {currentStep === step && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Room Selection */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-4">Select Your Rooms</h3>

              {/* Home presets */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Quick Select Home Type</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(HOME_PRESETS).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant={selectedPreset === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePresetSelect(key)}
                      className="justify-start"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Room selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(ROOM_TYPES).map(([roomType, room]) => {
                  const count = rooms[roomType] || 0
                  const RoomIcon = room.icon

                  return (
                    <Card key={roomType} className={`overflow-hidden ${count > 0 ? "border-primary/50" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <RoomIcon className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-medium">{room.label}</span>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Standard: ${room.basePrice.standard}/room</p>
                                <p>Premium: ${room.basePrice.detailing}/room</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRoomChange2(roomType, count - 1)}
                            disabled={count === 0}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="font-medium text-lg w-8 text-center">{count}</span>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRoomChange2(roomType, count + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {!canProceed() && (
                <p className="text-amber-600 dark:text-amber-400 text-sm mt-4">
                  Please select at least one room to continue.
                </p>
              )}
            </motion.div>
          )}

          {/* Step 2: Service Type */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-4">Select Service Type</h3>

              <RadioGroup
                value={serviceType}
                onValueChange={(value) => setServiceType(value as "standard" | "detailing")}
                className="space-y-4"
              >
                <div
                  className={`relative rounded-lg border p-4 ${serviceType === "standard" ? "border-primary bg-primary/5" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                  <RadioGroupItem value="standard" id="standard" className="absolute right-4 top-4" />
                  <Label htmlFor="standard" className="flex flex-col cursor-pointer">
                    <span className="text-lg font-medium">Standard Cleaning</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Our regular cleaning service covers all the basics for a clean home.
                    </span>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Dusting surfaces</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Vacuuming floors</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Bathroom cleaning</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Kitchen surfaces</span>
                      </div>
                    </div>
                  </Label>
                </div>

                <div
                  className={`relative rounded-lg border p-4 ${serviceType === "detailing" ? "border-primary bg-primary/5" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                  <RadioGroupItem value="detailing" id="detailing" className="absolute right-4 top-4" />
                  <Label htmlFor="detailing" className="flex flex-col cursor-pointer">
                    <div className="flex items-center">
                      <span className="text-lg font-medium">Premium Detailing</span>
                      <span className="ml-2 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full">
                        +80% cost
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      A thorough deep cleaning service that covers hard-to-reach areas and fixtures.
                    </span>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Everything in Standard</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Inside appliances</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Deep fixture cleaning</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Hard-to-reach areas</span>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </motion.div>
          )}

          {/* Step 3: Cleanliness Level */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-4">Current Cleanliness Level</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Help us understand the current state of your space so we can allocate the right resources.
              </p>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">
                      Cleanliness Level:{" "}
                      {cleanlinessLevel === 1
                        ? "Lightly Soiled"
                        : cleanlinessLevel === 2
                          ? "Moderately Soiled"
                          : cleanlinessLevel === 3
                            ? "Heavily Soiled"
                            : "Extremely Soiled"}
                    </span>
                    {cleanlinessLevel > 1 && (
                      <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full">
                        +{cleanlinessLevel === 2 ? "30" : cleanlinessLevel === 3 ? "70" : "150"}% surcharge
                      </span>
                    )}
                  </div>

                  <Slider
                    value={[cleanlinessLevel]}
                    min={1}
                    max={4}
                    step={1}
                    onValueChange={(value) => setCleanlinessLevel(value[0])}
                    className="mb-6"
                  />

                  <div className="grid grid-cols-4 gap-2 text-xs text-center">
                    <div>Lightly Soiled</div>
                    <div>Moderately Soiled</div>
                    <div>Heavily Soiled</div>
                    <div>Extremely Soiled</div>
                  </div>
                </div>

                {cleanlinessLevel >= 3 && serviceType === "standard" && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 text-sm">
                    <strong>Note:</strong> For heavily or extremely soiled conditions, we recommend our Premium
                    Detailing service. Standard cleaning may not be sufficient.
                  </div>
                )}

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">Cleanliness Level Descriptions</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Lightly Soiled:</strong> Regular maintenance cleaning, minimal dirt/dust.
                    </li>
                    <li>
                      <strong>Moderately Soiled:</strong> 2-3 weeks without cleaning, visible dust/dirt.
                    </li>
                    <li>
                      <strong>Heavily Soiled:</strong> 1+ months without cleaning, stubborn stains.
                    </li>
                    <li>
                      <strong>Extremely Soiled:</strong> Long-term neglect, requires intensive cleaning.
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Frequency & Options */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium mb-4">Service Frequency & Options</h3>

              <div className="space-y-6">
                {/* Frequency selection */}
                <div>
                  <h4 className="text-sm font-medium mb-2">How often would you like cleaning service?</h4>
                  <RadioGroup value={frequency} onValueChange={setFrequency} className="grid grid-cols-2 gap-2">
                    {FREQUENCY_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className={`relative rounded-lg border p-3 ${frequency === option.value ? "border-primary bg-primary/5" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`frequency-${option.value}`}
                          className="absolute right-2 top-2"
                        />
                        <Label htmlFor={`frequency-${option.value}`} className="flex flex-col cursor-pointer">
                          <span className="font-medium">{option.label}</span>
                          {option.discount > 0 && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              {option.discount}% discount
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Payment frequency */}
                {frequency !== "one_time" && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Payment Frequency</h4>
                    <RadioGroup value={paymentFrequency} onValueChange={setPaymentFrequency} className="space-y-2">
                      {PAYMENT_OPTIONS.map((option) => (
                        <div
                          key={option.value}
                          className={`relative rounded-lg border p-3 ${paymentFrequency === option.value ? "border-primary bg-primary/5" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`payment-${option.value}`}
                            className="absolute right-2 top-2"
                          />
                          <Label htmlFor={`payment-${option.value}`} className="flex flex-col cursor-pointer">
                            <span className="font-medium">{option.label}</span>
                            {option.discount > 0 && (
                              <span className="text-xs text-green-600 dark:text-green-400">
                                {option.discount}% additional discount
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Additional options */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Additional Options</h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="video-recording"
                        checked={allowVideoRecording}
                        onCheckedChange={(checked) => setAllowVideoRecording(checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="video-recording" className="text-sm font-medium">
                          Allow Video Recording
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow our cleaners to record the cleaning process for quality assurance and get a $25
                          discount.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between p-4 border-t bg-gray-50 dark:bg-gray-800/50">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {currentStep < 4 ? (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                // Final step - we're done
                // This would typically submit the form or finalize the process
              }}
              variant="default"
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
