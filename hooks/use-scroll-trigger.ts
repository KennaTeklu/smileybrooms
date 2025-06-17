"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface ScrollTrigger {
  threshold: number
  onEnter?: () => void
  onLeave?: () => void
  once?: boolean
}

export function useScrollTrigger(triggers: ScrollTrigger[]) {
  const [activeStates, setActiveStates] = useState<boolean[]>(new Array(triggers.length).fill(false))
  const triggeredOnce = useRef<boolean[]>(new Array(triggers.length).fill(false))
  const rafRef = useRef<number>()

  const checkTriggers = useCallback(() => {
    const scrollY = window.pageYOffset
    const windowHeight = window.innerHeight

    triggers.forEach((trigger, index) => {
      const isActive = scrollY >= trigger.threshold
      const wasActive = activeStates[index]
      const hasTriggeredOnce = triggeredOnce.current[index]

      if (isActive !== wasActive) {
        if (isActive && !hasTriggeredOnce) {
          trigger.onEnter?.()
          if (trigger.once) {
            triggeredOnce.current[index] = true
          }
        } else if (!isActive && !trigger.once) {
          trigger.onLeave?.()
        }

        setActiveStates((prev) => {
          const newStates = [...prev]
          newStates[index] = isActive
          return newStates
        })
      }
    })
  }, [triggers, activeStates])

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(checkTriggers)
  }, [checkTriggers])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    checkTriggers() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll, checkTriggers])

  return activeStates
}
