/**
 * Utility functions for managing scroll behavior
 */

// 1. Enable body scroll
export function enableBodyScroll() {
  document.body.style.overflow = "auto"
  document.body.style.position = "relative"
  document.body.style.height = "auto"
  document.body.style.width = "auto"
  document.documentElement.style.overflow = "auto"
}

// 2. Prevent body scroll lock
export function preventBodyScrollLock() {
  const scrollY = window.scrollY

  // Store the current scroll position
  document.body.style.top = `-${scrollY}px`

  // Function to restore scroll position
  return () => {
    document.body.style.top = ""
    window.scrollTo(0, scrollY)
  }
}

// 3. Force enable scrolling on an element
export function forceEnableScrolling(element: HTMLElement) {
  element.style.overflow = "auto"
  element.style.WebkitOverflowScrolling = "touch"
  element.style.overscrollBehavior = "contain"
}

// 4. Reset iOS overscroll behavior
export function resetIOSOverscroll() {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.documentElement.style.WebkitOverflowScrolling = "touch"
  }
}

// 5. Ensure scrollable height
export function ensureScrollableHeight(element: HTMLElement) {
  // Make sure the element has a proper height for scrolling
  if (element.scrollHeight <= element.clientHeight) {
    element.style.minHeight = "100%"
  }
}

// 6. Fix Android overscroll
export function fixAndroidOverscroll() {
  if (/Android/.test(navigator.userAgent)) {
    document.documentElement.style.overscrollBehavior = "none"
    document.body.style.overscrollBehavior = "none"

    // Restore after a short delay
    setTimeout(() => {
      document.documentElement.style.overscrollBehavior = "auto"
      document.body.style.overscrollBehavior = "auto"
    }, 300)
  }
}

// 7. Prevent scroll chaining
export function preventScrollChaining(element: HTMLElement) {
  element.addEventListener(
    "touchmove",
    (e) => {
      // Check if the element is at the top or bottom
      if (
        (element.scrollTop === 0 && e.touches[0].clientY > 0) ||
        (element.scrollHeight - element.scrollTop === element.clientHeight && e.touches[0].clientY < 0)
      ) {
        e.preventDefault()
      }
    },
    { passive: false },
  )
}

// 8. Ensure keyboard scrollable
export function ensureKeyboardScrollable(element: HTMLElement) {
  element.tabIndex = 0
  element.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      element.scrollTop += 40
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      element.scrollTop -= 40
      e.preventDefault()
    }
  })
}

// 9. Maintain scroll position
export function maintainScrollPosition() {
  const scrollY = window.scrollY

  // Return a function to restore the scroll position
  return () => {
    window.scrollTo(0, scrollY)
  }
}

// 10. Ensure all drawers are scrollable
export function ensureAllDrawersScrollable() {
  const drawers = document.querySelectorAll(".scrollable-container")
  drawers.forEach((drawer) => {
    if (drawer instanceof HTMLElement) {
      forceEnableScrolling(drawer)
      ensureScrollableHeight(drawer)
      preventScrollChaining(drawer)
    }
  })
}

// 11. Fix scroll on all rooms
export function fixScrollOnAllRooms() {
  // Apply scroll fixes to all room drawers
  document.querySelectorAll("[data-room-drawer]").forEach((drawer) => {
    if (drawer instanceof HTMLElement) {
      forceEnableScrolling(drawer)
      ensureScrollableHeight(drawer)
      preventScrollChaining(drawer)
    }
  })
}

// 12. Ensure main content scrolls
export function ensureMainContentScrolls() {
  const main = document.querySelector("main")
  if (main instanceof HTMLElement) {
    forceEnableScrolling(main)
  }
}

// 13. Fix scroll on iOS
export function fixScrollOnIOS() {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.documentElement.style.height = "100%"
    document.body.style.height = "100%"
    document.documentElement.style.WebkitOverflowScrolling = "touch"
    document.body.style.WebkitOverflowScrolling = "touch"
  }
}

