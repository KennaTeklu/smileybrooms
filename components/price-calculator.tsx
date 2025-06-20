"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect, useCallback } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Home,
  Star,
  Zap,
  Shield,
  Bath,
  Utensils,
  Sofa,
  BookOpen,
  WashingMachineIcon as Laundry,
  DoorOpen,
  Waypoints,
  StepBackIcon as Stairs,
  Lightbulb,
  Droplet,
  FlaskConical,
  Leaf,
  CheckCircle2,
  Info,
  Trash2,
  Minus,
  Plus,
} from "lucide-react" // Added Check, Star, Zap, Shield
import { roomConfig } from "@/lib/room-config"
import { cn } from "@/lib/utils"
import { usePricing } from "@/contexts/pricing-context" // Import the context
import {
  BASE_ROOM_RATES,
  SERVICE_TIERS,
  CLEANLINESS_DIFFICULTY,
  STRATEGIC_ADDONS,
  PREMIUM_EXCLUSIVE_SERVICES,
} from "@/lib/pricing-config" // Import pricing data
import type { ServiceTierId, CleanlinessLevelId } from "@/lib/pricing-config" // Import types
import { Badge } from "@/components/ui/badge" // Import Badge for "Most Popular"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { EnhancedRoomCustomizationPanel } from "./enhanced-room-customization-panel"
import { ServiceSummaryCard } from "./service-summary-card"
import { CollapsibleAddAllPanel } from "./collapsible-add-all-panel"
import { CollapsibleSharePanel } from "./collapsible-share-panel"
import { CollapsibleChatbotPanel } from "./collapsible-chatbot-panel"
import { useUserSegment } from "@/hooks/use-user-segment"
import { useFeatureFlag } from "@/hooks/use-feature-flag"
import { useAnalytics } from "@/hooks/use-analytics"
import { PersonalizedMessage } from "./personalized-message"
import { usePricingContext } from "@/contexts/pricing-context"

// Define the types for the calculator props
interface PriceCalculatorProps {
  onCalculationComplete?: (data: {
    rooms: Record<string, number>
    frequency: string
    firstServicePrice: number
    recurringServicePrice: number
    serviceType: ServiceTierId // Changed type
    cleanlinessLevel: CleanlinessLevelId // Changed type
    priceMultiplier: number
    isServiceAvailable: boolean
    addressId: string
    paymentFrequency: "per_service" | "monthly" | "yearly"
    isRecurring: boolean
    recurringInterval: "week" | "month" | "year"
  }) => void
  onAddToCart?: () => void
}

interface RoomConfig {
  roomName: string
  roomType: string
  roomIcon: string
  count: number
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  cleanlinessLevel: string
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  reductionsPrice: number
  totalPrice: number
}

const ROOM_ICONS: { [key: string]: React.ReactNode } = {
  bedroom: <Home />,
  bathroom: <Bath />,
  kitchen: <Utensils />,
  livingRoom: <Sofa />,
  diningRoom: <BookOpen />,
  homeOffice: <Laptop />,
  laundryRoom: <Laundry />,
  entryway: <DoorOpen />,
  hallway: <Waypoints />,
  stairs: <Stairs />,
}

const CLEANLINESS_ICONS: { [key: string]: React.ReactNode } = {
  LIGHT: <Lightbulb className="h-4 w-4 text-green-500" />,
  MEDIUM: <Droplet className="h-4 w-4 text-yellow-500" />,
  HEAVY: <FlaskConical className="h-4 w-4 text-orange-500" />,
  BIOHAZARD: <Leaf className="h-4 w-4 text-red-500" />,
}

