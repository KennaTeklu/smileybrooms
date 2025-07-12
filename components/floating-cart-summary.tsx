"use client"

import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function FloatingCartSummary() {
  const { cart } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (cart.items.length > 0) {
      setIsVisible(true)
    } else {
      // Optionally hide after a delay if cart becomes empty
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [cart.items.length])

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  if (!isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 17 }}
          className="fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center space-x-4 max-w-sm w-full"
        >
          <ShoppingCart className="h-6 w-6" />
          <div className="flex-1">
            <p className="text-sm font-medium">Your Cart ({totalItems} items)</p>
            <p className="text-lg font-bold">{formatCurrency(cart.total)}</p>
          </div>
          <Link href="/cart" passHref>
            <Button variant="secondary" className="flex items-center">
              Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
