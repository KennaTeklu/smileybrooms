"use client"

import { useState, useEffect } from "react"

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const updatePosition = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", updatePosition, { passive: true })
    updatePosition()

    return () => window.removeEventListener("scroll", updatePosition)
  }, [])

  return scrollPosition
}
