"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

/*  Dynamically import the component that relies on
    client-only hooks (e.g. useSearchParams).  By setting
    ssr:false we ensure it’s never executed during the
    build or on the Node runtime, eliminating the
    “useSearchParams() should be wrapped in a suspense
    boundary” error. */
const NotFoundContent = dynamic(() => import("@/components/not-found-content"), { ssr: false })

export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundContent />
    </Suspense>
  )
}
