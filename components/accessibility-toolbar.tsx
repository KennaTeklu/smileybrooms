"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Plus, Minus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [fontScale, setFontScale] = useState(1)

  /* ───────────────────────── Helpers ───────────────────────── */
  const toggleDark = () => setDarkMode((d) => !d)
  const increaseFont = () => setFontScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2)))
  const decreaseFont = () => setFontScale((s) => Math.max(0.8, +(s - 0.1).toFixed(2)))

  /* ───────────────────────── Side-effects ───────────────────────── */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  useEffect(() => {
    document.documentElement.style.setProperty("--sb-font-scale", String(fontScale))
  }, [fontScale])

  /* ───────────────────────── UI ───────────────────────── */
  return (
    <>
      {/* FAB trigger */}
      {!open && (
        <Button
          aria-label="Open accessibility toolbar"
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
        >
          <Sun className="h-5 w-5" />
        </Button>
      )}

      {/* Toolbar */}
      {open && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-col gap-2 rounded-lg bg-white p-4 shadow-lg",
            "dark:bg-gray-800 dark:text-gray-100",
          )}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm">Accessibility</span>
            <button
              aria-label="Close accessibility toolbar"
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Button size="sm" variant="secondary" onClick={toggleDark} className="justify-start">
            {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>

          <div className="flex items-center justify-between">
            <span className="text-sm">Font Size</span>
            <div className="flex gap-1">
              <Button size="icon" variant="outline" onClick={decreaseFont} aria-label="Decrease font">
                <Minus className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={increaseFont} aria-label="Increase font">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
