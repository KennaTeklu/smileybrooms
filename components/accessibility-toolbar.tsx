"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Plus, Minus } from "lucide-react"

export default function AccessibilityToolbar() {
  const [highContrast, setHighContrast] = useState(false)
  const [fontScale, setFontScale] = useState(1)

  // Apply / clean up CSS variables on the <html> element
  useEffect(() => {
    const root = document.documentElement

    // High-contrast mode
    if (highContrast) {
      root.classList.add("accessibility-high-contrast")
    } else {
      root.classList.remove("accessibility-high-contrast")
    }

    // Font scaling
    root.style.setProperty("--accessibility-font-scale", fontScale.toString())
    return () => {
      root.classList.remove("accessibility-high-contrast")
      root.style.removeProperty("--accessibility-font-scale")
    }
  }, [highContrast, fontScale])

  return (
    <aside
      aria-label="Accessibility toolbar"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-md p-2 dark:bg-gray-900/80 dark:border-gray-700"
    >
      <Button
        size="icon"
        variant="ghost"
        aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
        onClick={() => setHighContrast((v) => !v)}
      >
        {highContrast ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Increase font size"
        onClick={() => setFontScale((v) => Math.min(v + 0.1, 1.6))}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        aria-label="Decrease font size"
        onClick={() => setFontScale((v) => Math.max(v - 0.1, 0.8))}
      >
        <Minus className="h-4 w-4" />
      </Button>
    </aside>
  )
}

/*
  OPTIONAL (but recommended):

  Add the following to global CSS (e.g., app/globals.css) so the toolbar’s
  styles actually take effect:

  html {
    font-size: calc(100% * var(--accessibility-font-scale, 1));
  }

  .accessibility-high-contrast {
    --background: #000 !important;
    --foreground: #fff !important;
    --card: #111 !important;
    --card-foreground: #fff !important;
  }
*/
