"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
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
