"use client"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/actions"
import { useCart } from "@/lib/cart-context"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { CustomLineItem, LineItem } from "@/lib/actions"

interface CheckoutButtonProps extends Omit<ButtonProps, "onClick"> {
  successUrl?: string
  cancelUrl?: string
  clientReferenceId?: string
  customerEmail?: string
  metadata?: Record<string, string>
  onCheckoutStart?: () => void
  onCheckoutComplete?: (url: string) => void
  onCheckoutError?: (error: Error) => void
}

export default function CheckoutButton({
  successUrl,
  cancelUrl,
  clientReferenceId,
  customerEmail,
  metadata = {},
  onCheckoutStart,
  onCheckoutComplete,
  onCheckoutError,
  children = "Checkout Now",
  ...props
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { cart } = useCart()
  const { toast } = useToast()

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    onCheckoutStart?.()

    try {
      // Prepare line items for Stripe
      const lineItems: LineItem[] = []
      const customLineItems: CustomLineItem[] = []

      // Process cart items
      cart.items.forEach((item) => {
        if (item.priceId.startsWith("price_")) {
          // Regular Stripe price ID
          lineItems.push({
            price: item.priceId,
            quantity: item.quantity,
          })
        } else {
          // Custom price (dynamic pricing)
          customLineItems.push({
            name: item.name,
            description: item.description,
            amount: item.price,
            quantity: item.quantity,
            images: item.image ? [item.image] : undefined,
          })
        }
      })

      // Set default URLs if not provided
      const defaultSuccessUrl = `${window.location.origin}/success`
      const defaultCancelUrl = `${window.location.origin}/canceled`

      // Create checkout session
      const checkoutUrl = await createCheckoutSession({
        lineItems,
        customLineItems,
        successUrl: successUrl || defaultSuccessUrl,
        cancelUrl: cancelUrl || defaultCancelUrl,
        clientReferenceId,
        customerEmail,
        metadata: {
          cartId: `cart_${Date.now()}`,
          ...metadata,
        },
        allowPromotionCodes: true,
        shippingAddressCollection: true,
      })

      if (checkoutUrl) {
        onCheckoutComplete?.(checkoutUrl)
        window.location.href = checkoutUrl
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      onCheckoutError?.(error instanceof Error ? error : new Error("Checkout failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className="w-full" onClick={handleCheckout} disabled={isLoading || cart.items.length === 0} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
