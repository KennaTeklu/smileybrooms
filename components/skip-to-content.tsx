"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function SkipToContent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2",
        "bg-primary text-primary-foreground rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
      )}
    >
      Skip to content
    </a>
  )
}
