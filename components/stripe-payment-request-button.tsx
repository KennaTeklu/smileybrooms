"use client"

import { useEffect, useState } from "react"
import { loadStripe, type Stripe, type StripeElements, type PaymentRequest } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Apple, Smartphone } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentRequestButtonProps {
  total: number
  onPaymentSuccess: () => void
  onPaymentFailure: (error: string) => void
  customerEmail: string
  customerName: string
  paymentMethodType: "apple_pay" | "google_pay"
}

export default function StripePaymentRequestButton({
  total,
  onPaymentSuccess,
  onPaymentFailure,
  customerEmail,
  customerName,
  paymentMethodType,
}: StripePaymentRequestButtonProps) {
  const { toast } = useToast()
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [elements, setElements] = useState<StripeElements | null>(null)
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    stripePromise.then((s) => {
      if (s) {
        setStripe(s)
        setElements(s.elements())
      }
    })
  }, [])

  useEffect(() => {
    if (stripe && elements && total > 0) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "SmileyBrooms Cleaning Service",
          amount: Math.round(total * 100), // Amount in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
      })

      // Check if the specific payment method is available
      pr.canMakePayment().then((result) => {
        if (result) {
          // For Apple Pay, check if we're on iOS and Apple Pay is available
          if (paymentMethodType === "apple_pay" && result.applePay) {
            setCanMakePayment(true)
            setPaymentRequest(pr)
          }
          // For Google Pay, check if Google Pay is available (works on most devices)
          else if (paymentMethodType === "google_pay" && (result.googlePay || result.applePay)) {
            setCanMakePayment(true)
            setPaymentRequest(pr)
          }
        }
        setIsLoading(false)
      })

      pr.on("paymentmethod", async (event) => {
        setIsProcessing(true)
        try {
          const { paymentMethod, shippingAddress } = event

          // Simulate server-side payment processing
          console.log("PaymentMethod received:", paymentMethod)
          console.log("ShippingAddress received:", shippingAddress)

          // Simulate API call to your backend
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Simulate success (90% success rate for demo)
          const isSuccess = Math.random() > 0.1

          if (isSuccess) {
            event.complete("success")
            onPaymentSuccess()
            toast({
              title: "Payment Successful! 🎉",
              description: `Your payment via ${paymentMethodType === "apple_pay" ? "Apple Pay" : "Google Pay"} was processed successfully.`,
              variant: "default",
            })
          } else {
            event.complete("fail")
            onPaymentFailure("Payment was declined. Please try again.")
            toast({
              title: "Payment Failed",
              description: "Your payment was declined. Please try again or contact us for alternative payment options.",
              variant: "destructive",
            })
          }
        } catch (error: any) {
          event.complete("fail")
          onPaymentFailure(error.message || "Payment failed.")
          toast({
            title: "Payment Error",
            description: error.message || "There was an issue processing your payment.",
            variant: "destructive",
          })
        } finally {
          setIsProcessing(false)
        }
      })
    }
  }, [stripe, elements, total, onPaymentSuccess, onPaymentFailure, toast, paymentMethodType])

  const handleClick = () => {
    if (paymentRequest && !isProcessing) {
      paymentRequest.show()
    }
  }

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading payment options...
        </>
      )
    }

    if (isProcessing) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing payment...
        </>
      )
    }

    if (paymentMethodType === "apple_pay") {
      return (
        <>
          <Apple className="mr-2 h-5 w-5" />
          Pay {formatCurrency(total)} with Apple Pay
        </>
      )
    } else {
      return (
        <>
          <Smartphone className="mr-2 h-5 w-5" />
          Pay {formatCurrency(total)} with Google Pay
        </>
      )
    }
  }

  const getButtonStyle = () => {
    if (paymentMethodType === "apple_pay") {
      return "w-full h-14 bg-black text-white hover:bg-gray-800 transition-colors text-lg font-semibold rounded-xl"
    } else {
      return "w-full h-14 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-semibold rounded-xl"
    }
  }

  if (isLoading) {
    return (
      <Button disabled className="w-full h-14 text-lg rounded-xl">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking payment availability...
      </Button>
    )
  }

  if (!canMakePayment) {
    return (
      <div className="text-center p-6 border border-dashed rounded-xl bg-gray-50 dark:bg-gray-800">
        <div className="text-sm text-muted-foreground mb-2">
          {paymentMethodType === "apple_pay" ? "Apple Pay" : "Google Pay"} is not available on this device.
        </div>
        <div className="text-xs text-muted-foreground">
          Please try the alternative payment option below.
        </div>
      </div>
    )
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      className={getButtonStyle()}
      disabled={isProcessing}
      aria-label={`Pay ${formatCurrency(total)} with ${paymentMethodType === "apple_pay" ? "Apple Pay" : "Google Pay"}`}
    >
      {getButtonContent()}
    </Button>
  )
}
