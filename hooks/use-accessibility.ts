"use client"

import { useCallback } from "react"
import { useAccessibility as useAccessibilityContext } from "@/lib/accessibility-context"

/**
 * Combines the low-level DOM-utility helpers (announce, focus, trapFocus)
 * with the rich accessibility state & setters exposed by
 * `lib/accessibility-context.tsx`.
 *
 * Any component that needs **either** set of helpers can simply import
 * `useAccessibility` from `@/hooks/use-accessibility`.
 */
export function useAccessibility() {
  /* ------------------------------------------------------------------
   * DOM-utility helpers
   * ------------------------------------------------------------------ */
  const announceToScreenReader = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (typeof window === "undefined") return

    const node = document.createElement("div")
    node.setAttribute("aria-live", priority)
    node.setAttribute("aria-atomic", "true")
    node.className = "sr-only"
    node.textContent = message

    document.body.appendChild(node)

    // Remove the node after it has had a chance to be announced
    setTimeout(() => {
      document.body.removeChild(node)
    }, 1000)
  }, [])

  const focusElement = useCallback((selector: string) => {
    if (typeof window === "undefined") return
    const el = document.querySelector<HTMLElement>(selector)
    el?.focus()
  }, [])

  const trapFocus = useCallback((containerSelector: string) => {
    if (typeof window === "undefined") return

    const container = document.querySelector<HTMLElement>(containerSelector)
    if (!container) return

    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === last) {
          first.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener("keydown", handleTab)
    return () => container.removeEventListener("keydown", handleTab)
  }, [])

  /* ------------------------------------------------------------------
   * Context-derived accessibility state & setters
   * ------------------------------------------------------------------ */
  const ctx = useAccessibilityContext()

  return {
    // Context fields
    ...ctx,

    // Utility helpers
    announceToScreenReader,
    focusElement,
    trapFocus,
  }
}
