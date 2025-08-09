"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw } from "lucide-react"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-950 flex items-center justify-center p-4">
          <div className="text-center max-w-lg mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-white/20">
            <div className="mb-8">
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-6">
                Oops!
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Something went wrong</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                We encountered an unexpected error. Don't worry, we're on it!
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={reset}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className="mr-3 h-5 w-5" />
                Try Again
              </Button>

              <Link href="/" passHref>
                <Button
                  variant="outline"
                  className="w-full py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out border-2 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Go to Homepage
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
