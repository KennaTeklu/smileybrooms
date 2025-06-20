"use client"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"

interface Position {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

interface UseAdaptiveScrollPositioningProps {
  basePosition: Position
  elementType?: "button" | "panel" | "chatbot" | "toolbar"
  priority?: "low" | "medium" | "high"
}

export function useAdaptiveScrollPositioning({
  basePosition,
  elementType = "button",
  priority = "medium",
}: UseAdaptiveScrollPositioningProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef<number>()

  // Memoize the base style to prevent re-renders
  const baseStyle = useMemo(
    () => ({
      position: "fixed" as const,
      ...basePosition,
      zIndex: priority === "high" ? 50 : priority === "medium" ? 40 : 30,
    }),
    [basePosition, priority],
  )

  // Memoize the scroll handler to prevent re-creation
  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY)
    })
  }, [])

  // Calculate adaptive position based on scroll
  const adaptiveStyle = useMemo(() => {
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 1000
    const documentHeight = typeof document !== "undefined" ? document.documentElement.scrollHeight : 1000

    const scrollProgress = scrollY / Math.max(documentHeight - windowHeight, 1)
    const adjustment = Math.min(scrollProgress * 20, 20) // Max 20px adjustment

    return {
      ...baseStyle,
      transform: `translateY(${-adjustment}px)`,
      transition: "transform 0.3s ease-out",
    }
  }, [baseStyle, scrollY])

  useEffect(() => {
    // Set initial scroll position
    setScrollY(window.scrollY)

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  return {
    elementRef,
    style: adaptiveStyle,
    positionStyles: adaptiveStyle,
    isVisible: true,
    scrollProgress: scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
  }
}
