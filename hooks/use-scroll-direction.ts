"use client"

import { useState, useEffect, useRef } from "react"

export type ScrollDirection = "up" | "down" | "idle"

export function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("idle")
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset
      const difference = Math.abs(scrollY - lastScrollY.current)

      if (difference >= threshold) {
        setScrollDirection(scrollY > lastScrollY.current ? "down" : "up")
        lastScrollY.current = scrollY
      }

      ticking.current = false
    }

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollDirection)
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [threshold])

  return scrollDirection
}
