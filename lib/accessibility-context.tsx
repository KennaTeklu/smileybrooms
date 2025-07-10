"use client"

import type React from "react"
import { createContext, useState, useEffect, useCallback } from "react"

// Define the full set of accessibility preferences
export interface AccessibilityPreferences {
  prefersDarkTheme: boolean // Replaces highContrast for theme toggle
  prefersLightTheme: boolean // Explicitly track light theme preference
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  keyboardNavigation: boolean
  fontFamily: string
  language: string
  lineHeight: number
  letterSpacing: number
  textAlignment: "left" | "center" | "right"
}

interface AccessibilityContextType {
  preferences: AccessibilityPreferences
  updatePreference: (key: keyof AccessibilityPreferences, value: any) => void
  resetPreferences: () => void
  // DOM utility helpers (these are implemented in useAccessibility hook, but types are here for completeness)
  announceToScreenReader: (message: string, polite?: boolean) => void
  focusElement: (selector: string) => void
  trapFocus: (containerSelector: string) => () => void
}

const defaultPreferences: AccessibilityPreferences = {
  prefersDarkTheme: false,
  prefersLightTheme: true, // Default to light theme
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  keyboardNavigation: false,
  fontFamily: "Inter, sans-serif",
  language: "en",
  lineHeight: 1.5,
  letterSpacing: 0,
  textAlignment: "left",
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(defaultPreferences)

  // Load preferences from local storage on mount
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem("accessibilityPreferences")
      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences) as AccessibilityPreferences
        // Merge with defaults to ensure new preferences are added if not in storage
        setPreferences((prev) => ({ ...prev, ...parsedPreferences }))
      }
    } catch (error) {
      console.error("Failed to load accessibility preferences from local storage:", error)
    }
  }, [])

  // Save preferences to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("accessibilityPreferences", JSON.stringify(preferences))
    } catch (error) {
      console.error("Failed to save accessibility preferences to local storage:", error)
    }
  }, [preferences])

  // Apply preferences to the DOM
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Theme
      if (preferences.prefersDarkTheme) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }

      // High Contrast
      if (preferences.highContrast) {
        document.body.classList.add("high-contrast")
      } else {
        document.body.classList.remove("high-contrast")
      }

      // Large Text
      if (preferences.largeText) {
        document.body.classList.add("large-text")
      } else {
        document.body.classList.remove("large-text")
      }

      // Reduced Motion
      if (preferences.reducedMotion) {
        document.body.classList.add("motion-reduced")
      } else {
        document.body.classList.remove("motion-reduced")
      }

      // Keyboard Navigation (for focus indicators etc.)
      if (preferences.keyboardNavigation) {
        document.body.classList.add("keyboard-navigation")
      } else {
        document.body.classList.remove("keyboard-navigation")
      }

      // Font Family
      document.documentElement.style.setProperty("--accessibility-font-family", preferences.fontFamily)

      // Line Height
      document.documentElement.style.setProperty("--accessibility-line-height", preferences.lineHeight.toString())

      // Letter Spacing
      document.documentElement.style.setProperty("--accessibility-letter-spacing", `${preferences.letterSpacing}em`)

      // Text Alignment
      document.documentElement.style.setProperty("--accessibility-text-align", preferences.textAlignment)
    }
  }, [preferences])

  const updatePreference = useCallback((key: keyof AccessibilityPreferences, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences)
  }, [])

  /* ╭───────────────────────────────────────────────────────────────╮
     │  DOM helper utilities (copied from useAccessibility hook)     │
     ╰───────────────────────────────────────────────────────────────╯ */

  /** Announces a message for screen-reader users (client-only). */
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

  /** Programmatically focuses the first element that matches `selector`. */
  const focusElement = useCallback((selector: string) => {
    if (typeof window === "undefined") return
    document.querySelector<HTMLElement>(selector)?.focus()
  }, [])

  /**
   * Traps keyboard focus inside the element matched by `containerSelector`.
   * Returns a cleanup function to remove the event listener.
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

  return (
    <AccessibilityContext.Provider
      value={{ preferences, updatePreference, resetPreferences, announceToScreenReader, focusElement, trapFocus }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}
