"use client"

import React, { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollAwarePositioning } from "@/hooks/use-scroll-aware-positioning"
import { cn } from "@/lib/utils"

interface ScrollAwareWrapperProps {
  children: React.ReactNode
  className?: string
  side?: "left" | "right"
  config?: Parameters<typeof useScrollAwarePositioning>[0]
  onVisibilityChange?: (visible: boolean) => void
  elementHeight?: number // Height of the element for better positioning
}

const ScrollAwareWrapper = memo(function ScrollAwareWrapper({
  children,
  className,
  side = "right",
  config,
  onVisibilityChange,
  elementHeight = 60,
}: ScrollAwareWrapperProps) {
  // Enhanced config with continuous movement for pricing page
  const enhancedConfig = React.useMemo(
    () => ({
      defaultPosition: "continuous" as const,
      scrollPosition: "continuous" as const,
      continuousMovement: {
        enabled: true,
        startPosition: 40, // Start at 40% from top
        endPosition: 80, // End at 80% from top
        minDistanceFromBottom: Math.max(120, elementHeight + 40), // Dynamic based on element height
      },
      offset: {
        top: 20,
        bottom: 120, // Account for fixed footer
        left: side === "left" ? 20 : undefined,
        right: side === "right" ? 20 : undefined,
      },
      ...config,
    }),
    [config, side, elementHeight],
  )

  const { isVisible, positionStyles, isMobile, scrollProgress } = useScrollAwarePositioning(enhancedConfig)

  // Notify parent of visibility changes - only when actually changed
  React.useEffect(() => {
    onVisibilityChange?.(isVisible)
  }, [isVisible, onVisibilityChange])

  // Memoize side styles to prevent re-renders
  const sideStyles = React.useMemo(() => {
    return side === "left" ? { left: "20px" } : { right: "20px" }
  }, [side])

  // Memoize combined styles
  const combinedStyles = React.useMemo(
    () => ({
      ...positionStyles,
      ...sideStyles,
      zIndex: 50,
    }),
    [positionStyles, sideStyles],
  )

  // Dynamic opacity based on scroll progress for subtle effect
  const dynamicOpacity = React.useMemo(() => {
    // Fade slightly when near bottom to indicate end of content
    if (scrollProgress > 0.95) {
      return 0.8
    }
    return 1
  }, [scrollProgress])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: dynamicOpacity,
            scale: 1,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={combinedStyles}
          className={cn(
            "pointer-events-auto",
            isMobile && "scale-90",
            "transition-opacity duration-200", // Smooth opacity transitions
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export { ScrollAwareWrapper }
