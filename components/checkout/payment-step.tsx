"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CreditCard, Loader2 } from "lucide-react" // Added Loader2
import Link from "next/link"
import { motion } from "framer-motion"
import DynamicPaymentSelector from "@/components/dynamic-payment-selector"
import type { PaymentMethod } from "@/lib/payment-config"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import StripePaymentRequestButton from "@/components/stripe-payment-request-button"
import { useCart } from "@/lib/cart-context"
import { createCheckoutSession } from "@/lib/actions" // Import the server action
import { useRouter } from "next/navigation" // Import useRouter

interface PaymentStepProps {
  data: CheckoutData["payment"]
  onSave: (data: CheckoutData["payment"]) => void
  onNext: () => void
  onPrevious: () => void
  checkoutData: CheckoutData // To get contact and address info for payment request
}

export default function PaymentStep({ data, onSave, onNext, onPrevious, checkoutData }: PaymentStepProps) {
  const { toast } = useToast()
  const { cart, clearCart } = useCart() // Added clearCart
  const router = useRouter() // Initialize useRouter

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(data.paymentMethod)
  const [agreeToTerms, setAgreeToTerms] = useState(data.agreeToTerms)
  const [allowVideoRecording, setAllowVideoRecording] = useState(data.allowVideoRecording)
  const [videoConsentDetails, setVideoConsentDetails] = useState<string | undefined>(data.videoConsentDetails) // New state for consent timestamp
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setPaymentMethod(data.paymentMethod)
    setAgreeToTerms(data.agreeToTerms)
    setAllowVideoRecording(data.allowVideoRecording)
    setVideoConsentDetails(data.videoConsentDetails)
  }, [data])

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const tax = (subtotal - videoDiscount) * 0.08 // 8% tax
  const total = subtotal - videoDiscount + tax

  const handleAllowVideoRecordingChange = (checked: boolean) => {
    setAllowVideoRecording(checked)
    if (checked) {
      setVideoConsentDetails(new Date().toISOString()) // Record timestamp when checked
    } else {
      setVideoConsentDetails(undefined) // Clear timestamp when unchecked
    }
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
    onSave({ paymentMethod, allowVideoRecording, videoConsentDetails, agreeToTerms }) // Save current step data

    try {
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        description: item.description,
        images: item.image ? [item.image] : undefined,
        metadata: {
          itemId: item.id,
          category: item.category,
          // Stringify complex objects for Stripe metadata
          roomConfig: item.metadata?.roomConfig ? JSON.stringify(item.metadata.roomConfig) : undefined,
          tier: item.metadata?.tier,
          frequency: item.metadata?.frequency,
          duration: item.metadata?.duration,
          // Add any other specific details from item.metadata
          ...(item.metadata &&
            Object.fromEntries(
              Object.entries(item.metadata).map(([key, value]) => [
                key,
                typeof value === "object" && value !== null ? JSON.stringify(value) : String(value),
              ]),
            )),
        },
      }))

      // Apply coupon discount as a negative line item if applicable
      if (cart.couponDiscount > 0) {
        customLineItems.push({
          name: `Discount: ${cart.couponCode || "Applied Coupon"}`,
          amount: -cart.couponDiscount, // Negative amount for discount
          quantity: 1,
          description: `Coupon code: ${cart.couponCode}`,
        })
      }

      // Apply full house discount as a negative line item if applicable
      if (cart.fullHouseDiscount > 0) {
        customLineItems.push({
          name: "Full House Discount",
          amount: -cart.fullHouseDiscount, // Negative amount for discount
          quantity: 1,
          description: "Discount for booking all rooms",
        })
      }

      const sessionUrl = await createCheckoutSession({
        customLineItems: customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: checkoutData.contact.email,
        customerData: {
          name: `${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`,
          email: checkoutData.contact.email,
          phone: checkoutData.contact.phone,
          address: {
            line1: checkoutData.address.address,
            city: checkoutData.address.city,
            state: checkoutData.address.state,
            postal_code: checkoutData.address.zipCode,
            country: "US", // Assuming US for now, can be dynamic
          },
          allowVideoRecording: allowVideoRecording,
          videoConsentDetails: videoConsentDetails,
        },
        automaticTax: { enabled: true },
        shippingAddressCollection: { allowed_countries: ["US"] }, // Example: restrict to US
      })

      if (sessionUrl) {
        router.push(sessionUrl)
        clearCart() // Clear cart after successful redirection to Stripe
      } else {
        toast({
          title: "Checkout Failed",
          description: "Could not create checkout session. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Checkout Error",
        description: "An unexpected error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStripePaymentSuccess = () => {
    onSave({ paymentMethod, allowVideoRecording, videoConsentDetails, agreeToTerms: true }) // Assume terms agreed if using Apple/Google Pay
    clearCart() // Clear cart after successful payment request
    router.push("/success") // Redirect to success page
  }

  const handleStripePaymentFailure = (error: string) => {
    console.error("Stripe Payment Request failed:", error)
    // Toast handled by StripePaymentRequestButton
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
        <CardDescription>Choose how you'd like to pay for your cleaning service</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dynamic Payment Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <DynamicPaymentSelector onSelect={setPaymentMethod} selectedMethod={paymentMethod} />
          </motion.div>

          {/* Stripe Payment Request Button for Apple Pay / Google Pay */}
          {(paymentMethod === "apple" || paymentMethod === "google") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="pt-4">
                <StripePaymentRequestButton
                  total={total}
                  onPaymentSuccess={handleStripePaymentSuccess}
                  onPaymentFailure={handleStripePaymentFailure}
                  customerEmail={checkoutData.contact.email}
                  customerName={`${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`}
                />
              </div>
            </motion.div>
          )}

          {/* Special Options */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">Additional Options</h3>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Checkbox
                  id="videoRecording"
                  checked={allowVideoRecording}
                  onCheckedChange={(checked) => handleAllowVideoRecordingChange(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="videoRecording" className="text-base">
                    Allow video recording for quality assurance and social media use
                    <span className="text-green-600 font-medium ml-2">(Save 10% on your order)</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    By selecting this, you acknowledge that a live video stream of your cleaning may be recorded and
                    used for internal quality assurance and promotional purposes. Your privacy is important to us;
                    recordings will be handled in accordance with our Privacy Policy.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
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
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" size="default" className="px-6 rounded-lg bg-transparent" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Address
            </Button>
            {/* This button now triggers the Stripe checkout session */}
            <Button type="submit" size="default" className="px-6 rounded-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Review Order
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </motion.div>
  )
}
