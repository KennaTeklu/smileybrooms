"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Package, Shield, MapPin, CreditCard, Check, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { createCheckoutSession } from "@/lib/actions"
import type { CheckoutData } from "@/lib/types"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomDisplayNames } from "@/lib/room-tiers"
import { Badge } from "@/components/ui/badge"

interface ReviewStepProps {
  checkoutData: CheckoutData
  onPrevious: () => void
}

export default function ReviewStep({ checkoutData, onPrevious }: ReviewStepProps) {
  const router = useRouter()
  const { cart, clearCart, applyCoupon } = useCart()
  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [couponCodeInput, setCouponCodeInput] = useState("")
  const [couponError, setCouponError] = useState<string | null>(null)

  const { contact: contactData, address: addressData, payment: paymentData } = checkoutData

  // Find the custom cleaning service item if it exists
  const customServiceItem = cart.items.find((item) => item.id.startsWith("custom-cleaning-"))

  // Calculate totals based on cart state, which now includes couponDiscount
  const subtotal = cart.subtotalPrice // Use subtotalPrice from cart context
  const videoDiscount = paymentData?.allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const totalBeforeTax = subtotal - videoDiscount - cart.couponDiscount // Use cart.couponDiscount
  const tax = totalBeforeTax * 0.08 // 8% tax
  const total = totalBeforeTax + tax

  useEffect(() => {
    // Reset coupon input and error if cart items or other discounts change
    setCouponCodeInput(cart.couponCode || "") // Keep input synced with applied coupon
    setCouponError(null)
  }, [cart.items, videoDiscount, cart.couponCode])

  const handleApplyCoupon = () => {
    setCouponError(null)
    if (couponCodeInput.trim() === "") {
      setCouponError("Please enter a coupon code.")
      toast({
        title: "Coupon Required",
        description: "Please enter a coupon code to apply.",
        variant: "destructive",
      })
      return
    }

    const success = applyCoupon(couponCodeInput) // Use the applyCoupon from context
    if (!success) {
      setCouponError("Invalid coupon code. Please try again.")
      // Toast is already handled by applyCoupon in cart-context
    }
  }

  const handleCheckout = async () => {
    if (!contactData || !addressData || !paymentData) {
      toast({
        title: "Missing Information",
        description: "Please complete all previous steps before checkout.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Prepare line items for Stripe
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        description: item.metadata?.description || `Service: ${item.name}`,
        images: item.image ? [item.image] : [],
        metadata: {
          itemId: item.id,
          ...item.metadata,
        },
      }))

      // Add video discount if applicable
      if (videoDiscount > 0) {
        customLineItems.push({
          name: "Video Recording Discount",
          amount: -videoDiscount, // Negative amount for discount
          quantity: 1,
          description: "Discount for allowing video recording during service",
        })
      }

      // Add coupon discount if applicable
      if (cart.couponDiscount > 0) {
        // Use cart.couponDiscount
        customLineItems.push({
          name: `Coupon Discount: ${cart.couponCode}`, // Use cart.couponCode
          amount: -cart.couponDiscount, // Negative amount for discount
          quantity: 1,
          description: `Discount applied with coupon code: ${cart.couponCode}`,
        })
      }

      // Create checkout session with Stripe
      const checkoutUrl = await createCheckoutSession({
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: contactData.email,
        customerData: {
          name: `${contactData.firstName} ${contactData.lastName}`,
          email: contactData.email,
          phone: contactData.phone,
          address: {
            line1: addressData.address,
            city: addressData.city,
            state: addressData.state,
            postal_code: addressData.zipCode,
            country: "US",
          },
        },
        allowPromotions: true,
        paymentMethodTypes: paymentData.paymentMethod === "card" ? ["card"] : undefined, // Restrict if not card
      })

      if (checkoutUrl) {
        // Clear checkout data from localStorage
        localStorage.removeItem("checkout-contact")
        localStorage.removeItem("checkout-address")
        localStorage.removeItem("checkout-payment")
        clearCart() // Clear cart after successful checkout initiation

        // Redirect to Stripe
        window.location.href = checkoutUrl
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateDetailedPriceBreakdown = () => {
    if (!customServiceItem || !customServiceItem.metadata) {
      return { breakdown: [], finalSubtotal: 0 }
    }

    const {
      rooms,
      selectedTierIds,
      selectedAddOns,
      selectedReductions,
      frequency,
      cleanlinessLevel,
      appliedCoupon: itemAppliedCoupon,
      couponDiscount: itemCouponDiscount,
    } = customServiceItem.metadata as {
      rooms: Record<string, number>
      selectedTierIds: Record<string, string>
      selectedAddOns: Record<string, string[]>
      selectedReductions: Record<string, string[]>
      frequency: string
      cleanlinessLevel: number
      appliedCoupon?: string | null
      couponDiscount?: number
    }

    let currentSubtotal = 0
    const breakdown: { type: string; name: string; quantity?: number; price: number; isDiscount?: boolean }[] = []

    Object.entries(rooms).forEach(([roomType, count]) => {
      const selectedTierId = selectedTierIds[roomType]
      const tiers = getRoomTiers(roomType)
      const tier = tiers.find((t) => t.id === selectedTierId)

      if (tier) {
        const itemPrice = tier.price * count
        currentSubtotal += itemPrice
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
          currentSubtotal += itemPrice
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
          currentSubtotal -= itemPrice
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
      const adjustmentAmount = currentSubtotal * (priceMultiplier - 1)
      currentSubtotal += adjustmentAmount
      breakdown.push({
        type: "adjustment",
        name: `Cleanliness Adjustment (${cleanlinessLevel}% clean)`,
        price: adjustmentAmount,
      })
    }

    // Apply frequency discount/premium
    let frequencyAdjustment = 0
    if (frequency === "weekly") {
      frequencyAdjustment = currentSubtotal * -0.2 // 20% discount
      breakdown.push({ type: "discount", name: "Weekly Discount (20%)", price: frequencyAdjustment, isDiscount: true })
    } else if (frequency === "bi-weekly") {
      frequencyAdjustment = currentSubtotal * -0.1 // 10% discount
      breakdown.push({
        type: "discount",
        name: "Bi-Weekly Discount (10%)",
        price: frequencyAdjustment,
        isDiscount: true,
      })
    }
    currentSubtotal += frequencyAdjustment

    // Apply coupon discount (from metadata, as it was applied at calculation time)
    if (itemAppliedCoupon && itemCouponDiscount && itemCouponDiscount > 0) {
      const couponAmount = currentSubtotal * itemCouponDiscount
      currentSubtotal -= couponAmount
      breakdown.push({
        type: "coupon",
        name: `Coupon: ${itemAppliedCoupon} (${itemCouponDiscount * 100}%)`,
        price: -couponAmount,
        isDiscount: true,
      })
    }

    return { breakdown, finalSubtotal: Math.max(0, currentSubtotal) }
  }

  const { breakdown, finalSubtotal } = calculateDetailedPriceBreakdown()

  if (cart.items.length === 0) {
    return (
      <div className="p-6 text-center text-red-500">
        Your cart is empty. Please go back and configure your service.
        <Button onClick={onPrevious} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Review Your Order
        </CardTitle>
        <CardDescription>Please review your order details before completing your purchase</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Order Summary */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </CardTitle>
            <CardDescription>
              {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} in your cart
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customServiceItem && customServiceItem.metadata ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Custom Cleaning Service Details</h3>
                <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Service Type:</span>
                    <Badge
                      variant={
                        customServiceItem.metadata.serviceType === "luxury"
                          ? "destructive"
                          : customServiceItem.metadata.serviceType === "premium"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {customServiceItem.metadata.serviceType?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">Frequency:</span>
                    <span>{customServiceItem.metadata.frequency?.replace("-", " ")}</span>
                  </div>
                  {customServiceItem.metadata.isRecurring && (
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Recurring Interval:</span>
                      <span>{customServiceItem.metadata.recurringInterval}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Cleanliness Level:</span>
                    <span>{customServiceItem.metadata.cleanlinessLevel}%</span>
                  </div>
                </div>

                <h4 className="text-md font-medium mt-4 mb-2">Detailed Breakdown:</h4>
                <div className="space-y-1">
                  {breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className={item.isDiscount ? "text-red-500" : ""}>{item.name}</span>
                      <span className={item.isDiscount ? "text-red-500" : ""}>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="text-sm text-gray-500 space-y-1">
                        {item.metadata?.frequency && <p>Frequency: {item.metadata.frequency.replace(/_/g, " ")}</p>}
                        {item.metadata?.rooms && <p>Rooms: {item.metadata.rooms}</p>}
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-lg">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-6" />

            {/* Coupon Code Section */}
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Coupon Code
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  className={couponError ? "border-red-500" : ""}
                />
                <Button onClick={handleApplyCoupon} disabled={isProcessing}>
                  Apply
                </Button>
              </div>
              {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
              {cart.couponDiscount > 0 && (
                <p className="text-green-600 text-sm mt-1">
                  Coupon applied: -{formatCurrency(cart.couponDiscount)} (Code: {cart.couponCode})
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {videoDiscount > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Video Recording Discount</span>
                  <span>-{formatCurrency(videoDiscount)}</span>
                </div>
              )}
              {cart.couponDiscount > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(cart.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer & Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address Information */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Service Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{addressData.fullName}</p>
                <p>{addressData.email}</p>
                <p>{addressData.phone}</p>
                <Separator className="my-3" />
                <p>{addressData.address}</p>
                {addressData.address2 && <p>{addressData.address2}</p>}
                <p>
                  {addressData.city}, {addressData.state} {addressData.zipCode}
                </p>
                {addressData.specialInstructions && (
                  <>
                    <Separator className="my-3" />
                    <p className="font-medium">Special Instructions:</p>
                    <p className="text-gray-600">{addressData.specialInstructions}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {paymentData.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : paymentData.paymentMethod === "paypal"
                          ? "PayPal"
                          : paymentData.paymentMethod === "apple"
                            ? "Apple Pay"
                            : "Google Pay"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {paymentData.paymentMethod === "card"
                        ? "Visa, Mastercard, American Express"
                        : paymentData.paymentMethod === "paypal"
                          ? "Pay with your PayPal account"
                          : "Touch ID or Face ID"}
                    </p>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Billing address same as service address</span>
                  </div>
                  {paymentData.allowVideoRecording && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Video recording discount applied</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payment
          </Button>
          <Button
            onClick={handleCheckout}
            size="lg"
            className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                Processing Your Order...
              </>
            ) : (
              <>
                <Shield className="mr-3 h-5 w-5" />
                Complete Order - {formatCurrency(total)}
              </>
            )}
          </Button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          By clicking "Complete Order", you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </motion.div>
  )
}
