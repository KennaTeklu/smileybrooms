"use client"

import { useEffect, useRef, useCallback } from "react"

export function useScrollSync(isActive = true) {
  const containerRef = useRef<HTMLElement | null>(null)
  const lastScrollTop = useRef<number>(0)

  const syncScroll = useCallback(
    (event: Event) => {
      if (!isActive || !containerRef.current) return

      const target = event.target as HTMLElement
      const scrollTop = target.scrollTop
      const scrollDelta = scrollTop - lastScrollTop.current

      // Sync with main page scroll
      window.scrollBy(0, scrollDelta * 0.3)
      lastScrollTop.current = scrollTop
    },
    [isActive],
  )

  const setContainer = useCallback(
    (element: HTMLElement | null) => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", syncScroll)
      }

      containerRef.current = element

      if (element) {
        element.addEventListener("scroll", syncScroll, { passive: true })
        lastScrollTop.current = element.scrollTop
      }
    },
    [syncScroll],
  )

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", syncScroll)
      }
    }
  }, [syncScroll])

  return { setContainer, containerRef }
}
