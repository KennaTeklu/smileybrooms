"use client"

import { useEffect } from "react"
import { applyAllScrollFixes } from "@/lib/scroll-utils"

export function ScrollFixer() {
  useEffect(() => {
    // Apply all scroll fixes when the component mounts
    const cleanup = applyAllScrollFixes()

    // Clean up when the component unmounts
    return () => {
      if (typeof cleanup === "function") {
        cleanup()
      }
    }
  }, [])

  // This component doesn't render anything
  return null
}
