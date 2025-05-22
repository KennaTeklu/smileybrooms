"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function PersistentViewCart() {
  const router = useRouter()
  const { cart, getCartTotal, getItemCount } = useCart()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const itemCount = getItemCount()
  const totalPrice = getCartTotal()

  // Handle scroll events to show/hide the button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Don't render if cart is empty
  if (itemCount === 0) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50"
        >
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm text-white rounded-full shadow-lg border border-white/10"
            aria-label={`View cart with ${itemCount} items totaling ${formatCurrency(totalPrice)}`}
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span>View Cart</span>
            <span className="font-semibold">{formatCurrency(totalPrice)}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
