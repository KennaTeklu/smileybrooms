"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface FloatingPosition {
  x: number
  y: number
  scale: number
  opacity: number
}

export function useFloatingPosition(
  isVisible = true,
  options: {
    basePosition?: { x: number; y: number }
    animationDuration?: number
    scaleOnHover?: boolean
  } = {},
) {
  const { basePosition = { x: 0, y: 0 }, animationDuration = 300, scaleOnHover = true } = options

  const [position, setPosition] = useState<FloatingPosition>({
    x: basePosition.x,
    y: basePosition.y,
    scale: 1,
    opacity: isVisible ? 1 : 0,
  })

  const [isHovered, setIsHovered] = useState(false)
  const animationRef = useRef<number>()

  const updatePosition = useCallback((newPosition: Partial<FloatingPosition>) => {
    setPosition((prev) => ({ ...prev, ...newPosition }))
  }, [])

  useEffect(() => {
    setPosition((prev) => ({
      ...prev,
      opacity: isVisible ? 1 : 0,
      scale: isVisible ? (isHovered && scaleOnHover ? 1.1 : 1) : 0.8,
    }))
  }, [isVisible, isHovered, scaleOnHover])

  const floatingProps = {
    style: {
      transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${position.scale})`,
      opacity: position.opacity,
      transition: `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    },
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  return {
    position,
    updatePosition,
    floatingProps,
    isHovered,
  }
}
