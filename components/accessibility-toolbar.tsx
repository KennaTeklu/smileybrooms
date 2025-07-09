"use client"

import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Monitor, MoonStar, Plus } from "lucide-react"
import { useState } from "react"

/**
 * A simple accessibility helper that lets users
 *  • increase text size
 *  • toggle a high-contrast / dark mode
 *  • reset to default
 */
export function AccessibilityToolbar() {
  const [fontScale, setFontScale] = useState(1)

  const increaseFont = () => {
    const newScale = Math.min(fontScale + 0.1, 1.6)
    setFontScale(newScale)
    document.documentElement.style.setProperty("--sb-font-scale", String(newScale))
  }

  const resetFont = () => {
    setFontScale(1)
    document.documentElement.style.removeProperty("--sb-font-scale")
  }

  const toggleContrast = () => {
    document.documentElement.classList.toggle("contrast")
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-white p-2 shadow-md dark:bg-gray-900"
      role="region"
      aria-label="Accessibility toolbar"
    >
      <Button size="icon" variant="ghost" onClick={increaseFont} aria-label="Increase text size">
        <Plus className="h-4 w-4" />
      </Button>

      <Toggle
        pressed={document.documentElement.classList.contains("contrast")}
        onPressedChange={toggleContrast}
        aria-label="Toggle high-contrast / dark mode"
      >
        <MoonStar className="h-4 w-4" />
      </Toggle>

      <Button size="icon" variant="ghost" onClick={resetFont} aria-label="Reset accessibility settings">
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  )
}

/*  Provide BOTH default and named exports so the module
    can be imported however the app expects. */
export default AccessibilityToolbar
