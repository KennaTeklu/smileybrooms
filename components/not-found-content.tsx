"use client"

// The rest of your NotFoundContent component code goes here.
// (Content omitted for brevity, as it was previously assumed correct)
// Example structure:
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HomeIcon } from "lucide-react"

export default function NotFoundContent() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">404 - Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400">Oops! The page you're looking for doesn't exist.</p>
      </div>
      <Link href="/">
        <Button className="flex items-center gap-2">
          <HomeIcon className="h-4 w-4" />
          Go to Homepage
        </Button>
      </Link>
    </div>
  )
}
