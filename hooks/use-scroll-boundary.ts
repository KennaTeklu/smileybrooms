"use client"

import { useCallback, useRef, useState } from "react"

export interface ScrollBoundary {
  top: number
  bottom: number
  left: number
  right: number
}

export function useScrollBoundary(boundary: ScrollBoundary) {
  const [isWithinBounds, setIsWithinBounds] = useState(true)
  const [boundaryViolations, setBoundaryViolations] = useState<string[]>([])
  const elementRef = useRef<HTMLElement | null>(null)

  const checkBoundaries = useCallback(
    (element: HTMLElement) => {
      const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = element
      const violations: string[] = []

      // Check vertical boundaries
      if (scrollTop < boundary.top) {
        violations.push("top")
      }
      if (scrollTop + clientHeight > scrollHeight - boundary.bottom) {
        violations.push("bottom")
      }

      // Check horizontal boundaries
      if (scrollLeft < boundary.left) {
        violations.push("left")
      }
      if (scrollLeft + clientWidth > scrollWidth - boundary.right) {
        violations.push("right")
      }

      const withinBounds = violations.length === 0
      setIsWithinBounds(withinBounds)
      setBoundaryViolations(violations)

      return { withinBounds, violations }
    },
    [boundary],
  )

  const handleScroll = useCallback(
    (event: Event) => {
      const element = event.target as HTMLElement
      checkBoundaries(element)
    },
    [checkBoundaries],
  )

  const setElement = useCallback(
    (element: HTMLElement | null) => {
      if (elementRef.current) {
        elementRef.current.removeEventListener("scroll", handleScroll)
      }

      elementRef.current = element

      if (element) {
        element.addEventListener("scroll", handleScroll, { passive: true })
        checkBoundaries(element)
      }
    },
    [handleScroll, checkBoundaries],
  )

  const constrainScroll = useCallback(
    (targetScrollTop: number, targetScrollLeft: number) => {
      if (!elementRef.current) return { scrollTop: targetScrollTop, scrollLeft: targetScrollLeft }

      const { scrollHeight, scrollWidth, clientHeight, clientWidth } = elementRef.current

      const constrainedScrollTop = Math.max(
        boundary.top,
        Math.min(targetScrollTop, scrollHeight - clientHeight - boundary.bottom),
      )

      const constrainedScrollLeft = Math.max(
        boundary.left,
        Math.min(targetScrollLeft, scrollWidth - clientWidth - boundary.right),
      )

      return {
        scrollTop: constrainedScrollTop,
        scrollLeft: constrainedScrollLeft,
      }
    },
    [boundary],
  )

  return {
    isWithinBounds,
    boundaryViolations,
    setElement,
    constrainScroll,
    checkBoundaries: () => (elementRef.current ? checkBoundaries(elementRef.current) : null),
  }
}
