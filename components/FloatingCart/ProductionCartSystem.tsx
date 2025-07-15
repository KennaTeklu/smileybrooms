"use client"

import { useEffect } from "react"

import { useState } from "react"

import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { formatCurrency } from "@/lib/utils"
import { useFloatingUI } from "@/hooks/useFloatingUI" // Assuming this hook exists for positioning
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization" // Assuming this hook exists for performance
import { useCartA11y } from "@/hooks/useCartA11y" // Assuming this hook exists for accessibility
import { useCartAnimation } from "@/hooks/useCartAnimation" // Assuming this hook exists for animations

export default function ProductionCartSystem() {
  const { cart, removeItem, updateItemQuantity } = useCart()
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

  const { floatingRef, referenceRef, x, y, strategy, placement, middlewareData } = useFloatingUI()
  const { isOptimized } = usePerformanceOptimization() // Example usage
  const { announceCartUpdate } = useCartA11y() // Example usage
  const { animateItemAdd, animateItemRemove } = useCartAnimation() // Example usage

  const [isOpen, setIsOpen] = useState(false)

  // Announce cart updates for screen readers
  useEffect(() => {
    announceCartUpdate(itemCount)
  }, [itemCount, announceCartUpdate])

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
    animateItemRemove(itemId) // Trigger remove animation
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateItemQuantity(itemId, quantity)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        ref={referenceRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
          aria-label={`Shopping cart with ${itemCount} items`}
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <motion.span
              key={itemCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            >
              {itemCount}
            </motion.span>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={floatingRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: "min(90vw, 400px)",
              zIndex: 100,
            }}
            className="absolute bottom-full right-0 mb-4 rounded-lg bg-white p-4 shadow-xl dark:bg-gray-800"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-bold">Your Cart</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close cart">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-4 max-h-60 overflow-y-auto space-y-3">
              {itemCount === 0 ? (
                <p className="text-center text-muted-foreground py-4">Your cart is empty.</p>
              ) : (
                cart.items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between gap-3 border-b pb-2 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">{formatCurrency(cartTotal)}</span>
            </div>
            <Button asChild className="mt-4 w-full">
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                Proceed to Checkout
              </Link>
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full bg-transparent">
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                View Full Cart
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
