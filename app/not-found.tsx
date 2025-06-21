"use client" // This page itself needs to be a client component to use `dynamic`

// 🛑 Prevent static prerendering – required because children may use
// useSearchParams or other client-only hooks.
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import dynamicImport from "next/dynamic"

// Dynamically import NotFoundContent with SSR disabled.
// This ensures that any client-side hooks (like useSearchParams)
// within NotFoundContent or its children are never executed
// during the server-side prerendering phase.
const DynamicNotFoundContent = dynamicImport(() => import("@/components/not-found-content"), {
  ssr: false,
  loading: () => <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">Loading&nbsp;404…</div>,
})

export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <DynamicNotFoundContent />
    </Suspense>
  )
}
