"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react" // Import Suspense
import { AccessibilityProvider } from "@/lib/accessibility-context"
import AccessibilityClientPage from "./page.client"

// A simple loading component to show as a fallback
function AccessibilityPanelLoading() {
  return (
    <div className="flex items-center justify-center p-4 text-muted-foreground">Loading accessibility panel...</div>
  )
}

// Lazy-load the client bundle (disabled during SSR)
const AccessibilityPageClient = dynamic(() => import("./page.client"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 text-muted-foreground">Loading accessibility page…</div>
  ),
})

export default function AccessibilityPage() {
  return (
    /* `Suspense` here is just for the dynamic fallback */
    <Suspense fallback={null}>
      <AccessibilityProvider>
        {/* Wrap the entire page content in Suspense */}
        <Suspense fallback={<AccessibilityPanelLoading />}>
          <AccessibilityClientPage />
        </Suspense>
      </AccessibilityProvider>
    </Suspense>
  )
}
