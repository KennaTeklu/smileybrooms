"use client"

import { useCallback } from "react"
import { _useAccessibilityContextInternal, DEFAULT_PREFERENCES } from "@/lib/accessibility-context"

/**
 * Public hook for accessing accessibility preferences and DOM helpers.
 */
export function useAccessibility() {
  /* ───────────────────────── DOM helpers ───────────────────────── */

  /** Announces a message for screen-reader users (client-only). */
  const announceToScreenReader = useCallback((message: string, polite = true) => {
    if (typeof window === "undefined") return
    const el = document.createElement("div")
    el.setAttribute("role", "status")
    el.setAttribute("aria-live", polite ? "polite" : "assertive")
    el.className = "sr-only"
    el.textContent = message
    document.body.appendChild(el)
    setTimeout(() => document.body.removeChild(el), 700)
  }, [])

  /** Programmatically focuses the first element that matches `selector`. */
  const focusElement = useCallback((selector: string) => {
    if (typeof window === "undefined") return
    document.querySelector<HTMLElement>(selector)?.focus()
  }, [])

  /**
   * Traps keyboard focus inside the element matched by `containerSelector`.
   * Returns a cleanup function.
   */
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
        // Shift+Tab
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

  /* ─────────────────────── Context fallback ────────────────────── */

  const context = _useAccessibilityContextInternal()

  if (!context) {
    const noop = () => {}
    return {
      preferences: DEFAULT_PREFERENCES,
      updatePreference: noop,
      resetPreferences: noop,
      announceToScreenReader,
      focusElement,
      trapFocus,
    }
  }

  return {
    ...context,
    announceToScreenReader,
    focusElement,
    trapFocus,
  }
}
