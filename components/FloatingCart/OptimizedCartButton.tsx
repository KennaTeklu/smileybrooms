"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { cn } from "@/lib/utils"
import { useFloatingElement } from "@/hooks/use-floating-element"
import { useScrollDirection } from "@/hooks/use-scroll-direction"
import { useFloatingAnimation } from "@/hooks/use-floating-animation"
import { useOptimizedRendering } from "@/hooks/useOptimizedRendering"
import { usePerformanceOptimization } from "@/hooks/use-performance-monitor"
import { useProductionOptimizations } from "@/hooks/useProductionOptimizations"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function OptimizedCartButton() {
  const { cartItems } = useCart()
  const { ref, style } = useFloatingElement()
  const scrollDirection = useScrollDirection()
  const { animatedStyle } = useFloatingAnimation(scrollDirection)
  const { optimizeRendering } = useOptimizedRendering()
  const { startMonitoring, stopMonitoring } = usePerformanceOptimization()
  const { applyProductionOptimizations } = useProductionOptimizations()
  const router = useRouter()

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleCartClick = () => {
    router.push("/cart")
  }

  useEffect(() => {
    // Apply performance optimizations
    optimizeRendering()
    applyProductionOptimizations()
    startMonitoring()

    return () => {
      stopMonitoring()
    }
  }, [optimizeRendering, applyProductionOptimizations, startMonitoring, stopMonitoring])

  return (
    <Button
      ref={ref}
      onClick={handleCartClick}
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-full p-4 shadow-lg transition-all duration-300",
        itemCount > 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
        animatedStyle,
      )}
      style={style}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
    </Button>
  )
}
