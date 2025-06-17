"use client"

import { useCallback, useRef } from "react"

export function useScrollSnap(snapPoints: number[] = []) {
  const isSnappingRef = useRef(false)
  const snapTimeoutRef = useRef<NodeJS.Timeout>()

  const findNearestSnapPoint = useCallback(
    (scrollPosition: number) => {
      if (snapPoints.length === 0) return scrollPosition

      return snapPoints.reduce((nearest, point) => {
        return Math.abs(point - scrollPosition) < Math.abs(nearest - scrollPosition) ? point : nearest
      })
    },
    [snapPoints],
  )

  const snapToNearest = useCallback(
    (element: HTMLElement, duration = 300) => {
      if (isSnappingRef.current) return

      const currentScroll = element.scrollTop
      const nearestPoint = findNearestSnapPoint(currentScroll)

      if (Math.abs(nearestPoint - currentScroll) < 5) return

      isSnappingRef.current = true
      const startTime = performance.now()
      const startScroll = currentScroll
      const distance = nearestPoint - startScroll

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Ease-out-cubic
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)

        element.scrollTop = startScroll + distance * easeOutCubic

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          isSnappingRef.current = false
        }
      }

      requestAnimationFrame(animate)
    },
    [findNearestSnapPoint],
  )

  const handleScrollEnd = useCallback(
    (element: HTMLElement, delay = 150) => {
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current)
      }

      snapTimeoutRef.current = setTimeout(() => {
        snapToNearest(element)
      }, delay)
    },
    [snapToNearest],
  )

  return { snapToNearest, handleScrollEnd, isSnapping: isSnappingRef.current }
}
