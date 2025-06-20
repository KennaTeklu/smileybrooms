"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"

interface ScrollAwareConfig {
  // Position thresholds
  topThreshold?: number
  bottomThreshold?: number

  // Positioning behavior
  defaultPosition?: "top" | "center" | "bottom" | "continuous"
  scrollPosition?: "top" | "center" | "bottom" | "continuous"

  // Offset adjustments
  offset?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }

  // Continuous movement settings
  continuousMovement?: {
    enabled?: boolean
    startPosition?: number // percentage from top (0-100)
    endPosition?: number // percentage from top (0-100)
    minDistanceFromBottom?: number // minimum pixels from bottom
  }

  // Responsive behavior
  hideOnMobile?: boolean
  mobileBreakpoint?: number

  // Debug mode
  debug?: boolean
}

const DEFAULT_CONFIG: Required<ScrollAwareConfig> = {
  topThreshold: 100,
  bottomThreshold: 200,
  defaultPosition: "continuous",
  scrollPosition: "continuous",
  offset: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
  continuousMovement: {
    enabled: true,
    startPosition: 50, // Start at 50% from top
    endPosition: 85, // End at 85% from top (never reach bottom)
    minDistanceFromBottom: 100, // Always stay 100px from bottom
  },
  hideOnMobile: false,
  mobileBreakpoint: 768,
  debug: false,
}

