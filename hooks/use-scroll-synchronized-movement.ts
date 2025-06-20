"use client"

import { useRef, useEffect, useCallback } from "react"

interface ScrollSyncConfig {
  headerHeightCm: number
  rightPosition: number
}

export function useScrollSynchronizedMovement(config: ScrollSyncConfig) {
  const elementRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  // Calculate precise scroll-synchronized position
  const updatePosition = useCallback(() => {
    if (!elementRef.current) return

    const scrollY = window.scrollY
    const devicePixelRatio = window.devicePixelRatio || 1
    const pixelsPerCm = 37.8 * devicePixelRatio

    // Calculate position in centimeters with header offset
    const scrollCm = scrollY / pixelsPerCm
    const totalOffsetCm = scrollCm + config.headerHeightCm

    // Apply transform for precise 1:1 movement
    const transform = `translateY(${totalOffsetCm}cm)`
    elementRef.current.style.transform = transform

    // Debug logging for verification
    console.log(`🔄 Scroll Sync Update:`, {
      scrollY: `${scrollY}px`,
      scrollCm: `${scrollCm.toFixed(3)}cm`,
      headerOffset: `${config.headerHeightCm}cm`,
      totalOffset: `${totalOffsetCm.toFixed(3)}cm`,
      transform,
      devicePixelRatio,
    })
  }, [config.headerHeightCm])

  // Optimized scroll handler with requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      console.log("📜 Scroll event triggered")
      updatePosition()
    })
  }, [updatePosition])

  useEffect(() => {
    console.log("🚀 Initializing scroll-synchronized movement", {
      headerHeightCm: config.headerHeightCm,
      rightPosition: config.rightPosition,
    })

    // Attach passive scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Set initial position
    updatePosition()

    // DevTools layer inspection helper
    if (elementRef.current) {
      elementRef.current.setAttribute("data-scroll-sync", "active")
      console.log("🔍 DevTools: Element marked with data-scroll-sync attribute")
    }

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up scroll listener")
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll, updatePosition, config.headerHeightCm, config.rightPosition])

  // Verify element positioning in DevTools
  useEffect(() => {
    if (elementRef.current) {
      const element = elementRef.current
      const computedStyle = getComputedStyle(element)

      console.log("🔍 DevTools Layer Inspection:", {
        position: computedStyle.position,
        zIndex: computedStyle.zIndex,
        contain: computedStyle.contain,
        willChange: computedStyle.willChange,
        transform: computedStyle.transform,
        backfaceVisibility: computedStyle.backfaceVisibility,
      })

      // Check for conflicting parent containers
      let parent = element.parentElement
      while (parent && parent !== document.body) {
        const parentStyle = getComputedStyle(parent)
        if (parentStyle.transform !== "none" || parentStyle.position === "relative") {
          console.warn("⚠️ Potential positioning conflict detected:", {
            element: parent,
            transform: parentStyle.transform,
            position: parentStyle.position,
          })
        }
        parent = parent.parentElement
      }
    }
  }, [])

  return {
    elementRef,
    // Return critical styles for the floating button
    buttonStyles: {
      position: "absolute" as const,
      top: 0,
      right: config.rightPosition,
      zIndex: 1000,
      transition: "none",
      contain: "content",
      willChange: "transform",
      backfaceVisibility: "hidden" as const,
      transformStyle: "preserve-3d" as const,
    },
  }
}
