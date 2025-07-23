"use client"

import { useCallback, useRef } from "react"

export interface ScrollPhysicsOptions {
  friction?: number
  tension?: number
  mass?: number
}

export function useScrollPhysics(options: ScrollPhysicsOptions = {}) {
  const { friction = 0.8, tension = 0.3, mass = 1 } = options

  const velocityRef = useRef(0)
  const accelerationRef = useRef(0)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const animationRef = useRef<number>()

  const animate = useCallback(() => {
    const force = (targetRef.current - currentRef.current) * tension
    accelerationRef.current = force / mass
    velocityRef.current += accelerationRef.current
    velocityRef.current *= friction
    currentRef.current += velocityRef.current

    const isSettled = Math.abs(velocityRef.current) < 0.01 && Math.abs(targetRef.current - currentRef.current) < 0.01

    if (!isSettled) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return currentRef.current
  }, [friction, tension, mass])

  const setTarget = useCallback(
    (target: number) => {
      targetRef.current = target

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      animationRef.current = requestAnimationFrame(animate)
    },
    [animate],
  )

  const getCurrentValue = useCallback(() => currentRef.current, [])

  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    velocityRef.current = 0
    accelerationRef.current = 0
  }, [])

  return { setTarget, getCurrentValue, stop }
}
