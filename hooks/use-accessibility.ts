"use client"

import { useContext } from "react"
import { AccessibilityContext } from "@/lib/accessibility-context" // Import type

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
  if (!ctx) {
    throw new Error("useAccessibility must be used within <AccessibilityProvider>.")
  }

  // DOM helper utilities are now provided directly by the context
  const { preferences, updatePreference, resetPreferences, announceToScreenReader, focusElement, trapFocus } = ctx

  // If context is available, return the real values with DOM utilities
  return {
    preferences,
    updatePreference,
    resetPreferences,
    announceToScreenReader,
    focusElement,
    trapFocus,
  }
}
