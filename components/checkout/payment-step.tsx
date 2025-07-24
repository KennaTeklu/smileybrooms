"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Apple, Phone } from 'lucide-react'
import Link from "next/link"
import { motion } from "framer-motion"
import DynamicPaymentSelector from "@/components/dynamic-payment-selector"
import type { PaymentMethod } from "@/lib/payment-config"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import StripePaymentRequestButton from "@/components/stripe-payment-request-button"
import { useCart } from "@/lib/cart-context"
import { useDeviceDetection } from "@/lib/device-detection"
import { supportsDigitalWallet, getPrimaryPaymentMethod, getContactInfo } from "@/lib/payment-config"

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
  const deviceInfo = useDeviceDetection()
  const contactInfo = getContactInfo()

  // Initialize payment method based on device
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(() => {
    return data.paymentMethod || getPrimaryPaymentMethod(deviceInfo.type)
  })
  const [agreeToTerms, setAgreeToTerms] = useState(data.agreeToTerms)
  const [allowVideoRecording, setAllowVideoRecording] = useState(data.allowVideoRecording)
  const [videoConsentDetails, setVideoConsentDetails] = useState<string | undefined>(data.videoConsentDetails)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update payment method when device detection completes
  useEffect(() => {
    if (deviceInfo.type !== "unknown" && !data.paymentMethod) {
      const primaryMethod = getPrimaryPaymentMethod(deviceInfo.type)
      setPaymentMethod(primaryMethod)
    }
  }, [deviceInfo.type, data.paymentMethod])

  useEffect(() => {
    setPaymentMethod(data.paymentMethod || getPrimaryPaymentMethod(deviceInfo.type))
    setAgreeToTerms(data.agreeToTerms)
    setAllowVideoRecording(data.allowVideoRecording)
    setVideoConsentDetails(data.videoConsentDetails)
  }, [data, deviceInfo.type])

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const videoDiscount = allowVideoRecording ? (subtotal >= 250 ? 25 : subtotal * 0.1) : 0
  const tax = (subtotal - videoDiscount) * 0.08
  const total = subtotal - videoDiscount + tax

  const handleAllowVideoRecordingChange = (checked: boolean) => {
    setAllowVideoRecording(checked)
    if (checked) {
      setVideoConsentDetails(new Date().toISOString())
    } else {
      setVideoConsentDetails(undefined)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // For contact_for_alternatives, we don't need terms agreement
    if (paymentMethod !== 'contact_for_alternatives' && !agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    onSave({ paymentMethod, allowVideoRecording, videoConsentDetails, agreeToTerms })
    onNext()
    setIsSubmitting(false)
  }

  const handleDigitalWalletSuccess = () => {
    // For digital wallets, we assume terms are agreed and proceed directly
    onSave({
      paymentMethod,
      allowVideoRecording,
      videoConsentDetails,
      agreeToTerms: true,
    })
    onNext()
  }

  const handleDigitalWalletFailure = (error: string) => {
    console.error("Digital wallet payment failed:", error)
    toast({
      title: "Payment Failed",
      description: `${error} You can try the alternative payment option below.`,
      variant: "destructive",
    })
  }

  const getPaymentMethodDescription = () => {
    if (deviceInfo.isIOS) {
      return "Choose Apple Pay for instant payment, or contact us for cash/Zelle options"
    } else {
      return "Choose Google Pay for instant payment, or contact us for cash/Zelle options"
    }
  }

  const renderPaymentInterface = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-6"
      >
        <DynamicPaymentSelector onSelect={setPaymentMethod} selectedMethod={paymentMethod} />
        
        {/* Show digital wallet button if selected */}
        {(paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') && (
          <div className="mt-6">
            <StripePaymentRequestButton
              total={total}
              onPaymentSuccess={handleDigitalWalletSuccess}
              onPaymentFailure={handleDigitalWalletFailure}
              customerEmail={checkoutData.contact.email}
              customerName={`${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`}
              paymentMethodType={paymentMethod}
            />
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
        <CardDescription>
          {getPaymentMethodDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Payment Interface */}
          {renderPaymentInterface()}

          {/* Additional Options */}
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

            {/* Terms agreement - only show for digital wallet payments */}
            {(paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') && (
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
            )}

            {/* Contact info for alternative payments */}
            {paymentMethod === 'contact_for_alternatives' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-800 dark:text-green-200">Ready to arrange payment?</h4>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    Call us at <strong>{contactInfo.phoneFormatted}</strong> or visit <strong>{contactInfo.website}</strong> to arrange:
                  </p>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Cash payment when we arrive</li>
                    <li>• Zelle payment instructions</li>
                    <li>• Other payment arrangements</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" size="default" className="px-6 rounded-lg bg-transparent" onClick={onPrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Address
            </Button>

            {/* Show continue button for contact_for_alternatives */}
            {paymentMethod === 'contact_for_alternatives' && (
              <Button type="submit" size="default" className="px-6 rounded-lg" disabled={isSubmitting}>
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
            )}
          </div>
        </form>
      </CardContent>
    </motion.div>
  )
}
