"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"

interface ScrollAwareConfig {
  // Position thresholds
  topThreshold?: number
  bottomThreshold?: number

  // Positioning behavior
  defaultPosition?: "top" | "center" | "bottom"
  scrollPosition?: "top" | "center" | "bottom"

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
  // Memoize the full config to prevent re-renders
  const fullConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])

  const [scrollY, setScrollY] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollDirection = useRef<"up" | "down">("down")
  const rafId = useRef<number>()

  // Throttled scroll handler to prevent excessive re-renders
  const handleScroll = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }

    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY

      // Only update if scroll position actually changed
      if (currentScrollY !== lastScrollY.current) {
        setScrollY(currentScrollY)

        // Determine scroll direction
        if (currentScrollY > lastScrollY.current) {
          scrollDirection.current = "down"
        } else {
          scrollDirection.current = "up"
        }
        lastScrollY.current = currentScrollY
      }
    })
  }, [])

  const handleResize = useCallback(() => {
    setWindowHeight(window.innerHeight)
    setIsMobile(window.innerWidth < fullConfig.mobileBreakpoint)
  }, [fullConfig.mobileBreakpoint])

  // Track scroll position and window dimensions
  useEffect(() => {
    // Initial setup
    handleScroll()
    handleResize()

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [handleScroll, handleResize])

  // Memoized position calculation
  const positionStyles = useMemo((): React.CSSProperties => {
    const { topThreshold, defaultPosition, scrollPosition, offset, hideOnMobile } = fullConfig

    // Hide on mobile if configured
    if (isMobile && hideOnMobile) {
      return { display: "none" }
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
    isMobile,
    fullConfig.topThreshold,
    fullConfig.defaultPosition,
    fullConfig.scrollPosition,
    fullConfig.offset,
    fullConfig.hideOnMobile,
  ])

  // Visibility helpers - memoized to prevent re-renders
  const show = useCallback(() => setIsVisible(true), [])
  const hide = useCallback(() => setIsVisible(false), [])
  const toggle = useCallback(() => setIsVisible((prev) => !prev), [])

  // Utility functions - memoized
  const isScrolledPast = useCallback((threshold: number) => scrollY > threshold, [scrollY])
  const isNearBottom = useCallback(
    () => scrollY > windowHeight - fullConfig.bottomThreshold,
    [scrollY, windowHeight, fullConfig.bottomThreshold],
  )
  const isNearTop = useCallback(() => scrollY < fullConfig.topThreshold, [scrollY, fullConfig.topThreshold])

  return {
    // Position data
    scrollY,
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
    isScrolledPast,
    isNearBottom,
    isNearTop,
  }
}
