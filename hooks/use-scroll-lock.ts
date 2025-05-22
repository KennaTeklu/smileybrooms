"use client"

import { useEffect, useRef } from "react"

// 11. Custom hook to prevent scroll lock
export function usePreventScrollLock(isLocked: boolean) {
  const scrollPosition = useRef(0)

  useEffect(() => {
    // Save current scroll position
    if (isLocked) {
      scrollPosition.current = window.scrollY
      document.body.dataset.scrollLock = "true"
    } else {
      document.body.dataset.scrollLock = "false"
      // Restore scroll position
      setTimeout(() => {
        window.scrollTo(0, scrollPosition.current)
      }, 50)
    }

    return () => {
      document.body.dataset.scrollLock = "false"
    }
  }, [isLocked])
}

// 12. Hook to ensure main content scrolls
export function useEnsureMainContentScrolls() {
  useEffect(() => {
    const mainContent = document.querySelector("main") || document.body

    const observer = new MutationObserver(() => {
      // Check if body scroll is locked
      const computedStyle = window.getComputedStyle(document.body)
      if (computedStyle.overflow === "hidden") {
        ;(mainContent as HTMLElement).style.overflow = "auto"
        ;(mainContent as HTMLElement).style.height = "100%"
      }
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    })

    return () => observer.disconnect()
  }, [])
}
