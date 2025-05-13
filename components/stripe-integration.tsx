"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

export function StripeIntegration() {
  const [isLoading, setIsLoading] = useState(false)
  const [stripeLoaded, setStripeLoaded] = useState(false)
  const { cart } = useCart()

  useEffect(() => {
    // Load Stripe.js
    const loadStripe = async () => {
      if (!window.Stripe) {
        const script = document.createElement("script")
        script.src = "https://js.stripe.com/v3/"
        script.async = true
        script.onload = () => setStripeLoaded(true)
        document.body.appendChild(script)
      } else {
        setStripeLoaded(true)
      }
    }

    loadStripe()
  }, [])

  const handleCreateCheckoutSession = async () => {
    if (!stripeLoaded || cart.items.length === 0) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.items,
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/canceled`,
        }),
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        console.error("Stripe redirect error:", error)
        alert("Payment failed. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("There was an error processing your payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <Button
        onClick={handleCreateCheckoutSession}
        disabled={isLoading || !stripeLoaded || cart.items.length === 0}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Processing..." : "Pay with Stripe"}
      </Button>

      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>Secure payment processing by Stripe</p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <svg className="h-6" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 10.5H8v4h8v-4z" fill="#f1f1f1" />
            <path
              d="M59 3H1a1 1 0 00-1 1v17a1 1 0 001 1h58a1 1 0 001-1V4a1 1 0 00-1-1zm-1 17H2V5h56v15z"
              fill="#e6e6e6"
            />
            <path
              d="M14 15h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2zm3 0h2v1h-2z"
              fill="#e6e6e6"
            />
            <path d="M8 9h1v6H8z" fill="#5286f9" />
            <path d="M15 9h1v6h-1z" fill="#5286f9" />
            <path d="M19 11a2 2 0 100-4 2 2 0 000 4zm0-3a1 1 0 110 2 1 1 0 010-2z" fill="#f1f1f1" />
            <path d="M22 11a2 2 0 100-4 2 2 0 000 4zm0-3a1 1 0 110 2 1 1 0 010-2z" fill="#f1f1f1" />
          </svg>
          <svg className="h-6" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M45.5 4h-31C8.6 4 4 8.6 4 14.5S8.6 25 14.5 25h31c5.9 0 10.5-4.6 10.5-10.5S51.4 4 45.5 4z"
              fill="#3c4043"
            />
            <path d="M45.5 5C51 5 55.5 9.5 55.5 15S51 25 45.5 25h-31C9 25 4.5 20.5 4.5 15S9 5 14.5 5h31" fill="#fff" />
            <path d="M17 15a2 2 0 100-4 2 2 0 000 4z" fill="#eb001b" />
            <path d="M43 15a2 2 0 100-4 2 2 0 000 4z" fill="#f79e1b" />
            <path d="M30 17a2 2 0 100-4 2 2 0 000 4z" fill="#00c2ff" />
          </svg>
          <svg className="h-6" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
            <path d="M55 4H5a1 1 0 00-1 1v15a1 1 0 001 1h50a1 1 0 001-1V5a1 1 0 00-1-1z" fill="#252525" />
            <path d="M18 10l-3 5h-2l3-5h2z" fill="#fff" />
            <path d="M21 10l-3 5h-2l3-5h2z" fill="#fff" />
            <path d="M24 10l-3 5h-2l3-5h2z" fill="#fff" />
            <path d="M27 10l-3 5h-2l3-5h2z" fill="#fff" />
            <path d="M30 10l-3 5h-2l3-5h2z" fill="#fff" />
            <path d="M33 10l-3 5h-2l3-5h2z" fill="#fff" />
            <path d="M36 10l-3 5h-2l3-5h2z" fill="#fff" />
            <path d="M39 10l-3 5h-2l3-5h2z" fill="#fff" />
            <path d="M42 10l-3 5h-2l3-5h2z" fill="#fff" />
            <path d="M45 10l-3 5h-2l3-5h2z" fill="#fff" />
          </svg>
        </div>
      </div>
    </div>
  )
}
