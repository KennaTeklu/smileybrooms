"use client" // Keep this here as a best practice for the page itself

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import NotFoundContent with SSR disabled.
// This ensures that any client-side hooks (like useSearchParams,
// even if implicitly used by Next.js's internal 404 handling)
// within NotFoundContent or its children are never executed
// during the server-side prerendering phase.
const DynamicNotFoundContent = dynamic(() => import("@/components/not-found-content"), {
  ssr: false,
  loading: () => <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">Loading 404...</div>,
})

export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <DynamicNotFoundContent />
    </Suspense>
  )
}
