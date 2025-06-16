"use client"

import { Badge } from "@/components/ui/badge"
import { useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Sparkles } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface CartButtonProps {
  showLabel?: boolean
  variant?: "default" | "floating" | "compact" | "minimal"
  size?: "sm" | "md" | "lg"
  position?: "header" | "floating" | "inline"
  className?: string
}

export default function CartButton({
  showLabel = false,
  variant = "default",
  size = "sm",
  position = "header",
  className,
}: CartButtonProps) {
  const { cart } = useCart()
  const router = useRouter()

  // Memoized calculations for performance with safe fallbacks
  const cartMetrics = useMemo(
    () => ({
      totalItems: cart?.totalItems || 0,
      totalValue: cart?.total || 0,
      hasItems: (cart?.totalItems || 0) > 0,
      isHighValue: (cart?.total || 0) > 200,
      itemCount: cart?.items?.length || 0,
    }),
    [cart?.totalItems, cart?.total, cart?.items?.length],
  )

  // Optimized handler to navigate to cart page
  const handleOpenCartPage = useCallback(() => {
    console.log("Cart button clicked - navigating to /cart") // Debug log
    router.push("/cart")
  }, [router])

  // Dynamic styling based on variant and state
  const buttonVariants = {
    default: "relative flex items-center gap-2 transition-all duration-200 hover:scale-105",
    floating:
      "relative flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-2 hover:scale-110",
    compact: "relative flex items-center gap-1 transition-all duration-200",
    minimal: "relative flex items-center transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
  }

  const sizeVariants = {
    sm: variant === "floating" ? "h-12 px-4" : "h-8 px-3",
    md: variant === "floating" ? "h-14 px-6" : "h-10 px-4",
    lg: variant === "floating" ? "h-16 px-8" : "h-12 px-6",
  }

  // Icon selection based on cart state
  const CartIcon = cartMetrics.hasItems ? (cartMetrics.isHighValue ? Sparkles : Package) : ShoppingCart

  // Badge styling based on cart value
  const badgeVariant = cartMetrics.isHighValue ? "default" : "destructive"
  const badgeClassName = cn(
    "ml-1 px-1.5 py-0 text-xs font-medium transition-all duration-200",
    cartMetrics.isHighValue && "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    variant === "floating" && "shadow-sm",
  )

  return (
    <Button
      variant={variant === "floating" ? "default" : "outline"}
      size={size}
      className={cn(
        buttonVariants[variant],
        sizeVariants[size],
        cartMetrics.hasItems && "ring-2 ring-blue-200 dark:ring-blue-800",
        cartMetrics.isHighValue && "ring-purple-200 dark:ring-purple-800",
        position === "floating" && "fixed bottom-6 right-6 z-40",
        className,
      )}
      onClick={handleOpenCartPage}
      aria-label={`Open shopping cart (${cartMetrics.totalItems} items, $${cartMetrics.totalValue.toFixed(2)})`}
      aria-expanded={false}
      aria-haspopup="page"
    >
      <CartIcon
        className={cn(
          "transition-all duration-200",
          size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6",
          cartMetrics.hasItems && "text-blue-600 dark:text-blue-400",
          cartMetrics.isHighValue && "text-purple-600 dark:text-purple-400",
        )}
      />

      {showLabel && (
        <span
          className={cn(
            "transition-all duration-200",
            variant === "compact" ? "hidden sm:inline" : "hidden md:inline",
            size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base",
          )}
        >
          Cart
        </span>
      )}

      {cartMetrics.hasItems && (
        <Badge variant={badgeVariant} className={badgeClassName}>
          {cartMetrics.totalItems > 99 ? "99+" : cartMetrics.totalItems}
        </Badge>
      )}

      {/* High value indicator */}
      {cartMetrics.isHighValue && variant === "floating" && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
      )}
    </Button>
  )
}
