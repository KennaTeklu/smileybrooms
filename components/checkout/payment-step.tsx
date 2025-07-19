"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, CreditCard, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type { CheckoutData } from "@/lib/types"
import { StripePaymentRequestButton } from "@/components/stripe-payment-request-button"

interface PaymentStepProps {
  data: CheckoutData["payment"]
  onSave: (data: CheckoutData["payment"]) => void
  onNext: () => void
  onPrevious: () => void
  checkoutData: CheckoutData // To access contact and address info for StripePaymentRequestButton
}

export default function PaymentStep({ data, onSave, onNext, onPrevious, checkoutData }: PaymentStepProps) {
  const { toast } = useToast()

  // This step now primarily serves as a placeholder or for alternative payment methods
  // The main Stripe checkout is initiated from the AddressStep.

  const handlePaymentMethodSelect = (method: CheckoutData["payment"]["paymentMethod"]) => {
    onSave({ ...data, paymentMethod: method })
    toast({
      title: "Payment Method Selected",
      description: `You have selected ${method} as your payment method.`,
      variant: "default",
    })
    // For now, we'll still allow navigation to the review step,
    // but the primary Stripe checkout happens earlier.
    onNext()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
        <CardDescription>Choose how you'd like to pay for your service.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Payment Option</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${data.paymentMethod === "card" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500" : ""}`}
                onClick={() => handlePaymentMethodSelect("card")}
              >
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">Credit/Debit Card</p>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${data.paymentMethod === "paypal" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500" : ""}`}
                onClick={() => handlePaymentMethodSelect("paypal")}
              >
                <CardContent className="p-4 text-center">
                  <Wallet className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">PayPal</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stripe Payment Request Button (Apple Pay / Google Pay) */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">Express Checkout</h3>
            <StripePaymentRequestButton
              customerEmail={checkoutData.contact.email}
              customerName={`${checkoutData.contact.firstName} ${checkoutData.contact.lastName}`}
              customerAddress={{
                line1: checkoutData.address.address,
                city: checkoutData.address.city,
                state: checkoutData.address.state,
                postal_code: checkoutData.address.zipCode,
                country: "US", // Assuming US for now
              }}
              allowVideoRecording={checkoutData.address.allowVideoRecording}
              videoConsentDetails={checkoutData.address.videoConsentDetails}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" size="default" className="px-6 rounded-lg bg-transparent" onClick={onPrevious}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Address
          </Button>
          {/* The "Continue to Review" button is now for non-Stripe paths or if user wants to review before final payment */}
          <Button type="button" size="default" className="px-6 rounded-lg" onClick={onNext}>
            Continue to Review
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </motion.div>
  )
}
