"use client"

import { useCallback, useRef, useState } from "react"

interface AnimationState {
  isAnimating: boolean
  scale: number
  translateY: number
}

interface CartAnimationOptions {
  enableHover?: boolean
  enablePress?: boolean
  enableFloat?: boolean
  floatIntensity?: number
}

export function useCartAnimation(options: CartAnimationOptions = {}) {
  const { enableHover = true, enablePress = true, enableFloat = true, floatIntensity = 2 } = options

  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    scale: 1,
    translateY: 0,
  })

  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>()

  const startFloating = useCallback(() => {
    if (!enableFloat) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const floatY = Math.sin(elapsed * 0.002) * floatIntensity

      setAnimationState((prev) => ({
        ...prev,
        translateY: floatY,
        isAnimating: true,
      }))

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [enableFloat, floatIntensity])

  const stopFloating = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
      startTimeRef.current = undefined
    }

    setAnimationState((prev) => ({
      ...prev,
      translateY: 0,
      isAnimating: false,
    }))
  }, [])

  const handleHover = useCallback(
    (isHovering: boolean) => {
      if (!enableHover) return

      setAnimationState((prev) => ({
        ...prev,
        scale: isHovering ? 1.05 : 1,
        translateY: isHovering ? -2 : prev.translateY,
      }))
    },
    [enableHover],
  )

  const handlePress = useCallback(
    (isPressed: boolean) => {
      if (!enablePress) return

      setAnimationState((prev) => ({
        ...prev,
        scale: isPressed ? 0.98 : 1,
      }))
    },
    [enablePress],
  )

  const triggerPulse = useCallback(() => {
    setAnimationState((prev) => ({ ...prev, scale: 1.2 }))

    setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, scale: 1 }))
    }, 150)
  }, [])

  return {
    animationState,
    startFloating,
    stopFloating,
    handleHover,
    handlePress,
    triggerPulse,
  }
}
