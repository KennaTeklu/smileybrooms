"use client"
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Shield, MapPin, CreditCard, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { createCheckoutSession } from "@/lib/actions"

export default function ReviewPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()

  const [addressData, setAddressData] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = paymentData?.allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const tax = (subtotal - videoDiscount) * 0.08 // 8% tax
  const total = subtotal - videoDiscount + tax

  // Redirect if cart is empty or missing data
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/pricing")
      return
    }

    // Load address data from localStorage
    const savedAddress = localStorage.getItem("checkout-address")
    if (!savedAddress) {
      router.push("/checkout/address")
      return
    }

    // Load payment data from localStorage
    const savedPayment = localStorage.getItem("checkout-payment")
    if (!savedPayment) {
      router.push("/checkout/payment")
      return
    }

    try {
      setAddressData(JSON.parse(savedAddress))
      setPaymentData(JSON.parse(savedPayment))
    } catch (e) {
      console.error("Failed to parse saved checkout data")
      router.push("/checkout/address")
    }
  }, [cart.items.length, router])

  const handleCheckout = async () => {
    if (!addressData || !paymentData) {
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

      // Create checkout session with Stripe
      const checkoutUrl = await createCheckoutSession({
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerData: {
          name: addressData.fullName,
          email: addressData.email,
          phone: addressData.phone,
          address: {
            line1: addressData.address,
            city: addressData.city,
            state: addressData.state,
            postal_code: addressData.zipCode,
            country: "US",
          },
        },
        allowPromotions: true,
      })

      if (checkoutUrl) {
        // Clear checkout data
        localStorage.removeItem("checkout-address")
        localStorage.removeItem("checkout-payment")

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

  if (!addressData || !paymentData) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/checkout/payment"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payment
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <Package className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Review Your Order</h1>
            <p className="text-xl text-muted-foreground">
              Please review your order details before completing your purchase
            </p>
          </div>
        </div>

        {/* Review Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Order Summary */}
          <Card className="shadow-lg border-0">
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
                      </div>
                    </div>
                    <span className="font-medium text-lg">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

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
                            : "Apple Pay"}
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

          {/* Complete Order Button */}
          <div className="pt-6">
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

            <p className="text-center text-sm text-gray-500 mt-4">
              By clicking "Complete Order", you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>

        {/* Security Badges */}
        <div className="mt-12 text-center">
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              SSL Secured
            </div>
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Encrypted Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
