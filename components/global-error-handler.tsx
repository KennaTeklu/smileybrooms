"use client"

import { useEffect } from "react"

// Mock function to simulate logging global errors to an external service
const logGlobalErrorToService = (
  error: Error | PromiseRejectionEvent | Event,
  type: "unhandled_error" | "unhandled_rejection",
) => {
  const errorDetails: any = {
    type,
    timestamp: new Date().toISOString(),
  }

  if (error instanceof Error) {
    errorDetails.message = error.message
    errorDetails.stack = error.stack
  } else if (error instanceof PromiseRejectionEvent) {
    errorDetails.reason = error.reason
    errorDetails.message = `Unhandled Promise Rejection: ${error.reason}`
  } else if (error instanceof Event) {
    errorDetails.message = `Unhandled Event Error: ${error.type}`
    // For generic events, you might need to dig into event.error or event.message
  }

  console.error("🚨 Global Error reported to service:", errorDetails)
  // In a real application, you would send this data to Sentry, Datadog, Bugsnag, etc.
  // Example: Sentry.captureException(error, { tags: { type } });
}

export function GlobalErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logGlobalErrorToService(event.error || new Error(event.message), "unhandled_error")
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      logGlobalErrorToService(event, "unhandled_rejection")
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  return null // This component doesn't render anything
}
