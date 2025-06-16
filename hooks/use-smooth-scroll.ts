"use client"

import { useCallback, useRef } from "react"

export function useSmoothScroll() {
  const isScrollingRef = useRef(false)

  const smoothScrollTo = useCallback((element: HTMLElement, targetPosition: number, duration = 500) => {
    if (isScrollingRef.current) return

    isScrollingRef.current = true
    const startPosition = element.scrollTop
    const distance = targetPosition - startPosition
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)

      element.scrollTop = startPosition + distance * easeOutCubic

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        isScrollingRef.current = false
      }
    }

    requestAnimationFrame(animateScroll)
  }, [])

  const smoothScrollBy = useCallback(
    (element: HTMLElement, deltaY: number, duration = 300) => {
      const targetPosition = element.scrollTop + deltaY
      smoothScrollTo(element, targetPosition, duration)
    },
    [smoothScrollTo],
  )

  return { smoothScrollTo, smoothScrollBy, isScrolling: isScrollingRef.current }
}
