"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface DeviceConfig {
  movementMultiplier: number
  maxMovement: number
  smoothingFactor: number
}

interface ScrollAnimationConfig {
  basePosition: {
    bottom?: number
    right?: number
    top?: number
    left?: number
  }
  enableVerticalMovement?: boolean
  enableHorizontalMovement?: boolean
}

export function useScrollTriggeredAnimation(config: ScrollAnimationConfig) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [transform, setTransform] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number>()
  const lastScrollY = useRef(0)

  // Device-specific configurations
  const deviceConfigs: Record<string, DeviceConfig> = {
    mobile: {
      movementMultiplier: 0.15, // Less movement on mobile for better UX
      maxMovement: 60,
      smoothingFactor: 0.8,
    },
    tablet: {
      movementMultiplier: 0.25,
      maxMovement: 80,
      smoothingFactor: 0.85,
    },
    desktop: {
      movementMultiplier: 0.35, // More dramatic movement on desktop
      maxMovement: 120,
      smoothingFactor: 0.9,
    },
  }

  // Detect device type
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

  // Smooth scroll handler with device-aware calculations
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const maxScroll = documentHeight - windowHeight

      if (maxScroll <= 0) return

      // Calculate scroll progress (0 to 1)
      const progress = Math.min(currentScrollY / maxScroll, 1)
      setScrollProgress(progress)

      // Get device-specific config
      const deviceConfig = deviceConfigs[deviceType]

      // Calculate movement based on scroll progress and device type
      const baseMovement = progress * deviceConfig.maxMovement * deviceConfig.movementMultiplier

      // Apply smoothing to prevent jittery movement
      const smoothedMovement = lastScrollY.current + (baseMovement - lastScrollY.current) * deviceConfig.smoothingFactor
      lastScrollY.current = smoothedMovement

      // Calculate transforms
      const newTransform = {
        x: config.enableHorizontalMovement ? smoothedMovement * 0.3 : 0, // Subtle horizontal movement
        y: config.enableVerticalMovement ? smoothedMovement : 0,
      }

      setTransform(newTransform)
    })
  }, [deviceType, config.enableVerticalMovement, config.enableHorizontalMovement])

  useEffect(() => {
    // Initial scroll position
    handleScroll()

    // Add scroll listener with passive flag for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  // Generate CSS styles
  const animationStyles = {
    position: "fixed" as const,
    ...config.basePosition,
    transform: `translate3d(${transform.x}px, ${-transform.y}px, 0)`,
    transition: "transform 0.1s ease-out",
    willChange: "transform",
    zIndex: 40,
  }

  return {
    scrollProgress,
    deviceType,
    transform,
    animationStyles,
    isScrolling: Math.abs(transform.y) > 1,
  }
}
