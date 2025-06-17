"use client"

import { useCallback, useEffect, useState } from "react"
import { usePhysicsAnimation } from "./usePhysicsAnimation"

interface AnimationSequence {
  id: string
  animations: Array<{
    property: string
    from: number
    to: number
    duration?: number
    delay?: number
    easing?: string
  }>
  onComplete?: () => void
}

interface GestureAnimation {
  scale: number
  rotation: number
  x: number
  y: number
  opacity: number
}

export function useAdvancedAnimations() {
  // Physics-based animations for different properties
  const scaleAnimation = usePhysicsAnimation(1, { tension: 300, friction: 30 })
  const rotationAnimation = usePhysicsAnimation(0, { tension: 200, friction: 25 })
  const xAnimation = usePhysicsAnimation(0, { tension: 280, friction: 60 })
  const yAnimation = usePhysicsAnimation(0, { tension: 280, friction: 60 })
  const opacityAnimation = usePhysicsAnimation(1, { tension: 300, friction: 40 })

  const [gestureState, setGestureState] = useState<GestureAnimation>({
    scale: 1,
    rotation: 0,
    x: 0,
    y: 0,
    opacity: 1,
  })

  // Update gesture state when animations change
  useEffect(() => {
    setGestureState({
      scale: scaleAnimation.value,
      rotation: rotationAnimation.value,
      x: xAnimation.value,
      y: yAnimation.value,
      opacity: opacityAnimation.value,
    })
  }, [scaleAnimation.value, rotationAnimation.value, xAnimation.value, yAnimation.value, opacityAnimation.value])

  // Hover animation with physics
  const animateHover = useCallback(
    (isHovering: boolean) => {
      scaleAnimation.animateTo(isHovering ? 1.05 : 1, { tension: 400, friction: 30 })
      yAnimation.animateTo(isHovering ? -2 : 0, { tension: 300, friction: 25 })
    },
    [scaleAnimation, yAnimation],
  )

  // Press animation with physics
  const animatePress = useCallback(
    (isPressed: boolean) => {
      scaleAnimation.animateTo(isPressed ? 0.95 : 1, { tension: 500, friction: 35 })
    },
    [scaleAnimation],
  )

  // Floating animation
  const animateFloat = useCallback(
    (intensity = 2) => {
      const floatY = Math.sin(Date.now() * 0.002) * intensity
      yAnimation.animateTo(floatY, { tension: 200, friction: 20 })
    },
    [yAnimation],
  )

  // Pulse animation
  const animatePulse = useCallback(() => {
    scaleAnimation.animateTo(1.2, { tension: 400, friction: 20 })
    setTimeout(() => {
      scaleAnimation.animateTo(1, { tension: 300, friction: 25 })
    }, 150)
  }, [scaleAnimation])

  // Shake animation
  const animateShake = useCallback(() => {
    const shakeSequence = [-10, 10, -8, 8, -6, 6, -4, 4, 0]
    let index = 0

    const shake = () => {
      if (index < shakeSequence.length) {
        xAnimation.animateTo(shakeSequence[index], { tension: 800, friction: 50 })
        index++
        setTimeout(shake, 100)
      }
    }

    shake()
  }, [xAnimation])

  // Bounce animation
  const animateBounce = useCallback(() => {
    yAnimation.animateTo(-20, { tension: 400, friction: 20 })
    setTimeout(() => {
      yAnimation.animateTo(0, { tension: 300, friction: 30 })
    }, 200)
  }, [yAnimation])

  // Wobble animation
  const animateWobble = useCallback(() => {
    const wobbleSequence = [15, -10, 5, -5, 0]
    let index = 0

    const wobble = () => {
      if (index < wobbleSequence.length) {
        rotationAnimation.animateTo(wobbleSequence[index], { tension: 600, friction: 40 })
        index++
        setTimeout(wobble, 150)
      }
    }

    wobble()
  }, [rotationAnimation])

  // Fade animation
  const animateFade = useCallback(
    (visible: boolean, duration = 300) => {
      const tension = 1000 / duration
      opacityAnimation.animateTo(visible ? 1 : 0, { tension, friction: tension * 0.7 })
    },
    [opacityAnimation],
  )

  // Slide animation
  const animateSlide = useCallback(
    (direction: "left" | "right" | "up" | "down", distance = 100, visible = true) => {
      const targetX = direction === "left" ? -distance : direction === "right" ? distance : 0
      const targetY = direction === "up" ? -distance : direction === "down" ? distance : 0

      if (visible) {
        xAnimation.animateTo(0, { tension: 280, friction: 60 })
        yAnimation.animateTo(0, { tension: 280, friction: 60 })
      } else {
        xAnimation.animateTo(targetX, { tension: 280, friction: 60 })
        yAnimation.animateTo(targetY, { tension: 280, friction: 60 })
      }
    },
    [xAnimation, yAnimation],
  )

  // Reset all animations
  const resetAnimations = useCallback(() => {
    scaleAnimation.set(1)
    rotationAnimation.set(0)
    xAnimation.set(0)
    yAnimation.set(0)
    opacityAnimation.set(1)
  }, [scaleAnimation, rotationAnimation, xAnimation, yAnimation, opacityAnimation])

  // Get transform string for CSS
  const getTransform = useCallback(() => {
    return `translate3d(${gestureState.x}px, ${gestureState.y}px, 0) scale(${gestureState.scale}) rotate(${gestureState.rotation}deg)`
  }, [gestureState])

  // Get style object
  const getAnimatedStyle = useCallback(() => {
    return {
      transform: getTransform(),
      opacity: gestureState.opacity,
      willChange: "transform, opacity",
    }
  }, [getTransform, gestureState.opacity])

  // Check if any animation is running
  const isAnimating = useCallback(() => {
    return (
      scaleAnimation.isAnimating ||
      rotationAnimation.isAnimating ||
      xAnimation.isAnimating ||
      yAnimation.isAnimating ||
      opacityAnimation.isAnimating
    )
  }, [
    scaleAnimation.isAnimating,
    rotationAnimation.isAnimating,
    xAnimation.isAnimating,
    yAnimation.isAnimating,
    opacityAnimation.isAnimating,
  ])

  return {
    gestureState,
    animateHover,
    animatePress,
    animateFloat,
    animatePulse,
    animateShake,
    animateBounce,
    animateWobble,
    animateFade,
    animateSlide,
    resetAnimations,
    getTransform,
    getAnimatedStyle,
    isAnimating: isAnimating(),
  }
}
