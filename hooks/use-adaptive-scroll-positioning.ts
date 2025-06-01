"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"

interface ScrollSensors {
  scrollY: number
  scrollVelocity: number
  mouseY: number
  mouseX: number
  isMouseActive: boolean
  deviceType: "mobile" | "tablet" | "desktop"
  scrollType: "touch" | "mouse" | "momentum"
  viewportRatio: number
  documentRatio: number
}

interface AdaptiveScrollConfig {
  startPosition: number
  endPosition: number
  minDistanceFromBottom: number
  mouseSensitivity: number
  velocityDamping: number
  adaptiveSpeed: boolean
}

const DEFAULT_CONFIG: AdaptiveScrollConfig = {
  startPosition: 80,
  endPosition: 200,
  minDistanceFromBottom: 180,
  mouseSensitivity: 0.3,
  velocityDamping: 0.8,
  adaptiveSpeed: true,
}

export function useAdaptiveScrollPositioning(config: Partial<AdaptiveScrollConfig> = {}) {
  const fullConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])

  // Core state
  const [sensors, setSensors] = useState<ScrollSensors>({
    scrollY: 0,
    scrollVelocity: 0,
    mouseY: 0,
    mouseX: 0,
    isMouseActive: false,
    deviceType: "desktop",
    scrollType: "mouse",
    viewportRatio: 1,
    documentRatio: 1,
  })

  const [windowHeight, setWindowHeight] = useState(0)
  const [documentHeight, setDocumentHeight] = useState(0)
  const [adaptivePosition, setAdaptivePosition] = useState(fullConfig.startPosition)

  // Refs for tracking
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(Date.now())
  const mouseTimeout = useRef<NodeJS.Timeout>()
  const rafId = useRef<number>()
  const velocityHistory = useRef<number[]>([])
  const positionHistory = useRef<number[]>([])

  // Device detection
  const detectDevice = useCallback(() => {
    const width = window.innerWidth
    const userAgent = navigator.userAgent.toLowerCase()
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0

    if (width < 768) return "mobile"
    if (width < 1024) return "tablet"
    return "desktop"
  }, [])

  // Scroll type detection
  const detectScrollType = useCallback((velocity: number) => {
    const isTouchDevice = "ontouchstart" in window
    const isHighVelocity = Math.abs(velocity) > 50

    if (isTouchDevice && isHighVelocity) return "momentum"
    if (isTouchDevice) return "touch"
    return "mouse"
  }, [])

  // Mouse position tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setSensors((prev) => ({
      ...prev,
      mouseY: e.clientY,
      mouseX: e.clientX,
      isMouseActive: true,
    }))

    // Reset mouse timeout
    if (mouseTimeout.current) clearTimeout(mouseTimeout.current)
    mouseTimeout.current = setTimeout(() => {
      setSensors((prev) => ({ ...prev, isMouseActive: false }))
    }, 2000)
  }, [])

  // Advanced scroll handler with multiple sensors
  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current)

    rafId.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      const currentTime = Date.now()
      const currentWindowHeight = window.innerHeight
      const currentDocumentHeight = document.documentElement.scrollHeight

      // Calculate velocity
      const deltaY = currentScrollY - lastScrollY.current
      const deltaTime = Math.max(currentTime - lastScrollTime.current, 1)
      const velocity = (deltaY / deltaTime) * 1000 // pixels per second

      // Update velocity history (keep last 5 values)
      velocityHistory.current.push(velocity)
      if (velocityHistory.current.length > 5) {
        velocityHistory.current.shift()
      }

      // Calculate average velocity for smoothing
      const avgVelocity = velocityHistory.current.reduce((sum, v) => sum + v, 0) / velocityHistory.current.length

      // Calculate ratios
      const viewportRatio = currentWindowHeight / currentDocumentHeight
      const documentRatio = currentDocumentHeight / currentWindowHeight

      // Detect device and scroll type
      const deviceType = detectDevice()
      const scrollType = detectScrollType(avgVelocity)

      // Update sensors
      setSensors((prev) => ({
        ...prev,
        scrollY: currentScrollY,
        scrollVelocity: avgVelocity,
        deviceType,
        scrollType,
        viewportRatio,
        documentRatio,
      }))

      // Update dimensions
      setWindowHeight(currentWindowHeight)
      setDocumentHeight(currentDocumentHeight)

      // Update refs
      lastScrollY.current = currentScrollY
      lastScrollTime.current = currentTime
    })
  }, [detectDevice, detectScrollType])

  // Adaptive position calculation
  const calculateAdaptivePosition = useCallback(() => {
    const { scrollY, scrollVelocity, mouseY, isMouseActive, deviceType, scrollType, viewportRatio, documentRatio } =
      sensors

    if (!windowHeight || !documentHeight) return fullConfig.startPosition

    // Base scroll progress
    const maxScroll = Math.max(documentHeight - windowHeight, 1)
    const baseScrollProgress = Math.min(scrollY / maxScroll, 1)

    // Device-specific adjustments
    let deviceMultiplier = 1
    switch (deviceType) {
      case "mobile":
        deviceMultiplier = 0.6 // Slower movement on mobile
        break
      case "tablet":
        deviceMultiplier = 0.8 // Medium movement on tablet
        break
      case "desktop":
        deviceMultiplier = 1.0 // Normal movement on desktop
        break
    }

    // Scroll type adjustments
    let scrollMultiplier = 1
    switch (scrollType) {
      case "momentum":
        scrollMultiplier = 0.4 // Much slower for momentum scrolling
        break
      case "touch":
        scrollMultiplier = 0.7 // Slower for touch scrolling
        break
      case "mouse":
        scrollMultiplier = 1.0 // Normal for mouse scrolling
        break
    }

    // Mouse proximity adjustment
    let mouseAdjustment = 0
    if (isMouseActive && fullConfig.mouseSensitivity > 0) {
      const mouseProgress = mouseY / windowHeight
      const scrollProgress = scrollY / maxScroll

      // If mouse is significantly different from scroll position, adjust
      const mouseDifference = Math.abs(mouseProgress - scrollProgress)
      if (mouseDifference > 0.2) {
        // Mouse is far from expected position, slow down movement
        mouseAdjustment = -mouseDifference * fullConfig.mouseSensitivity
      }
    }

    // Velocity damping
    let velocityAdjustment = 0
    if (fullConfig.adaptiveSpeed && Math.abs(scrollVelocity) > 10) {
      // High velocity detected, slow down movement
      const velocityFactor = Math.min(Math.abs(scrollVelocity) / 100, 1)
      velocityAdjustment = -velocityFactor * 0.3
    }

    // Document ratio adjustment
    let ratioAdjustment = 0
    if (documentRatio > 3) {
      // Very long document, slow down movement
      ratioAdjustment = -0.2
    } else if (documentRatio < 1.5) {
      // Short document, speed up movement
      ratioAdjustment = 0.1
    }

    // Combine all adjustments
    const totalMultiplier = Math.max(
      0.1, // Minimum multiplier
      deviceMultiplier * scrollMultiplier + mouseAdjustment + velocityAdjustment + ratioAdjustment,
    )

    // Apply adjusted scroll progress
    const adjustedScrollProgress = Math.min(baseScrollProgress * totalMultiplier, 1)

    // Calculate position range
    const startPos = fullConfig.startPosition
    const endPos = Math.max(
      windowHeight - fullConfig.endPosition,
      startPos + 100, // Minimum movement
    )

    // Calculate current position
    const currentPos = startPos + (endPos - startPos) * adjustedScrollProgress

    // Ensure minimum distance from bottom
    const maxPos = windowHeight - fullConfig.minDistanceFromBottom
    const finalPos = Math.min(currentPos, maxPos)

    // Smooth the position change
    const smoothedPos =
      positionHistory.current.length > 0
        ? positionHistory.current[positionHistory.current.length - 1] * 0.9 + finalPos * 0.1
        : finalPos

    // Update position history
    positionHistory.current.push(smoothedPos)
    if (positionHistory.current.length > 3) {
      positionHistory.current.shift()
    }

    return smoothedPos
  }, [sensors, windowHeight, documentHeight, fullConfig])

  // Update adaptive position
  useEffect(() => {
    const newPosition = calculateAdaptivePosition()
    setAdaptivePosition(newPosition)
  }, [calculateAdaptivePosition])

  // Setup event listeners
  useEffect(() => {
    // Initial setup
    setWindowHeight(window.innerHeight)
    setDocumentHeight(document.documentElement.scrollHeight)
    handleScroll()

    // Add event listeners
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      if (mouseTimeout.current) clearTimeout(mouseTimeout.current)
    }
  }, [handleScroll, handleMouseMove])

  // Position styles
  const positionStyles = useMemo(
    () => ({
      position: "fixed" as const,
      top: `${adaptivePosition}px`,
      right: "20px",
      zIndex: 50,
      transition: "top 0.1s ease-out",
      willChange: "top",
    }),
    [adaptivePosition],
  )

  return {
    positionStyles,
    sensors,
    adaptivePosition,
    debugInfo: {
      scrollProgress: sensors.scrollY / Math.max(documentHeight - windowHeight, 1),
      deviceType: sensors.deviceType,
      scrollType: sensors.scrollType,
      velocity: sensors.scrollVelocity,
      mouseActive: sensors.isMouseActive,
      position: adaptivePosition,
    },
  }
}
