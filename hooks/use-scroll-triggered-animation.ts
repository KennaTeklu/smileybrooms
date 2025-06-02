"use client"

import { useState, useEffect, useRef, useMemo } from "react"

interface ScrollAnimationConfig {
  basePosition: {
    top: number
    right: number
  }
}

// Convert pixels to centimeters (assuming 96 DPI standard)
const PIXELS_PER_CM = 37.8

export function useScrollTriggeredAnimation(config: ScrollAnimationConfig) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const animationRef = useRef({
    rafId: 0,
    scrollTimeout: null as NodeJS.Timeout | null,
  })

  // Direct 1:1 scroll position tracking (in centimeters)
  const [scrollPosition, setScrollPosition] = useState(0)

  const animationStyles = useMemo(
    () => ({
      position: "fixed" as const,
      top: config.basePosition.top + scrollPosition, // Direct 1:1 movement in centimeters
      right: config.basePosition.right,
      zIndex: 40,
      transform: "translate3d(0, 0, 0)", // No transform needed, using top positioning
      willChange: "top",
    }),
    [scrollPosition, config.basePosition.top, config.basePosition.right],
  )

  // Direct 1:1 scroll tracking in centimeters
  useEffect(() => {
    const handleScroll = () => {
      if (animationRef.current.rafId) {
        cancelAnimationFrame(animationRef.current.rafId)
      }

      animationRef.current.rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const maxScrollY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
        const progress = Math.min(currentScrollY / maxScrollY, 1)

        // Update scroll progress for UI
        setScrollProgress(progress)

        // Convert pixels to centimeters for 1:1 movement
        const scrollCm = currentScrollY / PIXELS_PER_CM
        setScrollPosition(scrollCm)

        // Handle scrolling state with debounce
        setIsScrolling(true)
        if (animationRef.current.scrollTimeout) {
          clearTimeout(animationRef.current.scrollTimeout)
        }

        animationRef.current.scrollTimeout = setTimeout(() => {
          setIsScrolling(false)
        }, 150)
      })
    }

    // Set up scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial call to set starting position
    handleScroll()

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationRef.current.rafId) {
        cancelAnimationFrame(animationRef.current.rafId)
      }
      if (animationRef.current.scrollTimeout) {
        clearTimeout(animationRef.current.scrollTimeout)
      }
    }
  }, [])

  return {
    animationStyles,
    scrollProgress,
    isScrolling,
  }
}
