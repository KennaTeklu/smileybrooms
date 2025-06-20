"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface PhysicsConfig {
  mass?: number
  tension?: number
  friction?: number
  velocity?: number
  precision?: number
  restThreshold?: number
}

interface PhysicsState {
  value: number
  velocity: number
  isAnimating: boolean
}

interface SpringAnimation {
  from: number
  to: number
  config: Required<PhysicsConfig>
  onUpdate: (value: number) => void
  onComplete?: () => void
}

export function usePhysicsAnimation(initialValue = 0, config: PhysicsConfig = {}) {
  const defaultConfig: Required<PhysicsConfig> = {
    mass: 1,
    tension: 280,
    friction: 60,
    velocity: 0,
    precision: 0.01,
    restThreshold: 0.01,
  }

  const finalConfig = { ...defaultConfig, ...config }

  const [state, setState] = useState<PhysicsState>({
    value: initialValue,
    velocity: finalConfig.velocity,
    isAnimating: false,
  })

  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>()
  const targetRef = useRef<number>(initialValue)

  // Spring physics calculation
  const calculateSpring = useCallback(
    (currentValue: number, targetValue: number, currentVelocity: number, deltaTime: number) => {
      const { mass, tension, friction } = finalConfig

      // Spring force calculation
      const springForce = -tension * (currentValue - targetValue)
      const dampingForce = -friction * currentVelocity

      // Acceleration = Force / Mass
      const acceleration = (springForce + dampingForce) / mass

      // Update velocity and position
      const newVelocity = currentVelocity + acceleration * deltaTime
      const newValue = currentValue + newVelocity * deltaTime

      return { value: newValue, velocity: newVelocity }
    },
    [finalConfig.mass, finalConfig.tension, finalConfig.friction],
  )

  // Animation loop
  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp
      }

      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.016) // Cap at 60fps
      lastTimeRef.current = timestamp

      setState((prevState) => {
        const { value, velocity } = calculateSpring(prevState.value, targetRef.current, prevState.velocity, deltaTime)

        // Check if animation should stop
        const isAtRest =
          Math.abs(velocity) < finalConfig.restThreshold && Math.abs(value - targetRef.current) < finalConfig.precision

        if (isAtRest) {
          return {
            value: targetRef.current,
            velocity: 0,
            isAnimating: false,
          }
        }

        // Continue animation
        animationRef.current = requestAnimationFrame(animate)

        return {
          value,
          velocity,
          isAnimating: true,
        }
      })
    },
    [calculateSpring, finalConfig],
  )

  // Start animation to target value
  const animateTo = useCallback(
    (target: number, customConfig?: Partial<PhysicsConfig>) => {
      targetRef.current = target

      if (customConfig) {
        Object.assign(finalConfig, customConfig)
      }

      setState((prev) => ({ ...prev, isAnimating: true }))

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      lastTimeRef.current = undefined
      animationRef.current = requestAnimationFrame(animate)
    },
    [animate, finalConfig],
  )

  // Stop animation
  const stop = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
    }

    setState((prev) => ({ ...prev, isAnimating: false, velocity: 0 }))
  }, [])

  // Set immediate value without animation
  const set = useCallback(
    (value: number) => {
      targetRef.current = value
      setState({
        value,
        velocity: 0,
        isAnimating: false,
      })
      stop()
    },
    [stop],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return {
    value: state.value,
    velocity: state.velocity,
    isAnimating: state.isAnimating,
    animateTo,
    stop,
    set,
  }
}
