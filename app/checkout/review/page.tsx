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
import { requiresEmailPricing, CUSTOM_SPACE_LEGAL_DISCLAIMER } from "@/lib/room-tiers"

interface ReviewStepProps {
  checkoutData: CheckoutData
  onPrevious: () => void
}

export default function ReviewStep({ checkoutData, onPrevious }: ReviewStepProps) {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState<string | null>(null)

  const { contact: contactData, address: addressData, payment: paymentData } = checkoutData

  // Filter items for online payment
  const onlinePaymentItems = cart.items.filter((item) => item.paymentType !== "in_person")
  const inPersonPaymentItems = cart.items.filter((item) => item.paymentType === "in_person")

  // Calculate totals for online payment
  const subtotalOnline = onlinePaymentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = paymentData?.allowVideoRecording ? (subtotalOnline >= 250 ? 25 : subtotalOnline * 0.1) : 0
  const totalBeforeTaxOnline = subtotalOnline - videoDiscount - couponDiscount
  const tax = totalBeforeTaxOnline * 0.08 // 8% tax
  const totalOnline = totalBeforeTaxOnline + tax

  // Total for in-person payment
  const totalInPerson = inPersonPaymentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    // Reset coupon discount if cart items or other discounts change
    setCouponDiscount(0)
    setCouponCode("")
    setCouponError(null)
  }, [cart.items, videoDiscount])

  const handleApplyCoupon = () => {
    setCouponError(null)
    // Simulate coupon application
    if (couponCode.toLowerCase() === "v0discount") {
      const discountAmount = Math.min(totalBeforeTaxOnline * 0.15, 50) // 15% off, max $50
      setCouponDiscount(discountAmount)
      toast({
        title: "Coupon Applied!",
        description: `You saved ${formatCurrency(discountAmount)} with code "${couponCode}".`,
        variant: "success",
      })
    } else if (couponCode.trim() === "") {
      setCouponError("Please enter a coupon code.")
    } else {
      setCouponDiscount(0)
      setCouponError("Invalid coupon code. Please try again.")
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      })
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
      // Prepare line items for Stripe (only online payment items)
      const customLineItems = onlinePaymentItems.map((item) => ({
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
      if (couponDiscount > 0) {
        customLineItems.push({
          name: `Coupon Discount: ${couponCode}`,
          amount: -couponDiscount, // Negative amount for discount
          quantity: 1,
          description: `Discount applied with coupon code: ${couponCode}`,
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
            <div className="space-y-4">
              {cart.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="text-sm text-gray-500 space-y-1">
                      {item.metadata?.frequency && <p>Frequency: {item.metadata.frequency.replace(/_/g, " ")}</p>}
                      {item.metadata?.rooms && <p>Rooms: {item.metadata.rooms}</p>}
                      <p>Quantity: {item.quantity}</p>
                      {item.paymentType === "in_person" && (
                        <p className="text-orange-500 font-semibold">Payment in person</p>
                      )}
                    </div>
                  </div>
                  {item.paymentType === "in_person" || requiresEmailPricing(item.metadata?.roomType) ? (
                    <span className="font-medium text-lg text-orange-600">Email for Pricing</span>
                  ) : (
                    <span className="font-medium text-lg">{formatCurrency(item.price * item.quantity)}</span>
                  )}
                </div>
              ))}
            </div>

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
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className={couponError ? "border-red-500" : ""}
                />
                <Button onClick={handleApplyCoupon} disabled={isProcessing}>
                  Apply
                </Button>
              </div>
              {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
              {couponDiscount > 0 && (
                <p className="text-green-600 text-sm mt-1">Coupon applied: -{formatCurrency(couponDiscount)}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span>Subtotal (Online Payment)</span>
                <span>{formatCurrency(subtotalOnline)}</span>
              </div>
              {videoDiscount > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Video Recording Discount</span>
                  <span>-{formatCurrency(videoDiscount)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-lg text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total (Online Payment)</span>
                <span>{formatCurrency(totalOnline)}</span>
              </div>
              {totalInPerson > 0 && (
                <div className="flex justify-between text-xl font-bold text-orange-600 mt-4">
                  <span>Custom Services</span>
                  <span>Email for Pricing</span>
                </div>
              )}
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
                {totalInPerson > 0
                  ? `Complete Online Payment - ${formatCurrency(totalOnline)}`
                  : `Complete Order - ${formatCurrency(totalOnline)}`}
              </>
            )}
          </Button>
        </div>
        {totalInPerson > 0 && (
          <p className="text-center text-sm text-orange-500 mt-4">Note: {CUSTOM_SPACE_LEGAL_DISCLAIMER}</p>
        )}
        <p className="text-center text-sm text-gray-500 mt-4">
          By clicking "Complete Order", you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </motion.div>
  )
}
