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

// Device-specific configurations
const DEVICE_CONFIGS = {
  mobile: {
    movementMultiplier: 0.15,
    maxMovement: 60,
    smoothingFactor: 0.8,
  },
  tablet: {
    movementMultiplier: 0.25,
    maxMovement: 80,
    smoothingFactor: 0.85,
  },
  desktop: {
    movementMultiplier: 0.35,
    maxMovement: 120,
    smoothingFactor: 0.9,
  },
}

export function useScrollTriggeredAnimation(config: ScrollAnimationConfig) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [isScrolling, setIsScrolling] = useState(false)

  const animationRef = useRef({
    lastScrollY: 0,
    smoothedPosition: 0,
    rafId: 0,
    scrollTimeout: null as NodeJS.Timeout | null,
  })

  // Memoize the styles object to prevent unnecessary re-renders
  const [transform, setTransform] = useState({ y: 0 })

  const animationStyles = useMemo(
    () => ({
      position: "fixed" as const,
      bottom: config.basePosition.bottom,
      right: config.basePosition.right,
      zIndex: 40,
      transform: `translate3d(0, ${-transform.y}px, 0)`,
      willChange: "transform",
    }),
    [config.basePosition.bottom, config.basePosition.right, transform.y],
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

  // Scroll handler - separated from useEffect to avoid dependency issues
  useEffect(() => {
    const deviceConfig = DEVICE_CONFIGS[deviceType]

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

        // Calculate movement based on device config
        const targetMovement = progress * deviceConfig.movementMultiplier * deviceConfig.maxMovement

        // Smooth the movement
        animationRef.current.smoothedPosition +=
          (targetMovement - animationRef.current.smoothedPosition) * deviceConfig.smoothingFactor

        // Update transform
        setTransform({ y: animationRef.current.smoothedPosition })

        // Handle scrolling state with debounce
        setIsScrolling(true)
        if (animationRef.current.scrollTimeout) {
          clearTimeout(animationRef.current.scrollTimeout)
        }

        animationRef.current.scrollTimeout = setTimeout(() => {
          setIsScrolling(false)
        }, 150)

        animationRef.current.lastScrollY = currentScrollY
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
  }, [deviceType]) // Only re-run when device type changes

  return {
    animationStyles,
    scrollProgress,
    deviceType,
    isScrolling,
  }
}
