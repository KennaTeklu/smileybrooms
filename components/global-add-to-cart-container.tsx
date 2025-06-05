"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface GlobalAddToCartContainerProps {
  children: React.ReactNode
}

export function GlobalAddToCartContainer({ children }: GlobalAddToCartContainerProps) {
  const headerRef = useRef<HTMLElement | null>(null)
  const [topOffset, setTopOffset] = useState(72) // Default to 64px header + 8px gap

  useEffect(() => {
    const header = document.getElementById("main-header")
    if (!header) {
      console.warn("Header with ID 'main-header' not found. Sticky button positioning might be off.")
      return
    }

    headerRef.current = header

    const updateOffset = () => {
      // Calculate 2cm in pixels (1 inch = 96px, 1 inch = 2.54cm)
      const twoCmInPx = 2 * (96 / 2.54)
      setTopOffset(header.offsetHeight + twoCmInPx)
    }

    // Update offset initially and on window resize
    updateOffset()
    window.addEventListener("resize", updateOffset)

    return () => {
      window.removeEventListener("resize", updateOffset)
    }
  }, [])

  return (
    <div
      className="sticky-container"
      style={{
        position: "fixed", // Changed from sticky to fixed for more reliable viewport positioning
        top: `${topOffset}px`,
        right: "clamp(1rem, 3vw, 2rem)",
        left: "auto", // Explicitly set left to auto to ensure right alignment
        bottom: "auto", // Explicitly set bottom to auto to ensure top alignment
        width: "fit-content", // Ensure it doesn't take full width
        zIndex: 999,
      }}
    >
      {children}
    </div>
  )
}