export function useScrollAwarePositioning(config: ScrollAwareConfig = {}) {
  // Memoize the full config to prevent re-renders
  const fullConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])

  const [scrollY, setScrollY] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const [documentHeight, setDocumentHeight] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollDirection = useRef<"up" | "down">("down")
  const rafId = useRef<number>()
  const debugRef = useRef<HTMLDivElement | null>(null)

  // Create debug element if needed
  useEffect(() => {
    if (fullConfig.debug && typeof window !== "undefined") {
      if (!debugRef.current) {
        const debugEl = document.createElement("div")
        debugEl.style.position = "fixed"
        debugEl.style.bottom = "10px"
        debugEl.style.left = "10px"
        debugEl.style.backgroundColor = "rgba(0,0,0,0.7)"
        debugEl.style.color = "white"
        debugEl.style.padding = "5px"
        debugEl.style.fontSize = "12px"
        debugEl.style.zIndex = "9999"
        debugEl.style.fontFamily = "monospace"
        debugEl.style.borderRadius = "3px"
        debugEl.id = "scroll-debug-info"
        document.body.appendChild(debugEl)
        debugRef.current = debugEl
      }
    }

    return () => {
      if (debugRef.current) {
        document.body.removeChild(debugRef.current)
        debugRef.current = null
      }
    }
  }, [fullConfig.debug])

  // Update debug info
  const updateDebugInfo = useCallback(() => {
    if (fullConfig.debug && debugRef.current) {
      debugRef.current.innerHTML = `
        scrollY: ${scrollY}<br>
        windowHeight: ${windowHeight}<br>
        documentHeight: ${documentHeight}<br>
        direction: ${scrollDirection.current}<br>
        progress: ${(scrollY / (documentHeight - windowHeight)).toFixed(2)}<br>
        isMobile: ${isMobile}
      `
    }
  }, [scrollY, windowHeight, documentHeight, isMobile, fullConfig.debug])

  // Throttled scroll handler to prevent excessive re-renders
  const handleScroll = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current)
    }

    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      const currentDocumentHeight = document.documentElement.scrollHeight
      const currentWindowHeight = window.innerHeight

      // Only update if values actually changed
      if (
        currentScrollY !== lastScrollY.current ||
        currentDocumentHeight !== documentHeight ||
        currentWindowHeight !== windowHeight
      ) {
        setScrollY(currentScrollY)
        setDocumentHeight(currentDocumentHeight)
        setWindowHeight(currentWindowHeight)

        // Determine scroll direction
        if (currentScrollY > lastScrollY.current) {
          scrollDirection.current = "down"
        } else {
          scrollDirection.current = "up"
        }
        lastScrollY.current = currentScrollY

        // Update debug info
        updateDebugInfo()
      }
    })
  }, [documentHeight, windowHeight, updateDebugInfo])

  const handleResize = useCallback(() => {
    setWindowHeight(window.innerHeight)
    setDocumentHeight(document.documentElement.scrollHeight)
    setIsMobile(window.innerWidth < fullConfig.mobileBreakpoint)
    updateDebugInfo()
  }, [fullConfig.mobileBreakpoint, updateDebugInfo])

  // Track scroll position and window dimensions
  useEffect(() => {
    // Ensure we're in the browser
    if (typeof window === "undefined") return

    // Force immediate measurement
    const currentScrollY = window.scrollY
    const currentDocumentHeight = document.documentElement.scrollHeight
    const currentWindowHeight = window.innerHeight

    setScrollY(currentScrollY)
    setDocumentHeight(currentDocumentHeight)
    setWindowHeight(currentWindowHeight)
    setIsMobile(window.innerWidth < fullConfig.mobileBreakpoint)
    lastScrollY.current = currentScrollY

    // Initial debug update
    updateDebugInfo()

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [handleScroll, handleResize, fullConfig.mobileBreakpoint, updateDebugInfo])

  // Calculate continuous position based on scroll
  const calculateContinuousPosition = useCallback(() => {
    const { continuousMovement, offset } = fullConfig

    if (!continuousMovement.enabled || !windowHeight) {
      return { top: "50%", transform: "translateY(-50%)" }
    }

    // Prevent division by zero
    const maxScroll = Math.max(documentHeight - windowHeight, 1)
    const scrollProgress = Math.min(scrollY / maxScroll, 1)

    // Calculate position range
    const startPixels = (continuousMovement.startPosition / 100) * windowHeight
    const endPixels = Math.min(
      (continuousMovement.endPosition / 100) * windowHeight,
      windowHeight - continuousMovement.minDistanceFromBottom,
    )

    // Interpolate position based on scroll progress
    const currentPosition = startPixels + (endPixels - startPixels) * scrollProgress

    // Ensure we never go too close to bottom
    const maxPosition = windowHeight - continuousMovement.minDistanceFromBottom
    const finalPosition = Math.min(currentPosition, maxPosition)

    return {
      top: `${finalPosition}px`,
      transform: "translateZ(0)", // Hardware acceleration
    }
  }, [scrollY, windowHeight, documentHeight, fullConfig])

  // Memoized position calculation
  const positionStyles = useMemo((): React.CSSProperties => {
    const { topThreshold, defaultPosition, scrollPosition, offset, hideOnMobile, continuousMovement } = fullConfig

    // Hide on mobile if configured
    if (isMobile && hideOnMobile) {
      return { display: "none" }
    }

    // Use continuous positioning if enabled
    if (continuousMovement.enabled && (defaultPosition === "continuous" || scrollPosition === "continuous")) {
      const continuousPos = calculateContinuousPosition()
      return {
        position: "fixed",
        transition: "top 0.1s ease-out", // Faster transition for continuous movement
        willChange: "transform, top",
        ...continuousPos,
      }
    }

    // Fallback to discrete positioning
    let position: "top" | "center" | "bottom" = defaultPosition as "top" | "center" | "bottom"

    // Determine position based on scroll
    if (scrollY > topThreshold) {
      position = scrollPosition as "top" | "center" | "bottom"
    }

    // Calculate actual CSS values for discrete positioning
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
        // Ensure bottom position respects minimum distance
        const minBottom = Math.max(offset.bottom, fullConfig.continuousMovement.minDistanceFromBottom)
        styles.bottom = `${minBottom}px`
        styles.top = "auto"
        break
    }

    return styles
  }, [scrollY, windowHeight, documentHeight, isMobile, fullConfig, calculateContinuousPosition])

  // Visibility helpers - memoized to prevent re-renders
  const show = useCallback(() => setIsVisible(true), [])
  const hide = useCallback(() => setIsVisible(false), [])
  const toggle = useCallback(() => setIsVisible((prev) => !prev), [])

  // Utility functions - memoized
  const isScrolledPast = useCallback((threshold: number) => scrollY > threshold, [scrollY])
  const isNearBottom = useCallback(
    () => scrollY > documentHeight - windowHeight - fullConfig.bottomThreshold,
    [scrollY, documentHeight, windowHeight, fullConfig.bottomThreshold],
  )
  const isNearTop = useCallback(() => scrollY < fullConfig.topThreshold, [scrollY, fullConfig.topThreshold])

  // Calculate scroll progress (0-1)
  const scrollProgress = useMemo(() => {
    if (documentHeight <= windowHeight) return 0
    const maxScroll = documentHeight - windowHeight
    return maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0
  }, [scrollY, documentHeight, windowHeight])

  return {
    // Position data
    scrollY,
    windowHeight,
    documentHeight,
    isMobile,
    scrollDirection: scrollDirection.current,
    scrollProgress,

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
