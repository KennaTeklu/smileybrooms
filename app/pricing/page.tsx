"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import AddressCollectionModal, { type AddressData } from "@/components/address-collection-modal"
import EnhancedTermsModal from "@/components/enhanced-terms-modal"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  ShoppingCart,
  Sparkles,
  Lock,
  CheckCircle,
  Plus,
  Minus,
  AlertTriangle,
  Home,
  Bath,
  UtensilsCrossed,
  Briefcase,
  Sofa,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Room types and their rates
const roomTypes = [
  { id: "bedroom", name: "Bedroom", icon: <Home className="h-5 w-5" />, standardRate: 25, detailingRate: 45 },
  { id: "bathroom", name: "Bathroom", icon: <Bath className="h-5 w-5" />, standardRate: 30, detailingRate: 54 },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: <UtensilsCrossed className="h-5 w-5" />,
    standardRate: 50,
    detailingRate: 90,
  },
  { id: "living_room", name: "Living Room", icon: <Sofa className="h-5 w-5" />, standardRate: 40, detailingRate: 72 },
  { id: "office", name: "Office", icon: <Briefcase className="h-5 w-5" />, standardRate: 35, detailingRate: 63 },
]

// Cleanliness levels and their multipliers
const cleanlinessLevels = [
  { level: 1, label: "Light", multiplier: 1.0, description: "Regular maintenance cleaning" },
  { level: 2, label: "Medium", multiplier: 1.3, description: "Moderate dirt and dust" },
  { level: 3, label: "Deep", multiplier: 1.7, description: "Heavy dirt and stains" },
  { level: 4, label: "Biohazard", multiplier: 0, description: "Requires specialized cleaning", disabled: true },
]

