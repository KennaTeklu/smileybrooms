"use client"

import { useState, useEffect, useRef, useMemo } from "react"

interface ScrollAnimationConfig {
  basePosition: {
    bottom: number
    right: number
  }
  enableVerticalMovement?: boolean
  enableHorizontalMovement?: boolean
}

export function useScrollTriggeredAnimation(config: ScrollAnimationConfig) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [isScrolling, setIsScrolling] = useState(false)

  const animationRef = useRef({
    rafId: 0,
    scrollTimeout: null as NodeJS.Timeout | null,
  })

  // Direct 1:1 scroll position tracking
  const [scrollPosition, setScrollPosition] = useState(0)

  // Calculate starting position based on viewport
  const startingPosition = useMemo(() => {
    if (typeof window === "undefined") return 20

    // Start near the top of the viewport
    const viewportHeight = window.innerHeight
    const startFromTop = Math.min(100, viewportHeight * 0.1) // 10% from top or 100px max
    return viewportHeight - startFromTop - 200 // Account for button height
  }, [])

  const animationStyles = useMemo(
    () => ({
      position: "fixed" as const,
      bottom: startingPosition - scrollPosition, // Direct 1:1 movement
      right: config.basePosition.right,
      zIndex: 40,
      transform: "translate3d(0, 0, 0)", // No transform needed, using bottom positioning
      willChange: "bottom",
    }),
    [startingPosition, scrollPosition, config.basePosition.right],
  )

  // Device detection - only runs on mount and window resize
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType("mobile")
      } else if (width < 1024) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }
    }

    detectDevice()
    window.addEventListener("resize", detectDevice)
    return () => window.removeEventListener("resize", detectDevice)
  }, [])

  // Direct 1:1 scroll tracking
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

        // Direct 1:1 movement - every pixel scrolled = button moves 1 pixel down
        setScrollPosition(currentScrollY)

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
    deviceType,
    isScrolling,
  }
}
