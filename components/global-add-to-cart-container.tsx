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
        position: "sticky",
        top: `${topOffset}px`, // Stick 2cm below the header
        alignSelf: "flex-end", // Pushes to the right if parent is flex
        zIndex: 999, // Below header (1001) but above most content
        right: "clamp(1rem, 3vw, 2rem)", // Responsive right spacing
        // No transform here, as it should always be visible
      }}
    >
      {children}
    </div>
  )
}
