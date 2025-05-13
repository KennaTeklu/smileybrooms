"use client"

import { useEffect } from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function GlobalError({
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
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-destructive">Critical Error</h1>
            <h2 className="text-3xl font-semibold mt-4 mb-6">Application Crashed</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
              We apologize for the inconvenience. A critical error has occurred. Please try refreshing the page or
              contact our support team.
            </p>
            {error.digest && <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Error ID: {error.digest}</p>}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={reset} size="lg">
                Refresh Page
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
