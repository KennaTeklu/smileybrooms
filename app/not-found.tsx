"use client"

import NotFoundContent from "@/components/not-found-content"
import { Suspense } from "react"

/**
 * Custom 404 page rendered when a route is not found.
 * Marked as a client component because it uses React hooks
 * internally (via NotFoundContent) and may rely on
 * `useSearchParams` under the hood.
 */
export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundContent />
    </Suspense>
  )
}
