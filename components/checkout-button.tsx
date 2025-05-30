"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/actions"
import { Loader2, CreditCard } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"

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
  recurringInterval?: "day" | "week" | "month" | "year"
  paymentMethod?: "card" | "bank" | "wallet"
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
  shippingAddressCollection?: { allowed_countries: string[] }
  automaticTax?: { enabled: boolean }
  trialPeriodDays?: number
  cancelAtPeriodEnd?: boolean
  allowPromotions?: boolean
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
  paymentMethod = "card",
  customerData,
  shippingAddressCollection,
  automaticTax,
  trialPeriodDays,
  cancelAtPeriodEnd,
  allowPromotions,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { cart } = useCart()

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      let checkoutUrl: string | undefined

      const commonParams = {
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        isRecurring,
        recurringInterval,
        customerEmail: customerData?.email,
        customerData,
        shippingAddressCollection,
        automaticTax,
        trialPeriodDays,
        cancelAtPeriodEnd,
        allowPromotions,
        paymentMethodTypes: [paymentMethod],
      }

      if (priceId) {
        checkoutUrl = await createCheckoutSession({
          lineItems: [{ price: priceId, quantity }],
          ...commonParams,
        })
      } else if (productName && productPrice) {
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
          ...commonParams,
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
