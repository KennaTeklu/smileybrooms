"use client"

import { useRef, useEffect, useCallback } from "react"

interface ScrollAnimationConfig {
  basePosition: {
    top: number
    right: number
  }
}

// Convert pixels to centimeters (with device pixel ratio adjustment)
const getPixelsPerCm = () => 37.8 * (window.devicePixelRatio || 1)

export function useScrollTriggeredAnimation(config: ScrollAnimationConfig) {
  const elementRef = useRef<HTMLDivElement>(null)

  // Direct DOM manipulation for instant updates
  const updatePosition = useCallback(() => {
    if (!elementRef.current) return

    const PIXELS_PER_CM = getPixelsPerCm()
    const scrollCm = window.scrollY / PIXELS_PER_CM

    // Debug logging
    console.log(`Scroll update: ${window.scrollY}px = ${scrollCm.toFixed(2)}cm`)

    // Direct style manipulation bypasses React state delays
    elementRef.current.style.top = `${config.basePosition.top + scrollCm}px`
  }, [config.basePosition.top])

  useEffect(() => {
    console.log("Attaching scroll listener") // Debug log

    // Optimized scroll handler with requestAnimationFrame
    const scrollHandler = () => {
      console.log("Scroll event fired") // Debug log
      requestAnimationFrame(updatePosition)
    }

    // Passive listener for better performance
    window.addEventListener("scroll", scrollHandler, { passive: true })

    // Initial position setup
    updatePosition()

    // Cleanup
    return () => {
      console.log("Removing scroll listener") // Debug log
      window.removeEventListener("scroll", scrollHandler)
    }
  }, [updatePosition])

  // Debug parent container checks
  useEffect(() => {
    if (elementRef.current) {
      let el = elementRef.current.parentElement
      while (el) {
        const styles = getComputedStyle(el)
        if (styles.transform !== "none") {
          console.warn("Transform container found:", el, styles.transform)
        }
        if (styles.position === "relative" || styles.position === "absolute") {
          console.warn("Positioned container found:", el, styles.position)
        }
        el = el.parentElement
      }
    }
  }, [])

  return {
    elementRef,
    // Return styles for debugging
    debugStyles: {
      position: "fixed" as const,
      top: config.basePosition.top,
      right: config.basePosition.right,
      zIndex: 1000,
      transition: "none", // Disable transitions for instant movement
      willChange: "top",
      // Debug border
      border: "3px solid red",
      // Reset inherited styles
      all: "unset" as const,
      display: "block",
      contain: "content",
      backfaceVisibility: "hidden",
    },
  }
}
