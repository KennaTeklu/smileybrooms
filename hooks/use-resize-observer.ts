"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export interface ResizeObserverEntry {
  width: number
  height: number
  element: HTMLElement
}

export function useResizeObserver() {
  const [dimensions, setDimensions] = useState<ResizeObserverEntry | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)

  const setElement = useCallback((element: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    elementRef.current = element

    if (element && "ResizeObserver" in window) {
      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (entry) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
            element: entry.target as HTMLElement,
          })
        }
      })

      observerRef.current.observe(element)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { dimensions, setElement, elementRef }
}
