"use client"

import React from "react"
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

export function ScrollAwareWrapper({
  children,
  className,
  side = "right",
  config = {},
  onVisibilityChange,
}: ScrollAwareWrapperProps) {
  const { isVisible, positionStyles, isMobile } = useScrollAwarePositioning({
    defaultPosition: "center",
    scrollPosition: "bottom",
    offset: {
      top: 20,
      bottom: 80, // Account for fixed footer
      left: side === "left" ? 20 : undefined,
      right: side === "right" ? 20 : undefined,
    },
    hideOnMobile: false,
    ...config,
  })

  // Notify parent of visibility changes
  React.useEffect(() => {
    onVisibilityChange?.(isVisible)
  }, [isVisible, onVisibilityChange])

  const sideStyles =
    side === "left" ? { left: positionStyles.left || "20px" } : { right: positionStyles.right || "20px" }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            ...positionStyles,
            ...sideStyles,
            zIndex: 50,
          }}
          className={cn(
            "pointer-events-auto",
            isMobile && "scale-90", // Slightly smaller on mobile
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
