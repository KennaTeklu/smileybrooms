"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Something went wrong</h1>
        <p className="text-gray-600 dark:text-gray-400">
          We apologize for the inconvenience. Our team has been notified of this issue.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button variant="outline" onClick={() => reset()} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Try Again
          </Button>

          <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Go Back
          </Button>

          <Button asChild className="flex items-center gap-2">
            <Link href="/">
              <Home size={16} />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
