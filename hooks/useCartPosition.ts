"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface ViewportBoundary {
  right: number
  bottom: number
  isOffScreen: boolean
}

interface CartPositionOptions {
  padding?: number
  enableBoundaryDetection?: boolean
}

export function useCartPosition(options: CartPositionOptions = {}) {
  const { padding = 16, enableBoundaryDetection = true } = options
  const cartRef = useRef<HTMLDivElement>(null)
  const [boundary, setBoundary] = useState<ViewportBoundary>({
    right: padding,
    bottom: padding,
    isOffScreen: false,
  })

  const checkBoundaries = useCallback(() => {
    if (!cartRef.current || !enableBoundaryDetection) return

    const rect = cartRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const adjustments = {
      right: Math.max(padding, viewport.width - rect.right),
      bottom: Math.max(padding, viewport.height - rect.bottom),
      isOffScreen: rect.right > viewport.width || rect.bottom > viewport.height,
    }

    setBoundary(adjustments)

    // Apply adjustments if needed
    if (adjustments.isOffScreen) {
      const style = cartRef.current.style
      if (rect.right > viewport.width) {
        style.right = `${adjustments.right}px`
      }
      if (rect.bottom > viewport.height) {
        style.bottom = `${adjustments.bottom}px`
      }
    }
  }, [padding, enableBoundaryDetection])

  const resetPosition = useCallback(() => {
    if (!cartRef.current) return

    const style = cartRef.current.style
    style.right = ""
    style.bottom = ""
  }, [])

  useEffect(() => {
    const handleResize = () => {
      checkBoundaries()
    }

    const handleOrientationChange = () => {
      // Delay to allow for viewport changes
      setTimeout(checkBoundaries, 100)
    }

    window.addEventListener("resize", handleResize, { passive: true })
    window.addEventListener("orientationchange", handleOrientationChange, { passive: true })

    // Initial check
    checkBoundaries()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleOrientationChange)
    }
  }, [checkBoundaries])

  return {
    cartRef,
    boundary,
    checkBoundaries,
    resetPosition,
  }
}
