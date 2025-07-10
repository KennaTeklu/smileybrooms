"use client"

import type React from "react"
import { createContext, useState } from "react"
import type { ReactNode } from "react"
import { useAccessibility } from "../hooks/use-accessibility"

export type AccessibilityPreferences = {
  highContrast: boolean
  largeText: boolean
}

export interface AccessibilityContextValue {
  preferences: AccessibilityPreferences
  setPreferences: React.Dispatch<React.SetStateAction<AccessibilityPreferences>>
}

/**
 * Internal context object.  Only exported so the hook can consume it.
 */
export const AccessibilityContext = createContext<AccessibilityContextValue | null>(null)

/**
 * Provider mounted near the root of the tree (e.g. in `app/layout.tsx`).
 */
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    highContrast: false,
    largeText: false,
  })

  const value: AccessibilityContextValue = { preferences, setPreferences }

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

/**
 * Re-export the public hook so consumers can either
 * `import { useAccessibility } from '@/lib/accessibility-context'`
 * or from `'@/hooks/use-accessibility'` – both work.
 */
export { useAccessibility }
