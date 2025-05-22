"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function UnifiedCartButton() {
  const { items, getCartTotal, getItemCount } = useCart()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const itemCount = getItemCount()
  const total = getCartTotal()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleClick = () => {
    router.push("/cart")
  }

  if (itemCount === 0) {
    return null
  }

  return (
    <div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <Button
        onClick={handleClick}
        className="bg-black/80 hover:bg-black/90 text-white backdrop-blur-sm border border-white/20 shadow-lg rounded-full px-6 py-3 flex items-center gap-3 transition-all duration-200 hover:scale-105"
        aria-label={`View cart with ${itemCount} items, total $${total.toFixed(2)}`}
      >
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </div>
        <span className="font-medium">View Cart</span>
        <span className="font-semibold">${total.toFixed(2)}</span>
      </Button>
    </div>
  )
}
