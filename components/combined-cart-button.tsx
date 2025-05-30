"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Cart } from "@/components/cart"

interface CombinedCartButtonProps {
  onCheckout: () => void
}

export default function CombinedCartButton({ onCheckout }: CombinedCartButtonProps) {
  const { cart } = useCart()
  const [isClient, setIsClient] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCount, setPrevCount] = useState(0)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
      return "$0.00"
    }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2 px-4 sm:px-6 lg:px-8 z-50">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="default" className={cn("relative", isAnimating && "animate-bounce-once")}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>Cart</span>
              {isClient && cart.totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cart.totalItems}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <Cart />
        </Sheet>
        <div className="flex items-center gap-4">
          <div className="text-lg font-bold">{formattedPrice(cart.totalPrice)}</div>
          <Button
            onClick={onCheckout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
