"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  ChevronDown,
  Info,
  Check,
  Bed,
  BedDouble,
  Bath,
  Utensils,
  Sofa,
  UtensilsCrossed,
  Briefcase,
  Gamepad2,
  HardDriveIcon as Boot,
  Shirt,
  Sun,
  Users,
  Car,
  Brush,
  Phone,
  Shield,
} from "lucide-react"
import { ROOM_CONFIG } from "@/lib/room-config"
import CleanlinessSlider from "./cleanliness-slider"
import ServiceTypeSelector from "./service-type-selector"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getFormEmoji, getCommonMetadata } from "@/lib/form-utils"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function PriceCalculator({ onCalculationComplete, onAddToCart }) {
  const [rooms, setRooms] = useState({
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
  const [frequency, setFrequency] = useState("one_time")
  const [serviceType, setServiceType] = useState("standard")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(7)
  const [totalPrice, setTotalPrice] = useState(0)
  const [showItemized, setShowItemized] = useState(false)
  const [itemizedDetails, setItemizedDetails] = useState([])
  const [addressId, setAddressId] = useState(`address-${Date.now()}`)
  const [hasSelections, setHasSelections] = useState(false)
  const [paymentFrequency, setPaymentFrequency] = useState("per_service")
  const [showServiceDetails, setShowServiceDetails] = useState(false)
  const { toast } = useToast()
  const { addItem } = useCart()

  // Calculate price whenever inputs change
  useEffect(() => calculatePrice(), [rooms, frequency, serviceType, cleanlinessLevel, paymentFrequency])

  const handleRoomChange = (roomType, value) => setRooms((prev) => ({ ...prev, [roomType]: Number.parseInt(value) }))

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

  const formatRoomName = (name) => name.replace(/_/g, " ")

  // Combined utility functions for price calculation
  const calculatePrice = () => {
    // Calculate base price from room selections
    const basePrice = Object.entries(ROOM_CONFIG.roomPrices).reduce((total, [roomType, price]) => {
      return total + price * (rooms[roomType] || 0)
    }, 0)

    // Get frequency multiplier
    const frequencyMultiplier = ROOM_CONFIG.frequencyMultipliers[frequency] || 1

    // Check if there are any room selections
    const hasRoomSelections = Object.values(rooms).some((value) => value > 0)
    setHasSelections(hasRoomSelections)

    // Calculate multipliers and service availability
    const priceMultiplier = getPriceMultiplier()
    const isServiceAvailable = cleanlinessLevel >= 4

    // Calculate payment details
    const servicesPerYear = getServicesPerYear()
    const paymentsPerYear = getPaymentsPerYear()
    const servicesPerPayment = servicesPerYear / paymentsPerYear
    const paymentMultiplier = getPaymentMultiplier()

    // Calculate final price
    let pricePerService = hasRoomSelections
      ? basePrice * frequencyMultiplier * priceMultiplier + ROOM_CONFIG.serviceFee
      : 0
    pricePerService = pricePerService * paymentMultiplier
    const totalUpfrontPayment = pricePerService * servicesPerPayment

    setTotalPrice(totalUpfrontPayment)
    generateItemizedDetails(basePrice, frequencyMultiplier, hasRoomSelections)

    // Call the callback if provided
    if (onCalculationComplete && hasRoomSelections) {
      onCalculationComplete({
        rooms,
        frequency,
        totalPrice: totalUpfrontPayment,
        serviceType,
        cleanlinessLevel,
        priceMultiplier,
        isServiceAvailable,
        addressId,
        paymentFrequency,
      })
    }
  }

  // Helper functions for price calculation
  const getPriceMultiplier = () => {
    let multiplier = 1
    if (serviceType === "detailing") multiplier *= 3.5
    if (cleanlinessLevel >= 4 && cleanlinessLevel < 7) multiplier *= 3.5
    return multiplier
  }

  const getServicesPerYear = () => {
    const servicesMap = { weekly: 52, biweekly: 26, monthly: 12, semi_annual: 2, annually: 1, vip_daily: 365 }
    return servicesMap[frequency] || 1
  }

  const getPaymentsPerYear = () => {
    const paymentsMap = { monthly: 12, yearly: 1, per_service: getServicesPerYear() }
    return paymentsMap[paymentFrequency] || getServicesPerYear()
  }

  const getPaymentMultiplier = () => {
    if (frequency === "one_time") return 1

    const servicesPerYear = getServicesPerYear()

    if (paymentFrequency === "monthly" && servicesPerYear > 12) return 0.98
    if (paymentFrequency === "yearly" && servicesPerYear > 1) return 0.92

    return 1
  }

  // Generate itemized details for display
  const generateItemizedDetails = (basePrice, frequencyMultiplier, hasRoomSelections) => {
    const details = []

    // Add room details
    Object.entries(ROOM_CONFIG.roomPrices).forEach(([roomType, price]) => {
      const numRooms = rooms[roomType] || 0
      if (numRooms > 0) {
        details.push({ label: `${formatRoomName(roomType)} (${numRooms})`, amount: price * numRooms })
      }
    })

    // Add other details based on selections
    if (hasRoomSelections) {
      // Add frequency adjustment
      if (frequency !== "weekly") {
        details.push({
          label: `${frequency.charAt(0).toUpperCase() + frequency.slice(1).replace("_", " ")} Adjustment`,
          amount: null,
        })
      }

      // Add payment frequency discount
      if (paymentFrequency !== "per_service" && frequency !== "one_time") {
        const servicesPerYear = getServicesPerYear()
        if (
          (paymentFrequency === "monthly" && servicesPerYear > 12) ||
          (paymentFrequency === "yearly" && servicesPerYear > 1)
        ) {
          const discountLabel = paymentFrequency === "yearly" ? "15%" : "5%"
          details.push({
            label: `${paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1)} payment discount (${discountLabel})`,
            amount: null,
          })
        }
      }

      // Add service type and cleanliness adjustments
      if (serviceType === "detailing") {
        details.push({ label: "Premium Detailing (3.5x)", amount: null })
      }

      if (cleanlinessLevel >= 4 && cleanlinessLevel < 7) {
        details.push({ label: "Extra Cleaning Required (3.5x)", amount: null })
      }

      // Add service fee
      details.push({ label: "Service Fee", amount: ROOM_CONFIG.serviceFee })
    }

    setItemizedDetails(details)
  }

  // Handle cart operations
  const handleAddToCart = () => {
    if (!hasSelections) {
      toast({
        title: "No rooms selected",
        description: "Please select at least one room to add to cart",
        variant: "destructive",
      })
      return
    }

    if (cleanlinessLevel < 4) {
      toast({
        title: "Service unavailable",
        description: "Please contact us for extremely dirty conditions",
        variant: "destructive",
      })
      return
    }

    // Skip showing the modal and directly call the final add to cart function
    handleFinalAddToCart()
  }

  const handleServiceUpgrade = () => {
    setServiceType("detailing")
    toast({ title: "Service upgraded", description: "Your service has been upgraded to Premium Detailing" })
  }

  const handleFinalAddToCart = () => {
    // Create service data object
    const serviceData = {
      name: `${serviceType === "standard" ? "Standard" : "Premium"} Cleaning Service`,
      serviceType,
      frequency,
      cleanlinessLevel,
      rooms: Object.entries(rooms)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => `${type} (${count})`)
        .join(", "),
      totalRooms: Object.values(rooms).reduce((sum, count) => sum + count, 0),
      paymentFrequency,
      formType: "calculator",
      meta: getCommonMetadata(),
      data: {
        serviceDetails: {
          serviceType,
          frequency,
          cleanlinessLevel,
          totalRooms: Object.values(rooms).reduce((sum, count) => sum + count, 0),
          roomBreakdown: Object.entries(rooms)
            .filter(([_, count]) => count > 0)
            .reduce((acc, [type, count]) => {
              acc[type] = count
              return acc
            }, {}),
        },
        calculatedPrice: totalPrice,
        priceMultiplier: getPriceMultiplier(),
        paymentDetails: {
          frequency: paymentFrequency,
          isRecurring: frequency !== "one_time",
          servicesPerYear: getServicesPerYear(),
          paymentsPerYear: getPaymentsPerYear(),
        },
        timestamp: new Date().toISOString(),
      },
    }

    // Add to cart
    addItem({
      id: `custom-cleaning-${Date.now()}`,
      name: `${serviceType === "standard" ? "Standard" : "Premium"} Cleaning Service`,
      price: totalPrice,
      priceId: "price_custom_cleaning",
      quantity: 1,
      sourceSection: "Price Calculator",
      metadata: {
        serviceType,
        frequency,
        cleanlinessLevel,
        rooms,
        paymentFrequency,
        calculatorData: serviceData,
        customer: { addressId },
      },
    })

    // Log calculator usage
    try {
      fetch(
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formType: "calculator_usage",
            name: "Calculator User",
            email: "anonymous@calculator.use",
            message: `${getFormEmoji("calculator")} Price Calculator: ${serviceType} ${frequency} service configured`,
            meta: getCommonMetadata(),
            data: serviceData,
          }),
        },
      ).catch((error) => console.error("Error logging calculator usage:", error))
    } catch (error) {
      console.error("Error logging calculator usage:", error)
    }

    setShowServiceDetails(false)
    if (onAddToCart) onAddToCart()
  }

  // Get payment frequency description
  const getPaymentFrequencyDescription = () => {
    if (frequency === "one_time") return "One-time payment"

    const servicesPerYear = getServicesPerYear()
    const paymentsPerYear = getPaymentsPerYear()
    const servicesPerPayment = servicesPerYear / paymentsPerYear

    if (paymentFrequency === "per_service") return "Pay each time service occurs"

    if (paymentFrequency === "monthly") {
      if (servicesPerYear > 12)
        return `Pay monthly (${servicesPerPayment.toFixed(1)} services per payment, 2% discount)`
      if (frequency === "monthly") return "Pay monthly (matches service frequency)"
      return "Pay monthly (prepayment for less frequent service)"
    }

    if (paymentFrequency === "yearly") {
      if (servicesPerYear > 1) return `Pay yearly (${servicesPerYear} services per payment, 8% discount)`
      return "Pay yearly (matches service frequency)"
    }

    return "Select payment frequency"
  }

  // Get room icon based on room type
  const getRoomIcon = (roomType) => {
    const icons = {
      master_bedroom: <Bed className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bedroom: <BedDouble className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      bathroom: <Bath className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      kitchen: <Utensils className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      living_room: <Sofa className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      dining_room: <UtensilsCrossed className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      office: <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      playroom: <Gamepad2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      mudroom: <Boot className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      laundry_room: <Shirt className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      sunroom: <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      guest_room: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      garage: <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    }
    return icons[roomType] || <Brush className="h-5 w-5 text-blue-600 dark:text-blue-400" />
  }

  // Add this useEffect after the other useEffect
  useEffect(() => {
    if (frequency === "vip_daily") {
      setPaymentFrequency("per_service")
    }
  }, [frequency])

  return (
    <div className="calculator-container flex flex-col lg:flex-row gap-8">
      <div className="calculator-display flex-1">
        <form id="price-calculator" className="space-y-8">
          {/* Service Type Selector */}
          <ServiceTypeSelector value={serviceType} onChange={setServiceType} />

          {/* Cleanliness Level Slider */}
          <CleanlinessSlider onChange={setCleanlinessLevel} />

          {cleanlinessLevel < 4 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Service currently unavailable for extremely dirty conditions. Please contact us for a custom quote.
              </AlertDescription>
            </Alert>
          )}

          <Separator className="my-8" />

          {/* Room Selection */}
          <div>
            <h3 className="text-xl font-medium mb-6 flex items-center">
              <span className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </span>
              Select Rooms to Clean
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(ROOM_CONFIG.roomPrices).map(([roomType, price]) => (
                <motion.div
                  key={roomType}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    className={`overflow-hidden transition-all ${rooms[roomType] > 0 ? "border-blue-400 dark:border-blue-500 shadow-md" : "border-gray-200 dark:border-gray-700"}`}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                          {getRoomIcon(roomType)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{formatRoomName(roomType)}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(price)}/room</p>
                        </div>
                      </div>

                      <Select
                        value={rooms[roomType].toString()}
                        onValueChange={(value) => handleRoomChange(roomType, value)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="0" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {rooms[roomType] > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/30 py-1 px-4 text-center">
                        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center">
                          <Check className="h-3 w-3 mr-1" /> Selected
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </form>
      </div>

      <div className="price-display w-full lg:w-[400px] sticky top-4 self-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="total-price-container bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-xl text-white flex justify-between items-center mb-6 shadow-lg relative overflow-hidden"
        >
          <div className="relative z-10">
            <p className="text-lg font-medium">Total Upfront Payment:</p>
            <span
              id="total_price"
              className={cn("text-4xl font-bold block mt-2", cleanlinessLevel < 4 ? "line-through" : "")}
            >
              {formatCurrency(totalPrice)}
            </span>
            {cleanlinessLevel < 4 && <span className="text-sm font-medium">Contact us for a custom quote</span>}
          </div>

          <div className="relative z-10">
            <ChevronDown
              className={`h-8 w-8 cursor-pointer transition-transform ${showItemized ? "rotate-180" : ""}`}
              onClick={() => setShowItemized(!showItemized)}
            />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-20 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600 opacity-20 rounded-full -ml-10 -mb-10"></div>
        </motion.div>

        {/* Add to Cart Button - Moved to be directly below pricing info */}
        {hasSelections && onAddToCart && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 mb-6"
          >
            <Button
              className="w-full py-6 text-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0"
              size="lg"
              onClick={handleAddToCart}
              disabled={cleanlinessLevel < 4 || totalPrice <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>

            {/* Satisfaction Guarantee */}
            <div className="mt-3 flex items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-help">
                      <Shield className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
                      <span>Satisfaction Guarantee</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-white text-gray-800 p-3">
                    <p>
                      If not satisfied, call us within 24 hours and we will redo parts for free within 24 hours (doesn't
                      cover new stains, spills, etc.)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="frequency-selection bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md mb-6"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <label htmlFor="frequency" className="text-xl font-medium">
                Service Frequency:
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-gray-800">
                    <p className="max-w-xs">How often would you like your cleaning service?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one_time">One-Time Cleaning</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Biweekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="semi_annual">Semi-Annually (2x a year)</SelectItem>
                <SelectItem value="annually">Annually (Yearly)</SelectItem>
                <SelectItem value="vip_daily">VIP Daily</SelectItem>
              </SelectContent>
            </Select>

            {frequency === "vip_daily" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
                className="mt-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded border border-blue-200 dark:border-blue-800"
              >
                <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <Phone className="h-3 w-3 mr-1" /> Call us at 602-800-0605 for VIP discount!
                </p>
              </motion.div>
            )}

            {frequency !== "one_time" && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <Label className="block mb-3 text-lg font-medium">Payment Frequency:</Label>
                <RadioGroup
                  value={paymentFrequency}
                  onValueChange={(value) => setPaymentFrequency(value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="per_service" id="per_service" />
                    <Label htmlFor="per_service" className="cursor-pointer">
                      Pay per service
                    </Label>
                  </div>

                  {frequency !== "vip_daily" && (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="cursor-pointer flex items-center">
                          {frequency === "weekly" || frequency === "biweekly" ? (
                            <>
                              Pay monthly
                              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                                2% discount
                              </Badge>
                            </>
                          ) : (
                            "Pay monthly"
                          )}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly" className="cursor-pointer flex items-center">
                          {frequency === "one_time" || frequency === "annually" ? (
                            "Pay yearly"
                          ) : (
                            <>
                              Pay yearly
                              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                                8% discount
                              </Badge>
                            </>
                          )}
                        </Label>
                      </div>
                    </>
                  )}
                </RadioGroup>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{getPaymentFrequencyDescription()}</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showItemized ? 1 : 0, height: showItemized ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className={`itemized-bill bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden`}
        >
          {showItemized && (
            <>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-lg">Itemized Breakdown</h3>
              </div>
              <ul id="itemized-list" className="divide-y">
                {itemizedDetails.map((item, index) => (
                  <li
                    key={index}
                    className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.amount !== null && (
                      <>
                        <span className="flex-1 border-b border-dotted border-gray-300 mx-4"></span>
                        <span>{formatCurrency(item.amount)}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 text-sm text-gray-500 dark:text-gray-400">
                <p className="italic">
                  1. Tax & fees included.
                  <br />
                  2. All payments are made upfront.
                  <br />
                  3. Discounts applied based on payment frequency.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
