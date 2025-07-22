"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/actions"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { CartItem } from "@/lib/cart/types" // Import CartItem type
import type Stripe from "stripe" // Declare Stripe variable

interface CheckoutButtonProps extends React.ComponentProps<typeof Button> {
  useCheckoutPage?: boolean
  cartItems: CartItem[] // Changed to accept an array of CartItem
  customerEmail?: string
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
  isRecurring?: boolean
  recurringInterval?: "day" | "week" | "month" | "year"
  discount?: {
    amount: number
    reason: string
  }
  shippingAddressCollection?: { allowed_countries: string[] }
  automaticTax?: { enabled: boolean }
  paymentMethodTypes?: Stripe.Checkout.SessionCreateParams.PaymentMethodType[]
  trialPeriodDays?: number
  cancelAtPeriodEnd?: boolean
  allowPromotions?: boolean
}

export function CheckoutButton({
  useCheckoutPage = false,
  cartItems, // Destructure cartItems
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
    setIsLoading(true)
    try {
      // Map cartItems to customLineItems for Stripe
      const customLineItems = cartItems.map((item) => ({
        name: item.name,
        // Ensure unitPrice is a valid number, default to 0 if not
        amount: Number(item.unitPrice) || 0,
        quantity: item.quantity,
        description: item.description,
        images: item.images,
        metadata: item.meta, // Pass the entire meta object as metadata
      }))

      const checkoutUrl = await createCheckoutSession({
        customLineItems, // Pass the mapped customLineItems
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
        window.location.href = checkoutUrl
      } else {
        toast({
          title: "Checkout Failed",
          description: "Could not initiate checkout. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout Error",
        description: `An unexpected error occurred during checkout: ${error.message || "Unknown error"}. Please try again.`,
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
