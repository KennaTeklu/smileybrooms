"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Apple, CreditCard } from "lucide-react"

// Declare Stripe and StripePaymentRequestButtonElement globally
declare global {
  interface Window {
    Stripe: any
  }
}

interface StripePaymentRequestButtonProps {
  total: number
  onPaymentSuccess: () => void
  onPaymentFailure: (error: string) => void
  customerEmail?: string
  customerName?: string
}

export default function StripePaymentRequestButton({
  total,
  onPaymentSuccess,
  onPaymentFailure,
  customerEmail,
  customerName,
}: StripePaymentRequestButtonProps) {
  const [stripe, setStripe] = useState<any>(null)
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const buttonRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Stripe.js script
    const loadStripe = async () => {
      if (window.Stripe) {
        setStripe(window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY))
      } else {
        const script = document.createElement("script")
        script.src = "https://js.stripe.com/v3/"
        script.async = true
        script.onload = () => {
          setStripe(window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY))
        }
        document.body.appendChild(script)
      }
    }

    loadStripe()
  }, [])

  useEffect(() => {
    if (stripe && total > 0) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "SmileyBrooms Service",
          amount: Math.round(total * 100), // Amount in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      pr.canMakePayment().then((result: any) => {
        if (result) {
          setCanMakePayment(true)
          setPaymentRequest(pr)
        } else {
          setCanMakePayment(false)
          toast({
            title: "Payment Request Not Available",
            description: "Apple Pay or Google Pay is not configured on this device or browser.",
            variant: "info",
          })
        }
      })

      pr.on("paymentmethod", async (event: any) => {
        setIsProcessing(true)
        try {
          const { paymentMethod, shippingAddress } = event
          // In a real application, you would send paymentMethod.id to your server
          // to confirm the payment. For this demo, we'll simulate success.

          console.log("Payment Method:", paymentMethod)
          console.log("Shipping Address:", shippingAddress)

          // Simulate server-side payment confirmation
          await new Promise((resolve) => setTimeout(resolve, 2000))

          event.complete("success")
          onPaymentSuccess()
          toast({
            title: "Payment Successful!",
            description: "Your order has been placed.",
            variant: "success",
          })
        } catch (error: any) {
          event.complete("fail")
          onPaymentFailure(error.message || "Payment failed")
          toast({
            title: "Payment Failed",
            description: error.message || "An error occurred during payment. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsProcessing(false)
        }
      })
    }
  }, [stripe, total, onPaymentSuccess, onPaymentFailure, toast])

  const handleClick = () => {
    if (paymentRequest) {
      paymentRequest.show()
    }
  }

  if (!canMakePayment) {
    return (
      <Button disabled className="w-full">
        <CreditCard className="mr-2 h-4 w-4" />
        Payment Request Not Available
      </Button>
    )
  }

  return (
    <div ref={buttonRef}>
      {/* Stripe's Payment Request Button will render here */}
      {/* This div is where Stripe.js will inject the actual button */}
      {/* We'll use a fallback button if Stripe.js hasn't loaded yet or can't make payment */}
      {paymentRequest && (
        <Button
          onClick={handleClick}
          className="w-full h-12 text-lg bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Apple className="mr-2 h-5 w-5" />
              Pay with Apple Pay / Google Pay
            </>
          )}
        </Button>
      )}
    </div>
  )
}
