"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { cart } = useCart()

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      alert("Your cart is empty. Please add items before checking out.")
      return
    }

    setIsLoading(true)

    try {
      // Redirect to Stripe checkout
      window.location.href = "/api/create-checkout-session"
    } catch (error) {
      console.error("Checkout error:", error)
      alert("There was an error processing your checkout. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(cart.totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(cart.totalPrice * 0.08)}</span>
        </div>
        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(cart.totalPrice * 1.08)}</span>
        </div>
      </div>

      <Button onClick={handleCheckout} disabled={isLoading || cart.items.length === 0} className="w-full" size="lg">
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </Button>

      <div className="text-xs text-center text-gray-500 dark:text-gray-400">
        <p>By proceeding, you agree to our</p>
        <div className="flex justify-center gap-1">
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>
          <span>&</span>
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}
