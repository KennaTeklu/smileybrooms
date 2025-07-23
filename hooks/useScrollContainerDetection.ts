"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface ScrollContainer {
  element: Element
  isRoot: boolean
  scrollHeight: number
  clientHeight: number
  scrollTop: number
  canScrollVertically: boolean
  canScrollHorizontally: boolean
}

export function useScrollContainerDetection() {
  const [scrollContainers, setScrollContainers] = useState<ScrollContainer[]>([])
  const [activeContainer, setActiveContainer] = useState<ScrollContainer | null>(null)
  const detectionRef = useRef<HTMLElement>(null)

  // Find all scroll containers
  const detectScrollContainers = useCallback(() => {
    const containers: ScrollContainer[] = []

    // Check document root
    const rootContainer: ScrollContainer = {
      element: document.documentElement,
      isRoot: true,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      scrollTop: document.documentElement.scrollTop,
      canScrollVertically: document.documentElement.scrollHeight > document.documentElement.clientHeight,
      canScrollHorizontally: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }
    containers.push(rootContainer)

    // Find other scrollable elements
    const allElements = document.querySelectorAll("*")
    allElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element)
      const overflowY = computedStyle.overflowY
      const overflowX = computedStyle.overflowX

      const isScrollable =
        overflowY === "scroll" || overflowY === "auto" || overflowX === "scroll" || overflowX === "auto"

      if (isScrollable && element !== document.documentElement) {
        const canScrollVertically = element.scrollHeight > element.clientHeight
        const canScrollHorizontally = element.scrollWidth > element.clientWidth

        if (canScrollVertically || canScrollHorizontally) {
          containers.push({
            element,
            isRoot: false,
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            scrollTop: element.scrollTop,
            canScrollVertically,
            canScrollHorizontally,
          })
        }
      }
    })

    return containers
  }, [])

  // Find the closest scroll container to a given element
  const findClosestScrollContainer = useCallback((targetElement: Element): ScrollContainer | null => {
    let current = targetElement.parentElement

    while (current && current !== document.documentElement) {
      const computedStyle = window.getComputedStyle(current)
      const overflowY = computedStyle.overflowY
      const overflowX = computedStyle.overflowX

      const isScrollable =
        overflowY === "scroll" || overflowY === "auto" || overflowX === "scroll" || overflowX === "auto"

      if (isScrollable) {
        const canScrollVertically = current.scrollHeight > current.clientHeight
        const canScrollHorizontally = current.scrollWidth > current.clientWidth

        if (canScrollVertically || canScrollHorizontally) {
          return {
            element: current,
            isRoot: false,
            scrollHeight: current.scrollHeight,
            clientHeight: current.clientHeight,
            scrollTop: current.scrollTop,
            canScrollVertically,
            canScrollHorizontally,
          }
        }
      }

      current = current.parentElement
    }

    // Return root container as fallback
    return {
      element: document.documentElement,
      isRoot: true,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      scrollTop: document.documentElement.scrollTop,
      canScrollVertically: document.documentElement.scrollHeight > document.documentElement.clientHeight,
      canScrollHorizontally: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    }
  }, [])

  // Update scroll container information
  const updateScrollContainers = useCallback(() => {
    const containers = detectScrollContainers()
    setScrollContainers(containers)

    // Update active container if we have a reference element
    if (detectionRef.current) {
      const closest = findClosestScrollContainer(detectionRef.current)
      setActiveContainer(closest)
    }
  }, [detectScrollContainers, findClosestScrollContainer])

  // Handle scroll events on detected containers
  useEffect(() => {
    const handleScroll = (container: ScrollContainer) => {
      // Update scroll position
      const updatedContainer = {
        ...container,
        scrollTop: container.element.scrollTop,
      }

      setScrollContainers((prev) => prev.map((c) => (c.element === container.element ? updatedContainer : c)))

      if (activeContainer?.element === container.element) {
        setActiveContainer(updatedContainer)
      }
    }

    // Add scroll listeners to all containers
    scrollContainers.forEach((container) => {
      const element = container.element
      const scrollHandler = () => handleScroll(container)
      element.addEventListener("scroll", scrollHandler, { passive: true })
    })

    return () => {
      scrollContainers.forEach((container) => {
        const element = container.element
        element.removeEventListener("scroll", () => {})
      })
    }
  }, [scrollContainers, activeContainer])

  // Initial detection and setup
  useEffect(() => {
    updateScrollContainers()

    // Re-detect on DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(updateScrollContainers, 100)
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    })

    return () => observer.disconnect()
  }, [updateScrollContainers])

  return {
    detectionRef,
    scrollContainers,
    activeContainer,
    findClosestScrollContainer,
    updateScrollContainers,
  }
}
