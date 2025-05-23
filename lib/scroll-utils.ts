/**
 * Forces a container to be scrollable by adding minimum content
 * This is useful when you want to ensure a container has a scrollbar
 * even when its content doesn't overflow
 */
export function forceEnableScrolling(element: HTMLElement): void {
  // Check if the element already has a scrollbar
  const hasScrollbar = element.scrollHeight > element.clientHeight

  if (!hasScrollbar) {
    // Create a temporary invisible element to force scrolling
    const tempDiv = document.createElement("div")
    tempDiv.style.height = "1px"
    tempDiv.style.marginBottom = "1px"
    tempDiv.style.visibility = "hidden"
    tempDiv.setAttribute("data-force-scroll", "true")

    // Append to the element
    element.appendChild(tempDiv)

    // Clean up function to remove the element when no longer needed
    return () => {
      const forceScrollElements = element.querySelectorAll('[data-force-scroll="true"]')
      forceScrollElements.forEach((el) => el.remove())
    }
  }

  // Return empty cleanup if no action was taken
  return () => {}
}

/**
 * Prevents scroll events from propagating to parent elements
 */
export function isolateScrolling(element: HTMLElement): () => void {
  const handleWheel = (e: WheelEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = element

    // Check if scrolling up at the top or down at the bottom
    if ((scrollTop === 0 && e.deltaY < 0) || (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)) {
      e.preventDefault()
    }
  }

  element.addEventListener("wheel", handleWheel, { passive: false })

  // Return cleanup function
  return () => {
    element.removeEventListener("wheel", handleWheel)
  }
}

/**
 * Tracks scroll position and provides information about the scroll state
 */
export function useScrollTracking(element: HTMLElement | null): {
  position: number
  percentage: number
  isAtTop: boolean
  isAtBottom: boolean
  maxScroll: number
} {
  if (!element) {
    return {
      position: 0,
      percentage: 0,
      isAtTop: true,
      isAtBottom: false,
      maxScroll: 0,
    }
  }

  const scrollTop = element.scrollTop
  const scrollHeight = element.scrollHeight
  const clientHeight = element.clientHeight
  const maxScroll = scrollHeight - clientHeight

  return {
    position: scrollTop,
    percentage: maxScroll > 0 ? scrollTop / maxScroll : 0,
    isAtTop: scrollTop <= 0,
    isAtBottom: Math.abs(scrollTop + clientHeight - scrollHeight) < 1,
    maxScroll,
  }
}
