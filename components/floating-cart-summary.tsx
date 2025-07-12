"use client"

import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function FloatingCartSummary() {
  const { cart } = useCart()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show the cart summary if there are items in the cart
    if (cart.totalItems > 0) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [cart.totalItems])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center space-x-4">
        <ShoppingCart className="h-6 w-6" />
        <div className="flex flex-col">
          <span className="text-sm font-medium">Your Cart: {cart.totalItems} items</span>
          <span className="text-lg font-bold">{formatCurrency(cart.totalPrice)}</span>
        </div>
        <Button
          variant="secondary"
          className="ml-4"
          onClick={() => router.push("/checkout")}
          disabled={cart.totalItems === 0}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  )
}
