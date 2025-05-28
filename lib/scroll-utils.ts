/**
 * Forces an element to be scrollable by adding minimum content
 * This is useful for elements that need to be scrollable but don't have enough content
 *
 * @param element The element to make scrollable
 * @returns A cleanup function to remove the added content
 */
export function forceEnableScrolling(element: HTMLElement): () => void {
  // Create a hidden div that's taller than the container
  const spacer = document.createElement("div")
  spacer.style.height = "1px"
  spacer.style.marginBottom = "100vh" // Add extra space to ensure scrollability
  spacer.style.opacity = "0"
  spacer.style.pointerEvents = "none"
  spacer.setAttribute("aria-hidden", "true")
  spacer.dataset.scrollSpacer = "true"

  // Add the spacer to the element
  element.appendChild(spacer)

  // Return a cleanup function
  return () => {
    if (element.contains(spacer)) {
      element.removeChild(spacer)
    }
  }
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
