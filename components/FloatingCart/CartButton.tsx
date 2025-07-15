"use client"

import { forwardRef } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartAnimation } from "@/hooks/useCartAnimation"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import styles from "./cart.module.css"

interface CartButtonProps {
  className?: string
  disabled?: boolean
}

export const CartButton = forwardRef<HTMLButtonElement, CartButtonProps>(({ className, disabled = false }, ref) => {
  const { cart } = useCart()
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

  const { animationState, handleHover, handlePress, startFloating, stopFloating } = useCartAnimation({
    enableFloat: itemCount > 0,
  })

  const handleMouseEnter = () => {
    handleHover(true)
    if (itemCount > 0) startFloating()
  }

  const handleMouseLeave = () => {
    handleHover(false)
    stopFloating()
  }

  const handleMouseDown = () => handlePress(true)
  const handleMouseUp = () => handlePress(false)

  const ariaLabel = `Shopping Cart (${itemCount} items, $${totalPrice.toFixed(2)})`

  return (
    <Button
      ref={ref}
      asChild
      disabled={disabled}
      className={cn(styles.cartButton, className)}
      style={{
        transform: `translateY(${animationState.translateY}px) scale(${animationState.scale})`,
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      aria-label={ariaLabel}
      aria-controls="cart-panel"
      data-testid="floating-cart-button"
    >
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />

        {itemCount > 0 && (
          <Badge
            className={cn(styles.cartBadge)}
            style={{
              backgroundColor: "var(--destructive)",
              color: "var(--destructive-foreground)",
            }}
            aria-label={`${itemCount} items in cart`}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}

        {/* High value indicator */}
        {totalPrice > 200 && (
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"
            aria-hidden="true"
          />
        )}
      </Link>
    </Button>
  )
})

CartButton.displayName = "CartButton"
