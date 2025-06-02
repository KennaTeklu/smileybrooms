"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"

interface ScrollAnimationConfig {
  basePosition: {
    bottom: number
    right: number
  }
  enableVerticalMovement?: boolean
  enableHorizontalMovement?: boolean
}

interface DeviceConfig {
  type: "mobile" | "tablet" | "desktop"
  movementMultiplier: number
  maxMovement: number
  smoothingFactor: number
}

export function useScrollTriggeredAnimation(config: ScrollAnimationConfig) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [isScrolling, setIsScrolling] = useState(false)
  const [animationStyles, setAnimationStyles] = useState<React.CSSProperties>({})

  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const rafRef = useRef<number>()
  const lastScrollY = useRef(0)
  const smoothedPosition = useRef(0)

  // Device detection
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

  // Device-specific configurations
  const getDeviceConfig = useCallback((): DeviceConfig => {
    switch (deviceType) {
      case "mobile":
        return {
          type: "mobile",
          movementMultiplier: 0.15,
          maxMovement: 60,
          smoothingFactor: 0.8,
        }
      case "tablet":
        return {
          type: "tablet",
          movementMultiplier: 0.25,
          maxMovement: 80,
          smoothingFactor: 0.85,
        }
      case "desktop":
        return {
          type: "desktop",
          movementMultiplier: 0.35,
          maxMovement: 120,
          smoothingFactor: 0.9,
        }
    }
  }, [deviceType])

  // Smooth scroll handler
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      const maxScrollY = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)

      const progress = Math.min(currentScrollY / maxScrollY, 1)
      setScrollProgress(progress)

      // Calculate movement based on device config
      const deviceConfig = getDeviceConfig()
      const targetMovement = progress * deviceConfig.movementMultiplier * deviceConfig.maxMovement

      // Smooth the movement
      smoothedPosition.current += (targetMovement - smoothedPosition.current) * deviceConfig.smoothingFactor

      // Update styles
      const newStyles: React.CSSProperties = {
        position: "fixed",
        bottom: config.basePosition.bottom,
        right: config.basePosition.right,
        zIndex: 40,
        transform: `translate3d(0, ${config.enableVerticalMovement ? -smoothedPosition.current : 0}px, 0)`,
        willChange: "transform",
        transition: "box-shadow 0.1s ease-out",
      }

      setAnimationStyles(newStyles)

      // Handle scrolling state
      setIsScrolling(true)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)

      lastScrollY.current = currentScrollY
    })
  }, [config, getDeviceConfig])

  // Set up scroll listener
  useEffect(() => {
    // Initial styles
    setAnimationStyles({
      position: "fixed",
      bottom: config.basePosition.bottom,
      right: config.basePosition.right,
      zIndex: 40,
      transform: "translate3d(0, 0, 0)",
      willChange: "transform",
    })

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [handleScroll, config])

  return {
    animationStyles,
    scrollProgress,
    deviceType,
    isScrolling,
  }
}
