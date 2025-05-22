export function lockScroll() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "hidden"
    document.body.style.paddingRight = getScrollbarWidth() + "px"
  }
}

export function unlockScroll() {
  if (typeof window !== "undefined") {
    document.body.style.overflow = ""
    document.body.style.paddingRight = ""
  }
}

export function getScrollbarWidth(): number {
  if (typeof window === "undefined") return 0

  const outer = document.createElement("div")
  outer.style.visibility = "hidden"
  outer.style.overflow = "scroll"
  outer.style.msOverflowStyle = "scrollbar"
  document.body.appendChild(outer)

  const inner = document.createElement("div")
  outer.appendChild(inner)

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)

  return scrollbarWidth
}

export function smoothScrollTo(element: HTMLElement, offset = 0) {
  if (typeof window === "undefined") return

  const elementPosition = element.offsetTop
  const offsetPosition = elementPosition - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  })
}

export function isElementInViewport(element: HTMLElement): boolean {
  if (typeof window === "undefined") return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export function getScrollPosition(): { x: number; y: number } {
  if (typeof window === "undefined") return { x: 0, y: 0 }

  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  }
}

export function setScrollPosition(x: number, y: number) {
  if (typeof window === "undefined") return

  window.scrollTo(x, y)
}

export function detectAndFixScrollIssues(): {
  fixed: string[]
  issues: string[]
} {
  const fixed: string[] = []
  const issues: string[] = []

  if (typeof window === "undefined") {
    return { fixed, issues }
  }

  try {
    // Check if body scroll is locked
    const bodyStyle = window.getComputedStyle(document.body)
    if (bodyStyle.overflow === "hidden") {
      document.body.style.overflow = ""
      fixed.push("Unlocked body scroll")
    }

    // Check for iOS scroll issues
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS) {
      // Fix iOS momentum scrolling
      document.body.style.webkitOverflowScrolling = "touch"
      fixed.push("Applied iOS momentum scrolling fix")

      // Fix iOS scroll bounce
      document.addEventListener(
        "touchmove",
        (e) => {
          if (e.target === document.body) {
            e.preventDefault()
          }
        },
        { passive: false },
      )
      fixed.push("Applied iOS scroll bounce fix")
    }

    // Check for Android scroll issues
    const isAndroid = /Android/.test(navigator.userAgent)
    if (isAndroid) {
      // Fix Android scroll performance
      document.body.style.transform = "translateZ(0)"
      fixed.push("Applied Android scroll performance fix")
    }

    // Check for scrollable containers without proper overflow
    const scrollableElements = document.querySelectorAll("[data-scrollable]")
    scrollableElements.forEach((element) => {
      const style = window.getComputedStyle(element as HTMLElement)
      if (style.overflow === "visible") {
        ;(element as HTMLElement).style.overflow = "auto"
        fixed.push(`Fixed overflow for scrollable element: ${element.tagName}`)
      }
    })

    // Check for elements with scroll but no scrollbar
    const elementsWithScroll = document.querySelectorAll("*")
    elementsWithScroll.forEach((element) => {
      const el = element as HTMLElement
      if (el.scrollHeight > el.clientHeight && el.scrollWidth === el.clientWidth) {
        const style = window.getComputedStyle(el)
        if (style.overflowY === "hidden") {
          issues.push(`Element has scrollable content but hidden overflow: ${el.tagName}`)
        }
      }
    })

    // Fix common scroll restoration issues
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
      fixed.push("Set scroll restoration to manual")
    }

    // Check for conflicting scroll event listeners
    const scrollEvents = (window as any)._scrollEventListeners || []
    if (scrollEvents.length > 10) {
      issues.push(`High number of scroll event listeners detected: ${scrollEvents.length}`)
    }
  } catch (error) {
    issues.push(`Error during scroll issue detection: ${error}`)
  }

  return { fixed, issues }
}

export function debounceScroll(func: Function, wait = 16) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttleScroll(func: Function, limit = 16) {
  let inThrottle: boolean
  return function executedFunction(...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
