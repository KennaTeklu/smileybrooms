"use client"

import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomDisplayNames } from "@/lib/room-tiers"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface ReviewStepProps {
  onPrevious: () => void
  checkoutData: any // This will still hold contact/address/payment, but service details come from cart
}

export default function ReviewStep({ onPrevious, checkoutData }: ReviewStepProps) {
  const { cart } = useCart()
  const customServiceItem = cart.items.find((item) => item.id.startsWith("custom-cleaning-"))

  if (!customServiceItem || !customServiceItem.metadata) {
    return (
      <div className="p-6 text-center text-red-500">
        No custom cleaning service found in cart. Please go back and configure your service.
        <Button onClick={onPrevious} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const {
    rooms,
    selectedTierIds,
    selectedAddOns,
    selectedReductions,
    frequency,
    cleanlinessLevel,
    isRecurring,
    recurringInterval,
    appliedCoupon,
    couponDiscount,
    serviceType,
  } = customServiceItem.metadata as {
    rooms: Record<string, number>
    selectedTierIds: Record<string, string>
    selectedAddOns: Record<string, string[]>
    selectedReductions: Record<string, string[]>
    frequency: string
    cleanlinessLevel: number
    isRecurring: boolean
    recurringInterval?: "week" | "month" | "year"
    appliedCoupon?: string | null
    couponDiscount?: number
    serviceType: string
  }

  const calculateDetailedPriceBreakdown = () => {
    let subtotal = 0
    const breakdown: { type: string; name: string; quantity?: number; price: number; isDiscount?: boolean }[] = []

    Object.entries(rooms).forEach(([roomType, count]) => {
      const selectedTierId = selectedTierIds[roomType]
      const tiers = getRoomTiers(roomType)
      const tier = tiers.find((t) => t.id === selectedTierId)

      if (tier) {
        const itemPrice = tier.price * count
        subtotal += itemPrice
        breakdown.push({
          type: "room",
          name: `${count} x ${roomDisplayNames[roomType]} (${tier.name})`,
          price: itemPrice,
        })
      }

      const roomAddOns = getRoomAddOns(roomType)
      ;(selectedAddOns[roomType] || []).forEach((addOnId) => {
        const addOn = roomAddOns.find((a) => a.id === addOnId)
        if (addOn) {
          const itemPrice = addOn.price * count
          subtotal += itemPrice
          breakdown.push({
            type: "add-on",
            name: `${count} x ${addOn.name}`,
            price: itemPrice,
          })
        }
      })

      const roomReductions = getRoomReductions(roomType)
      ;(selectedReductions[roomType] || []).forEach((reductionId) => {
        const reduction = roomReductions.find((r) => r.id === reductionId)
        if (reduction) {
          const itemPrice = reduction.discount * count
          subtotal -= itemPrice
          breakdown.push({
            type: "reduction",
            name: `${count} x ${reduction.name}`,
            price: -itemPrice, // Negative for display
            isDiscount: true,
          })
        }
      })
    })

    // Apply cleanliness level multiplier
    const priceMultiplier =
      cleanlinessLevel <= 20 ? 1.5 : cleanlinessLevel <= 50 ? 1.2 : cleanlinessLevel <= 80 ? 1.0 : 0.9
    if (priceMultiplier !== 1.0) {
      const adjustmentAmount = subtotal * (priceMultiplier - 1)
      subtotal += adjustmentAmount
      breakdown.push({
        type: "adjustment",
        name: `Cleanliness Adjustment (${cleanlinessLevel}% clean)`,
        price: adjustmentAmount,
      })
    }

    // Apply frequency discount/premium
    let frequencyAdjustment = 0
    if (frequency === "weekly") {
      frequencyAdjustment = subtotal * -0.2 // 20% discount
      breakdown.push({ type: "discount", name: "Weekly Discount (20%)", price: frequencyAdjustment, isDiscount: true })
    } else if (frequency === "bi-weekly") {
      frequencyAdjustment = subtotal * -0.1 // 10% discount
      breakdown.push({
        type: "discount",
        name: "Bi-Weekly Discount (10%)",
        price: frequencyAdjustment,
        isDiscount: true,
      })
    }
    subtotal += frequencyAdjustment

    // Apply coupon discount (this is already handled by cart context, but for detailed breakdown)
    if (appliedCoupon && couponDiscount && couponDiscount > 0) {
      const couponAmount = subtotal * couponDiscount
      subtotal -= couponAmount
      breakdown.push({
        type: "coupon",
        name: `Coupon: ${appliedCoupon} (${couponDiscount * 100}%)`,
        price: -couponAmount,
        isDiscount: true,
      })
    }

    return { breakdown, finalSubtotal: Math.max(0, subtotal) }
  }

  const { breakdown, finalSubtotal } = calculateDetailedPriceBreakdown()

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center">Review Your Order</h2>
      <p className="text-center text-muted-foreground">Please confirm your service details before proceeding.</p>

      {/* Service Summary */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Service Details</h3>
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Service Type:</span>
            <Badge
              variant={serviceType === "luxury" ? "destructive" : serviceType === "premium" ? "secondary" : "default"}
            >
              {serviceType.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Frequency:</span>
            <span>{frequency.replace("-", " ")}</span>
          </div>
          {isRecurring && (
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Recurring Interval:</span>
              <span>{recurringInterval}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="font-medium">Cleanliness Level:</span>
            <span>{cleanlinessLevel}%</span>
          </div>
        </div>

        <h4 className="text-lg font-medium mt-6 mb-2">Detailed Breakdown</h4>
        <div className="space-y-2">
          {breakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className={item.isDiscount ? "text-red-500" : ""}>{item.name}</span>
              <span className={item.isDiscount ? "text-red-500" : ""}>{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Estimated Total:</span>
          <span>{formatCurrency(finalSubtotal)}</span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Contact Information</h3>
        <div className="p-4 border rounded-md">
          <p>
            <strong>Name:</strong> {checkoutData.contact.firstName} {checkoutData.contact.lastName}
          </p>
          <p>
            <strong>Email:</strong> {checkoutData.contact.email}
          </p>
          <p>
            <strong>Phone:</strong> {checkoutData.contact.phone}
          </p>
        </div>
      </div>

      {/* Service Address */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Service Address</h3>
        <div className="p-4 border rounded-md">
          <p>
            <strong>Address:</strong> {checkoutData.address.address} {checkoutData.address.address2}
          </p>
          <p>
            <strong>City, State, Zip:</strong> {checkoutData.address.city}, {checkoutData.address.state}{" "}
            {checkoutData.address.zipCode}
          </p>
          {checkoutData.address.specialInstructions && (
            <p>
              <strong>Special Instructions:</strong> {checkoutData.address.specialInstructions}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Payment Method</h3>
        <div className="p-4 border rounded-md">
          <p>
            <strong>Method:</strong>{" "}
            {checkoutData.payment.paymentMethod === "card"
              ? "Credit/Debit Card"
              : checkoutData.payment.paymentMethod === "paypal"
                ? "PayPal"
                : "Apple Pay"}
          </p>
          <div className="flex items-start mt-2 text-sm text-blue-600">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Your card will only be charged after the cleaning service is completed to your satisfaction.</span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="agree-terms"
          checked={checkoutData.payment.agreeToTerms}
          // This checkbox is for display in review, actual agreement happens in PaymentStep
          disabled
        />
        <Label htmlFor="agree-terms">
          I agree to the{" "}
          <a href="/terms" className="underline">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </Label>
      </div>

      <CardFooter className="flex justify-between p-0 pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button>Confirm Booking</Button>
      </CardFooter>
    </div>
  )
}
