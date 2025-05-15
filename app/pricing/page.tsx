"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { motion } from "framer-motion"
import {
  ShoppingCart,
  Plus,
  Minus,
  AlertTriangle,
  Home,
  Bath,
  UtensilsCrossed,
  Briefcase,
  Sofa,
  Settings,
  ChevronRight,
  Check,
  Leaf,
  Droplets,
  SprayCanIcon as Spray,
  Snowflake,
  Fan,
  Clock,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Room types and their base rates
const roomTypes = [
  {
    id: "bedroom",
    name: "Bedroom",
    icon: <Home className="h-5 w-5" />,
    standardRate: 25,
    detailingRate: 45,
    standardIncludes: ["Dusting surfaces", "Vacuuming floor", "Making bed", "Emptying trash"],
    detailingIncludes: [
      "Deep dusting all surfaces",
      "Moving furniture to clean",
      "Vacuuming under bed",
      "Cleaning baseboards",
      "Window sill cleaning",
    ],
    customOptions: [
      {
        id: "carpet_deep_cleaning",
        name: "Carpet Deep Cleaning",
        price: 18,
        description: "Steam extraction to remove deep stains and allergens",
      },
      {
        id: "window_cleaning",
        name: "Window & Blinds Cleaning",
        price: 12,
        description: "Clean windows, sills, and blinds thoroughly",
      },
      {
        id: "closet_organization",
        name: "Basic Closet Organization",
        price: 25,
        description: "Organize clothing and items in closet (no removal)",
      },
      {
        id: "ceiling_fan",
        name: "Ceiling Fan & Light Fixtures",
        price: 10,
        description: "Dust and clean ceiling fan blades and light fixtures",
      },
      {
        id: "wall_spot_cleaning",
        name: "Wall Spot Treatment",
        price: 15,
        description: "Remove marks, scuffs and spots from walls",
      },
      {
        id: "under_bed_cleaning",
        name: "Under Bed Deep Clean",
        price: 12,
        description: "Move bed to clean underneath and sanitize area",
      },
      {
        id: "mattress_treatment",
        name: "Mattress Sanitizing",
        price: 35,
        description: "Vacuum, deodorize and sanitize mattress surfaces",
      },
    ],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: <Bath className="h-5 w-5" />,
    standardRate: 30,
    detailingRate: 54,
    standardIncludes: ["Cleaning toilet", "Wiping counters", "Cleaning shower/tub", "Mopping floor"],
    detailingIncludes: [
      "Deep scrubbing of shower/tub",
      "Tile grout cleaning",
      "Sanitizing all surfaces",
      "Cleaning inside cabinets",
      "Polishing fixtures",
    ],
    customOptions: [
      {
        id: "grout_cleaning",
        name: "Tile & Grout Deep Cleaning",
        price: 28,
        description: "Deep clean, sanitize and seal grout lines",
      },
      {
        id: "mold_treatment",
        name: "Mold & Mildew Treatment",
        price: 35,
        description: "Specialized treatment for mold and mildew in wet areas",
      },
      {
        id: "cabinet_organization",
        name: "Cabinet & Drawer Organization",
        price: 20,
        description: "Organize and clean bathroom storage areas",
      },
      {
        id: "shower_door",
        name: "Glass & Mirror Treatment",
        price: 15,
        description: "Special treatment for glass shower doors and mirrors",
      },
      {
        id: "exhaust_fan",
        name: "Exhaust Fan Deep Clean",
        price: 12,
        description: "Disassemble and clean bathroom exhaust fan",
      },
      {
        id: "toilet_deep_clean",
        name: "Toilet Deep Sanitization",
        price: 18,
        description: "Complete toilet sanitization including tank and base",
      },
      {
        id: "caulk_cleaning",
        name: "Caulk Cleaning & Whitening",
        price: 22,
        description: "Clean and whiten caulk around tub, shower and sink",
      },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    standardRate: 50,
    detailingRate: 90,
    standardIncludes: ["Wiping countertops", "Cleaning sink", "Cleaning stovetop", "Sweeping/mopping floor"],
    detailingIncludes: [
      "Inside and outside of appliances",
      "Cabinet fronts",
      "Backsplash cleaning",
      "Under sink cleaning",
      "Disinfecting all surfaces",
    ],
    customOptions: [
      {
        id: "inside_fridge",
        name: "Refrigerator Deep Clean",
        price: 30,
        description: "Empty, clean and organize refrigerator interior",
      },
      {
        id: "inside_oven",
        name: "Oven & Stovetop Deep Clean",
        price: 35,
        description: "Deep clean oven interior, stovetop and hood",
      },
      {
        id: "cabinet_interiors",
        name: "Cabinet & Pantry Organization",
        price: 45,
        description: "Empty, clean and organize cabinets and pantry",
      },
      {
        id: "dishwasher_cleaning",
        name: "Dishwasher Sanitization",
        price: 20,
        description: "Clean, descale and sanitize dishwasher",
      },
      {
        id: "range_hood",
        name: "Range Hood & Filter Cleaning",
        price: 25,
        description: "Degrease and clean range hood, fan and filters",
      },
      {
        id: "small_appliances",
        name: "Small Appliance Cleaning",
        price: 22,
        description: "Clean toaster, microwave, coffee maker, etc.",
      },
      {
        id: "garbage_disposal",
        name: "Garbage Disposal & Drain Treatment",
        price: 15,
        description: "Clean and deodorize disposal and drains",
      },
      {
        id: "under_appliance",
        name: "Under/Behind Appliance Cleaning",
        price: 28,
        description: "Move and clean under/behind refrigerator and stove",
      },
    ],
  },
  {
    id: "living_room",
    name: "Living Room",
    icon: <Sofa className="h-5 w-5" />,
    standardRate: 40,
    detailingRate: 72,
    standardIncludes: ["Dusting surfaces", "Vacuuming floor", "Straightening items", "Emptying trash"],
    detailingIncludes: [
      "Moving furniture to clean",
      "Cleaning baseboards",
      "Dusting blinds/curtains",
      "Cleaning light fixtures",
      "Spot cleaning upholstery",
    ],
    customOptions: [
      {
        id: "upholstery_cleaning",
        name: "Upholstery Deep Cleaning",
        price: 45,
        description: "Deep clean and sanitize sofas and upholstered furniture",
      },
      {
        id: "blind_cleaning",
        name: "Blind & Curtain Detailed Cleaning",
        price: 25,
        description: "Thorough cleaning of window treatments and hardware",
      },
      {
        id: "electronics_dusting",
        name: "Electronics & Entertainment Center",
        price: 18,
        description: "Careful cleaning of TV, components and cables",
      },
      {
        id: "carpet_treatment",
        name: "Carpet Stain & Odor Treatment",
        price: 30,
        description: "Treat visible carpet stains and neutralize odors",
      },
      {
        id: "air_purification",
        name: "Air Purification Treatment",
        price: 35,
        description: "HEPA air purification and room deodorizing",
      },
      {
        id: "furniture_moving",
        name: "Furniture Moving & Under Cleaning",
        price: 28,
        description: "Move and clean under heavy furniture pieces",
      },
      {
        id: "decor_cleaning",
        name: "Decor & Art Cleaning",
        price: 22,
        description: "Careful cleaning of decorative items and artwork",
      },
      {
        id: "hardwood_treatment",
        name: "Hardwood Floor Treatment",
        price: 32,
        description: "Special treatment for hardwood floors",
      },
    ],
  },
  {
    id: "office",
    name: "Office",
    icon: <Briefcase className="h-5 w-5" />,
    standardRate: 35,
    detailingRate: 63,
    standardIncludes: ["Dusting desk and surfaces", "Vacuuming floor", "Emptying trash", "Organizing desk"],
    detailingIncludes: [
      "Cleaning electronics",
      "Organizing cables",
      "Cleaning bookshelves",
      "Dusting blinds",
      "Cleaning desk drawers",
    ],
    customOptions: [
      {
        id: "filing_organization",
        name: "Basic Filing Organization",
        price: 30,
        description: "Organize loose papers and basic filing system",
      },
      {
        id: "computer_cleaning",
        name: "Computer & Electronics Detailing",
        price: 25,
        description: "Careful cleaning of computer, keyboard, monitors",
      },
      {
        id: "bookshelf_organization",
        name: "Bookshelf Cleaning & Organization",
        price: 20,
        description: "Dust, clean and organize bookshelves and contents",
      },
      {
        id: "whiteboard_cleaning",
        name: "Whiteboard & Glass Surface Restoration",
        price: 15,
        description: "Deep clean and restore whiteboards and glass surfaces",
      },
      {
        id: "desk_sanitization",
        name: "Workspace Sanitization",
        price: 18,
        description: "Sanitize high-touch desk areas and equipment",
      },
      {
        id: "cable_management",
        name: "Cable Management",
        price: 15,
        description: "Organize and secure cables and cords",
      },
      {
        id: "drawer_organization",
        name: "Drawer & Storage Organization",
        price: 22,
        description: "Clean and organize desk drawers and storage areas",
      },
    ],
  },
]

// Frequency options and their adjustments
const frequencyOptions = [
  { id: "weekly", label: "Weekly", initialMultiplier: 1.05, discountMultiplier: 0.88 },
  { id: "biweekly", label: "Biweekly", initialMultiplier: 1.03, discountMultiplier: 0.92 },
  { id: "monthly", label: "Monthly", initialMultiplier: 1.0, discountMultiplier: 0.95 },
  { id: "annual", label: "Annual", initialMultiplier: 1.15, discountMultiplier: 0.8 },
]

// Global add-on options
const globalAddOns = [
  {
    id: "eco_friendly",
    name: "Eco-Friendly Products",
    price: 18,
    description: "100% environmentally safe, non-toxic cleaning products",
    icon: <Leaf className="h-4 w-4" />,
  },
  {
    id: "pet_friendly",
    name: "Pet-Safe Treatment",
    price: 15,
    description: "Special cleaning safe for pets with pet hair focus",
    icon: <Droplets className="h-4 w-4" />,
  },
  {
    id: "allergy_friendly",
    name: "Allergy-Friendly Cleaning",
    price: 25,
    description: "HEPA vacuums and hypoallergenic products for allergy sufferers",
    icon: <Snowflake className="h-4 w-4" />,
  },
  {
    id: "air_freshening",
    name: "Premium Air Freshening",
    price: 12,
    description: "Essential oil diffusion and natural deodorizing",
    icon: <Fan className="h-4 w-4" />,
  },
  {
    id: "sanitization",
    name: "Full Home Sanitization",
    price: 35,
    description: "Hospital-grade sanitization of all high-touch surfaces",
    icon: <Spray className="h-4 w-4" />,
  },
  {
    id: "move_in_out",
    name: "Move-In/Move-Out Preparation",
    price: 50,
    description: "Special deep cleaning for moving in or out",
    icon: <Home className="h-4 w-4" />,
  },
  {
    id: "same_day",
    name: "Same-Day Service",
    price: 40,
    description: "Priority scheduling for same-day service (when available)",
    icon: <Clock className="h-4 w-4" />,
  },
]

// Cleanliness levels and their multipliers
const cleanlinessLevels = [
  { level: 1, label: "Light", multiplier: 1.0, description: "Regular maintenance cleaning" },
  { level: 2, label: "Medium", multiplier: 1.3, description: "Moderate dirt and dust" },
  { level: 3, label: "Deep", multiplier: 1.7, description: "Heavy dirt and stains" },
  { level: 4, label: "Biohazard", multiplier: 0, description: "Requires specialized cleaning", disabled: true },
]

export default function PricingPage() {
  // State for calculator
  const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>({
    bedroom: 1,
    bathroom: 1,
    kitchen: 0,
    living_room: 0,
    office: 0,
  })

  // Room customization state
  const [roomCustomizations, setRoomCustomizations] = useState<Record<string, any>>({})

  // Global state
  const [serviceType, setServiceType] = useState<"standard" | "detailing">("standard")
  const [frequency, setFrequency] = useState("monthly")
  const [allowVideo, setAllowVideo] = useState(false)
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [isServiceAvailable, setIsServiceAvailable] = useState(true)
  const [selectedGlobalAddOns, setSelectedGlobalAddOns] = useState<string[]>([])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  // UI state
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [customizeDrawerOpen, setCustomizeDrawerOpen] = useState(false)
  const [currentRoomToCustomize, setCurrentRoomToCustomize] = useState<string | null>(null)
  const [priceBreakdown, setPriceBreakdown] = useState<any>({})

  const { addItem, cart } = useCart()
  const { toast } = useToast()

  // Initialize room customizations
  useEffect(() => {
    const initialCustomizations: Record<string, any> = {}

    roomTypes.forEach((room) => {
      initialCustomizations[room.id] = {
        cleanlinessLevel: 2,
        selectedOptions: [],
      }
    })

    setRoomCustomizations(initialCustomizations)
  }, [])

  // Calculate price whenever selections change
  useEffect(() => {
    calculatePrice()
  }, [selectedRooms, roomCustomizations, serviceType, frequency, allowVideo, selectedGlobalAddOns])

  // Function to open the customization drawer for a specific room
  const openCustomizeDrawer = (roomId: string) => {
    setCurrentRoomToCustomize(roomId)
    setCustomizeDrawerOpen(true)
  }

  // Function to toggle a custom option for the current room
  const toggleCustomOption = (optionId: string) => {
    if (!currentRoomToCustomize) return

    setRoomCustomizations((prev) => {
      const currentOptions = [...(prev[currentRoomToCustomize]?.selectedOptions || [])]

      if (currentOptions.includes(optionId)) {
        return {
          ...prev,
          [currentRoomToCustomize]: {
            ...prev[currentRoomToCustomize],
            selectedOptions: currentOptions.filter((id) => id !== optionId),
          },
        }
      } else {
        return {
          ...prev,
          [currentRoomToCustomize]: {
            ...prev[currentRoomToCustomize],
            selectedOptions: [...currentOptions, optionId],
          },
        }
      }
    })
  }

  // Function to set cleanliness level for a specific room
  const setRoomCleanlinessLevel = (roomId: string, level: number) => {
    setRoomCustomizations((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        cleanlinessLevel: level,
      },
    }))
  }

  // Function to toggle global add-on
  const toggleGlobalAddOn = (addOnId: string) => {
    setSelectedGlobalAddOns((prev) => {
      if (prev.includes(addOnId)) {
        return prev.filter((id) => id !== addOnId)
      } else {
        return [...prev, addOnId]
      }
    })
  }

  // Function to calculate the price
  const calculatePrice = () => {
    let totalPrice = 0
    const breakdown: any = {
      basePrice: 0,
      roomPrices: {},
      customOptions: 0,
      globalAddOns: 0,
      frequencyDiscount: 0,
      videoDiscount: 0,
      total: 0,
    }

    // Calculate base price for each room
    Object.entries(selectedRooms).forEach(([roomId, count]) => {
      if (count <= 0) return

      const room = roomTypes.find((r) => r.id === roomId)
      if (!room) return

      const baseRate = serviceType === "standard" ? room.standardRate : room.detailingRate
      const roomCustomization = roomCustomizations[roomId] || { cleanlinessLevel: 2, selectedOptions: [] }

      // Apply cleanliness level multiplier for this room
      const cleanlinessMultiplier =
        cleanlinessLevels.find((c) => c.level === roomCustomization.cleanlinessLevel)?.multiplier || 1

      // Calculate room base price
      const roomBasePrice = baseRate * count * cleanlinessMultiplier
      breakdown.basePrice += roomBasePrice

      // Add room to breakdown
      breakdown.roomPrices[roomId] = {
        count,
        baseRate,
        cleanlinessLevel: roomCustomization.cleanlinessLevel,
        cleanlinessMultiplier,
        subtotal: roomBasePrice,
        customOptions: [],
      }

      // Add custom options for this room
      if (roomCustomization.selectedOptions && roomCustomization.selectedOptions.length > 0) {
        const roomOptions = room.customOptions || []

        roomCustomization.selectedOptions.forEach((optionId: string) => {
          const option = roomOptions.find((opt) => opt.id === optionId)
          if (option) {
            const optionPrice = option.price * count // Multiply by room count
            totalPrice += optionPrice
            breakdown.customOptions += optionPrice

            // Add to room breakdown
            breakdown.roomPrices[roomId].customOptions.push({
              name: option.name,
              price: optionPrice,
            })
          }
        })
      }

      totalPrice += roomBasePrice
    })

    // Add global add-ons
    selectedGlobalAddOns.forEach((addOnId) => {
      const addOn = globalAddOns.find((a) => a.id === addOnId)
      if (addOn) {
        totalPrice += addOn.price
        breakdown.globalAddOns += addOn.price
      }
    })

    // Apply frequency discount
    const frequencyOption = frequencyOptions.find((f) => f.id === frequency)
    if (frequencyOption) {
      const discountAmount = totalPrice * (1 - frequencyOption.discountMultiplier)
      totalPrice = totalPrice * frequencyOption.discountMultiplier
      breakdown.frequencyDiscount = discountAmount
    }

    // Apply video discount
    if (allowVideo) {
      totalPrice -= 25
      breakdown.videoDiscount = 25
    }

    // Check if service is available (Level 3-4 cleanliness with Standard service)
    const hasHighCleanlinessLevel = Object.values(roomCustomizations).some(
      (room) => (room.cleanlinessLevel >= 3 && serviceType === "standard") || room.cleanlinessLevel === 4,
    )

    setIsServiceAvailable(!hasHighCleanlinessLevel)

    // Set the calculated price (rounded to 2 decimal places)
    const finalPrice = Math.max(0, Math.round(totalPrice * 100) / 100)
    setCalculatedPrice(finalPrice)

    // Set final total in breakdown
    breakdown.total = finalPrice
    setPriceBreakdown(breakdown)
  }

  // Function to increment room count
  const incrementRoom = (roomId: string) => {
    if ((selectedRooms[roomId] || 0) < 10) {
      setSelectedRooms((prev) => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) + 1,
      }))
    }
  }

  // Function to decrement room count
  const decrementRoom = (roomId: string) => {
    if ((selectedRooms[roomId] || 0) > 0) {
      setSelectedRooms((prev) => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) - 1,
      }))
    }
  }

  // Get total room count
  const getTotalRoomCount = () => {
    return Object.values(selectedRooms).reduce((sum, count) => sum + count, 0)
  }

  // Get current room being customized
  const getCurrentRoom = () => {
    if (!currentRoomToCustomize) return null
    return roomTypes.find((room) => room.id === currentRoomToCustomize) || null
  }

  // Show address modal when Add to Cart is clicked
  const handleAddToCart = () => {
    if (!termsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (!isServiceAvailable) {
      toast({
        title: "Service Unavailable",
        description: "Please adjust cleanliness levels or switch to Detailing service.",
        variant: "destructive",
      })
      return
    }

    if (getTotalRoomCount() === 0) {
      toast({
        title: "No rooms selected",
        description: "Please select at least one room before adding to cart.",
        variant: "destructive",
      })
      return
    }

    setShowAddressModal(true)
  }

  // Process the address data and add to cart
  const handleAddressSubmit = (addressData: AddressData) => {
    // Get the frequency label
    const frequencyLabel =
      {
        weekly: "Weekly Cleaning",
        biweekly: "Biweekly Cleaning",
        monthly: "Monthly Cleaning",
        annual: "Annual Cleaning",
      }[frequency] || "Cleaning Service"

    // Count total rooms
    const totalRooms = getTotalRoomCount()

    // Create a descriptive name for the service
    const serviceTypeLabel = serviceType === "standard" ? "Standard" : "Premium Detailing"
    const serviceName = `${serviceTypeLabel} ${frequencyLabel} (${totalRooms} rooms)`

    // Get the room types that were selected with their customizations
    const selectedRoomsList = Object.entries(selectedRooms)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => {
        const roomType = roomTypes.find((r) => r.id === type)
        const customization = roomCustomizations[type] || { cleanlinessLevel: 2, selectedOptions: [] }

        // Get selected options for this room
        const options = roomType?.customOptions
          .filter((opt) => customization.selectedOptions.includes(opt.id))
          .map((opt) => opt.name)
          .join(", ")

        const cleanlinessLabel =
          cleanlinessLevels.find((c) => c.level === customization.cleanlinessLevel)?.label || "Medium"

        return `${roomType?.name || type} x${count} (${cleanlinessLabel}${options ? `, with: ${options}` : ""})`
      })
      .join("; ")

    // Get selected global add-ons
    const globalAddOnsList = selectedGlobalAddOns
      .map((id) => globalAddOns.find((a) => a.id === id)?.name || "")
      .filter(Boolean)
      .join(", ")

    // Generate a unique ID that includes the address to help with combining similar items
    const itemId = `custom-cleaning-${addressData.address.replace(/\s+/g, "-").toLowerCase()}-${serviceType}-${frequency}`

    // Add to cart with customer data
    addItem({
      id: itemId,
      name: serviceName,
      price: calculatedPrice,
      priceId: "price_custom_cleaning",
      image: "/home-cleaning.png",
      quantity: 1,
      metadata: {
        rooms: selectedRoomsList,
        globalAddOns: globalAddOnsList,
        frequency,
        serviceType,
        allowVideo,
        priceBreakdown: priceBreakdown,
        customer: {
          name: addressData.fullName,
          email: addressData.email,
          phone: addressData.phone,
          address: addressData.address,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          specialInstructions: addressData.specialInstructions,
          allowVideoRecording: allowVideo,
          termsAccepted: true,
          termsAcceptedDate: new Date().toISOString(),
        },
      },
    })

    // Show success message
    toast({
      title: "Added to cart!",
      description: `${serviceName} has been added to your cart.`,
    })
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pricing Calculator
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Calculator Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="text-2xl">Calculate Your Cleaning Price</CardTitle>
                  <CardDescription>Configure the cleaning details for your location</CardDescription>
                </CardHeader>

                <Tabs
                  defaultValue="standard"
                  value={serviceType}
                  onValueChange={(value) => setServiceType(value as "standard" | "detailing")}
                >
                  <TabsList className="w-full rounded-none border-b">
                    <TabsTrigger value="standard" className="flex-1 text-sm md:text-base">
                      Standard Cleaning
                    </TabsTrigger>
                    <TabsTrigger value="detailing" className="flex-1 text-sm md:text-base">
                      Premium Detailing
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="standard" className="p-6">
                    <div className="space-y-6">
                      {/* Room Selection with Customization */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Select & Customize Rooms</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {roomTypes.map((room) => (
                            <Card
                              key={room.id}
                              className={cn(
                                "border overflow-hidden transition-all",
                                selectedRooms[room.id] > 0
                                  ? "border-blue-200 dark:border-blue-800"
                                  : "border-gray-200 dark:border-gray-800",
                              )}
                            >
                              <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex items-center">
                                    <div
                                      className={cn(
                                        "p-2 rounded-full mr-3",
                                        selectedRooms[room.id] > 0
                                          ? "bg-blue-100 dark:bg-blue-900/30"
                                          : "bg-gray-100 dark:bg-gray-800",
                                      )}
                                    >
                                      {room.icon}
                                    </div>
                                    <div>
                                      <p className="font-medium">{room.name}</p>
                                      <p className="text-sm text-gray-500">
                                        ${serviceType === "standard" ? room.standardRate : room.detailingRate} per room
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => decrementRoom(room.id)}
                                        disabled={selectedRooms[room.id] === 0}
                                        className="h-8 w-8"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="w-8 text-center font-medium">{selectedRooms[room.id] || 0}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => incrementRoom(room.id)}
                                        disabled={selectedRooms[room.id] === 10}
                                        className="h-8 w-8"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "gap-1",
                                        selectedRooms[room.id] === 0 && "opacity-50 cursor-not-allowed",
                                      )}
                                      disabled={selectedRooms[room.id] === 0}
                                      onClick={() => openCustomizeDrawer(room.id)}
                                    >
                                      <Settings className="h-4 w-4" />
                                      <span className="hidden sm:inline">Customize</span>
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Show customization summary if room is selected and has customizations */}
                                {selectedRooms[room.id] > 0 && roomCustomizations[room.id] && (
                                  <div className="mt-3 pt-3 border-t text-sm">
                                    <div className="flex flex-wrap gap-2">
                                      {/* Cleanliness level badge */}
                                      <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                      >
                                        {cleanlinessLevels.find(
                                          (c) => c.level === roomCustomizations[room.id]?.cleanlinessLevel,
                                        )?.label || "Medium"}{" "}
                                        Cleaning
                                      </Badge>

                                      {/* Custom options badges */}
                                      {roomCustomizations[room.id]?.selectedOptions?.map((optionId: string) => {
                                        const option = room.customOptions.find((opt) => opt.id === optionId)
                                        if (!option) return null
                                        return (
                                          <Badge
                                            key={optionId}
                                            variant="outline"
                                            className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                          >
                                            {option.name}
                                          </Badge>
                                        )
                                      })}

                                      {/* If no custom options selected */}
                                      {(!roomCustomizations[room.id]?.selectedOptions ||
                                        roomCustomizations[room.id]?.selectedOptions.length === 0) && (
                                        <span className="text-gray-500 text-xs italic">No add-ons selected</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Global Add-ons */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Global Add-ons</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {globalAddOns.map((addOn) => (
                            <div
                              key={addOn.id}
                              className={cn(
                                "flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                                selectedGlobalAddOns.includes(addOn.id)
                                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                                  : "border-gray-200 dark:border-gray-700",
                              )}
                              onClick={() => toggleGlobalAddOn(addOn.id)}
                            >
                              <div
                                className={cn(
                                  "rounded-full p-1.5 flex-shrink-0",
                                  selectedGlobalAddOns.includes(addOn.id)
                                    ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                                    : "bg-gray-100 text-gray-500 dark:bg-gray-800",
                                )}
                              >
                                {addOn.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <p className="font-medium">{addOn.name}</p>
                                  <p className="font-medium">${addOn.price}</p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{addOn.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Frequency Selection */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Cleaning Frequency</h3>
                        <Select value={frequency} onValueChange={setFrequency}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencyOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label}
                                <span className="ml-2 text-xs text-green-600">
                                  ({Math.round((1 - option.discountMultiplier) * 100)}% savings)
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500 mt-2">
                          Regular cleaning schedules receive discounted rates
                        </p>
                      </div>

                      {/* Video Discount Checkbox */}
                      <div>
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="allow-video"
                            checked={allowVideo}
                            onCheckedChange={(checked) => setAllowVideo(checked === true)}
                          />
                          <div>
                            <Label htmlFor="allow-video" className="text-base font-medium cursor-pointer">
                              Allow Video Recording ($25 Discount)
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">
                              We may record parts of the cleaning process for training and marketing purposes
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="detailing" className="p-6">
                    <div className="space-y-6">
                      {/* Room Selection with Customization */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Select & Customize Rooms</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {roomTypes.map((room) => (
                            <Card
                              key={room.id}
                              className={cn(
                                "border overflow-hidden transition-all",
                                selectedRooms[room.id] > 0
                                  ? "border-purple-200 dark:border-purple-800"
                                  : "border-gray-200 dark:border-gray-800",
                              )}
                            >
                              <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="flex items-center">
                                    <div
                                      className={cn(
                                        "p-2 rounded-full mr-3",
                                        selectedRooms[room.id] > 0
                                          ? "bg-purple-100 dark:bg-purple-900/30"
                                          : "bg-gray-100 dark:bg-gray-800",
                                      )}
                                    >
                                      {room.icon}
                                    </div>
                                    <div>
                                      <p className="font-medium">{room.name}</p>
                                      <p className="text-sm text-gray-500">
                                        ${serviceType === "standard" ? room.standardRate : room.detailingRate} per room
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => decrementRoom(room.id)}
                                        disabled={selectedRooms[room.id] === 0}
                                        className="h-8 w-8"
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="w-8 text-center font-medium">{selectedRooms[room.id] || 0}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => incrementRoom(room.id)}
                                        disabled={selectedRooms[room.id] === 10}
                                        className="h-8 w-8"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "gap-1",
                                        selectedRooms[room.id] === 0 && "opacity-50 cursor-not-allowed",
                                      )}
                                      disabled={selectedRooms[room.id] === 0}
                                      onClick={() => openCustomizeDrawer(room.id)}
                                    >
                                      <Settings className="h-4 w-4" />
                                      <span className="hidden sm:inline">Customize</span>
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Show customization summary if room is selected and has customizations */}
                                {selectedRooms[room.id] > 0 && roomCustomizations[room.id] && (
                                  <div className="mt-3 pt-3 border-t text-sm">
                                    <div className="flex flex-wrap gap-2">
                                      {/* Cleanliness level badge */}
                                      <Badge
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                      >
                                        {cleanlinessLevels.find(
                                          (c) => c.level === roomCustomizations[room.id]?.cleanlinessLevel,
                                        )?.label || "Medium"}{" "}
                                        Cleaning
                                      </Badge>

                                      {/* Custom options badges */}
                                      {roomCustomizations[room.id]?.selectedOptions?.map((optionId: string) => {
                                        const option = room.customOptions.find((opt) => opt.id === optionId)
                                        if (!option) return null
                                        return (
                                          <Badge
                                            key={optionId}
                                            variant="outline"
                                            className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                          >
                                            {option.name}
                                          </Badge>
                                        )
                                      })}

                                      {/* If no custom options selected */}
                                      {(!roomCustomizations[room.id]?.selectedOptions ||
                                        roomCustomizations[room.id]?.selectedOptions.length === 0) && (
                                        <span className="text-gray-500 text-xs italic">No add-ons selected</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Global Add-ons */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Global Add-ons</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {globalAddOns.map((addOn) => (
                            <div
                              key={addOn.id}
                              className={cn(
                                "flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                                selectedGlobalAddOns.includes(addOn.id)
                                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                                  : "border-gray-200 dark:border-gray-700",
                              )}
                              onClick={() => toggleGlobalAddOn(addOn.id)}
                            >
                              <div
                                className={cn(
                                  "rounded-full p-1.5 flex-shrink-0",
                                  selectedGlobalAddOns.includes(addOn.id)
                                    ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                                    : "bg-gray-100 text-gray-500 dark:bg-gray-800",
                                )}
                              >
                                {addOn.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <p className="font-medium">{addOn.name}</p>
                                  <p className="font-medium">${addOn.price}</p>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{addOn.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Frequency Selection */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Cleaning Frequency</h3>
                        <Select value={frequency} onValueChange={setFrequency}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencyOptions.map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                {option.label}
                                <span className="ml-2 text-xs text-green-600">
                                  ({Math.round((1 - option.discountMultiplier) * 100)}% savings)
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500 mt-2">
                          Regular cleaning schedules receive discounted rates
                        </p>
                      </div>

                      {/* Video Discount Checkbox */}
                      <div>
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="allow-video"
                            checked={allowVideo}
                            onCheckedChange={(checked) => setAllowVideo(checked === true)}
                          />
                          <div>
                            <Label htmlFor="allow-video" className="text-base font-medium cursor-pointer">
                              Allow Video Recording ($25 Discount)
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">
                              We may record parts of the cleaning process for training and marketing purposes
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          </div>

          {/* Price Breakdown Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg border-0">
                <CardHeader
                  className={cn(
                    "bg-gradient-to-r",
                    serviceType === "standard"
                      ? "from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900"
                      : "from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900",
                  )}
                >
                  <CardTitle className="text-xl flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Price Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Price Breakdown */}
                  <Accordion type="single" collapsible className="mb-6">
                    <AccordionItem value="breakdown">
                      <AccordionTrigger className="py-2">
                        <span className="text-lg font-medium">Price Breakdown</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-sm">
                          {/* Room prices */}
                          {Object.entries(priceBreakdown.roomPrices || {}).map(([roomId, details]: [string, any]) => {
                            const room = roomTypes.find((r) => r.id === roomId)
                            if (!room || details.count === 0) return null

                            return (
                              <div key={roomId} className="space-y-1">
                                <div className="flex justify-between font-medium">
                                  <span>
                                    {room.name} ({details.count}x)
                                  </span>
                                  <span>{formatCurrency(details.subtotal)}</span>
                                </div>
                                <div className="pl-4 text-gray-500">
                                  <div className="flex justify-between">
                                    <span>
                                      Base rate: ${serviceType === "standard" ? room.standardRate : room.detailingRate}{" "}
                                      × {details.count}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>
                                      Cleanliness:{" "}
                                      {cleanlinessLevels.find((c) => c.level === details.cleanlinessLevel)?.label} (
                                      {details.cleanlinessMultiplier}x)
                                    </span>
                                  </div>

                                  {/* Room custom options */}
                                  {details.customOptions && details.customOptions.length > 0 && (
                                    <div className="mt-1 pt-1 border-t border-dashed border-gray-200">
                                      {details.customOptions.map((option: any, index: number) => (
                                        <div key={index} className="flex justify-between">
                                          <span>+ {option.name}</span>
                                          <span>{formatCurrency(option.price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}

                          {/* Global add-ons */}
                          {selectedGlobalAddOns.length > 0 && (
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Global Add-ons</span>
                                <span>{formatCurrency(priceBreakdown.globalAddOns || 0)}</span>
                              </div>
                              <div className="pl-4 text-gray-500">
                                {selectedGlobalAddOns.map((addOnId) => {
                                  const addOn = globalAddOns.find((a) => a.id === addOnId)
                                  if (!addOn) return null
                                  return (
                                    <div key={addOnId} className="flex justify-between">
                                      <span>+ {addOn.name}</span>
                                      <span>{formatCurrency(addOn.price)}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* Discounts */}
                          {(priceBreakdown.frequencyDiscount > 0 || priceBreakdown.videoDiscount > 0) && (
                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Discounts</span>
                                <span>
                                  -
                                  {formatCurrency(
                                    (priceBreakdown.frequencyDiscount || 0) + (priceBreakdown.videoDiscount || 0),
                                  )}
                                </span>
                              </div>
                              <div className="pl-4 text-gray-500">
                                {priceBreakdown.frequencyDiscount > 0 && (
                                  <div className="flex justify-between">
                                    <span>{frequencyOptions.find((f) => f.id === frequency)?.label} discount</span>
                                    <span>-{formatCurrency(priceBreakdown.frequencyDiscount)}</span>
                                  </div>
                                )}
                                {priceBreakdown.videoDiscount > 0 && (
                                  <div className="flex justify-between">
                                    <span>Video recording discount</span>
                                    <span>-{formatCurrency(priceBreakdown.videoDiscount)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Service Summary */}
                  <div className="mb-6">
                    <h3 className="font-medium text-lg mb-2">Selected Service</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Type:</span>
                        <span className="font-medium">
                          {serviceType === "standard" ? "Standard Cleaning" : "Premium Detailing"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rooms:</span>
                        <span className="font-medium">{getTotalRoomCount()} total</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-medium">
                          {frequencyOptions.find((f) => f.id === frequency)?.label || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Add-ons:</span>
                        <span className="font-medium">
                          {selectedGlobalAddOns.length} global,{" "}
                          {Object.values(roomCustomizations).reduce(
                            (sum, room) => sum + (room.selectedOptions?.length || 0),
                            0,
                          )}{" "}
                          room-specific
                        </span>
                      </div>
                      {allowVideo && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Video Discount:</span>
                          <span className="font-medium text-green-600">-$25.00</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total Price:</span>
                      <div className="text-right">
                        <div className="text-3xl font-bold">
                          {formatCurrency(calculatedPrice)}
                          <span className="text-sm font-normal text-gray-500 ml-1">
                            /
                            {frequency === "annual"
                              ? "year"
                              : frequency === "monthly"
                                ? "month"
                                : frequency === "biweekly"
                                  ? "2 weeks"
                                  : "week"}
                          </span>
                        </div>
                        {!isServiceAvailable && (
                          <Badge variant="destructive" className="mt-1">
                            Service Unavailable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-6">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms-checkbox"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                      />
                      <div>
                        <Label htmlFor="terms-checkbox" className="text-sm font-medium cursor-pointer">
                          I accept the{" "}
                          <Button variant="link" className="h-auto p-0" onClick={() => setShowTermsModal(true)}>
                            terms and conditions
                          </Button>
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className={cn(
                      "w-full group relative overflow-hidden text-white py-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300",
                      serviceType === "standard"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
                    )}
                    disabled={!isServiceAvailable || getTotalRoomCount() === 0 || !termsAccepted}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 inline-block" />
                    <span className="font-medium">Add to Cart</span>
                  </Button>

                  {/* Cart Status */}
                  {cart.items.length > 0 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in cart
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Drawer */}
      <Drawer open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="text-xl flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Terms and Conditions
            </DrawerTitle>
            <DrawerDescription>Please read and accept our terms before proceeding</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-0 overflow-y-auto max-h-[calc(85vh-10rem)]">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3>Service Agreement</h3>
              <p>
                By accepting these terms, you agree to the cleaning services as described in your order. Our
                professional cleaners will perform the services selected, including any add-ons or special requests
                specified during booking.
              </p>

              <h3>Cancellation Policy</h3>
              <p>
                Cancellations must be made at least 24 hours before your scheduled service. Late cancellations may be
                subject to a fee of up to 50% of the service cost. No-shows will be charged the full service amount.
              </p>

              <h3>Payment Terms</h3>
              <p>
                Payment is processed at the time of booking. For recurring services, you authorize us to charge your
                payment method according to the frequency selected. Prices are subject to change with notice.
              </p>

              <h3>Service Guarantee</h3>
              <p>
                If you're not satisfied with our service, please notify us within 24 hours, and we'll return to address
                any issues at no additional cost. This guarantee applies to standard cleaning tasks only.
              </p>

              <h3>Property Access and Safety</h3>
              <p>
                You agree to provide safe access to your property at the scheduled time. Our cleaners reserve the right
                to refuse service if working conditions are unsafe or if they encounter biohazards not disclosed during
                booking.
              </p>

              <h3>Liability</h3>
              <p>
                While we take utmost care with your property, we are not liable for normal wear and tear, pre-existing
                damage, or items that are improperly secured. Please secure valuables before our arrival.
              </p>
            </div>
          </div>

          <DrawerFooter>
            <div className="flex items-start space-x-3 mb-4">
              <Checkbox
                id="accept-terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <div>
                <Label htmlFor="accept-terms" className="text-base font-medium cursor-pointer">
                  I accept the terms and conditions
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  By checking this box, you agree to our terms of service and privacy policy
                </p>
              </div>
            </div>
            <Button onClick={() => setShowTermsModal(false)} disabled={!termsAccepted}>
              Accept and Continue
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Room Customization Drawer */}
      <Drawer open={customizeDrawerOpen} onOpenChange={setCustomizeDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="text-xl flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Customize {getCurrentRoom()?.name || "Room"}
            </DrawerTitle>
            <DrawerDescription>Adjust cleanliness level and add custom services</DrawerDescription>
          </DrawerHeader>

          {currentRoomToCustomize && (
            <div className="px-4 pb-0 overflow-y-auto max-h-[calc(85vh-10rem)]">
              {/* Cleanliness Level */}
              <div className="mb-6">
                <h3 className="text-base font-medium mb-3">Cleanliness Level</h3>
                <div className="px-2">
                  <Slider
                    value={[roomCustomizations[currentRoomToCustomize]?.cleanlinessLevel || 2]}
                    min={1}
                    max={4}
                    step={1}
                    onValueChange={(value) => setRoomCleanlinessLevel(currentRoomToCustomize, value[0])}
                    className="mb-6"
                  />
                  <div className="flex justify-between">
                    {cleanlinessLevels.map((level) => (
                      <div
                        key={level.level}
                        className={cn(
                          "text-center flex-1",
                          roomCustomizations[currentRoomToCustomize]?.cleanlinessLevel === level.level && "font-medium",
                        )}
                      >
                        <div className="text-sm">{level.label}</div>
                        <div className="text-xs text-gray-500">
                          {level.level === 4 ? "N/A" : `×${level.multiplier}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {roomCustomizations[currentRoomToCustomize]?.cleanlinessLevel >= 3 && serviceType === "standard" && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 text-sm rounded-r flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Warning: High Cleanliness Level</p>
                      <p>For deep cleaning needs, we recommend our Premium Detailing service.</p>
                    </div>
                  </div>
                )}

                {roomCustomizations[currentRoomToCustomize]?.cleanlinessLevel === 4 && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-800 dark:text-red-300 text-sm rounded-r flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Biohazard Level Cleaning</p>
                      <p>
                        This level requires specialized cleaning services. Please contact us directly for a custom
                        quote.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Included Services */}
              <div className="mb-6">
                <h3 className="text-base font-medium mb-3">
                  Included in {serviceType === "standard" ? "Standard" : "Premium"} Service
                </h3>
                <div className="space-y-2 pl-1">
                  {getCurrentRoom()?.[serviceType === "standard" ? "standardIncludes" : "detailingIncludes"]?.map(
                    (item, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Custom Options */}
              <div className="mb-6">
                <h3 className="text-base font-medium mb-3">Additional Services</h3>
                <div className="space-y-3">
                  {getCurrentRoom()?.customOptions.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-start p-3 rounded-lg border cursor-pointer transition-all",
                        roomCustomizations[currentRoomToCustomize]?.selectedOptions?.includes(option.id)
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700",
                      )}
                      onClick={() => toggleCustomOption(option.id)}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full mr-2 flex items-center justify-center",
                                roomCustomizations[currentRoomToCustomize]?.selectedOptions?.includes(option.id)
                                  ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                                  : "bg-gray-100 text-gray-400 dark:bg-gray-800",
                              )}
                            >
                              {roomCustomizations[currentRoomToCustomize]?.selectedOptions?.includes(option.id) ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Plus className="h-3 w-3" />
                              )}
                            </div>
                            <p className="font-medium">{option.name}</p>
                          </div>
                          <p className="font-medium">${option.price}</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-7">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DrawerFooter>
            <Button onClick={() => setCustomizeDrawerOpen(false)}>Save Customization</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Address Collection Modal */}
      <AddressCollectionModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSubmit={handleAddressSubmit}
        calculatedPrice={calculatedPrice}
      />
    </div>
  )
}
