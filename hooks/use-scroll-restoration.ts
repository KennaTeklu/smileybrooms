"use client"

import { useEffect, useRef, useCallback } from "react"

export function useScrollRestoration(key: string) {
  const scrollPositions = useRef<Map<string, number>>(new Map())
  const elementRef = useRef<HTMLElement | null>(null)

  const saveScrollPosition = useCallback(() => {
    if (elementRef.current) {
      scrollPositions.current.set(key, elementRef.current.scrollTop)
    }
  }, [key])

  const restoreScrollPosition = useCallback(() => {
    if (elementRef.current) {
      const savedPosition = scrollPositions.current.get(key) || 0
      elementRef.current.scrollTop = savedPosition
    }
  }, [key])

  const setElement = useCallback(
    (element: HTMLElement | null) => {
      if (elementRef.current) {
        saveScrollPosition()
      }

      elementRef.current = element

      if (element) {
        // Restore position after a brief delay to ensure content is loaded
        setTimeout(restoreScrollPosition, 100)
      }
    },
    [saveScrollPosition, restoreScrollPosition],
  )

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      saveScrollPosition()
    }
  }, [saveScrollPosition])

  return { setElement, saveScrollPosition, restoreScrollPosition }
}
