"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface CheckoutButtonProps {
  items: {
    name: string
    description?: string
    price: number // in dollars
    quantity: number
    recurring?: { interval: "day" | "week" | "month" | "year" }
  }[]
  mode?: "payment" | "subscription"
  customerEmail?: string
  metadata?: Record<string, string>
  subscriptionData?: {
    trial_period_days?: number
    cancel_at_period_end?: boolean
  }
}

export function CheckoutButton({
  items,
  mode = "payment",
  customerEmail,
  metadata,
  subscriptionData,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/checkout-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lineItems: items,
          mode,
          customerEmail,
          metadata,
          subscriptionData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error: any) {
      toast({
        title: "Checkout Error",
        description: error.message || "An unexpected error occurred during checkout.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? "Redirecting..." : "Proceed to Checkout"}
    </Button>
  )
}
