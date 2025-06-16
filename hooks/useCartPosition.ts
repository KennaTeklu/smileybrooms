"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface CartPositionOptions {
  padding?: number // For fixed-viewport: padding from right/bottom. For sticky-page: bottom padding from document end.
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
    mode = "fixed-viewport",
    initialViewportTopOffset = 20, // Default for sticky-page
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

    const rect = cartRef.current.getBoundingClientRect()
    const elementHeight = rect.height // Get actual height of the element

    const newStyles: typeof styles = {
      position: mode === "fixed-viewport" ? "fixed" : "absolute",
      transition: "all 0.3s ease-out",
    }

    if (mode === "fixed-viewport") {
      // Fixed to viewport bottom-right
      newStyles.right = `${rightOffset}px`
      newStyles.bottom = `${padding}px` // 'padding' acts as bottom padding
    } else {
      // Sticky to page bottom
      const documentHeight = document.documentElement.scrollHeight
      const scrollY = window.scrollY

      // Calculate desired top position if it were to follow scroll
      const desiredTopFromScroll = scrollY + initialViewportTopOffset

      // Calculate the maximum top position to stick to the bottom of the document
      // documentHeight - elementHeight - padding (where padding is bottomPadding)
      const maxTopAtDocumentBottom = documentHeight - elementHeight - padding

      // The final top position is the minimum of (following scroll) and (sticking to document bottom)
      newStyles.top = `${Math.min(desiredTopFromScroll, maxTopAtDocumentBottom)}px`

      if (rightOffset !== undefined) {
        newStyles.right = `${rightOffset}px`
      } else if (leftOffset !== undefined) {
        newStyles.left = `${leftOffset}px`
      }
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
