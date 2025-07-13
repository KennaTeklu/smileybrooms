"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { CheckoutPreview } from "@/components/checkout-preview"
import { useRoomContext } from "@/lib/room-context"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { DynamicPaymentSelector } from "@/components/dynamic-payment-selector"

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const router = useRouter()
  const { cartItems, getTotalPrice } = useCart()
  const { roomCounts, roomConfigs } = useRoomContext()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string | null>(null)

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Math.round(getTotalPrice() * 100) }), // Amount in cents
        })
        const data = await response.json()
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          console.error("Failed to get client secret:", data.error)
          // Handle error, maybe redirect to an error page or show a message
        }
      } catch (error) {
        console.error("Error fetching client secret:", error)
      } finally {
        setLoading(false)
      }
    }

    if (getTotalPrice() > 0) {
      fetchClientSecret()
    } else {
      setLoading(false)
    }
  }, [getTotalPrice])

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#6366F1", // Indigo-500
      colorBackground: "#ffffff",
      colorText: "#1F2937",
      colorDanger: "#EF4444",
      fontFamily: "Inter, sans-serif",
      borderRadius: "0.375rem", // 6px
    },
    rules: {
      ".Input": {
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  const handleContinue = () => {
    // In a real app, you'd handle the payment submission here
    // For now, just navigate to the review page
    router.push("/checkout/review")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Progress value={80} className="w-full mb-8" />
      <h1 className="text-3xl font-bold text-center mb-8">Checkout: Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading payment options...</div>
              ) : getTotalPrice() === 0 ? (
                <div className="text-center py-8 text-gray-500">Your cart is empty. Please add items to proceed.</div>
              ) : clientSecret ? (
                <Elements options={options as any} stripe={stripePromise}>
                  <DynamicPaymentSelector
                    clientSecret={clientSecret}
                    totalPrice={getTotalPrice()}
                    onPaymentSuccess={() => router.push("/success")}
                    onPaymentError={(error) => {
                      console.error("Payment error:", error)
                      router.push("/canceled")
                    }}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8 text-red-500">
                  Failed to load payment options. Please try again later.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <CheckoutPreview
            cartItems={cartItems}
            totalPrice={getTotalPrice()}
            roomCounts={roomCounts}
            roomConfigs={roomConfigs}
          />
        </div>
      </div>
    </div>
  )
}
