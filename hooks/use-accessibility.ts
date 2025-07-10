"use client"

import { useCallback } from "react"
import { _useAccessibilityContextInternal, DEFAULT_PREFERENCES } from "@/lib/accessibility-context"

/**
 * Public hook for reading / updating accessibility preferences
 * and for a handful of helpful DOM-utilities.
 */
export function useAccessibility() {
  /* ──────────────────  DOM helpers  ────────────────── */

  /** Announce a message for screen-reader users (client-only). */
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

  /** Focus the first element that matches the supplied selector. */
  const focusElement = useCallback((selector: string) => {
    if (typeof window === "undefined") return
    document.querySelector<HTMLElement>(selector)?.focus()
  }, [])

  /**
   * Trap keyboard focus inside the element matched by
   * `containerSelector`; returns a cleanup function.
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
        // Shift + Tab
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab forward
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    container.addEventListener("keydown", onKeyDown)
    return () => container.removeEventListener("keydown", onKeyDown)
  }, [])

  /* ─────────────  Context access with SSR fallback  ───────────── */

  const context = _useAccessibilityContextInternal()

  if (!context) {
    // During SSR or if provider is missing: expose safe stubs
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
