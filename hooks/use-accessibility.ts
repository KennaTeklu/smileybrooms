"use client"

import { useCallback } from "react"
import { useAccessibility as useAccessibilityContext } from "@/lib/accessibility-context"

/**
 * Public hook consumed by any component that needs:
 *  – global accessibility settings/state
 *  – convenience helpers for announcing text, focusing elements, or trapping focus
 *
 * The hook is safe to call during SSR/ISR because it falls back to a
 * no-op stub when the real context is not yet available.
 */
export function useAccessibility() {
  /* ------------------------------------------------------------------ */
  /* DOM-utility helpers                                                 */
  /* ------------------------------------------------------------------ */

  /** Announce a message for screen-reader users (client-only). */
  const announceToScreenReader = useCallback((message: string, polite = true) => {
    if (typeof window === "undefined") return

    const node = document.createElement("div")
    node.setAttribute("aria-live", polite ? "polite" : "assertive")
    node.setAttribute("aria-atomic", "true")
    node.className = "sr-only"
    node.textContent = message
    document.body.appendChild(node)

    setTimeout(() => {
      document.body.removeChild(node)
    }, 700)
  }, [])

  /** Programmatically focus the first element that matches `selector`. */
  const focusElement = useCallback((selector: string) => {
    if (typeof window === "undefined") return
    document.querySelector<HTMLElement>(selector)?.focus()
  }, [])

  /**
   * Trap keyboard focus inside the element matched by `containerSelector`.
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

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      }
    }

    container.addEventListener("keydown", handleTab)
    return () => container.removeEventListener("keydown", handleTab)
  }, [])

  /* ------------------------------------------------------------------ */
  /* Context-derived accessibility state & setters                       */
  /* ------------------------------------------------------------------ */

  const ctx = useAccessibilityContext?.()

  /* If the hook is invoked during prerendering (no provider yet),
     expose a harmless stub so the tree can render on the server.       */
  if (!ctx) {
    const noop = () => {}

    return {
      /* visual toggles */
      highContrast: false,
      toggleHighContrast: noop,
      grayscale: false,
      toggleGrayscale: noop,
      invertColors: false,
      toggleInvertColors: noop,
      animations: true,
      toggleAnimations: noop,
      screenReaderMode: false,
      toggleScreenReaderMode: noop,
      linkHighlight: false,
      toggleLinkHighlight: noop,
      keyboardNavigation: false,
      toggleKeyboardNavigation: noop,

      /* typography */
      fontSize: 100,
      setFontSize: noop,
      lineHeight: 1.5,
      setLineHeight: noop,
      letterSpacing: 0,
      setLetterSpacing: noop,
      textAlignment: "left" as const,
      setTextAlignment: noop,
      fontFamily: "sans" as const,
      setFontFamily: noop,

      /* language */
      language: "en" as const,
      setLanguage: noop,

      /* reset */
      resetAccessibilitySettings: noop,

      /* helpers */
      announceToScreenReader,
      focusElement,
      trapFocus,
    }
  }

  /* Normal (client) case: merge helpers with real context data */
  return {
    ...ctx,
    announceToScreenReader,
    focusElement,
    trapFocus,
  }
}