const FREQUENCY_DISCOUNTS: { [key: string]: number } = {
  one_time: 0,
  weekly: 0.15,
  biweekly: 0.1,
  monthly: 0.05,
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

// Define task counts for each tier
const TIER_TASK_COUNTS = {
  standard: 20, // Example: 20+ point checklist
  premium: 70, // Example: 70+ point checklist
  elite: 120, // Example: 120+ point checklist
}

// Define time estimates for each tier
const TIER_TIME_ESTIMATES = {
  standard: "15-20 min",
  premium: "45-60 min",
  elite: "90-120 min",
}

// Define guarantees for each tier
const TIER_GUARANTEES = {
  standard: "7-day",
  premium: "30-day",
  elite: "1-year",
}

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
  const { cart, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart } = useCart()
  const { toast } = useToast()
  const { trackEvent } = useAnalytics()
  const { userSegment } = useUserSegment()
  const isPersonalizedPricingEnabled = useFeatureFlag("personalizedPricing")
  const isDynamicPricingEnabled = useFeatureFlag("dynamicPricing")
  const isUpsellEnabled = useFeatureFlag("upsellFeatures")
  const isChatbotEnabled = useFeatureFlag("chatbotIntegration")

  const { state, dispatch, isCalculating } = usePricing() // Destructure isCalculating
  const {
    serviceTier,
    selectedRooms,
    cleanlinessLevel,
    frequency,
    paymentFrequency,
    calculatedPrice,
    enforcedTierReason,
    selectedAddons,
    selectedExclusiveServices,
  } = state

  const {
    roomConfigs,
    setRoomConfigs,
    selectedFrequency,
    setSelectedFrequency,
    setCleanlinessLevel,
    selectedReductions,
    setSelectedReductions,
    selectedAddOns,
    setSelectedAddOns,
  } = usePricingContext()

  const [isCustomizationPanelOpen, setIsCustomizationPanelOpen] = useState(false)
  const [currentRoomToCustomize, setCurrentRoomToCustomize] = useState<RoomConfig | null>(null)

  const [showAddAllPanel, setShowAddAllPanel] = useState(false)
  const [showSharePanel, setShowSharePanel] = useState(false)
  const [showChatbotPanel, setShowChatbotPanel] = useState(false)

  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (isInitialLoad) {
      // Initialize room configs based on BASE_ROOM_RATES keys
      const initialConfigs: RoomConfig[] = Object.keys(BASE_ROOM_RATES)
        .filter((key) => key !== "default") // Exclude 'default' from initial rooms
        .map((roomType) => ({
          roomName: roomType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
          roomType: roomType,
          roomIcon: ROOM_ICONS[roomType] || <Home />,
          count: 0,
          selectedTier: SERVICE_TIERS.STANDARD.name,
          selectedAddOns: [],
          selectedReductions: [],
          cleanlinessLevel: CLEANLINESS_DIFFICULTY.LIGHT.name,
          basePrice: BASE_ROOM_RATES[roomType as keyof typeof BASE_ROOM_RATES].standard,
          tierUpgradePrice: 0,
          addOnsPrice: 0,
          reductionsPrice: 0,
          totalPrice: BASE_ROOM_RATES[roomType as keyof typeof BASE_ROOM_RATES].standard,
        }))
      setRoomConfigs(initialConfigs)
      setIsInitialLoad(false)
    }
  }, [isInitialLoad, setRoomConfigs])

  const calculateRoomPrice = useCallback((config: RoomConfig) => {
    const tier = SERVICE_TIERS[config.selectedTier.toUpperCase() as keyof typeof SERVICE_TIERS]
    const cleanliness =
      CLEANLINESS_DIFFICULTY[config.cleanlinessLevel.toUpperCase() as keyof typeof CLEANLINESS_DIFFICULTY]
    const baseRate =
      BASE_ROOM_RATES[config.roomType as keyof typeof BASE_ROOM_RATES]?.[
        tier.id as keyof (typeof BASE_ROOM_RATES)["bedroom"]
      ] || BASE_ROOM_RATES.default[tier.id as keyof (typeof BASE_ROOM_RATES)["bedroom"]]

    let price =
      baseRate * cleanliness.multipliers[tier.id as keyof (typeof CLEANLINESS_DIFFICULTY)["LIGHT"]["multipliers"]]

    // Add-ons (now global, but still calculated per room for display if needed)
    const currentAddOnsPrice = config.selectedAddOns.reduce((sum, addOnId) => {
      const addOn =
        STRATEGIC_ADDONS.find((a) => a.id === addOnId) || PREMIUM_EXCLUSIVE_SERVICES.find((a) => a.id === addOnId)
      return sum + (addOn ? (addOn.prices ? addOn.prices[tier.id as keyof typeof addOn.prices] : addOn.price) : 0)
    }, 0)

    // Reductions (now global, but still calculated per room for display if needed)
    const currentReductionsPrice = config.selectedReductions.reduce((sum, reductionId) => {
      // Placeholder for reduction logic, assuming a fixed amount for now
      return sum + 10 // Example reduction
    }, 0)

    price += currentAddOnsPrice - currentReductionsPrice

    return {
      basePrice: baseRate,
      tierUpgradePrice: baseRate * tier.multiplier - baseRate, // This needs to be re-evaluated based on actual tier pricing
      addOnsPrice: currentAddOnsPrice,
      reductionsPrice: currentReductionsPrice,
      totalPrice: Math.max(0, price),
    }
  }, [])

  useEffect(() => {
    // Recalculate prices for all rooms when cleanliness level changes
    setRoomConfigs((prevConfigs) =>
      prevConfigs.map((config) => {
        const updatedPrices = calculateRoomPrice({ ...config, cleanlinessLevel })
        return { ...config, ...updatedPrices, cleanlinessLevel }
      }),
    )
  }, [cleanlinessLevel, calculateRoomPrice, setRoomConfigs])

  const handleRoomCountChange = (roomType: string, change: number) => {
    setRoomConfigs((prevConfigs) =>
      prevConfigs.map((config) => {
        if (config.roomType === roomType) {
          const newCount = Math.max(0, config.count + change)
          return { ...config, count: newCount }
        }
        return config
      }),
    )
  }

  const handleCustomizeRoom = (room: RoomConfig) => {
    setCurrentRoomToCustomize(room)
    setIsCustomizationPanelOpen(true)
  }

  const handleRoomConfigChange = (updatedConfig: RoomConfig) => {
    setRoomConfigs((prevConfigs) =>
      prevConfigs.map((config) =>
        config.roomType === updatedConfig.roomType
          ? { ...updatedConfig, ...calculateRoomPrice(updatedConfig) }
          : config,
      ),
    )
    setCurrentRoomToCustomize(null)
    setIsCustomizationPanelOpen(false)
  }

  const handleAddAllRoomsToCart = () => {
    clearCart() // Clear existing items before adding all
    let itemsAdded = 0
    roomConfigs.forEach((room) => {
      if (room.count > 0) {
        const itemPrice = room.totalPrice // Price per room
        addItemToCart({
          id: room.roomType,
          name: `${room.roomName} (${room.selectedTier})`,
          price: itemPrice,
          quantity: room.count,
          sourceSection: "Room Customization",
          metadata: {
            roomType: room.roomType,
            roomName: room.roomName,
            selectedTier: room.selectedTier,
            cleanlinessLevel: room.cleanlinessLevel,
            selectedAddOns: room.selectedAddOns,
            selectedReductions: room.selectedReductions,
            frequency: selectedFrequency, // Add global frequency to metadata
          },
        })
        itemsAdded++
      }
    })

    if (itemsAdded > 0) {
      toast({
        title: "All selected rooms added to cart!",
        description: `You've added ${itemsAdded} room types to your cart.`,
      })
      trackEvent("add_all_rooms_to_cart", { num_room_types: itemsAdded, total_items: cart.items.length + itemsAdded })
    } else {
      toast({
        title: "No rooms selected",
        description: "Please select at least one room to add to your cart.",
        variant: "destructive",
      })
    }
    setShowAddAllPanel(false)
  }

  const totalRoomsSelected = roomConfigs.reduce((sum, room) => sum + room.count, 0)
  const subtotal = roomConfigs.reduce((sum, room) => sum + room.totalPrice * room.count, 0)

  const applyFrequencyDiscount = (price: number) => {
    const discountRate = FREQUENCY_DISCOUNTS[selectedFrequency] || 0
    return price * (1 - discountRate)
  }

  const finalPrice = applyFrequencyDiscount(subtotal)

  const getCleanlinessDescription = (level: string) => {
    const cleanliness = CLEANLINESS_DIFFICULTY[level.toUpperCase() as keyof typeof CLEANLINESS_DIFFICULTY]
    return cleanliness ? cleanliness.name : "Unknown"
  }

  const getCleanlinessTooltip = (level: string) => {
    switch (level) {
      case CLEANLINESS_DIFFICULTY.LIGHT.name:
        return "Light cleaning for regularly maintained homes."
      case CLEANLINESS_DIFFICULTY.MEDIUM.name:
        return "Medium cleaning for homes needing a bit more attention."
      case CLEANLINESS_DIFFICULTY.HEAVY.name:
        return "Heavy cleaning for homes with significant dirt or grime."
      case CLEANLINESS_DIFFICULTY.BIOHAZARD.name:
        return "Specialized cleaning for biohazard situations (e.g., mold, extreme filth)."
      default:
        return ""
    }
  }

  // Media query for responsive design (kept for potential future use, though not directly used in this phase's logic)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Effect to call onCalculationComplete when relevant state changes
  useEffect(() => {
    if (onCalculationComplete && calculatedPrice) {
      const selectedFrequencyOption = frequencyOptions.find((f) => f.id === frequency)
      onCalculationComplete({
        rooms: selectedRooms,
        frequency,
        firstServicePrice: calculatedPrice.firstServicePrice,
        recurringServicePrice: calculatedPrice.recurringServicePrice,
        serviceType: serviceTier,
        cleanlinessLevel: cleanlinessLevel,
        priceMultiplier: CLEANLINESS_DIFFICULTY[cleanlinessLevel].multipliers[serviceTier],
        isServiceAvailable: true, // Worker will determine availability, for now assume true if no error
        addressId: "custom", // This would be replaced with actual address ID in a real implementation
        paymentFrequency: paymentFrequency as "per_service" | "monthly" | "yearly",
        isRecurring: selectedFrequencyOption?.isRecurring || false,
        recurringInterval: selectedFrequencyOption?.recurringInterval as "week" | "month" | "year",
      })
    }
  }, [
    selectedRooms,
    frequency,
    paymentFrequency,
    serviceTier,
    cleanlinessLevel,
    calculatedPrice,
    onCalculationComplete,
  ])

  // Function to check if any rooms are selected
  const hasSelectedRooms = () => {
    return Object.values(selectedRooms).some((count) => count > 0)
  }

  // Get cleanliness level options from pricing-config
  const cleanlinessOptions = Object.values(CLEANLINESS_DIFFICULTY).map((level) => ({
    id: level.level,
    label: level.name,
    multiplier: level.multipliers[serviceTier],
  }))

  // Calculate total rooms selected

  // Function to render tier comparison table
  const renderTierComparisonTable = () => {
    const getTierIcon = (tierId: ServiceTierId) => {
      if (tierId === "standard") return <Shield className="h-4 w-4 text-blue-600" />
      if (tierId === "premium") return <Star className="h-4 w-4 text-purple-600" />
      if (tierId === "elite") return <Zap className="h-4 w-4 text-green-600" />
      return null
    }

    return (
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2"></th>
              {Object.values(SERVICE_TIERS).map((tier) => (
                <th key={tier.id} className="text-center py-2">
                  <div className="flex items-center justify-center gap-1">
                    {getTierIcon(tier.id as ServiceTierId)}
                    <span>{tier.name}</span>
                    {tier.id === "premium" && <Badge className="ml-1 bg-green-500">Popular</Badge>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-medium">Tasks/Room</td>
              <td className="text-center py-2">{TIER_TASK_COUNTS.standard}+</td>
              <td className="text-center py-2">{TIER_TASK_COUNTS.premium}+</td>
              <td className="text-center py-2">{TIER_TASK_COUNTS.elite}+</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Time/Room</td>
              <td className="text-center py-2">{TIER_TIME_ESTIMATES.standard}</td>
              <td className="text-center py-2">{TIER_TIME_ESTIMATES.premium}</td>
              <td className="text-center py-2">{TIER_TIME_ESTIMATES.elite}</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Guarantee</td>
              <td className="text-center py-2">{TIER_GUARANTEES.standard}</td>
              <td className="text-center py-2">{TIER_GUARANTEES.premium}</td>
              <td className="text-center py-2">{TIER_GUARANTEES.elite}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Build Your Cleaning Service</h1>

      {isPersonalizedPricingEnabled && <PersonalizedMessage userSegment={userSegment} className="mb-8" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cleanliness Level Selector */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Cleanliness Level</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Adjusting the cleanliness level impacts the time and effort required, affecting the price.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>How clean is your home currently?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm font-medium mb-2">
                {Object.values(CLEANLINESS_DIFFICULTY).map((level) => (
                  <span key={level.id} className="text-center">
                    {level.name}
                  </span>
                ))}
              </div>
              <Slider
                min={1}
                max={Object.keys(CLEANLINESS_DIFFICULTY).length}
                step={1}
                value={[
                  CLEANLINESS_DIFFICULTY[cleanlinessLevel.toUpperCase() as keyof typeof CLEANLINESS_DIFFICULTY]
                    ?.level || 1,
                ]}
                onValueChange={(value) => {
                  const level = Object.values(CLEANLINESS_DIFFICULTY).find((l) => l.level === value[0])
                  if (level) {
                    setCleanlinessLevel(level.name)
                    trackEvent("cleanliness_level_changed", { level: level.name })
                  }
                }}
                className="w-full"
              />
              <div className="flex items-center justify-center mt-4 text-lg font-semibold">
                {CLEANLINESS_ICONS[cleanlinessLevel.toUpperCase() as keyof typeof CLEANLINESS_ICONS]}
                <span className="ml-2">{getCleanlinessDescription(cleanlinessLevel)}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400 cursor-help ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{getCleanlinessTooltip(cleanlinessLevel)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>

          {/* Room Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Rooms</CardTitle>
              <CardDescription>Choose the rooms you'd like cleaned and customize their service tier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {roomConfigs.map((room) => (
                <div key={room.roomType} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl text-blue-600">{room.roomIcon}</div>
                    <div>
                      <h3 className="font-semibold">{room.roomName}</h3>
                      <p className="text-sm text-gray-500">
                        {room.selectedTier} Tier - {formatCurrency(room.totalPrice)} / room
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRoomCountChange(room.roomType, -1)}
                      disabled={room.count === 0}
                      className="bg-black text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-medium w-8 text-center">{room.count}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRoomCountChange(room.roomType, 1)}
                      className="bg-black text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCustomizeRoom(room)}
                      className="ml-2 bg-black text-white"
                    >
                      Customize
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Service Summary */}
          <ServiceSummaryCard
            roomConfigs={roomConfigs}
            selectedFrequency={selectedFrequency}
            cleanlinessLevel={cleanlinessLevel}
            totalPrice={finalPrice}
          />
        </div>

        {/* Sidebar / Cart Summary */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Cart</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Your cart is empty. Add some rooms!</p>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItemFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {selectedFrequency !== "one_time" && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>{selectedFrequency.replace("_", " ")} Discount</span>
                      <span>-{formatCurrency(subtotal - finalPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xl mt-2">
                    <span>Total</span>
                    <span>{formatCurrency(finalPrice)}</span>
                  </div>
                  <Button onClick={() => clearCart()} variant="outline" className="w-full mt-4 bg-black text-white">
                    Clear Cart
                  </Button>
                  <Button className="w-full mt-2">Proceed to Checkout</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {currentRoomToCustomize && (
        <EnhancedRoomCustomizationPanel
          isOpen={isCustomizationPanelOpen}
          onClose={() => setIsCustomizationPanelOpen(false)}
          roomType={currentRoomToCustomize.roomType}
          roomName={currentRoomToCustomize.roomName}
          roomIcon={currentRoomToCustomize.roomIcon}
          roomCount={currentRoomToCustomize.count}
          config={currentRoomToCustomize}
          onConfigChange={handleRoomConfigChange}
        />
      )}

      <CollapsibleAddAllPanel
        isOpen={showAddAllPanel}
        onClose={() => setShowAddAllPanel(false)}
        onAddAll={handleAddAllRoomsToCart}
        totalRooms={totalRoomsSelected}
        totalPrice={finalPrice}
      />

      <CollapsibleSharePanel
        isOpen={showSharePanel}
        onClose={() => setShowSharePanel(false)}
        shareUrl={typeof window !== "undefined" ? window.location.href : ""}
        shareText="Check out my customized cleaning service quote from SmileyBrooms!"
      />

      {isChatbotEnabled && (
        <CollapsibleChatbotPanel isOpen={showChatbotPanel} onClose={() => setShowChatbotPanel(false)} />
      )}

      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg w-12 h-12 bg-black text-white"
          onClick={() => setShowAddAllPanel(true)}
          title="Add All to Cart"
        >
          <CheckCircle2 className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg w-12 h-12 bg-black text-white"
          onClick={() => setShowSharePanel(true)}
          title="Share Quote"
        >
          <Share2 className="h-6 w-6" />
        </Button>
        {isChatbotEnabled && (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg w-12 h-12 bg-black text-white"
            onClick={() => setShowChatbotPanel(true)}
            title="Chat with us"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Placeholder for Laptop and Share2 icons if not already imported
function Laptop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.93 1.45H3.65a1 1 0 0 1-.93-1.45L4 16" />
    </svg>
  )
}

function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function Share2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  )
}
