// Utility functions to ensure proper scrolling behavior

// 1. Enable body scroll
export function enableBodyScroll() {
  document.body.style.overflow = ""
  document.body.style.touchAction = ""
  document.body.style.position = ""
  document.body.style.top = ""
  document.body.style.width = ""
  document.body.style.height = ""
}

// 2. Prevent body scroll lock
export function preventBodyScrollLock() {
  // Store the current scroll position
  const scrollY = window.scrollY

  // When a modal/drawer opens, some libraries lock the body scroll
  // This function ensures we can restore it
  return function restoreScroll() {
    document.body.style.overflow = ""
    document.body.style.position = ""
    document.body.style.top = ""
    document.body.style.width = ""
    window.scrollTo(0, scrollY)
  }
}

// 3. Force enable scrolling on specific element
export function forceEnableScrolling(element: HTMLElement) {
  element.style.overflow = "auto"
  element.style.webkitOverflowScrolling = "touch"
  element.style.overscrollBehavior = "auto"
}

// 4. Reset iOS overscroll behavior
export function resetIOSOverscroll() {
  document.documentElement.style.overscrollBehavior = "auto"
  document.body.style.overscrollBehavior = "auto"

  // iOS specific fix
  document.documentElement.style.webkitOverflowScrolling = "touch"
  document.body.style.webkitOverflowScrolling = "touch"
}

// 5. Ensure scrollable areas have proper height
export function ensureScrollableHeight(element: HTMLElement) {
  // Ensure the element doesn't exceed viewport height
  const windowHeight = window.innerHeight
  const maxHeight = windowHeight - 100 // Leave some space for headers/footers
  element.style.maxHeight = `${maxHeight}px`
  element.style.overflow = "auto"
}

// 6. Fix for Android Chrome overscroll issues
export function fixAndroidOverscroll() {
  document.documentElement.style.overscrollBehavior = "none"
  document.body.style.overscrollBehavior = "none"

  // Re-enable on main content
  const mainContent = document.querySelector("main")
  if (mainContent) {
    ;(mainContent as HTMLElement).style.overscrollBehavior = "auto"
  }
}

// 7. Prevent scroll chaining between elements
export function preventScrollChaining(element: HTMLElement) {
  element.style.overscrollBehavior = "contain"
}

// 8. Ensure scrollable with keyboard navigation
export function ensureKeyboardScrollable(element: HTMLElement) {
  element.tabIndex = 0
  element.style.outline = "none"
  element.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      element.scrollTop += 30
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      element.scrollTop -= 30
      e.preventDefault()
    }
  })
}

// 9. Detect and fix scroll issues
export function detectAndFixScrollIssues() {
  // Check if body scroll is locked
  const computedStyle = window.getComputedStyle(document.body)
  if (computedStyle.overflow === "hidden" || computedStyle.position === "fixed") {
    enableBodyScroll()
  }
}

// 10. Maintain scroll position when drawer opens/closes
export function maintainScrollPosition() {
  const scrollY = window.scrollY
  return function restorePosition() {
    setTimeout(() => {
      window.scrollTo(0, scrollY)
    }, 50)
  }
}
