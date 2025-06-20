"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setElement = useCallback(
    (element: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      elementRef.current = element

      if (element) {
        observerRef.current = new IntersectionObserver(([entry]) => {
          setIsIntersecting(entry.isIntersecting)
          setEntry(entry)
        }, options)

        observerRef.current.observe(element)
      }
    },
    [options],
  )

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { isIntersecting, entry, setElement, elementRef }
}
