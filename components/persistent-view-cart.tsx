"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export function PersistentViewCart() {
  const { cart } = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && isVisible) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY && !isVisible) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, isVisible])

  // Don't render anything if not mounted or cart is empty
  if (!mounted || cart.totalItems === 0) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-2 px-4 rounded-full shadow-lg hover:bg-primary/90 transition-all"
            aria-label={`View cart with ${cart.totalItems} items totaling ${formatCurrency(cart.totalPrice)}`}
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
              >
                {cart.totalItems}
              </Badge>
            </div>
            <span className="font-medium">View Cart</span>
            <span className="font-bold">{formatCurrency(cart.totalPrice)}</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
