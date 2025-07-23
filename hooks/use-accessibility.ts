"use client"

import { useCallback } from "react"
import {
  accessibilityPreferenceKeys,
  type AccessibilityPreferenceKey,
} from "@/lib/accessibility-keys" /* helper with the union of keys */
import { useAccessibility as useAccessibilityContext } from "@/lib/accessibility-context"

/**
 * High-level accessibility hook used throughout the app.
 *
 * • Returns `preferences`, `updatePreference`, `resetPreferences`
 * • Exposes DOM-helpers (`announceToScreenReader`, `focusElement`, `trapFocus`)
 * • Falls back to a harmless stub when rendered outside the provider
 *   (e.g. during SSG) so prerendering never crashes.
 */
export function useAccessibility() {
  /* ╭───────────────────────────────────────────────────────────────╮
     │  DOM helper utilities                                         │
     ╰───────────────────────────────────────────────────────────────╯ */
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
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      }
    }
    container.addEventListener("keydown", onKeyDown)
    return () => container.removeEventListener("keydown", onKeyDown)
  }, [])

  /* ╭───────────────────────────────────────────────────────────────╮
     │  Context access & graceful fallback                           │
     ╰───────────────────────────────────────────────────────────────╯ */
  const ctx = useAccessibilityContext?.()

  /* ---------- Stub for SSR / outside-provider renders ------------ */
  if (!ctx) {
    const noop = () => {}
    return {
      /* expected API for panels */
      preferences: Object.fromEntries(accessibilityPreferenceKeys.map((k) => [k, false])) as Record<
        AccessibilityPreferenceKey,
        boolean
      >,
      updatePreference: noop,
      resetPreferences: noop,

      /* helpers */
      announceToScreenReader,
      focusElement,
      trapFocus,
    }
  }

  /* ---------- Build the preferences object from real context ---- */
  const preferences: Record<AccessibilityPreferenceKey, boolean> = {
    highContrast: ctx.highContrast,
    largeText: ctx.fontSize >= 125,
    reducedMotion: !ctx.animations,
    screenReader: ctx.screenReaderMode,
    voiceControl: ctx.voiceControl ?? false,
    keyboardOnly: ctx.keyboardNavigation,
    prefersDarkTheme: ctx.language === "dark",
    prefersLightTheme: ctx.language === "light",
  }

  /* Map preference-key → their respective setter in context */
  const setters: Partial<Record<AccessibilityPreferenceKey, (val: boolean) => void>> = {
    highContrast: ctx.toggleHighContrast,
    largeText: (val) => ctx.setFontSize(val ? 125 : 100),
    reducedMotion: (val) => ctx.toggleAnimations(!val),
    screenReader: ctx.toggleScreenReaderMode,
    voiceControl: ctx.toggleVoiceControl ?? (() => {}),
    keyboardOnly: ctx.toggleKeyboardNavigation,
    prefersDarkTheme: (val) => {
      if (val) {
        ctx.setLanguage("dark")
      }
    },
    prefersLightTheme: (val) => {
      if (val) {
        ctx.setLanguage("light")
      }
    },
  }

  const updatePreference = (key: AccessibilityPreferenceKey, value: boolean) => {
    const setter = setters[key]
    if (setter) setter(value)
  }

  return {
    /* panels rely on these three keys */
    preferences,
    updatePreference,
    resetPreferences: ctx.resetAccessibilitySettings,

    /* helpers */
    announceToScreenReader,
    focusElement,
    trapFocus,
  }
}

// Re-export the hook from the main context file from "@/lib/accessibility-context"
