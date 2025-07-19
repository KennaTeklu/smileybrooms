"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, CreditCard, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import DynamicPaymentSelector from "@/components/dynamic-payment-selector"
import type { PaymentMethod } from "@/lib/payment-config"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import StripePaymentRequestButton from "@/components/stripe-payment-request-button"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

interface PaymentStepProps {
  data: CheckoutData["payment"]
  onSave: (data: CheckoutData["payment"]) => void
  onNext: () => void
  onPrevious: () => void
  checkoutData: CheckoutData // To get contact and address info for payment request
}

export default function PaymentStep({ data, onSave, onNext, onPrevious, checkoutData }: PaymentStepProps) {
  const { toast } = useToast()
  const { cart, clearCart } = useCart()
  const router = useRouter()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(data.paymentMethod)
  const [isSubmitting, setIsSubmitting] = useState(false) // For local form submission, if any

  useEffect(() => {
    setPaymentMethod(data.paymentMethod)
  }, [data])

  // Calculate total for Stripe Payment Request Button
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  // Note: Video discount and terms agreement are now handled in AddressStep
  const totalDiscount = cart.couponDiscount + cart.fullHouseDiscount
  const finalSubtotal = subtotal - totalDiscount
  const tax = finalSubtotal * 0.08 // Example 8% tax
  const total = finalSubtotal + tax

  const handleStripePaymentSuccess = () => {
    onSave({ paymentMethod }) // Save selected payment method
    clearCart() // Clear cart after successful payment request
    router.push("/success") // Redirect to success page
  }

  const handleStripePaymentFailure = (error: string) => {
    console.error("Stripe Payment Request failed:", error)
    // Toast handled by StripePaymentRequestButton
  }

  // This step now primarily handles alternative payment methods or acts as a review.
  // The main "Pay with Card" (Stripe Checkout) is initiated from AddressStep.
  const handleContinue = () => {
    setIsSubmitting(true)
    onSave({ paymentMethod })
    onNext() // Proceed to the next step (e.g., Review Order)
    setIsSubmitting(false)
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
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
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

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" size="default" className="px-6 rounded-lg bg-transparent" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Address
            </Button>
            {/* Only show a "Continue" button if not using Apple/Google Pay,
                as those buttons handle their own flow. */}
            {paymentMethod !== "apple" && paymentMethod !== "google" && (
              <Button
                type="button"
                size="default"
                className="px-6 rounded-lg"
                onClick={handleContinue}
                disabled={isSubmitting}
              >
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
            )}
          </div>
        </form>
      </CardContent>
    </motion.div>
  )
}
