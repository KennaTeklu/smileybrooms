/* Don't modify beyond what is requested ever. */
"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Cart } from "@/components/cart"

interface CartButtonProps {
  className?: string
  variant?: "default" | "outline" | "secondary" | "link" | "ghost" | "destructive" | null
  size?: "default" | "sm" | "lg" | "icon"
}

export default function CartButton({ className, variant = "outline", size = "default" }: CartButtonProps) {
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("relative", isAnimating && "animate-bounce-once", className)}
        >
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
  )
}
