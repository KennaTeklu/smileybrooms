"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowRight } from "lucide-react"
import { useEnhancedCart } from "@/lib/enhanced-cart-context"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface UnifiedCartButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showPrice?: boolean
  showCheckout?: boolean
  sticky?: boolean
  position?: "top-right" | "bottom-right" | "bottom-full"
}

export default function UnifiedCartButton({
  variant = "default",
  size = "default",
  showPrice = false,
  showCheckout = false,
  sticky = false,
  position = "bottom-right",
}: UnifiedCartButtonProps) {
  const { cart, getListCount } = useEnhancedCart()
  const [isAnimating, setIsAnimating] = useState(false)

  // Get the count of items in the main list
  const itemCount = getListCount("main")

  // Position classes based on the position prop
  const positionClasses = {
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-full": "bottom-0 left-0 right-0 w-full rounded-none",
  }

  // Trigger animation when cart count changes
  const prevCount = React.useRef(itemCount)

  React.useEffect(() => {
    if (itemCount > prevCount.current) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
    prevCount.current = itemCount
  }, [itemCount])

  return (
    <div className={cn("z-50", sticky ? `fixed ${positionClasses[position]}` : "relative")}>
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative",
          position === "bottom-full" && "w-full justify-between px-6 py-6",
          isAnimating && "ring-2 ring-blue-400 ring-offset-2",
        )}
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-500"
            />
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />

          {itemCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {itemCount}
            </Badge>
          )}

          {showPrice && <span className="ml-2 font-medium">{formatCurrency(cart.totalPrice)}</span>}
        </div>

        {showCheckout && (
          <div className="ml-4 flex items-center">
            <span>Checkout</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        )}
      </Button>
    </div>
  )
}
