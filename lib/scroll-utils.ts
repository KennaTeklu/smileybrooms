/**
 * Utility functions for enhanced scrolling behavior
 */

// Smooth scroll to element with customizable options
export function smoothScrollTo(
  element: HTMLElement | null,
  options: {
    offset?: number
    duration?: number
    container?: HTMLElement | null
    onComplete?: () => void
  } = {},
) {
  if (!element) return

  const { offset = 0, duration = 500, container = null, onComplete = () => {} } = options

  const targetPosition = container ? element.offsetTop - container.offsetTop + offset : element.offsetTop + offset

  const startPosition = container ? container.scrollTop : window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  // Easing function for smooth animation
  const easeInOutQuad = (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const easedProgress = easeInOutQuad(progress)

    if (container) {
      container.scrollTop = startPosition + distance * easedProgress
    } else {
      window.scrollTo(0, startPosition + distance * easedProgress)
    }

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll)
    } else {
      onComplete()
    }
  }

  requestAnimationFrame(animateScroll)
}

// Check if an element is fully visible within a container
export function isElementFullyVisible(element: HTMLElement, container: HTMLElement | Window = window): boolean {
  const elementRect = element.getBoundingClientRect()

  let containerRect: DOMRect
  if (container === window) {
    containerRect = {
      top: 0,
      left: 0,
      bottom: window.innerHeight,
      right: window.innerWidth,
      height: window.innerHeight,
      width: window.innerWidth,
      x: 0,
      y: 0,
      toJSON: () => {},
    }
  } else {
    containerRect = (container as HTMLElement).getBoundingClientRect()
  }

  return (
    elementRect.top >= containerRect.top &&
    elementRect.left >= containerRect.left &&
    elementRect.bottom <= containerRect.bottom &&
    elementRect.right <= containerRect.right
  )
}

// Get percentage of element visibility within container
export function getElementVisibilityPercentage(element: HTMLElement, container: HTMLElement | Window = window): number {
  const elementRect = element.getBoundingClientRect()

  let containerRect: DOMRect
  if (container === window) {
    containerRect = {
      top: 0,
      left: 0,
      bottom: window.innerHeight,
      right: window.innerWidth,
      height: window.innerHeight,
      width: window.innerWidth,
      x: 0,
      y: 0,
      toJSON: () => {},
    }
  } else {
    containerRect = (container as HTMLElement).getBoundingClientRect()
  }

  // Calculate the intersection rectangle
  const intersectionRect = {
    top: Math.max(elementRect.top, containerRect.top),
    bottom: Math.min(elementRect.bottom, containerRect.bottom),
    left: Math.max(elementRect.left, containerRect.left),
    right: Math.min(elementRect.right, containerRect.right),
  }

  // Check if there is an intersection
  if (intersectionRect.top < intersectionRect.bottom && intersectionRect.left < intersectionRect.right) {
    // Calculate the area of the intersection
    const intersectionArea =
      (intersectionRect.bottom - intersectionRect.top) * (intersectionRect.right - intersectionRect.left)

    // Calculate the area of the element
    const elementArea = elementRect.width * elementRect.height

    // Return the percentage of the element that is visible
    return (intersectionArea / elementArea) * 100
  }

  // No intersection, element is not visible
  return 0
}

// Debounce function to limit how often a function is called
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle function to limit the rate at which a function is executed
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