// 14. Fix scroll on Android
export function fixScrollOnAndroid() {
  if (/Android/.test(navigator.userAgent)) {
    document.documentElement.style.height = "100%"
    document.body.style.height = "100%"
    document.documentElement.style.overscrollBehavior = "none"
    document.body.style.overscrollBehavior = "none"
  }
}

// 15. Ensure scroll works on all browsers
export function ensureScrollWorksOnAllBrowsers() {
  // Apply fixes for different browsers
  fixScrollOnIOS()
  fixScrollOnAndroid()

  // General fixes
  document.documentElement.style.overflow = "auto"
  document.body.style.overflow = "auto"
  document.documentElement.style.height = "auto"
  document.body.style.height = "auto"
}

// 16. Periodic scroll check
export function startPeriodicScrollCheck() {
  // Check every second if scrolling is disabled and re-enable it
  const interval = setInterval(() => {
    if (document.body.style.overflow === "hidden") {
      enableBodyScroll()
    }
  }, 1000)

  // Return a function to stop the interval
  return () => clearInterval(interval)
}

// 17. Fix scroll on window resize
export function fixScrollOnWindowResize() {
  window.addEventListener("resize", () => {
    enableBodyScroll()
    ensureAllDrawersScrollable()
    fixScrollOnAllRooms()
  })
}

// 18. Fix scroll on orientation change
export function fixScrollOnOrientationChange() {
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      enableBodyScroll()
      ensureAllDrawersScrollable()
      fixScrollOnAllRooms()
    }, 300)
  })
}

// 19. Fix scroll on page load
export function fixScrollOnPageLoad() {
  window.addEventListener("load", () => {
    enableBodyScroll()
    ensureAllDrawersScrollable()
    fixScrollOnAllRooms()
    ensureScrollWorksOnAllBrowsers()
  })
}

// 20. Apply all scroll fixes
export function applyAllScrollFixes() {
  enableBodyScroll()
  ensureAllDrawersScrollable()
  fixScrollOnAllRooms()
  ensureScrollWorksOnAllBrowsers()
  fixScrollOnWindowResize()
  fixScrollOnOrientationChange()
  fixScrollOnPageLoad()
  startPeriodicScrollCheck()
}

// Add the missing detectAndFixScrollIssues function
export function detectAndFixScrollIssues() {
  // Check if body scroll is locked
  const isBodyScrollLocked =
    document.body.style.overflow === "hidden" || document.documentElement.style.overflow === "hidden"

  // Check for iOS specific issues
  const hasIOSIssues =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && document.documentElement.style.WebkitOverflowScrolling !== "touch"

  // Check for Android specific issues
  const hasAndroidIssues =
    /Android/.test(navigator.userAgent) && document.documentElement.style.overscrollBehavior !== "none"

  // Apply fixes based on detected issues
  if (isBodyScrollLocked) {
    enableBodyScroll()
  }

  if (hasIOSIssues) {
    fixScrollOnIOS()
  }

  if (hasAndroidIssues) {
    fixScrollOnAndroid()
  }

  // Check for drawer scroll issues
  const drawers = document.querySelectorAll(".scrollable-container, [data-room-drawer]")
  drawers.forEach((drawer) => {
    if (drawer instanceof HTMLElement) {
      const hasScrollIssue = drawer.style.overflow !== "auto" || drawer.scrollHeight <= drawer.clientHeight

      if (hasScrollIssue) {
        forceEnableScrolling(drawer)
        ensureScrollableHeight(drawer)
        preventScrollChaining(drawer)
      }
    }
  })

  // Return a summary of fixed issues
  return {
    fixedBodyScroll: isBodyScrollLocked,
    fixedIOSIssues: hasIOSIssues,
    fixedAndroidIssues: hasAndroidIssues,
    fixedDrawers: drawers.length,
  }
}
