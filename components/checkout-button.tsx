"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { CheckoutData } from "@/lib/types"

interface CheckoutButtonProps {
  checkoutData?: CheckoutData
  className?: string
  children?: React.ReactNode
}

export default function CheckoutButton({ checkoutData, className, children }: CheckoutButtonProps) {
  const { items, getTotalPrice } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some services to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    if (!checkoutData?.contact?.email || !checkoutData?.address?.address) {
      toast({
        title: "Missing information",
        description: "Please complete your contact and address information first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Save checkout data to localStorage for order summary page
      localStorage.setItem("checkout-contact", JSON.stringify(checkoutData.contact))
      localStorage.setItem("checkout-address", JSON.stringify(checkoutData.address))
      localStorage.setItem("checkout-payment", JSON.stringify(checkoutData.payment))
      localStorage.setItem("cartItems", JSON.stringify(items))

      // For demo purposes, redirect directly to order summary
      // In production, this would go through Stripe checkout first
      router.push("/order-summary")

      toast({
        title: "Redirecting to order summary...",
        description: "Processing your order information.",
      })

      // Uncomment below for actual Stripe integration:
      /*
      const { url } = await createCheckoutSession(items, checkoutData)
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error("No checkout URL returned")
      }
      */
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const total = getTotalPrice()

  return (
    <Button onClick={handleCheckout} disabled={isLoading || items.length === 0} className={className} size="lg">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || `Complete Order • $${total.toFixed(2)}`}
        </>
      )}
    </Button>
  )
}
