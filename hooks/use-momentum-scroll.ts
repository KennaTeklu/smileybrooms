"use client"

import { useCallback, useRef, useEffect } from "react"

export function useMomentumScroll() {
  const velocityRef = useRef(0)
  const lastScrollTimeRef = useRef(0)
  const lastScrollTopRef = useRef(0)
  const momentumAnimationRef = useRef<number>()

  const calculateVelocity = useCallback((scrollTop: number, timestamp: number) => {
    const deltaTime = timestamp - lastScrollTimeRef.current
    const deltaScroll = scrollTop - lastScrollTopRef.current

    if (deltaTime > 0) {
      velocityRef.current = deltaScroll / deltaTime
    }

    lastScrollTimeRef.current = timestamp
    lastScrollTopRef.current = scrollTop
  }, [])

  const applyMomentum = useCallback((element: HTMLElement, friction = 0.95, threshold = 0.1) => {
    const animate = () => {
      if (Math.abs(velocityRef.current) > threshold) {
        element.scrollTop += velocityRef.current * 16 // 16ms frame time
        velocityRef.current *= friction
        momentumAnimationRef.current = requestAnimationFrame(animate)
      }
    }

    if (momentumAnimationRef.current) {
      cancelAnimationFrame(momentumAnimationRef.current)
    }

    momentumAnimationRef.current = requestAnimationFrame(animate)
  }, [])

  const handleScroll = useCallback(
    (event: Event, applyMomentumOnEnd = true) => {
      const element = event.target as HTMLElement
      const timestamp = performance.now()

      calculateVelocity(element.scrollTop, timestamp)

      if (applyMomentumOnEnd) {
        clearTimeout(momentumAnimationRef.current)
        setTimeout(() => applyMomentum(element), 100)
      }
    },
    [calculateVelocity, applyMomentum],
  )

  useEffect(() => {
    return () => {
      if (momentumAnimationRef.current) {
        cancelAnimationFrame(momentumAnimationRef.current)
      }
    }
  }, [])

  return { handleScroll, applyMomentum, velocity: velocityRef.current }
}
