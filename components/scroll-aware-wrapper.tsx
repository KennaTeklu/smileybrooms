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
}

const ScrollAwareWrapper = memo(function ScrollAwareWrapper({
  children,
  className,
  side = "right",
  config,
  onVisibilityChange,
}: ScrollAwareWrapperProps) {
  const { isVisible, positionStyles, isMobile } = useScrollAwarePositioning(config)

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

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={combinedStyles}
          className={cn("pointer-events-auto", isMobile && "scale-90", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
})

export { ScrollAwareWrapper }
