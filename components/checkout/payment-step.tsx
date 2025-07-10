"use client"

import type React from "react"
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setPaymentMethod(data.paymentMethod)
    setAgreeToTerms(data.agreeToTerms)
    setAllowVideoRecording(data.allowVideoRecording)
  }, [data])

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const tax = (subtotal - videoDiscount) * 0.08 // 8% tax
  const total = subtotal - videoDiscount + tax

  const handleSubmit = (e: React.FormEvent) => {
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
    onSave({ paymentMethod, allowVideoRecording, agreeToTerms })
    onNext()
    setIsSubmitting(false)
  }

  const handleStripePaymentSuccess = () => {
    onSave({ paymentMethod, allowVideoRecording, agreeToTerms: true }) // Assume terms agreed if using Apple/Google Pay
    onNext()
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
          <DynamicPaymentSelector onSelect={setPaymentMethod} selectedMethod={paymentMethod} />

          {/* Stripe Payment Request Button for Apple Pay / Google Pay */}
          {(paymentMethod === "apple_pay" || paymentMethod === "google_pay") && (
            <div className="pt-4">
              <StripePaymentRequestButton
                total={total}
                onPaymentSuccess={handleStripePaymentSuccess}
                onPaymentFailure={handleStripePaymentFailure}
                customerEmail={checkoutData.contact.email}
                customerName={`${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`}
              />
            </div>
          )}

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
            <Button variant="outline" size="lg" className="px-8 bg-transparent" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Address
            </Button>
            {paymentMethod === "card" ||
            paymentMethod === "paypal" ||
            paymentMethod === "amazon_pay" ||
            paymentMethod === "bank_transfer" ? ( // Only show continue button for non-Stripe Payment Request methods
              <Button type="submit" size="lg" className="px-8" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Review Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </motion.div>
  )
}
