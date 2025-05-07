"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl font-bold text-gray-900">Critical Error</h1>
            <p className="text-gray-600">A critical error has occurred. We apologize for the inconvenience.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button onClick={() => reset()} variant="outline">
                Try Again
              </Button>
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
