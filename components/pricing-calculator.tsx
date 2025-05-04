"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  Info,
  Calendar,
  Home,
  Clock,
  Bed,
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
} from "lucide-react"
import { ROOM_CONFIG } from "@/lib/room-config"
import CleanlinessSlider from "./cleanliness-slider"
import ServiceTypeSelector from "./service-type-selector"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getFormEmoji, getCommonMetadata } from "@/lib/form-utils"

interface PricingCalculatorProps {
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

export default function PricingCalculator({ onCalculationComplete, onAddToCart }: PricingCalculatorProps) {
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

  const [frequency, setFrequency] = useState("one_time")
  const [serviceType, setServiceType] = useState<"standard" | "detailing">("standard")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(7)
  const [totalPrice, setTotalPrice] = useState(0)
  const [showItemized, setShowItemized] = useState(false)
  const [itemizedDetails, setItemizedDetails] = useState<Array<{ label: string; amount: number | null }>>([])
  const [addressId, setAddressId] = useState(`address-${Date.now()}`)
  const [hasSelections, setHasSelections] = useState(false)
  const [paymentFrequency, setPaymentFrequency] = useState<"per_service" | "monthly" | "yearly">("per_service")
  const [showServiceDetails, setShowServiceDetails] = useState(false)
  const [showVipCallDialog, setShowVipCallDialog] = useState(false)

  // State for collapsible sections
  const [serviceTypeOpen, setServiceTypeOpen] = useState(false)
  const [cleanlinessLevelOpen, setCleanlinessLevelOpen] = useState(false)

  const { toast } = useToast()
  const { addItem } = useCart()

  // Calculate price whenever rooms, frequency, serviceType, or cleanlinessLevel changes
  useEffect(() => {
    calculatePrice()
  }, [rooms, frequency, serviceType, cleanlinessLevel, paymentFrequency])

  // Update payment frequency when VIP daily is selected
  useEffect(() => {
    if (frequency === "vip_daily") {
      setPaymentFrequency("per_service")
    }
  }, [frequency])

  const handleRoomChange = (roomType: string, value: string) => {
    setRooms((prev) => ({
      ...prev,
      [roomType]: Number.parseInt(value),
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatRoomName = (name: string) => {
    return name.replace(/_/g, " ").toUpperCase()
  }

  const calculateDiscount = (newPrice: number, originalPrice: number) => {
    return (((originalPrice - newPrice) / originalPrice) * 100).toFixed(2)
  }

  const getPriceMultiplier = () => {
    let multiplier = 1

    // Apply service type multiplier
    if (serviceType === "detailing") {
      multiplier *= 3.5
    }

    // Apply cleanliness level multiplier
    if (cleanlinessLevel >= 4 && cleanlinessLevel < 7) {
      multiplier *= 3.5
    }

    return multiplier
  }

  const isServiceAvailable = () => {
    return cleanlinessLevel >= 4
  }

  // Get number of services per year based on frequency
  const getServicesPerYear = () => {
    switch (frequency) {
      case "weekly":
        return 52
      case "biweekly":
        return 26
      case "monthly":
        return 12
      case "semi_annual":
        return 2
      case "annually":
        return 1
      case "vip_daily":
        return 365
      case "one_time":
      default:
        return 1
    }
  }

  // Calculate payment multiplier based on payment frequency
  const getPaymentMultiplier = () => {
    // If one-time service, no discount regardless of payment frequency
    if (frequency === "one_time") {
      return 1
    }

    // Get number of services per year
    const servicesPerYear = getServicesPerYear()

    // For recurring services, discount depends on payment frequency relative to service frequency
    switch (paymentFrequency) {
      case "monthly":
        // Only apply discount if service is more frequent than monthly
        if (servicesPerYear > 12) {
          return 0.98 // 2% discount for monthly payments on more frequent services
        }
        return 1 // No discount if service is monthly or less frequent

      case "yearly":
        // Only apply discount if service is more frequent than yearly
        if (servicesPerYear > 1) {
          return 0.92 // 8% discount for yearly payments on more frequent services
        }
        return 1 // No discount if service is yearly

      case "per_service":
      default:
        return 1 // No discount for per-service payments
    }
  }

  // Calculate number of payments per year
  const getPaymentsPerYear = () => {
    switch (paymentFrequency) {
      case "monthly":
        return 12
      case "yearly":
        return 1
      case "per_service":
      default:
        return getServicesPerYear()
    }
  }

  // Update the calculatePrice function to reflect the new pricing structure
  const calculatePrice = () => {
    // Calculate base price from room selections
    const basePrice = Object.entries(ROOM_CONFIG.roomPrices).reduce((total, [roomType, price]) => {
      const numRooms = rooms[roomType as keyof typeof rooms] || 0
      return total + price * numRooms
    }, 0)

    // Get frequency multiplier
    const frequencyMultiplier =
      ROOM_CONFIG.frequencyMultipliers[frequency as keyof typeof ROOM_CONFIG.frequencyMultipliers]

    // Check if there are any room selections
    const hasRoomSelections = Object.values(rooms).some((value) => value > 0)
    setHasSelections(hasRoomSelections)

    // Apply price multiplier based on service type and cleanliness level
    const priceMultiplier = getPriceMultiplier()

    // Calculate price per service
    let pricePerService = hasRoomSelections
      ? basePrice * frequencyMultiplier * priceMultiplier + ROOM_CONFIG.serviceFee
      : 0

    if (!hasRoomSelections) {
      pricePerService = 0
    }

    // Apply payment frequency discount
    const paymentMultiplier = getPaymentMultiplier()
    pricePerService = pricePerService * paymentMultiplier

    // Calculate total upfront payment based on payment frequency
    const servicesPerYear = getServicesPerYear()
    const paymentsPerYear = getPaymentsPerYear()
    const servicesPerPayment = servicesPerYear / paymentsPerYear
    const totalUpfrontPayment = pricePerService * servicesPerPayment

    setTotalPrice(totalUpfrontPayment)

    // Generate itemized details
    const details: Array<{ label: string; amount: number | null }> = []

    // Add room details
    Object.entries(ROOM_CONFIG.roomPrices).forEach(([roomType, price]) => {
      const numRooms = rooms[roomType as keyof typeof rooms] || 0
      if (numRooms > 0) {
        details.push({
          label: `${formatRoomName(roomType)} (${numRooms})`,
          amount: price * numRooms,
        })
      }
    })

    // Add frequency adjustment if applicable
    if (hasRoomSelections && frequency !== "weekly") {
      const weeklyPrice = basePrice * ROOM_CONFIG.frequencyMultipliers.weekly
      const currentPrice = basePrice * frequencyMultiplier
      const priceDifference = currentPrice - weeklyPrice

      if (priceDifference < 0) {
        const discountPercentage = calculateDiscount(currentPrice, weeklyPrice)
        details.push({
          label: `${frequency.charAt(0).toUpperCase() + frequency.slice(1).replace("_", " ")} Discount (${discountPercentage}% off)`,
          amount: null,
        })
      } else {
        details.push({
          label: `${frequency.charAt(0).toUpperCase() + frequency.slice(1).replace("_", " ")} Adjustment`,
          amount: null,
        })
      }
    }

    // Add payment frequency discount
    if (paymentFrequency !== "per_service" && frequency !== "one_time") {
      const servicesPerYear = getServicesPerYear()

      // Only show discount if payment is less frequent than service
      if (
        (paymentFrequency === "monthly" && servicesPerYear > 12) ||
        (paymentFrequency === "yearly" && servicesPerYear > 1)
      ) {
        const discountLabel = paymentFrequency === "yearly" ? "15%" : "5%"
        details.push({
          label: `${paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1)} payment discount (${discountLabel})`,
          amount: null,
        })
      } else {
        // Just mention the payment plan without discount
        details.push({
          label: `${paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1)} payment plan`,
          amount: null,
        })
      }
    }

    // Add service type adjustment
    if (hasRoomSelections && serviceType === "detailing") {
      details.push({
        label: "Premium Detailing (3.5x)",
        amount: null,
      })
    }

    // Add cleanliness level adjustment
    if (hasRoomSelections && cleanlinessLevel >= 4 && cleanlinessLevel < 7) {
      details.push({
        label: "Extra Cleaning Required (3.5x)",
        amount: null,
      })
    }

    // Add service fee
    if (hasRoomSelections) {
      details.push({
        label: "Service Fee",
        amount: ROOM_CONFIG.serviceFee,
      })
    }

    // Add payment frequency explanation
    if (hasRoomSelections && frequency !== "one_time" && paymentFrequency !== "per_service") {
      details.push({
        label: `Paying for ${servicesPerPayment} services upfront (${paymentFrequency})`,
        amount: null,
      })
    }

    setItemizedDetails(details)

    // Determine if the service is recurring and the interval
    const isRecurring = frequency !== "one_time"
    let recurringInterval: "week" | "month" | "year" = "month"

    if (frequency === "weekly" || frequency === "biweekly") {
      recurringInterval = "week"
    } else if (frequency === "monthly") {
      recurringInterval = "month"
    } else {
      recurringInterval = "year"
    }

    // Call the callback if provided
    if (onCalculationComplete) {
      onCalculationComplete({
        rooms,
        frequency,
        totalPrice: totalUpfrontPayment,
        serviceType,
        cleanlinessLevel,
        priceMultiplier,
        isServiceAvailable: isServiceAvailable(),
        addressId,
        paymentFrequency,
        isRecurring,
        recurringInterval,
      })
    }
  }

  // Handle the add to cart button click
  const handleAddToCart = () => {
    if (!hasSelections) {
      toast({
        title: "No rooms selected",
        description: "Please select at least one room to add to cart",
        variant: "destructive",
      })
      return
    }

    if (!isServiceAvailable()) {
      toast({
        title: "Service unavailable",
        description: "Please contact us for extremely dirty conditions",
        variant: "destructive",
      })
      return
    }

    // Show service details modal
    setShowServiceDetails(true)
  }

  // Handle service upgrade
  const handleServiceUpgrade = () => {
    setServiceType("detailing")
    toast({
      title: "Service upgraded",
      description: "Your service has been upgraded to Premium Detailing",
    })
  }

  // Handle final add to cart after viewing details
  const handleFinalAddToCart = () => {
    // Create enhanced data object for analytics and sheet tracking
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
      formType: "pricing",
      meta: getCommonMetadata(),
      data: {
        serviceDetails: {
          serviceType,
          frequency,
          cleanlinessLevel,
          totalRooms: Object.values(rooms).reduce((sum, count) => sum + count, 0),
          roomBreakdown: Object.entries(rooms)
            .filter(([_, count]) => count > 0)
            .reduce(
              (acc, [type, count]) => {
                acc[type] = count
                return acc
              },
              {} as Record<string, number>,
            ),
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

    // Add to cart with source tracking
    addItem({
      id: `custom-cleaning-${Date.now()}`,
      name: `${serviceType === "standard" ? "Standard" : "Premium"} Cleaning Service`,
      price: totalPrice,
      priceId: "price_custom_cleaning",
      quantity: 1,
      sourceSection: "Price Calculator", // Add source section for analytics
      metadata: {
        serviceType,
        frequency,
        cleanlinessLevel,
        rooms,
        paymentFrequency,
        calculatorData: serviceData, // Add the enhanced data
        customer: {
          addressId,
        },
      },
    })

    // Also send this data directly to the Google Sheet for immediate tracking
    // This helps track calculator usage even if the user doesn't complete checkout
    try {
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

      fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: "pricing_usage",
          name: "Pricing User",
          email: "anonymous@pricing.use",
          message: `${getFormEmoji("pricing")} Pricing Calculator: ${serviceType} ${frequency} service configured`,
          meta: getCommonMetadata(),
          data: serviceData,
        }),
      }).catch((error) => {
        console.error("Error logging pricing usage:", error)
      })
    } catch (error) {
      console.error("Error logging pricing usage:", error)
    }

    // Close the modal
    setShowServiceDetails(false)

    // Ensure body scroll is not locked
    setTimeout(() => {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }, 100)

    // Call the onAddToCart callback if provided
    if (onAddToCart) {
      onAddToCart()
    }

    // Show success toast
    toast({
      title: "Added to cart",
      description: "Your cleaning service has been added to the cart",
      duration: 3000,
    })
  }

  // Get payment frequency description
  const getPaymentFrequencyDescription = () => {
    if (frequency === "one_time") {
      return "One-time payment"
    }

    const servicesPerYear = getServicesPerYear()
    const paymentsPerYear = getPaymentsPerYear()
    const servicesPerPayment = servicesPerYear / paymentsPerYear

    switch (paymentFrequency) {
      case "per_service":
        return `Pay each time service occurs`
      case "monthly":
        if (servicesPerYear > 12) {
          return `Pay monthly (${servicesPerPayment.toFixed(1)} services per payment, 2% discount)`
        } else if (frequency === "monthly") {
          return `Pay monthly (matches service frequency)`
        } else {
          return `Pay monthly (prepayment for less frequent service)`
        }
      case "yearly":
        if (servicesPerYear > 1) {
          return `Pay yearly (${servicesPerYear} services per payment, 8% discount)`
        } else {
          return `Pay yearly (matches service frequency)`
        }
      default:
        return "Select payment frequency"
    }
  }

  return (
    <div className="pricing-container flex flex-col md:flex-row gap-6">
      <div className="pricing-display flex-1 md:mr-8">
        <form id="price-calculator" className="space-y-8">
          {/* Service Type Selector - Improved Collapsible */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setServiceTypeOpen(!serviceTypeOpen)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium text-lg">Service Type</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${serviceTypeOpen ? "rotate-180" : ""}`}
              />
            </button>

            {serviceTypeOpen && (
              <div className="px-4 pb-6 pt-2 border-t">
                <ServiceTypeSelector value={serviceType} onChange={setServiceType} />
              </div>
            )}
          </div>

          {/* Cleanliness Level Slider - Improved Collapsible */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setCleanlinessLevelOpen(!cleanlinessLevelOpen)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium text-lg">Cleanliness Level</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${cleanlinessLevelOpen ? "rotate-180" : ""}`}
              />
            </button>

            {cleanlinessLevelOpen && (
              <div className="px-4 pb-6 pt-2 border-t">
                <CleanlinessSlider onChange={setCleanlinessLevel} />
              </div>
            )}
          </div>

          {!isServiceAvailable() && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Service currently unavailable for extremely dirty conditions. Please contact us for a custom quote and
                assessment.
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Room Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Home className="h-5 w-5 mr-2" />
              Select Rooms to Clean
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(ROOM_CONFIG.roomPrices).map(([roomType, price]) => {
                // Define icons for each room type
                const roomIcons: Record<string, React.ReactNode> = {
                  master_bedroom: <Bed className="h-5 w-5" />,
                  bedroom: <Bed className="h-5 w-5" />,
                  bathroom: <Bath className="h-5 w-5" />,
                  kitchen: <Utensils className="h-5 w-5" />,
                  living_room: <Sofa className="h-5 w-5" />,
                  dining_room: <UtensilsCrossed className="h-5 w-5" />,
                  office: <Briefcase className="h-5 w-5" />,
                  playroom: <Gamepad2 className="h-5 w-5" />,
                  mudroom: <Boot className="h-5 w-5" />,
                  laundry_room: <Shirt className="h-5 w-5" />,
                  sunroom: <Sun className="h-5 w-5" />,
                  guest_room: <Users className="h-5 w-5" />,
                  garage: <Car className="h-5 w-5" />,
                }

                return (
                  <Card
                    key={roomType}
                    className="p-6 hover:shadow-md transition-all hover:-translate-y-1 hover:border-primary"
                  >
                    <div className="flex items-center mb-3">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        {roomIcons[roomType] || <Home className="h-5 w-5" />}
                      </div>
                      <label htmlFor={roomType} className="block font-semibold text-gray-700 dark:text-gray-300">
                        {formatRoomName(roomType)}
                      </label>
                    </div>
                    <Select
                      value={rooms[roomType as keyof typeof rooms].toString()}
                      onValueChange={(value) => handleRoomChange(roomType, value)}
                    >
                      <SelectTrigger>
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
                  </Card>
                )
              })}
            </div>
          </div>
        </form>
      </div>

      <div className="price-display w-full md:w-[400px] sticky top-0 pt-8">
        <div className="total-price-container bg-gradient-to-r from-indigo-500 to-indigo-700 p-8 rounded-xl text-white flex justify-between items-center mb-6 shadow-lg relative overflow-hidden">
          <div>
            <p className="text-lg">Total Upfront Payment:</p>
            <span
              id="total_price"
              className={cn("text-4xl font-bold block mt-2", cleanlinessLevel < 4 ? "line-through" : "")}
            >
              {formatCurrency(totalPrice)}
            </span>
            {cleanlinessLevel < 4 && <span className="text-sm font-medium">Contact us for a custom quote</span>}
          </div>
          <ChevronDown
            className={`h-8 w-8 cursor-pointer transition-transform ${showItemized ? "rotate-180" : ""}`}
            onClick={() => setShowItemized(!showItemized)}
          />
        </div>

        <Card
          className={`frequency-selection bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white mb-6 transition-all ${showItemized ? "mb-0" : ""}`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <label htmlFor="frequency" className="text-xl font-medium">
                  Service Frequency:
                </label>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-white/80 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-gray-800">
                    <p className="max-w-xs">How often would you like your cleaning service?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="bg-white/90 border-white/30 text-gray-800">
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

            {frequency !== "one_time" && frequency !== "vip_daily" && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <label htmlFor="paymentFrequency" className="text-xl font-medium">
                      Payment Frequency:
                    </label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-white/80 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white text-gray-800">
                        <p className="max-w-xs">How often would you like to be billed?</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                  <SelectTrigger className="bg-white/90 border-white/30 text-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_service">Pay Per Service</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>

                <p className="mt-2 text-sm text-white/80">{getPaymentFrequencyDescription()}</p>
              </div>
            )}

            {frequency === "vip_daily" && (
              <div className="mt-4 bg-white/20 p-4 rounded-md">
                <p className="text-sm">
                  VIP Daily service is our premium offering with dedicated staff. Please contact us for details.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setShowVipCallDialog(true)}
                >
                  Request VIP Consultation
                </Button>
              </div>
            )}
          </div>
        </Card>

        {showItemized && (
          <Card className="mb-6 border-t-0 rounded-t-none">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Itemized Breakdown</h3>
              <div className="space-y-2">
                {itemizedDetails.map((detail, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">{detail.label}</span>
                    {detail.amount !== null && <span>{formatCurrency(detail.amount)}</span>}
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Button
          onClick={onAddToCart}
          disabled={!hasSelections || !isServiceAvailable()}
          className="w-full py-6 text-lg"
        >
          {!hasSelections
            ? "Select Rooms to Continue"
            : !isServiceAvailable()
              ? "Contact Us for Quote"
              : `Add to Cart - ${formatCurrency(totalPrice)}`}
        </Button>

        {!hasSelections && (
          <p className="text-sm text-gray-500 mt-2 text-center">Please select at least one room to clean.</p>
        )}
      </div>
    </div>
  )
}
