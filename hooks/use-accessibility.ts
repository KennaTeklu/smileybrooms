"use client"

import { useContext } from "react"
import { AccessibilityContext } from "@/lib/accessibility-context"

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
