"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export interface FloatingAnimationOptions {
  intensity?: number
  speed?: number
  direction?: "vertical" | "horizontal" | "both"
  pauseOnHover?: boolean
}

export function useFloatingAnimation(options: FloatingAnimationOptions = {}) {
  const { intensity = 10, speed = 2000, direction = "vertical", pauseOnHover = true } = options

  const [isHovered, setIsHovered] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp

      const elapsed = timestamp - startTimeRef.current
      const progress = (elapsed % speed) / speed

      if (!isHovered || !pauseOnHover) {
        setAnimationPhase(progress * Math.PI * 2)
      }

      animationRef.current = requestAnimationFrame(animate)
    },
    [isHovered, pauseOnHover, speed],
  )

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  const getTransform = useCallback(() => {
    const y = direction !== "horizontal" ? Math.sin(animationPhase) * intensity : 0
    const x = direction !== "vertical" ? Math.cos(animationPhase) * intensity : 0
    return `translate3d(${x}px, ${y}px, 0)`
  }, [animationPhase, intensity, direction])

  return {
    transform: getTransform(),
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    isHovered,
  }
}
