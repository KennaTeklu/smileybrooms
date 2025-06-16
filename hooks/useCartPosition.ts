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
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate desired right and bottom positions based on padding
    // This ensures it's always 'padding' pixels from the edge
    const desiredRight = padding
    const desiredBottom = padding

    // Apply these directly to the style
    cartRef.current.style.right = `${desiredRight}px`
    cartRef.current.style.bottom = `${desiredBottom}px`

    // Check if it's off-screen after adjustment (shouldn't be if logic is correct)
    const isOffScreen = rect.right > viewportWidth || rect.bottom > viewportHeight

    setBoundary({
      right: desiredRight,
      bottom: desiredBottom,
      isOffScreen: isOffScreen,
    })

    console.log(
      `Cart position adjusted: right=${desiredRight}px, bottom=${desiredBottom}px, isOffScreen=${isOffScreen}`,
    )
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
