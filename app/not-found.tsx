"use client"

import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"

// Separate client component that uses navigation hooks
function NotFoundContent() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => router.push("/")} className="px-6 py-2">
          Go Home
        </Button>
        <Button onClick={() => router.back()} variant="outline" className="px-6 py-2">
          Go Back
        </Button>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  )
}
