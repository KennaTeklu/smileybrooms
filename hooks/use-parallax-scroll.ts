"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useParallaxScroll(speed = 0.5) {
  const [offset, setOffset] = useState(0)
  const elementRef = useRef<HTMLElement | null>(null)
  const rafRef = useRef<number>()

  const updateParallax = useCallback(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const parallaxOffset = scrolled * speed

      setOffset(parallaxOffset)
    }
  }, [speed])

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(updateParallax)
  }, [updateParallax])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  const setElement = useCallback(
    (element: HTMLElement | null) => {
      elementRef.current = element
      updateParallax()
    },
    [updateParallax],
  )

  return { offset, setElement }
}
