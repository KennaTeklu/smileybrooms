"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"

interface CheckoutButtonProps {
  priceId?: string
  productName?: string
  productPrice?: number
  quantity?: number
  metadata?: Record<string, any>
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  useCheckoutPage?: boolean // New prop to control behavior
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
  useCheckoutPage = true, // Default to using checkout page
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
  const router = useRouter()

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      if (useCheckoutPage) {
        // Navigate to checkout page instead of direct Stripe
        if (cart.items.length === 0) {
          toast({
            title: "Cart is empty",
            description: "Please add items to your cart before checking out.",
            variant: "destructive",
          })
          return
        }

        router.push("/checkout")
        return
      }

      // Original Stripe direct checkout logic (kept for backward compatibility)
      const { createCheckoutSession } = await import("@/lib/actions")

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

      let checkoutUrl: string | undefined

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
          {useCheckoutPage ? "Loading..." : "Processing..."}
        </>
      ) : (
        <>
          {useCheckoutPage ? (
            <>
              <ArrowRight className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Checkout Now
            </>
          )}
        </>
      )}
    </Button>
  )
}
