"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface StickyAddToCartWrapperProps {
  children: React.ReactNode
}

export function StickyAddToCartWrapper({ children }: StickyAddToCartWrapperProps) {
  const [isStuck, setIsStuck] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const header = document.getElementById("main-header")
    if (!header) {
      console.warn("Header with ID 'main-header' not found. Sticky behavior might not work as expected.")
      return
    }

    headerRef.current = header

    // Observe the header to know when it's scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        // isStuck is true when the header is NOT fully intersecting (i.e., scrolled away)
        setIsStuck(!entry.isIntersecting)
      },
      {
        threshold: [0.99], // Trigger when 99% of the header is visible
        rootMargin: "-1px 0px 0px 0px", // Adjusts the viewport for intersection calculation
      },
    )

    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  // Calculate the top offset dynamically based on header height
  // This ensures the sticky element always appears just below the header
  const topOffset = headerRef.current ? headerRef.current.offsetHeight + 8 : 72 // Header height + 8px gap

  return (
    <motion.div
      ref={wrapperRef}
      className="sticky-container"
      style={{
        position: "sticky",
        top: `${topOffset}px`, // Stick just below the header
        alignSelf: "flex-end", // Pushes the sticky container to the right if in a flex context
        zIndex: 1000, // Ensure it's above other content but below the header
        // No transform property here, as the button should always be visible when rendered
        // position: sticky handles the smooth transition as it hits the 'top' threshold
      }}
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 20 }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
    >
      <div
        style={{
          position: "absolute",
          right: "clamp(1rem, 3vw, 2rem)", // Responsive right spacing
          top: "0", // Position relative to the sticky container's top
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}
