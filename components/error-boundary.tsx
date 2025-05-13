"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { trackError } from "@/lib/analytics"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Caught in error boundary:", error)
      setError(error.error)
      setHasError(true)

      // Track the error
      trackError(error.error.name || "UnknownError", error.error.message, error.error.stack)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-6 text-gray-600 max-w-md">
          We apologize for the inconvenience. Our team has been notified of this issue.
        </p>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              setHasError(false)
              setError(null)
            }}
          >
            Try again
          </Button>
          <Button onClick={() => window.location.reload()}>Refresh page</Button>
        </div>
        {process.env.NODE_ENV === "development" && error && (
          <div className="mt-6 p-4 bg-red-50 text-red-900 rounded-md text-left overflow-auto max-w-full">
            <p className="font-mono text-sm">{error.message}</p>
            <pre className="mt-2 text-xs overflow-x-auto">{error.stack}</pre>
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}

export default ErrorBoundary
