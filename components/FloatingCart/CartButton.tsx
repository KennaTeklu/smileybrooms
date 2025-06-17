"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAdvancedAnimations } from "@/hooks/useAdvancedAnimations"
import { motion } from "framer-motion"
import { useAnalytics } from "@/hooks/use-analytics" // Import useAnalytics

export function CartButton() {
  const { cartItems, toggleCartPanel } = useCart()
  const { hoverProps, pressProps, floatingProps } = useAdvancedAnimations()
  const { trackButtonClick } = useAnalytics() // Destructure trackButtonClick

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCartClick = () => {
    toggleCartPanel()
    trackButtonClick("Cart Button", "Header", { itemCount }) // Track the click
  }

  return (
    <motion.div className="relative" {...hoverProps} {...pressProps} {...floatingProps}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={handleCartClick}
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {itemCount}
          </span>
        )}
      </Button>
    </motion.div>
  )
}
