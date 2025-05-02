"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ChevronDown, Info } from "lucide-react"
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
import { ServiceDetailsModal } from "./service-details-modal"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getFormEmoji, getCommonMetadata } from "@/lib/form-utils"

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
  }) => void
  onAddToCart?: () => void
}

export default function PriceCalculator({ onCalculationComplete, onAddToCart }: PriceCalculatorProps) {
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
  const { toast } = useToast()
  const { addItem } = useCart()

  // Calculate price whenever rooms, frequency, serviceType, or cleanlinessLevel changes
  useEffect(() => {
    calculatePrice()
  }, [rooms, frequency, serviceType, cleanlinessLevel, paymentFrequency])

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

    // Call the callback if provided
    if (onCalculationComplete && hasRoomSelections) {
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
          formType: "calculator_usage",
          name: "Calculator User",
          email: "anonymous@calculator.use",
          message: `${getFormEmoji("calculator")} Price Calculator: ${serviceType} ${frequency} service configured`,
          meta: getCommonMetadata(),
          data: serviceData,
        }),
      }).catch((error) => {
        console.error("Error logging calculator usage:", error)
      })
    } catch (error) {
      console.error("Error logging calculator usage:", error)
    }

    // Close the modal
    setShowServiceDetails(false)

    // Call the onAddToCart callback if provided
    if (onAddToCart) {
      onAddToCart()
    }
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
    <div className="calculator-container flex flex-col md:flex-row gap-6">
      <div className="calculator-display flex-1 md:mr-8">
        <form id="price-calculator" className="space-y-8">
          {/* Service Type Selector */}
          <ServiceTypeSelector value={serviceType} onChange={setServiceType} />

          {/* Cleanliness Level Slider */}
          <CleanlinessSlider onChange={setCleanlinessLevel} />

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
            <h3 className="text-lg font-medium mb-4">Select Rooms to Clean</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(ROOM_CONFIG.roomPrices).map(([roomType, price]) => (
                <Card
                  key={roomType}
                  className="p-6 hover:shadow-md transition-all hover:-translate-y-1 hover:border-primary"
                >
                  <label
                    htmlFor={roomType}
                    className="block mb-3 font-semibold text-gray-700 dark:text-gray-300 pl-6 relative"
                  >
                    <span className="absolute left-0 top-1/2 transform -translate-y-1/2">🧹</span>
                    {formatRoomName(roomType)}:
                  </label>
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
              ))}
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
              <label htmlFor="frequency" className="text-xl font-medium">
                Service Frequency:
              </label>
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

            {frequency !== "one_time" && (
              <div className="mt-6 bg-white/20 p-4 rounded-md">
                <Label className="block mb-3 text-lg font-medium">Payment Frequency:</Label>
                <RadioGroup
                  value={paymentFrequency}
                  onValueChange={(value) => setPaymentFrequency(value as "per_service" | "monthly" | "yearly")}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="per_service" id="per_service" />
                    <Label htmlFor="per_service" className="cursor-pointer">
                      Pay per service
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">
                      {frequency === "weekly" || frequency === "biweekly" || frequency === "vip_daily"
                        ? "Pay monthly (2% discount)"
                        : "Pay monthly"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="cursor-pointer">
                      {frequency === "one_time" || frequency === "annually" ? "Pay yearly" : "Pay yearly (8% discount)"}
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-white/80 mt-2">{getPaymentFrequencyDescription()}</p>
              </div>
            )}
          </div>
        </Card>

        <div
          className={`itemized-bill bg-white/90 backdrop-blur-md rounded-xl border border-white/30 shadow-md overflow-hidden transition-all duration-300 ${showItemized ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0"}`}
        >
          <ul id="itemized-list" className="divide-y">
            {itemizedDetails.map((item, index) => (
              <li key={index} className="p-4 flex justify-between items-center hover:bg-blue-50/50 transition-colors">
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
          <p className="text-sm text-gray-500 italic p-4">
            1. Tax & fees included.
            <br />
            2. All payments are made upfront.
            <br />
            3. Discounts applied based on payment frequency.
          </p>
        </div>

        {hasSelections && onAddToCart && (
          <div className="mt-6">
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={!isServiceAvailable() || totalPrice <= 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>
        )}
      </div>

      {/* Service Details Modal */}
      <ServiceDetailsModal
        open={showServiceDetails}
        onOpenChange={setShowServiceDetails}
        serviceType={serviceType}
        frequency={frequency}
        cleanlinessLevel={cleanlinessLevel}
        totalPrice={totalPrice}
        onUpgrade={handleServiceUpgrade}
        onAddToCart={handleFinalAddToCart}
      />
    </div>
  )
}