// Frequency options and their adjustments
const frequencyOptions = [
  { id: "weekly", label: "Weekly", initialMultiplier: 1.05, discountMultiplier: 0.88 },
  { id: "biweekly", label: "Biweekly", initialMultiplier: 1.03, discountMultiplier: 0.92 },
  { id: "monthly", label: "Monthly", initialMultiplier: 1.0, discountMultiplier: 0.95 },
  { id: "annual", label: "Annual", initialMultiplier: 1.15, discountMultiplier: 0.8 },
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
  const [serviceType, setServiceType] = useState<"standard" | "detailing">("standard")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(1)
  const [frequency, setFrequency] = useState("monthly")
  const [allowVideo, setAllowVideo] = useState(false)
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [isServiceAvailable, setIsServiceAvailable] = useState(true)

  // State for modals and UI
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const { addItem, cart } = useCart()
  const { toast } = useToast()

  // Check if terms have been accepted
  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted")
    if (accepted === "true") {
      setTermsAccepted(true)
    } else {
      // Show terms popup if not accepted on first visit
      setShowTermsModal(true)
    }
  }, [])

  // Calculate price whenever selections change
  useEffect(() => {
    calculatePrice()
  }, [selectedRooms, serviceType, cleanlinessLevel, frequency, allowVideo])

  // Function to calculate the price
  const calculatePrice = () => {
    // 1. Calculate base price
    let basePrice = 0
    for (const roomType of roomTypes) {
      const count = selectedRooms[roomType.id] || 0
      const rate = serviceType === "standard" ? roomType.standardRate : roomType.detailingRate
      basePrice += count * rate
    }

    // 2. Apply cleanliness multiplier
    const cleanlinessMultiplier = cleanlinessLevels.find((c) => c.level === cleanlinessLevel)?.multiplier || 1
    let price = basePrice * cleanlinessMultiplier

    // 3. Apply frequency adjustment
    const frequencyOption = frequencyOptions.find((f) => f.id === frequency)
    if (frequencyOption) {
      price = price * frequencyOption.discountMultiplier
    }

    // 4. Apply video discount
    if (allowVideo) {
      price -= 25
    }

    // Check if service is available (Level 3-4 cleanliness with Standard service)
    const isUnavailable = (cleanlinessLevel >= 3 && serviceType === "standard") || cleanlinessLevel === 4
    setIsServiceAvailable(!isUnavailable)

    // Set the calculated price (rounded to 2 decimal places)
    setCalculatedPrice(Math.max(0, Math.round(price * 100) / 100))
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

  // Show address modal when Add to Cart is clicked
  const handleAddToCart = () => {
    if (!isServiceAvailable) {
      toast({
        title: "Service Unavailable",
        description: "Please select a lower cleanliness level or switch to Detailing service.",
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

    // Get the room types that were selected
    const selectedRoomsList = Object.entries(selectedRooms)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => {
        const roomType = roomTypes.find((r) => r.id === type)
        return `${roomType?.name || type} x${count}`
      })
      .join(", ")

    // Apply discount if video recording is allowed
    const finalPrice = allowVideo ? calculatedPrice : calculatedPrice

    // Generate a unique ID that includes the address to help with combining similar items
    const itemId = `custom-cleaning-${addressData.address.replace(/\s+/g, "-").toLowerCase()}-${serviceType}-${frequency}`

    // Add to cart with customer data
    addItem({
      id: itemId,
      name: serviceName,
      price: finalPrice,
      priceId: "price_custom_cleaning",
      image: "/home-cleaning.png",
      quantity: 1,
      metadata: {
        rooms: selectedRoomsList,
        frequency,
        serviceType,
        cleanlinessLevel,
        allowVideo,
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
        },
      },
    })

    // Show success message
    toast({
      title: "Added to cart!",
      description: `${serviceName} has been added to your cart.`,
    })
  }

  // Function to open terms and conditions
  const handleOpenTerms = () => {
    setShowTermsModal(true)
  }

  // Handle terms acceptance
  const handleTermsAccept = () => {
    setTermsAccepted(true)
    localStorage.setItem("termsAccepted", "true")
    setShowTermsModal(false)

    toast({
      title: "Terms Accepted",
      description: "Thank you for accepting our terms and conditions.",
    })
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
                <CardContent className="p-6">
                  {/* Service Type Toggle */}
                  <div className="mb-8">
                    <Label className="text-base font-medium mb-3 block">Service Type</Label>
                    <Tabs
                      defaultValue="standard"
                      value={serviceType}
                      onValueChange={(value) => setServiceType(value as "standard" | "detailing")}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="standard" className="text-sm md:text-base">
                          Standard Cleaning
                        </TabsTrigger>
                        <TabsTrigger value="detailing" className="text-sm md:text-base">
                          Premium Detailing
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <p className="text-sm text-gray-500 mt-2">
                      {serviceType === "standard"
                        ? "Basic cleaning for regular maintenance"
                        : "Deep cleaning with extra attention to details (1.8x standard rate)"}
                    </p>
                  </div>

                  {/* Room Selector */}
                  <div className="mb-8">
                    <Label className="text-base font-medium mb-3 block">Select Rooms</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roomTypes.map((room) => (
                        <div key={room.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">{room.icon}</div>
                            <div>
                              <p className="font-medium">{room.name}</p>
                              <p className="text-sm text-gray-500">
                                ${serviceType === "standard" ? room.standardRate : room.detailingRate} per room
                              </p>
                            </div>
                          </div>
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
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500 flex justify-between">
                      <span>Min: 1 room</span>
                      <span>Total rooms: {getTotalRoomCount()}</span>
                      <span>Max: 10 per type</span>
                    </div>
                  </div>

                  {/* Cleanliness Level Slider */}
                  <div className="mb-8">
                    <Label className="text-base font-medium mb-3 block">Cleanliness Level</Label>
                    <div className="px-2">
                      <Slider
                        value={[cleanlinessLevel]}
                        min={1}
                        max={4}
                        step={1}
                        onValueChange={(value) => setCleanlinessLevel(value[0])}
                        className="mb-6"
                      />
                      <div className="flex justify-between">
                        {cleanlinessLevels.map((level) => (
                          <div
                            key={level.level}
                            className={cn("text-center flex-1", cleanlinessLevel === level.level && "font-medium")}
                          >
                            <div className="text-sm">{level.label}</div>
                            <div className="text-xs text-gray-500">
                              {level.level === 4 ? "N/A" : `×${level.multiplier}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {cleanlinessLevel >= 3 && serviceType === "standard" && (
                      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 text-sm rounded-r flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Warning: High Cleanliness Level</p>
                          <p>For deep cleaning needs, we recommend our Premium Detailing service.</p>
                        </div>
                      </div>
                    )}
                    {cleanlinessLevel === 4 && (
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

                  {/* Frequency Dropdown */}
                  <div className="mb-8">
                    <Label className="text-base font-medium mb-3 block">Cleaning Frequency</Label>
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
                    <p className="text-sm text-gray-500 mt-2">Regular cleaning schedules receive discounted rates</p>
                  </div>

                  {/* Video Discount Checkbox */}
                  <div className="mb-8">
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

                  {/* Terms and Conditions Link */}
                  <div className="flex items-center justify-center mb-6">
                    <Button
                      variant="link"
                      onClick={handleOpenTerms}
                      className="text-sm md:text-base text-gray-600 hover:text-blue-600 flex items-center"
                    >
                      {termsAccepted ? (
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 mr-1" />
                      )}
                      {termsAccepted ? "Terms Accepted" : "View Terms and Conditions"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Floating Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="text-xl flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Price Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
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
                        <span className="text-gray-600">Cleanliness Level:</span>
                        <span className="font-medium">
                          {cleanlinessLevels.find((c) => c.level === cleanlinessLevel)?.label || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-medium">
                          {frequencyOptions.find((f) => f.id === frequency)?.label || "N/A"}
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
                          ${calculatedPrice.toFixed(2)}
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
                        {cleanlinessLevel === 4 && (
                          <Badge variant="destructive" className="mt-1">
                            Service Unavailable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    disabled={!isServiceAvailable || getTotalRoomCount() === 0}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Sparkles className="h-5 w-5 text-white animate-pulse" />
                    </span>
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

                  {/* Terms Status Indicator */}
                  <div className="mt-6 flex justify-center">
                    {termsAccepted ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 flex items-center"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Terms Accepted
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 flex items-center"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Terms Not Accepted
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Price:</p>
            <p className="text-xl font-bold">${calculatedPrice.toFixed(2)}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!isServiceAvailable || getTotalRoomCount() === 0}
            className="gap-2"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Address Collection Modal */}
      <AddressCollectionModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSubmit={handleAddressSubmit}
        calculatedPrice={calculatedPrice}
      />

      {/* Enhanced Terms Modal */}
      <EnhancedTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
        initialTab="terms"
      />
    </div>
  )
}
