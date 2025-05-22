"use client"

import { useState, useEffect } from "react"
import { useEnhancedCart } from "@/lib/enhanced-cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Cart } from "@/components/cart"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart, ArrowRight } from "lucide-react"

interface UnifiedCartButtonProps {
  className?: string
  variant?: "default" | "outline" | "secondary" | "link" | "ghost" | "destructive" | null
  size?: "default" | "sm" | "lg" | "icon"
  showPrice?: boolean
  showCheckout?: boolean
  sticky?: boolean
  position?: "top-right" | "bottom-right" | "bottom-full"
}

export default function UnifiedCartButton({
  className,
  variant = "outline",
  size = "default",
  showPrice = false,
  showCheckout = false,
  sticky = false,
  position = "top-right",
}: UnifiedCartButtonProps) {
  const { cart, setActiveList } = useEnhancedCart()
  const [isClient, setIsClient] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCount, setPrevCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  // Set the active list to "main" by default
  useEffect(() => {
    setActiveList("main")
  }, [setActiveList])

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

  // Position classes based on the position prop
  const positionClasses = {
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-full": "bottom-0 left-0 w-full",
  }

  // Determine if we should show the sticky version
  const stickyClasses = sticky
    ? cn(
        "fixed z-50 shadow-lg",
        position === "bottom-full"
          ? "py-2 px-4 bg-white border-t flex items-center justify-between w-full"
          : "rounded-full bg-white",
        positionClasses[position],
      )
    : ""

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "relative",
            isAnimating && "animate-bounce-once",
            stickyClasses,
            position === "bottom-full" ? "rounded-none" : "",
            className,
          )}
          onClick={() => setIsOpen(true)}
          aria-label={`Open cart with ${cart.totalItems} items`}
        >
          <ShoppingCart className={cn("h-5 w-5", showPrice || showCheckout ? "mr-2" : "")} />

          {showPrice && isClient && <span className="mr-2 font-medium">{formatCurrency(cart.totalPrice)}</span>}

          {!showPrice && !showCheckout && <span className="ml-2">Cart</span>}

          {showCheckout && (
            <span className="flex items-center">
              Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}

          {isClient && cart.totalItems > 0 && (
            <Badge
              variant="destructive"
              className={cn(
                "absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs",
                showCheckout && "right-auto left-4",
              )}
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
