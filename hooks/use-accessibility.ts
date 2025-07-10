"use client"

import { useCallback, useContext } from "react"
import { AccessibilityContext } from "@/lib/accessibility-context"

/**
 * Public hook for accessing accessibility preferences and utilities.
 *
 * It provides:
 * - `preferences`: An object containing all current accessibility settings.
 * - `updatePreference`: A function to update a specific preference.
 * - `resetPreferences`: A function to reset all preferences to default.
 * - DOM utility helpers: `announceToScreenReader`, `focusElement`, `trapFocus`.
 *
 * This hook must be used inside an `<AccessibilityProvider>` tree.
 */
export function useAccessibility() {
  const ctx = useContext(AccessibilityContext)

  const announceToScreenReader = useCallback((message: string, polite = true) => {
    if (typeof window === "undefined") return
    const el = document.createElement("div")
    el.setAttribute("role", "status")
    el.setAttribute("aria-live", polite ? "polite" : "assertive")
    el.className = "sr-only" // Hidden visually, but accessible to screen readers
    el.textContent = message
    document.body.appendChild(el)
    setTimeout(() => document.body.removeChild(el), 700)
  }, [])

  const focusElement = useCallback((selector: string) => {
    if (typeof window === "undefined") return
    document.querySelector<HTMLElement>(selector)?.focus()
  }, [])

  const trapFocus = useCallback((containerSelector: string) => {
    if (typeof window === "undefined") return () => {}

    const container = document.querySelector<HTMLElement>(containerSelector)
    if (!container) return () => {}

    const focusable = container.querySelectorAll<HTMLElement>(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    container.addEventListener("keydown", onKeyDown)
    return () => container.removeEventListener("keydown", onKeyDown)
  }, [])

  if (!ctx) {
    // Return a stub for SSR compatibility
    return {
      preferences: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false,
        keyboardNavigation: false,
      },
      updatePreference: () => {},
      resetPreferences: () => {},
      announceToScreenReader,
      focusElement,
      trapFocus,
    }
  }

  // If context is available, return the real values with DOM utilities
  return {
    ...ctx,
    announceToScreenReader,
    focusElement,
    trapFocus,
  }
}

export type AccessibilityPreferences = {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
}
