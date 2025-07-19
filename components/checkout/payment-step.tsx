"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CreditCard } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import DynamicPaymentSelector from "@/components/dynamic-payment-selector"
import type { PaymentMethod } from "@/lib/payment-config"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import StripePaymentRequestButton from "@/components/stripe-payment-request-button"
import { useCart } from "@/lib/cart-context"
import { CheckoutButton } from "@/components/checkout-button" // Import the dedicated CheckoutButton

interface PaymentStepProps {
  data: CheckoutData["payment"]
  onSave: (data: CheckoutData["payment"]) => void
  onNext: () => void
  onPrevious: () => void
  checkoutData: CheckoutData // To get contact and address info for payment request
}

export default function PaymentStep({ data, onSave, onNext, onPrevious, checkoutData }: PaymentStepProps) {
  const { toast } = useToast()
  const { cart } = useCart()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(data.paymentMethod)
  const [agreeToTerms, setAgreeToTerms] = useState(data.agreeToTerms)
  const [allowVideoRecording, setAllowVideoRecording] = useState(data.allowVideoRecording)
  const [videoConsentDetails, setVideoConsentDetails] = useState<string | undefined>(data.videoConsentDetails)
  const [isSubmitting, setIsSubmitting] = useState(false) // This state is now for the local form submission, not Stripe

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

  const handleStripePaymentSuccess = () => {
    onSave({ paymentMethod, allowVideoRecording, videoConsentDetails, agreeToTerms: true }) // Assume terms agreed if using Apple/Google Pay
    onNext() // Proceed to the next step (review or success)
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
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {" "}
          {/* Prevent default form submission */}
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
            {(paymentMethod === "card" || paymentMethod === "paypal") && ( // Only show continue button for card/paypal
              <CheckoutButton
                customerEmail={checkoutData.contact.email}
                customerName={`${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`}
                customerAddress={{
                  line1: checkoutData.address.address,
                  city: checkoutData.address.city,
                  state: checkoutData.address.state,
                  postal_code: checkoutData.address.zipCode,
                  country: "US", // Assuming US for now
                }}
                allowVideoRecording={allowVideoRecording}
                videoConsentDetails={videoConsentDetails}
                className="px-6 rounded-lg"
                size="default"
                disabled={!agreeToTerms} // Disable if terms not agreed
              >
                Review Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </CheckoutButton>
            )}
          </div>
        </form>
      </CardContent>
    </motion.div>
  )
}
