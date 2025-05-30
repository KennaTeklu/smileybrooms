"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Cart } from "@/components/cart"
import { formatCurrency } from "@/lib/utils" // Assuming formatCurrency is in utils

interface CartButtonProps {
  onCheckout: () => void
}

export default function CartButton({ onCheckout }: CartButtonProps) {
  const { cart } = useCart()
  const [isClient, setIsClient] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCount, setPrevCount] = useState(0)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Add animation when items are added to cart
  useEffect(() => {
    if (isClient && cart.totalItems > prevCount) {
      setIsAnimating(true)
      const timeout = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timeout)
    }
    setPrevCount(cart.totalItems)
  }, [cart.totalItems, isClient, prevCount])

  const formattedPrice = (price: number) => {
    try {
      return formatCurrency(price)
    } catch (error) {
      console.error("Error formatting price:", error)
      return "$0.00" // Fallback value
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          className={cn(
            "fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 sm:px-6 lg:px-8 z-50 cursor-pointer",
            isAnimating && "animate-bounce-once",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-medium">Cart ({isClient ? cart.totalItems : 0})</span>
              {isClient && cart.totalItems > 0 && (
                <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cart.totalItems}
                </Badge>
              )}
              <div className="text-lg font-bold ml-4">{formattedPrice(cart.totalPrice)}</div>
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation() // Prevent Sheet from opening when checkout button is clicked
                onCheckout()
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Checkout
            </Button>
          </div>
        </div>
      </SheetTrigger>
      <Cart />
    </Sheet>
  )
}
