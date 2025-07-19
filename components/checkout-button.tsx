"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createCheckoutSession } from "@/lib/stripe" // Declare the variable before using it

interface CheckoutButtonProps extends React.ComponentProps<typeof Button> {
  useCheckoutPage?: boolean // New prop to control behavior
  productName?: string // Optional, only used if not navigating to checkout page
  productPrice?: number // Optional, only used if not navigating to checkout page
  customerEmail?: string
  customerName?: string
  customerAddress?: {
    line1?: string
    city?: string
    state?: string
    postal_code?: string
    country?: string
  }
  allowVideoRecording?: boolean
  videoConsentDetails?: string
}

export function CheckoutButton({
  useCheckoutPage = false,
  productName,
  productPrice,
  customerEmail,
  customerName,
  customerAddress,
  allowVideoRecording,
  videoConsentDetails,
  className,
  ...props
}: CheckoutButtonProps) {
  const { cart, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (useCheckoutPage) {
      router.push("/checkout")
      return
    }

    setIsLoading(true)
    try {
      const customLineItems = cart.items.map((item) => ({
        name: item.name,
        amount: item.price,
        quantity: item.quantity,
        description: item.description,
        images: item.image ? [item.image] : undefined,
        metadata: {
          itemId: item.id,
          category: item.category,
          // Stringify complex objects for Stripe metadata
          roomConfig: item.metadata?.roomConfig ? JSON.stringify(item.metadata.roomConfig) : undefined,
          tier: item.metadata?.tier,
          frequency: item.metadata?.frequency,
          duration: item.metadata?.duration,
          // Add any other specific details from item.metadata
          ...(item.metadata &&
            Object.fromEntries(
              Object.entries(item.metadata).map(([key, value]) => [
                key,
                typeof value === "object" && value !== null ? JSON.stringify(value) : String(value),
              ]),
            )),
        },
      }))

      // Apply coupon discount as a negative line item if applicable
      if (cart.couponDiscount > 0) {
        customLineItems.push({
          name: `Discount: ${cart.couponCode || "Applied Coupon"}`,
          amount: -cart.couponDiscount, // Negative amount for discount
          quantity: 1,
          description: `Coupon code: ${cart.couponCode}`,
        })
      }

      // Apply full house discount as a negative line item if applicable
      if (cart.fullHouseDiscount > 0) {
        customLineItems.push({
          name: "Full House Discount",
          amount: -cart.fullHouseDiscount, // Negative amount for discount
          quantity: 1,
          description: "Discount for booking all rooms",
        })
      }

      const sessionUrl = await createCheckoutSession({
        customLineItems: customLineItems,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/canceled`,
        customerEmail: customerEmail,
        customerData: {
          name: customerName,
          email: customerEmail,
          address: customerAddress,
          allowVideoRecording: allowVideoRecording,
          videoConsentDetails: videoConsentDetails,
        },
        automaticTax: { enabled: true },
        shippingAddressCollection: { allowed_countries: ["US"] }, // Example: restrict to US
      })

      if (sessionUrl) {
        router.push(sessionUrl)
        clearCart() // Clear cart after successful redirection to Stripe
      } else {
        toast({
          title: "Checkout Failed",
          description: "Could not create checkout session. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout Error",
        description: "An unexpected error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (useCheckoutPage) {
    return (
      <Button
        onClick={handleCheckout}
        disabled={isLoading || cart.items.length === 0}
        className={cn("rounded-lg", className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Proceed to Checkout"
        )}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || cart.items.length === 0}
      className={cn("rounded-lg", className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Pay with Card"
      )}
    </Button>
  )
}

// Also provide default export for backward compatibility
export default CheckoutButton
