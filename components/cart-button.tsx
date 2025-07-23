"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard, ArrowRight, ShoppingCart } from "lucide-react" // Added ShoppingCart icon
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import Link from "next/link" // Import Link for navigation

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
  isCartButton?: boolean // New prop to distinguish the header cart button
}

export function CheckoutButton({
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
  isCartButton = false, // Default to false
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

  if (isCartButton) {
    return (
      <Button asChild variant="ghost" size="icon" className={className}>
        <Link href="/cart" aria-label={`View cart with ${cart.totalItems} items`}>
          <ShoppingCart className="h-5 w-5" />
          {cart.totalItems > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {cart.totalItems}
            </span>
          )}
        </Link>
      </Button>
    )
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

// Also provide default export for backward compatibility
export default CheckoutButton
