/**
 * Utility functions for scroll management
 */

// Force a container to be scrollable even if content doesn't overflow
export function forceEnableScrolling(element: HTMLElement): void {
  // Add a small invisible element to force scrolling
  const forceScrollEl = document.createElement("div")
  forceScrollEl.style.height = "1px"
  forceScrollEl.style.marginBottom = "1px"
  forceScrollEl.style.visibility = "hidden"
  element.appendChild(forceScrollEl)
}

// Prevent scroll events from propagating to parent elements
export function isolateScrolling(element: HTMLElement): () => void {
  const handleWheel = (e: WheelEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = element

    // Check if scrolling up and already at the top
    if (e.deltaY < 0 && scrollTop <= 0) {
      return // Allow browser to handle
    }

    // Check if scrolling down and already at the bottom
    if (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight) {
      return // Allow browser to handle
    }

    // Otherwise prevent default and handle scroll ourselves
    e.preventDefault()
    element.scrollTop += e.deltaY
  }

  element.addEventListener("wheel", handleWheel, { passive: false })

  // Return cleanup function
  return () => {
    element.removeEventListener("wheel", handleWheel)
  }
}

// Calculate scroll percentage
export function getScrollPercentage(element: HTMLElement): number {
  const { scrollTop, scrollHeight, clientHeight } = element
  if (scrollHeight <= clientHeight) return 100
  return (scrollTop / (scrollHeight - clientHeight)) * 100
}
