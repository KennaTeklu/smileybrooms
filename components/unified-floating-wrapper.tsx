"use client"

import React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useFloatingElement } from "@/hooks/use-floating-element"
import type { FloatingElementConfig } from "@/lib/floating-system"
import { cn } from "@/lib/utils"

interface UnifiedFloatingWrapperProps {
  id: string
  children: React.ReactNode
  className?: string
  elementHeight?: number
  config?: Partial<FloatingElementConfig>
  onVisibilityChange?: (visible: boolean) => void
}

export function UnifiedFloatingWrapper({
  id,
  children,
  className,
  elementHeight = 60,
  config = {},
  onVisibilityChange,
}: UnifiedFloatingWrapperProps) {
  const { isVisible, styles, animationVariants, elementRef } = useFloatingElement({
    id,
    elementHeight,
    ...config,
  })

  // Notify parent of visibility changes
  React.useEffect(() => {
    onVisibilityChange?.(isVisible)
  }, [isVisible, onVisibilityChange])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          ref={elementRef}
          style={styles}
          variants={animationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "pointer-events-auto", // Ensure interactions work
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
