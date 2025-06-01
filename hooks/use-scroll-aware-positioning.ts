"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSpring } from "framer-motion"

interface ScrollAwareConfig {
  // Position thresholds
  topThreshold?: number
  bottomThreshold?: number

  // Positioning behavior
  defaultPosition?: "top" | "center" | "bottom"
  scrollPosition?: "top" | "center" | "bottom"

  // Animation settings
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }

  // Offset adjustments
  offset?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }

  // Responsive behavior
  hideOnMobile?: boolean
  mobileBreakpoint?: number
}

const DEFAULT_CONFIG: Required<ScrollAwareConfig> = {
  topThreshold: 100,
  bottomThreshold: 200,
  defaultPosition: "center",
  scrollPosition: "bottom",
  springConfig: {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  },
  offset: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
  hideOnMobile: false,
  mobileBreakpoint: 768,
}

export function useScrollAwarePositioning(config: ScrollAwareConfig = {}) {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }
  const [scrollY, setScrollY] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollDirection = useRef<"up" | "down">("down")

  // Smooth scroll position with spring physics
  const smoothScrollY = useSpring(0, fullConfig.springConfig)

  // Track scroll position and window dimensions
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = "down"
      } else {
        scrollDirection.current = "up"
      }
      lastScrollY.current = currentScrollY

      // Update spring value
      smoothScrollY.set(currentScrollY)
    }

    const handleResize = () => {
      setWindowHeight(window.innerHeight)
      setIsMobile(window.innerWidth < fullConfig.mobileBreakpoint)
    }

    // Initial setup
    handleScroll()
    handleResize()

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [smoothScrollY, fullConfig])

  // Calculate dynamic position based on scroll
  const calculatePosition = useCallback(() => {
    const { topThreshold, bottomThreshold, defaultPosition, scrollPosition, offset } = fullConfig

    // Hide on mobile if configured
    if (isMobile && fullConfig.hideOnMobile) {
      setIsVisible(false)
      return { display: "none" }
    } else {
      setIsVisible(true)
    }

    let position: "top" | "center" | "bottom" = defaultPosition

    // Determine position based on scroll
    if (scrollY > topThreshold) {
      position = scrollPosition
    }

    // Calculate actual CSS values
    const styles: React.CSSProperties = {
      position: "fixed",
      transition: "all 0.3s ease-in-out",
      transform: "translateZ(0)", // Hardware acceleration
      willChange: "transform, top, bottom",
    }

    switch (position) {
      case "top":
        styles.top = `${offset.top}px`
        styles.bottom = "auto"
        break
      case "center":
        styles.top = "50%"
        styles.transform = "translateY(-50%) translateZ(0)"
        styles.bottom = "auto"
        break
      case "bottom":
        styles.bottom = `${offset.bottom}px`
        styles.top = "auto"
        break
    }

    return styles
  }, [
    scrollY,
    windowHeight,
    isMobile,
    fullConfig.topThreshold,
    fullConfig.bottomThreshold,
    fullConfig.defaultPosition,
    fullConfig.scrollPosition,
    fullConfig.offset,
    fullConfig.hideOnMobile,
    fullConfig.mobileBreakpoint,
  ])

  // Get current position styles
  const positionStyles = calculatePosition()

  // Visibility helpers
  const show = useCallback(() => setIsVisible(true), [])
  const hide = useCallback(() => setIsVisible(false), [])
  const toggle = useCallback(() => setIsVisible((prev) => !prev), [])

  return {
    // Position data
    scrollY,
    smoothScrollY,
    windowHeight,
    isMobile,
    scrollDirection: scrollDirection.current,

    // Visibility state
    isVisible,
    show,
    hide,
    toggle,

    // Calculated styles
    positionStyles,

    // Utility functions
    isScrolledPast: (threshold: number) => scrollY > threshold,
    isNearBottom: () => scrollY > windowHeight - fullConfig.bottomThreshold,
    isNearTop: () => scrollY < fullConfig.topThreshold,
  }
}
