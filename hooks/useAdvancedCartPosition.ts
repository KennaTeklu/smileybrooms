"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useFloatingUI } from "./useFloatingUI"

interface CollisionElement {
  element: Element
  priority: number
  type: "fixed" | "sticky" | "floating"
}

interface AdvancedPositionState {
  isColliding: boolean
  collidingElements: CollisionElement[]
  suggestedPosition: { x: number; y: number }
  safeZones: Array<{ x: number; y: number; width: number; height: number }>
}

interface UseAdvancedCartPositionOptions {
  enableCollisionDetection?: boolean
  enableSafeZoneCalculation?: boolean
  collisionPadding?: number
  updateInterval?: number
}

export function useAdvancedCartPosition(options: UseAdvancedCartPositionOptions = {}) {
  const {
    enableCollisionDetection = true,
    enableSafeZoneCalculation = true,
    collisionPadding = 16,
    updateInterval = 100,
  } = options

  const cartRef = useRef<HTMLDivElement>(null)
  const [positionState, setPositionState] = useState<AdvancedPositionState>({
    isColliding: false,
    collidingElements: [],
    suggestedPosition: { x: 0, y: 0 },
    safeZones: [],
  })

  // Floating UI integration for panel positioning
  const floatingUI = useFloatingUI({
    placement: "top-end",
    enableFlip: true,
    enableShift: true,
    enableHide: true,
  })

  // Detect fixed/sticky elements that might collide
  const detectFixedElements = useCallback((): CollisionElement[] => {
    const fixedElements: CollisionElement[] = []

    // Query all potentially colliding elements
    const selectors = [
      '[style*="position: fixed"]',
      '[style*="position: sticky"]',
      ".fixed",
      ".sticky",
      "[data-floating]",
      "header",
      "nav",
      ".header",
      ".navigation",
      ".toast",
      ".notification",
      ".modal",
      ".dialog",
    ]

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element)
        const position = computedStyle.position

        if (position === "fixed" || position === "sticky") {
          const rect = element.getBoundingClientRect()

          // Only consider visible elements
          if (rect.width > 0 && rect.height > 0) {
            fixedElements.push({
              element,
              priority: position === "fixed" ? 2 : 1,
              type: position as "fixed" | "sticky",
            })
          }
        }
      })
    })

    return fixedElements
  }, [])

  // Check for collisions with other elements
  const checkCollisions = useCallback(() => {
    if (!cartRef.current || !enableCollisionDetection) return

    const cartRect = cartRef.current.getBoundingClientRect()
    const fixedElements = detectFixedElements()
    const collidingElements: CollisionElement[] = []

    fixedElements.forEach(({ element, priority, type }) => {
      const elementRect = element.getBoundingClientRect()

      // Check if rectangles overlap (with padding)
      const isColliding = !(
        cartRect.right + collisionPadding < elementRect.left ||
        cartRect.left - collisionPadding > elementRect.right ||
        cartRect.bottom + collisionPadding < elementRect.top ||
        cartRect.top - collisionPadding > elementRect.bottom
      )

      if (isColliding) {
        collidingElements.push({ element, priority, type })
      }
    })

    return collidingElements
  }, [detectFixedElements, enableCollisionDetection, collisionPadding])

  // Calculate safe zones for positioning
  const calculateSafeZones = useCallback(() => {
    if (!enableSafeZoneCalculation) return []

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    const fixedElements = detectFixedElements()
    const occupiedAreas = fixedElements.map(({ element }) => element.getBoundingClientRect())

    // Calculate available safe zones
    const safeZones = []
    const padding = collisionPadding

    // Top-right corner (default)
    const topRight = {
      x: viewport.width - 100 - padding,
      y: padding,
      width: 100,
      height: 100,
    }

    // Check if top-right is clear
    const isTopRightSafe = !occupiedAreas.some(
      (rect) =>
        !(
          topRight.x + topRight.width < rect.left ||
          topRight.x > rect.right ||
          topRight.y + topRight.height < rect.top ||
          topRight.y > rect.bottom
        ),
    )

    if (isTopRightSafe) {
      safeZones.push(topRight)
    }

    // Add more safe zones (bottom-right, left side, etc.)
    const bottomRight = {
      x: viewport.width - 100 - padding,
      y: viewport.height - 100 - padding,
      width: 100,
      height: 100,
    }

    const isBottomRightSafe = !occupiedAreas.some(
      (rect) =>
        !(
          bottomRight.x + bottomRight.width < rect.left ||
          bottomRight.x > rect.right ||
          bottomRight.y + bottomRight.height < rect.top ||
          bottomRight.y > rect.bottom
        ),
    )

    if (isBottomRightSafe) {
      safeZones.push(bottomRight)
    }

    return safeZones
  }, [detectFixedElements, enableSafeZoneCalculation, collisionPadding])

  // Find optimal position
  const findOptimalPosition = useCallback(() => {
    const collidingElements = checkCollisions() || []
    const safeZones = calculateSafeZones()

    let suggestedPosition = { x: 0, y: 0 }

    if (safeZones.length > 0) {
      // Use the first available safe zone
      const safeZone = safeZones[0]
      suggestedPosition = { x: safeZone.x, y: safeZone.y }
    }

    setPositionState({
      isColliding: collidingElements.length > 0,
      collidingElements,
      suggestedPosition,
      safeZones,
    })
  }, [checkCollisions, calculateSafeZones])

  // Auto-adjust position based on collisions
  const autoAdjustPosition = useCallback(() => {
    if (!cartRef.current || !positionState.isColliding) return

    const { suggestedPosition } = positionState
    const style = cartRef.current.style

    // Apply suggested position
    style.right = `${window.innerWidth - suggestedPosition.x - 80}px`
    style.bottom = `${window.innerHeight - suggestedPosition.y - 80}px`
  }, [positionState])

  // Reset to default position
  const resetToDefaultPosition = useCallback(() => {
    if (!cartRef.current) return

    const style = cartRef.current.style
    style.right = ""
    style.bottom = ""
  }, [])

  // Periodic collision detection
  useEffect(() => {
    const interval = setInterval(findOptimalPosition, updateInterval)

    // Initial check
    findOptimalPosition()

    return () => clearInterval(interval)
  }, [findOptimalPosition, updateInterval])

  // Handle viewport changes
  useEffect(() => {
    const handleResize = () => {
      setTimeout(findOptimalPosition, 100)
    }

    const handleScroll = () => {
      findOptimalPosition()
    }

    window.addEventListener("resize", handleResize, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [findOptimalPosition])

  return {
    cartRef,
    positionState,
    floatingUI,
    autoAdjustPosition,
    resetToDefaultPosition,
    findOptimalPosition,
  }
}
