"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Shield, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import DynamicPaymentSelector from "@/components/dynamic-payment-selector"
import type { PaymentMethod } from "@/lib/payment-config"
import { useDeviceDetection } from "@/lib/device-detection"
import StripePaymentRequestButton from "@/components/stripe-payment-request-button"
import { createCheckoutSession } from "@/lib/actions"

export default function PaymentPage() {
  const router = useRouter()
  const { cart } = useCart()
  const { toast } = useToast()
  const deviceInfo = useDeviceDetection()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [allowVideoRecording, setAllowVideoRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addressData, setAddressData] = useState<any>(null)

  // Redirect if cart is empty or no address data
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

    try {
      setAddressData(JSON.parse(savedAddress))
    } catch (e) {
      console.error("Failed to parse saved address data", e)
      router.push("/checkout/address")
    }
  }, [cart.items.length, router])

  useEffect(() => {
    if (!addressData) {
      router.replace("/checkout")
    }
  }, [addressData, router])

  const handlePaymentSuccess = () => {
    // In a real app, this would be triggered by a Stripe webhook
    // For this example, we'll clear it here.
    localStorage.removeItem("checkout-address")
    localStorage.removeItem("checkout-payment")
    // Assuming a clearCart method exists in useCart, uncomment below:
    // cart.clearCart()
    router.push("/success")
  }

  const handlePaymentFailure = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    })
    setIsSubmitting(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Prepare line items for Stripe
    const lineItems = cart.items.map((item) => ({
      name: item.name,
      amount: item.price,
      quantity: item.quantity,
      description: item.description,
      images: item.image ? [item.image] : undefined,
      metadata: item.metadata ? JSON.stringify(item.metadata) : undefined, // Ensure metadata is stringified
    }))

    // Add video recording discount if applicable
    if (allowVideoRecording) {
      const discountAmount = cart.total * 0.1 // 10% discount
      lineItems.push({
        name: "Video Recording Discount",
        amount: -discountAmount, // Negative amount for discount
        quantity: 1,
        description: "10% discount for allowing video recording",
      })
    }

    const customerInfo = {
      name: addressData.fullName,
      email: addressData.email,
      phone: addressData.phone,
      address: {
        line1: addressData.addressLine1,
        line2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        postal_code: addressData.zipCode,
        country: "US", // Assuming US for now
      },
    }

    const metadata = {
      allowVideoRecording: allowVideoRecording,
      videoConsentDetails: allowVideoRecording ? "User consented to video recording for QA and social media." : "N/A",
      agreeToTerms: agreeToTerms,
      // Add any other relevant checkout data to metadata
    }

    try {
      const stripeCheckoutUrl = await createCheckoutSession({
        customLineItems: lineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: customerInfo.email,
        customerData: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          allowVideoRecording: allowVideoRecording,
          videoConsentDetails: metadata.videoConsentDetails,
        },
        // paymentMethodTypes: [paymentMethod], // This would be for direct Stripe Elements, not Payment Request Button
        automaticTax: { enabled: true }, // Example: enable automatic tax calculation
        allowPromotions: true,
      })

      if (stripeCheckoutUrl) {
        router.push(stripeCheckoutUrl)
      } else {
        handlePaymentFailure("Failed to get Stripe checkout URL.")
      }
    } catch (error: any) {
      console.error("Error initiating checkout:", error)
      handlePaymentFailure(error.message || "Failed to initiate checkout. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!addressData) {
    return null // Will redirect via useEffect
  }

  const isAppleOrGooglePay = paymentMethod === "apple_pay" || paymentMethod === "google_pay"

  return (
    <div
      className={`min-h-screen py-12 ${
        deviceInfo.isIOS
          ? "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
          : deviceInfo.isAndroid
            ? "bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-gray-900 dark:to-purple-900"
            : "bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      }`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/checkout/address"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Address
          </Link>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6"
            >
              <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">Payment Method</h1>
            <p className="text-xl text-muted-foreground">Choose how you'd like to pay for your cleaning service</p>
          </div>
        </div>

        {/* Payment Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>All transactions are secure and encrypted</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dynamic Payment Selector */}
                <DynamicPaymentSelector onSelect={setPaymentMethod} selectedMethod={paymentMethod} />

                {/* Special Options */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">Additional Options</h3>

                  <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Checkbox
                      id="videoRecording"
                      checked={allowVideoRecording}
                      onCheckedChange={(checked) => setAllowVideoRecording(checked as boolean)}
                    />
                    <Label htmlFor="videoRecording" className="text-base">
                      Allow video recording for quality assurance and social media use
                      <span className="text-green-600 font-medium ml-2">(Save 10% on your order)</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                      required
                    />
                    <Label htmlFor="terms" className="text-base">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Link href="/checkout/address">
                    <Button variant="outline" size="lg" className="px-8 bg-transparent" disabled={isSubmitting}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Address
                    </Button>
                  </Link>
                  {isAppleOrGooglePay && cart.total > 0 ? (
                    <StripePaymentRequestButton
                      total={cart.total}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentFailure={handlePaymentFailure}
                      customerEmail={addressData?.email || ""}
                      customerName={addressData?.fullName || ""}
                    />
                  ) : (
                    <Button type="submit" size="lg" className="px-8" disabled={isSubmitting || cart.total <= 0}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Secure Checkout...
                        </>
                      ) : (
                        <>
                          Pay Securely with Stripe
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Badges */}
        <div className="mt-8 text-center">
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              SSL Secured
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Encrypted Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
