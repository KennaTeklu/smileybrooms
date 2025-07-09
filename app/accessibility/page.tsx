"use client"
export const dynamic = "force-dynamic"

import { EnhancedAccessibilityPanel } from "@/components/enhanced-accessibility-panel"

// A simple loading component to show as a fallback
function AccessibilityPanelLoading() {
  return (
    <div className="flex items-center justify-center p-4 text-muted-foreground">Loading accessibility panel...</div>
  )
}

export default function AccessibilityPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Accessibility Settings</h1>
      <p className="text-lg text-center mb-8">
        Adjust your accessibility preferences for a better browsing experience.
      </p>
      <EnhancedAccessibilityPanel />
    </div>
  )
}
