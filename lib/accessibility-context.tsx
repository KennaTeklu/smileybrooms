"use client"

import * as React from "react"
import type { AccessibilityPreferences } from "@/hooks/use-accessibility"
import { useLocalStorage } from "@/hooks/use-local-storage" // already present in the repo

/* ---------- Context value ---------- */
type AccessibilityContextValue = {
  preferences: AccessibilityPreferences
  setPreferences: (prefs: AccessibilityPreferences) => void
}

/* ---------- Defaults ---------- */
const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
}

/* ---------- Context & Provider ---------- */
export const AccessibilityContext = React.createContext<AccessibilityContextValue>({
  preferences: defaultPreferences,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPreferences: () => {},
})

export function AccessibilityProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [preferences, setPreferences] = useLocalStorage<AccessibilityPreferences>(
    "sb-accessibility-preferences",
    defaultPreferences,
  )

  const value = React.useMemo(() => ({ preferences, setPreferences }), [preferences])

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

/* ---------- Re-export hook for backwards compatibility ---------- */
export { useAccessibility } from "@/hooks/use-accessibility"
