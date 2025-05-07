"use client"

import { Button } from "@/components/ui/button"
import { Home, RefreshCw } from "lucide-react"

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
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="space-y-6 max-w-md">
            <h1 className="text-4xl font-bold">Something went wrong!</h1>
            <p className="text-gray-600">We've encountered a critical error. Our team has been notified.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button variant="outline" onClick={() => reset()} className="flex items-center gap-2">
                <RefreshCw size={16} />
                Try Again
              </Button>

              <Button asChild className="flex items-center gap-2">
                <a href="/">
                  <Home size={16} />
                  Return Home
                </a>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
