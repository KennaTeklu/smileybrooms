"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createCheckoutSession } from "@/lib/actions"
import type { CartItem } from "@/lib/cart/types"
import type Stripe from "stripe"

/**
 * Props expected by the CheckoutButton.
 * Matches the shape used on /cart and other pages.
 */
interface CheckoutButtonProps extends React.ComponentProps<typeof Button> {
  /** If true we redirect to a dedicated /checkout page instead of Stripe */
  useCheckoutPage?: boolean
  /** Items in the cart */
  cartItems: CartItem[]
  /** Prefill e-mail in Stripe Checkout */
  customerEmail?: string
  /** Optional extra customer details */
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
    allowVideoRecording?: boolean
    videoConsentDetails?: string
  }
  /** Recurring plan options */
  isRecurring?: boolean
  recurringInterval?: "day" | "week" | "month" | "year"
  /** One-off discount */
  discount?: {
    amount: number
    reason: string
  }
  /** Stripe advanced options */
  shippingAddressCollection?: { allowed_countries: string[] }
  automaticTax?: { enabled: boolean }
  paymentMethodTypes?: Stripe.Checkout.SessionCreateParams.PaymentMethodType[]
  trialPeriodDays?: number
  cancelAtPeriodEnd?: boolean
  allowPromotions?: boolean
}

/**
 * Named export so `import { CheckoutButton } from "@/components/checkout-button"` works.
 * Also exported as default for convenience.
 */
export function CheckoutButton({
  useCheckoutPage = false,
  cartItems,
  customerEmail,
  customerData,
  isRecurring,
  recurringInterval,
  discount,
  shippingAddressCollection,
  automaticTax,
  paymentMethodTypes,
  trialPeriodDays,
  cancelAtPeriodEnd,
  allowPromotions,
  ...props
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Convert cart items to Stripe-compatible line items
      const customLineItems = cartItems.map((item) => ({
        name: item.name,
        // Make sure amount is a valid integer (cents)
        amount: Number(item.unitPrice) || 0,
        quantity: item.quantity,
        description: item.description,
        images: item.images,
        metadata: item.meta,
      }))

      // Create the Stripe Checkout Session via our server action
      const checkoutUrl = await createCheckoutSession({
        customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail,
        customerData,
        isRecurring,
        recurringInterval,
        discount,
        shippingAddressCollection,
        automaticTax,
        paymentMethodTypes,
        trialPeriodDays,
        cancelAtPeriodEnd,
        allowPromotions,
      })

      if (checkoutUrl) {
        // Redirect the customer
        window.location.href = checkoutUrl
      } else {
        toast({
          title: "Checkout failed",
          description: "Unable to start checkout. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout error",
        description: error?.message ?? "Unexpected error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading || cartItems.length === 0} {...props}>
      {isLoading ? "Processing..." : "Proceed to Checkout"}
    </Button>
  )
}

// Optional default export for other import styles
export default CheckoutButton
