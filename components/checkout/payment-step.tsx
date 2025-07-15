"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Video,
  DollarSign,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import DynamicPaymentSelector from "@/components/dynamic-payment-selector"
import type { PaymentMethod } from "@/lib/payment-config"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import StripePaymentRequestButton from "@/components/stripe-payment-request-button"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"

interface PaymentStepProps {
  data: CheckoutData["payment"]
  onSave: (data: CheckoutData["payment"]) => void
  onNext: () => void
  onPrevious: () => void
  checkoutData: CheckoutData
}

export default function PaymentStep({ data, onSave, onNext, onPrevious, checkoutData }: PaymentStepProps) {
  const { toast } = useToast()
  const { cart } = useCart()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(data.paymentMethod)
  const [agreeToTerms, setAgreeToTerms] = useState(data.agreeToTerms)
  const [allowVideoRecording, setAllowVideoRecording] = useState(data.allowVideoRecording)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)

  useEffect(() => {
    setPaymentMethod(data.paymentMethod)
    setAgreeToTerms(data.agreeToTerms)
    setAllowVideoRecording(data.allowVideoRecording)
  }, [data])

  // Calculate pricing
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const tax = (subtotal - videoDiscount) * 0.08
  const total = subtotal - videoDiscount + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowTermsError(false)

    if (!agreeToTerms) {
      setShowTermsError(true)
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate processing delay
    setTimeout(() => {
      onSave({ paymentMethod, allowVideoRecording, agreeToTerms })
      onNext()
      setIsSubmitting(false)
    }, 800)
  }

  const handleStripePaymentSuccess = () => {
    onSave({ paymentMethod, allowVideoRecording, agreeToTerms: true })
    onNext()
  }

  const handleStripePaymentFailure = (error: string) => {
    console.error("Stripe Payment Request failed:", error)
  }

  const isFormValid = agreeToTerms && paymentMethod
  const progressPercentage = (agreeToTerms ? 50 : 0) + (paymentMethod ? 50 : 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header with Progress */}
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Payment Method</CardTitle>
              <CardDescription>Secure payment processing</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Step 3 of 4
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Form Progress</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Order Summary Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Order Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {videoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Video Recording Discount</span>
                  <span>-{formatCurrency(videoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment Method Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Choose Payment Method</h3>
              {paymentMethod && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </motion.div>
              )}
            </div>
            <DynamicPaymentSelector onSelect={setPaymentMethod} selectedMethod={paymentMethod} />
          </motion.div>

          {/* Stripe Payment Request Button */}
          <AnimatePresence>
            {(paymentMethod === "apple_pay" || paymentMethod === "google_pay") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure one-tap payment</span>
                </div>
                <StripePaymentRequestButton
                  total={total}
                  onPaymentSuccess={handleStripePaymentSuccess}
                  onPaymentFailure={handleStripePaymentFailure}
                  customerEmail={checkoutData.contact.email}
                  customerName={`${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Special Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">Additional Options</h3>

            {/* Video Recording Option */}
            <motion.div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                allowVideoRecording
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                  : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 hover:border-blue-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex items-center pt-1">
                  <Checkbox
                    id="videoRecording"
                    checked={allowVideoRecording}
                    onCheckedChange={(checked) => setAllowVideoRecording(checked as boolean)}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-blue-600" />
                    <Label htmlFor="videoRecording" className="text-base font-medium cursor-pointer">
                      Allow video recording for quality assurance
                    </Label>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      Save {subtotal >= 250 ? "$25" : "10%"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Help us improve our service and get featured on our social media. Your privacy is protected - you
                    can opt out anytime.
                  </p>
                  {allowVideoRecording && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-green-600 font-medium"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Discount applied: -{formatCurrency(videoDiscount)}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Terms Agreement */}
            <motion.div
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                showTermsError
                  ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                  : agreeToTerms
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                    : "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20 hover:border-gray-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex items-center pt-1">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => {
                      setAgreeToTerms(checked as boolean)
                      setShowTermsError(false)
                    }}
                    required
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-600" />
                    <Label htmlFor="terms" className="text-base font-medium cursor-pointer">
                      Terms & Conditions Agreement
                    </Label>
                    {agreeToTerms && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </p>
                  <AnimatePresence>
                    {showTermsError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-sm text-red-600"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>Please agree to the terms and conditions to continue</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4"
          >
            <Shield className="h-4 w-4" />
            <span>Your payment information is encrypted and secure</span>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between pt-6"
          >
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="px-8 bg-transparent hover:bg-muted"
              onClick={onPrevious}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Address
            </Button>

            {(paymentMethod === "card" || paymentMethod === "paypal" || paymentMethod === "bank_transfer") && (
              <Button
                type="submit"
                size="lg"
                className="px-8 relative overflow-hidden"
                disabled={isSubmitting || !isFormValid}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="continue"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      Review Order
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            )}
          </motion.div>
        </form>
      </CardContent>
    </motion.div>
  )
}
