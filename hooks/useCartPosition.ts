"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface CartPositionOptions {
  padding?: number // For fixed-viewport: padding from specified edge
  enableBoundaryDetection?: boolean
  mode?: "fixed-viewport" | "sticky-page"
  initialViewportTopOffset?: number // Only for sticky-page mode
  rightOffset?: number
  leftOffset?: number
  topOffset?: number // New: for positioning from top
  bottomOffset?: number // For positioning from bottom
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left" // New: positioning preference
}

export function useCartPosition(options: CartPositionOptions = {}) {
  const {
    padding = 16,
    enableBoundaryDetection = true,
    mode = "fixed-viewport",
    initialViewportTopOffset = 20,
    rightOffset = 16,
    leftOffset,
    topOffset = 100, // Default top offset
    bottomOffset,
    position = "top-right", // Default to top-right positioning
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
    transition: "all 0.3s ease-out",
  })

  const calculatePosition = useCallback(() => {
    if (!cartRef.current || !enableBoundaryDetection) return

    const elementHeight = cartRef.current.offsetHeight
    const newStyles: typeof styles = {
      transition: "all 0.3s ease-out",
    }

    if (mode === "fixed-viewport") {
      newStyles.position = "fixed"

      // Handle horizontal positioning
      if (position.includes("right")) {
        newStyles.right = `${rightOffset}px`
        newStyles.left = "auto"
      } else if (position.includes("left")) {
        newStyles.left = `${leftOffset || 16}px`
        newStyles.right = "auto"
      }

      // Handle vertical positioning
      if (position.includes("top")) {
        newStyles.top = `${topOffset}px`
        newStyles.bottom = "auto"
      } else if (position.includes("bottom")) {
        newStyles.bottom = `${bottomOffset || padding}px`
        newStyles.top = "auto"
      }
    } else {
      // Sticky to page bottom (existing logic)
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
      newStyles.bottom = "auto"
    }

    setStyles(newStyles)
  }, [
    padding,
    enableBoundaryDetection,
    mode,
    initialViewportTopOffset,
    rightOffset,
    leftOffset,
    topOffset,
    bottomOffset,
    position,
  ])

  useEffect(() => {
    const handleScrollAndResize = () => {
      calculatePosition()
    }

    window.addEventListener("scroll", handleScrollAndResize, { passive: true })
    window.addEventListener("resize", handleScrollAndResize, { passive: true })
    window.addEventListener("orientationchange", handleScrollAndResize, { passive: true })

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
