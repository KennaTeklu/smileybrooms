"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { LoaderCircle } from "lucide-react"

interface QuickCheckoutButtonProps {
  serviceName: string
  price: number
  metadata?: Record<string, any>
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  buttonText?: string
}

export function QuickCheckoutButton({
  serviceName,
  price,
  metadata = {},
  className = "",
  variant = "default",
  buttonText = "Book Now",
}: QuickCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleQuickCheckout = async () => {
    setIsLoading(true)
    try {
      // Create checkout session with just this single service
      const checkoutUrl = await createCheckoutSession({
        customLineItems: [
          {
            name: serviceName,
            amount: price,
            quantity: 1,
            metadata,
          },
        ],
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
      })

      // Redirect to Stripe checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Quick checkout error:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} className={className} onClick={handleQuickCheckout} disabled={isLoading}>
      {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
      {buttonText}
    </Button>
  )
}
