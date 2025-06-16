"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"

interface RenderOptimizationOptions {
  enableVirtualization?: boolean
  enableMemoization?: boolean
  enableLazyLoading?: boolean
  enableIntersectionObserver?: boolean
  threshold?: number
  rootMargin?: string
}

interface VirtualizedItem {
  index: number
  height: number
  offset: number
  isVisible: boolean
}

export function useOptimizedRendering<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  options: RenderOptimizationOptions = {},
) {
  const {
    enableVirtualization = true,
    enableMemoization = true,
    enableLazyLoading = true,
    enableIntersectionObserver = true,
    threshold = 0.1,
    rootMargin = "50px",
  } = options

  const [visibleRange, setVisibleRange] = useState({ start: 0, end: Math.ceil(containerHeight / itemHeight) })
  const [scrollTop, setScrollTop] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const intersectionObserverRef = useRef<IntersectionObserver>()
  const visibleItemsRef = useRef<Set<number>>(new Set())

  // Calculate visible items for virtualization
  const calculateVisibleRange = useCallback(
    (scrollTop: number) => {
      if (!enableVirtualization) {
        return { start: 0, end: items.length }
      }

      const start = Math.floor(scrollTop / itemHeight)
      const visibleCount = Math.ceil(containerHeight / itemHeight)
      const end = Math.min(start + visibleCount + 2, items.length) // +2 for buffer

      return { start: Math.max(0, start - 1), end } // -1 for buffer
    },
    [enableVirtualization, items.length, itemHeight, containerHeight],
  )

  // Handle scroll events with throttling
  const handleScroll = useCallback(
    (event: Event) => {
      const target = event.target as HTMLDivElement
      const newScrollTop = target.scrollTop

      setScrollTop(newScrollTop)
      setIsScrolling(true)

      // Update visible range
      const newRange = calculateVisibleRange(newScrollTop)
      setVisibleRange(newRange)

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Set scrolling to false after scroll ends
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    },
    [calculateVisibleRange],
  )

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!enableIntersectionObserver || !containerRef.current) return

    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number.parseInt(entry.target.getAttribute("data-index") || "0")

          if (entry.isIntersecting) {
            visibleItemsRef.current.add(index)
          } else {
            visibleItemsRef.current.delete(index)
          }
        })
      },
      {
        root: containerRef.current,
        rootMargin,
        threshold,
      },
    )

    return () => {
      intersectionObserverRef.current?.disconnect()
    }
  }, [enableIntersectionObserver, rootMargin, threshold])

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Get virtualized items
  const getVirtualizedItems = useCallback(() => {
    if (!enableVirtualization) {
      return items.map((item, index) => ({
        item,
        index,
        style: {},
      }))
    }

    const virtualizedItems = []
    const { start, end } = visibleRange

    for (let i = start; i < end; i++) {
      if (i < items.length) {
        virtualizedItems.push({
          item: items[i],
          index: i,
          style: {
            position: "absolute" as const,
            top: i * itemHeight,
            height: itemHeight,
            width: "100%",
          },
        })
      }
    }

    return virtualizedItems
  }, [enableVirtualization, items, visibleRange, itemHeight])

  // Get container style for virtualization
  const getContainerStyle = useCallback(() => {
    if (!enableVirtualization) {
      return {}
    }

    return {
      height: containerHeight,
      overflow: "auto",
      position: "relative" as const,
    }
  }, [enableVirtualization, containerHeight])

  // Get content style for virtualization
  const getContentStyle = useCallback(() => {
    if (!enableVirtualization) {
      return {}
    }

    return {
      height: items.length * itemHeight,
      position: "relative" as const,
    }
  }, [enableVirtualization, items.length, itemHeight])

  // Memoized render function
  const memoizedRender = useCallback(
    (renderItem: (item: T, index: number) => React.ReactNode) => {
      const virtualizedItems = getVirtualizedItems()

      return virtualizedItems.map(({ item, index, style }) => {
        const shouldRender = enableLazyLoading ? visibleItemsRef.current.has(index) : true

        return (
          <div key={index} style={style} data-index={index}>
            {shouldRender ? renderItem(item, index) : <div style={{ height: itemHeight }} />}
          </div>
        )
      })
    },
    [getVirtualizedItems, enableLazyLoading, itemHeight],
  )

  // Scroll to specific item
  const scrollToItem = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      if (!containerRef.current) return

      const targetScrollTop = index * itemHeight
      containerRef.current.scrollTo({
        top: targetScrollTop,
        behavior,
      })
    },
    [itemHeight],
  )

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    const totalItems = items.length
    const visibleItems = visibleRange.end - visibleRange.start
    const renderRatio = visibleItems / totalItems

    return {
      totalItems,
      visibleItems,
      renderRatio,
      isScrolling,
      scrollTop,
    }
  }, [items.length, visibleRange, isScrolling, scrollTop])

  return {
    containerRef,
    visibleRange,
    scrollTop,
    isScrolling,
    getVirtualizedItems,
    getContainerStyle,
    getContentStyle,
    memoizedRender,
    scrollToItem,
    getPerformanceMetrics,
  }
}
