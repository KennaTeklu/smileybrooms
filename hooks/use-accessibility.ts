"use client"

import { useContext, useEffect } from "react"
import { AccessibilityContext } from "@/lib/accessibility-context"
import { useTheme } from "next-themes"

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  const { setTheme } = useTheme()

  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }

  const { preferences, updatePreference, announceToScreenReader } = context

  useEffect(() => {
    const body = document.body
    const html = document.documentElement

    // Apply high contrast
    if (preferences.highContrast) {
      body.classList.add("high-contrast")
    } else {
      body.classList.remove("high-contrast")
    }

    // Apply large text
    if (preferences.largeText) {
      body.classList.add("large-text")
    } else {
      body.classList.remove("large-text")
    }

    // Apply reduced motion
    if (preferences.reducedMotion) {
      body.classList.add("reduced-motion")
    } else {
      body.classList.remove("reduced-motion")
    }

    // Apply keyboard navigation focus indicator
    if (preferences.keyboardNavigation) {
      body.classList.add("keyboard-navigation-enabled")
    } else {
      body.classList.remove("keyboard-navigation-enabled")
    }

    // Apply font family
    body.style.fontFamily = preferences.fontFamily

    // Apply line height
    body.style.lineHeight = preferences.lineHeight.toString()

    // Apply letter spacing
    body.style.letterSpacing = `${preferences.letterSpacing}em`

    // Apply text alignment
    body.style.textAlign = preferences.textAlignment

    // Apply theme based on prefersDarkTheme/prefersLightTheme
    if (preferences.prefersDarkTheme) {
      setTheme("dark")
    } else if (preferences.prefersLightTheme) {
      setTheme("light")
    } else {
      // Fallback to system if neither is explicitly preferred
      setTheme("system")
    }

    // Apply custom color scheme
    body.classList.remove("color-scheme-green", "color-scheme-blue") // Remove previous
    if (preferences.colorScheme !== "default") {
      body.classList.add(`color-scheme-${preferences.colorScheme}`)
    }
  }, [preferences, setTheme])

  return context
}
