"use client"

import { useCart } from "@/lib/cart-context"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function UnifiedCartButton() {
  const { getItemCount, getCartTotal } = useCart()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const router = useRouter()

  const itemCount = getItemCount()
  const cartTotal = getCartTotal()
  const [shouldRender, setShouldRender] = useState(itemCount > 0)

  useEffect(() => {
    setShouldRender(itemCount > 0)
  }, [itemCount])

  // Hide button when cart is empty
  if (!shouldRender) {
    return null
  }

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show button when scrolling up, hide when scrolling down
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

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0",
      )}
    >
      <Button
        onClick={() => router.push("/cart")}
        className="bg-black/80 backdrop-blur-sm border border-white/10 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
        aria-label={`View cart with ${itemCount} items totaling $${cartTotal.toFixed(2)}`}
      >
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full">
              {itemCount}
            </Badge>
          )}
        </div>
        <span>View Cart</span>
        <span className="font-semibold">${cartTotal.toFixed(2)}</span>
      </Button>
    </div>
  )
}
