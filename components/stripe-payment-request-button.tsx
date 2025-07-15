"use client"

import { useEffect, useState } from "react"
import { loadStripe, type Stripe, type StripeElements, type PaymentRequest } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentRequestButtonProps {
  total: number
  onPaymentSuccess: () => void
  onPaymentFailure: (error: string) => void
  customerEmail: string
  customerName: string
}

export default function StripePaymentRequestButton({
  total,
  onPaymentSuccess,
  onPaymentFailure,
  customerEmail,
  customerName,
}: StripePaymentRequestButtonProps) {
  const { toast } = useToast()
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [elements, setElements] = useState<StripeElements | null>(null)
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
          label: "Total",
          amount: Math.round(total * 100), // Amount in cents
        },
        requestPayerName: true,
        requestPayerEmail: true,
      })

      pr.canMakePayment().then((result) => {
        if (result) {
          setCanMakePayment(true)
          setPaymentRequest(pr)
        }
        setIsLoading(false)
      })

      pr.on("paymentmethod", async (event) => {
        setIsLoading(true)
        try {
          const { paymentMethod, shippingAddress } = event
          // Here you would typically send paymentMethod.id to your server
          // to confirm the payment. For this example, we'll simulate success.
          console.log("PaymentMethod received:", paymentMethod)
          console.log("ShippingAddress received:", shippingAddress)

          // Simulate server-side payment confirmation
          await new Promise((resolve) => setTimeout(resolve, 1500))

          event.complete("success")
          onPaymentSuccess()
          toast({
            title: "Payment Successful!",
            description: "Your order has been placed.",
            variant: "success",
          })
        } catch (error: any) {
          event.complete("fail")
          onPaymentFailure(error.message || "Payment failed.")
          toast({
            title: "Payment Failed",
            description: error.message || "There was an issue processing your payment.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      })
    }
  }, [stripe, elements, total, onPaymentSuccess, onPaymentFailure, toast])

  const handleClick = () => {
    if (paymentRequest) {
      paymentRequest.show()
    }
  }

  if (isLoading) {
    return (
      <Button disabled className="w-full h-12">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading payment options...
      </Button>
    )
  }

  if (!canMakePayment) {
    return (
      <div className="text-center text-sm text-muted-foreground py-4">
        No Apple Pay or Google Pay available on this device/browser. Please use card payment.
      </div>
    )
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      className="w-full h-12 bg-black text-white hover:bg-gray-800 transition-colors"
      aria-label={`Pay ${formatCurrency(total)} with Apple Pay or Google Pay`}
    >
      <CreditCard className="mr-2 h-5 w-5" />
      Pay with Apple Pay / Google Pay
    </Button>
  )
}
