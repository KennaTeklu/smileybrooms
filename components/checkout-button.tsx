"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/actions"

export default function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const checkoutUrl = await createCheckoutSession({
        priceId: "price_1234567890", // Replace with your actual Stripe price ID
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
      })

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Error during checkout:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className="w-full" onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? "Processing..." : "Checkout Now"}
    </Button>
  )
}
