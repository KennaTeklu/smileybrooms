"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/actions"
import { Loader2, CreditCard } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"
import { trackBeginCheckout } from "@/lib/analytics-utils"

interface CheckoutButtonProps {
  priceId?: string
  productName?: string
  productPrice?: number
  quantity?: number
  metadata?: Record<string, any>
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  isRecurring?: boolean
  recurringInterval?: "week" | "month" | "year"
  paymentMethod?: "card" | "bank" | "both"
  customerData?: {
    name?: string
    email?: string
    phone?: string
    address?: {
      line1?: string
      city?: string
      state?: string
      postal_code?: string
      country?: string
    }
  }
}

export default function CheckoutButton({
  priceId,
  productName,
  productPrice,
  quantity = 1,
  metadata = {},
  className,
  variant = "default",
  size = "default",
  isRecurring = false,
  recurringInterval = "month",
  paymentMethod = "both",
  customerData,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { cart } = useCart()

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      let checkoutUrl: string | undefined

      // Track checkout initiated event
      try {
        trackBeginCheckout(cart.items, cart.totalPrice)
      } catch (error) {
        console.error("Error tracking checkout event:", error)
      }

      if (priceId) {
        // Use price ID for standard products
        checkoutUrl = await createCheckoutSession({
          lineItems: [{ price: priceId, quantity }],
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/canceled`,
          isRecurring,
          recurringInterval,
          paymentMethod,
          customerData,
        })
      } else if (productName && productPrice) {
        // Use custom line items for custom products
        checkoutUrl = await createCheckoutSession({
          customLineItems: [
            {
              name: productName,
              amount: productPrice,
              quantity,
              metadata: {
                ...metadata,
                paymentMethod,
              },
            },
          ],
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/canceled`,
          isRecurring,
          recurringInterval,
          paymentMethod,
          customerData,
        })
      } else {
        throw new Error("Either priceId or productName and productPrice must be provided")
      }

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className={className} variant={variant} size={size} onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Checkout Now
        </>
      )}
    </Button>
  )
}
