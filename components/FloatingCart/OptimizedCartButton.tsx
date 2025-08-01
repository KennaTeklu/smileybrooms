"use client"

import { forwardRef, useCallback, useEffect, useRef } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdvancedAnimations } from "@/hooks/useAdvancedAnimations"
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization"
import { cn } from "@/lib/utils"
import styles from "./cart.module.css"

interface OptimizedCartButtonProps {
  itemCount: number
  totalPrice: number
  onClick: () => void
  isOpen: boolean
  className?: string
  disabled?: boolean
}

export const OptimizedCartButton = forwardRef<HTMLButtonElement, OptimizedCartButtonProps>(
  ({ itemCount, totalPrice, onClick, isOpen, className, disabled = false }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const lastItemCountRef = useRef(itemCount)

    // Advanced physics-based animations
    const { animateHover, animatePress, animateFloat, animatePulse, animateBounce, getAnimatedStyle, isAnimating } =
      useAdvancedAnimations()

    // Performance monitoring
    const { startInteractionMeasurement, endInteractionMeasurement, getAdaptiveQuality } = usePerformanceOptimization({
      enableFPSMonitoring: true,
      enableRenderTimeTracking: true,
    })

    // Adaptive quality based on performance
    const quality = getAdaptiveQuality()
    const shouldUseReducedAnimations = quality === "low"

    // Handle item count changes with animation
    useEffect(() => {
      if (itemCount > lastItemCountRef.current && itemCount > 0) {
        // New item added - bounce animation
        if (!shouldUseReducedAnimations) {
          animateBounce()
        }
      } else if (itemCount === 1 && lastItemCountRef.current === 0) {
        // First item added - pulse animation
        if (!shouldUseReducedAnimations) {
          animatePulse()
        }
      }

      lastItemCountRef.current = itemCount
    }, [itemCount, animateBounce, animatePulse, shouldUseReducedAnimations])

    // Floating animation when cart has items
    useEffect(() => {
      let floatingInterval: NodeJS.Timeout

      if (itemCount > 0 && !isOpen && !shouldUseReducedAnimations) {
        floatingInterval = setInterval(() => {
          animateFloat(2)
        }, 3000)
      }

      return () => {
        if (floatingInterval) {
          clearInterval(floatingInterval)
        }
      }
    }, [itemCount, isOpen, animateFloat, shouldUseReducedAnimations])

    // Optimized event handlers
    const handleMouseEnter = useCallback(() => {
      if (!shouldUseReducedAnimations) {
        animateHover(true)
      }
    }, [animateHover, shouldUseReducedAnimations])

    const handleMouseLeave = useCallback(() => {
      if (!shouldUseReducedAnimations) {
        animateHover(false)
      }
    }, [animateHover, shouldUseReducedAnimations])

    const handleMouseDown = useCallback(() => {
      startInteractionMeasurement()
      if (!shouldUseReducedAnimations) {
        animatePress(true)
      }
    }, [animatePress, startInteractionMeasurement, shouldUseReducedAnimations])

    const handleMouseUp = useCallback(() => {
      if (!shouldUseReducedAnimations) {
        animatePress(false)
      }
    }, [animatePress, shouldUseReducedAnimations])

    const handleClick = useCallback(() => {
      endInteractionMeasurement()
      onClick()
    }, [onClick, endInteractionMeasurement])

    // Haptic feedback for mobile
    const triggerHapticFeedback = useCallback(() => {
      if ("vibrate" in navigator && /Mobi|Android/i.test(navigator.userAgent)) {
        navigator.vibrate(15)
      }
    }, [])

    // Enhanced click handler with haptic feedback
    const handleEnhancedClick = useCallback(() => {
      triggerHapticFeedback()
      handleClick()
    }, [triggerHapticFeedback, handleClick])

    const ariaLabel = `Shopping Cart (${itemCount} items, $${totalPrice.toFixed(2)})`

    return (
      <Button
        ref={ref || buttonRef}
        onClick={handleEnhancedClick}
        disabled={disabled}
        className={cn(styles.cartButton, className)}
        style={{
          ...getAnimatedStyle(),
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
          // Performance optimizations
          backfaceVisibility: "hidden",
          perspective: 1000,
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls="cart-panel"
        data-testid="optimized-cart-button"
        data-performance-quality={quality}
        data-is-animating={isAnimating}
      >
        <ShoppingCart
          className="h-5 w-5 sm:h-6 sm:w-6"
          aria-hidden="true"
          style={{
            // Optimize icon rendering
            willChange: shouldUseReducedAnimations ? "auto" : "transform",
          }}
        />

        {itemCount > 0 && (
          <Badge
            className={cn(styles.cartBadge)}
            style={{
              backgroundColor: "var(--destructive)",
              color: "var(--destructive-foreground)",
              // Optimize badge rendering
              willChange: shouldUseReducedAnimations ? "auto" : "transform, opacity",
              animation: shouldUseReducedAnimations ? "none" : undefined,
            }}
            aria-label={`${itemCount} items in cart`}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </Badge>
        )}

        {/* High value indicator with performance optimization */}
        {totalPrice > 200 && !shouldUseReducedAnimations && (
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"
            aria-hidden="true"
            style={{
              willChange: "opacity",
              backfaceVisibility: "hidden",
            }}
          />
        )}

        {/* Performance indicator (development only) */}
        {process.env.NODE_ENV === "development" && (
          <div
            className="absolute -top-2 -left-2 w-2 h-2 rounded-full"
            style={{
              backgroundColor: quality === "high" ? "green" : quality === "medium" ? "yellow" : "red",
            }}
            title={`Performance: ${quality}`}
          />
        )}
      </Button>
    )
  },
)

OptimizedCartButton.displayName = "OptimizedCartButton"
