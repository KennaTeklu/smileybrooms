"use client" // This page itself needs to be a client component to use `dynamic`

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import NotFoundContent with SSR disabled.
// This ensures that any client-side hooks (like useSearchParams)
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
