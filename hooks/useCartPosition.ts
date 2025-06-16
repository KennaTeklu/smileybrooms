"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface CartPositionOptions {
  padding?: number // For fixed-viewport: padding from bottom. For sticky-page: bottom padding from document end.
  enableBoundaryDetection?: boolean
  mode?: "fixed-viewport" | "sticky-page"
  initialViewportTopOffset?: number // Only for sticky-page mode, how far from viewport top it starts
  rightOffset?: number // For both modes, if applicable
  leftOffset?: number // For both modes, if applicable
}

export function useCartPosition(options: CartPositionOptions = {}) {
  const {
    padding = 16,
    enableBoundaryDetection = true,
    mode = "fixed-viewport", // Default back to fixed-viewport
    initialViewportTopOffset = 20, // Only relevant for sticky-page
    rightOffset = 16, // Default for right-aligned elements
    leftOffset, // Default for left-aligned elements
  } = options
  const cartRef = useRef<HTMLDivElement>(null)
  const [styles, setStyles] = useState<{
    position: "fixed" | "absolute"
    top?: number | string
    bottom?: number | string
    right?: number | string
    left?: number | string
    transition?: string
  }>({
    position: mode === "fixed-viewport" ? "fixed" : "absolute",
    transition: "all 0.3s ease-out", // Smooth transitions for position changes
  })

  const calculatePosition = useCallback(() => {
    if (!cartRef.current || !enableBoundaryDetection) return

    const elementHeight = cartRef.current.offsetHeight // Get actual height of the element

    const newStyles: typeof styles = {
      transition: "all 0.3s ease-out",
    }

    if (mode === "fixed-viewport") {
      // Fixed to viewport bottom-right
      newStyles.position = "fixed"
      newStyles.right = `${rightOffset}px`
      newStyles.bottom = `${padding}px` // 'padding' acts as bottom padding from viewport
      newStyles.top = "auto" // Ensure top is not set
      newStyles.left = "auto" // Ensure left is not set
    } else {
      // Sticky to page bottom (logic from previous iteration, for 'add all to cart' like behavior)
      newStyles.position = "absolute"
      const documentHeight = document.documentElement.scrollHeight
      const scrollY = window.scrollY

      const desiredTopFromScroll = scrollY + initialViewportTopOffset
      const maxTopAtDocumentBottom = documentHeight - elementHeight - padding

      newStyles.top = `${Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)}px`

      if (rightOffset !== undefined) {
        newStyles.right = `${rightOffset}px`
      } else if (leftOffset !== undefined) {
        newStyles.left = `${leftOffset}px`
      }
      newStyles.bottom = "auto" // Ensure bottom is not set
    }

    setStyles(newStyles)
  }, [padding, enableBoundaryDetection, mode, initialViewportTopOffset, rightOffset, leftOffset])

  useEffect(() => {
    const handleScrollAndResize = () => {
      calculatePosition()
    }

    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })
    window.addEventListener("orientationchange", handleScrollAndResize, { passive: true })

    // Initial check, with a slight delay to ensure element height is available
    const timeoutId = setTimeout(calculatePosition, 0)

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize)
      window.removeEventListener("resize", handleScrollAndResize)
      window.removeEventListener("orientationchange", handleScrollAndResize)
      clearTimeout(timeoutId)
    }
  }, [calculatePosition])

  return {
    cartRef,
    styles,
    calculatePosition,
  }
}
