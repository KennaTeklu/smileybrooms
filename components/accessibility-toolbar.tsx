"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ContrastIcon as HighContrast, Text } from "lucide-react"

/**
 * A lightweight accessibility toolbar that lets users:
 * 1. Adjust the global font-size scale.
 * 2. Toggle a high-contrast mode.
 *
 * NOTE: Feel free to enhance or reposition this component.
 * Right now it simply attaches to the bottom-right corner.
 */
export default function AccessibilityToolbar() {
  const [fontScale, setFontScale] = useState(1)
  const [highContrast, setHighContrast] = useState(false)

  /* Dynamically set a CSS custom property for font scaling */
  useEffect(() => {
    document.documentElement.style.setProperty("--sb-font-scale", fontScale.toString())
  }, [fontScale])

  /* Toggle a high-contrast class on <html> */
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast)
  }, [highContrast])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4 rounded-md border bg-white p-4 shadow-lg dark:bg-gray-900">
      {/* Font-size control */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Text className="h-4 w-4" />
        <span>Font size</span>
      </div>
      <Slider defaultValue={[1]} min={0.8} max={1.5} step={0.05} onValueChange={(v) => setFontScale(v[0])} />
      {/* High-contrast toggle */}
      <Button size="sm" variant={highContrast ? "default" : "outline"} onClick={() => setHighContrast((p) => !p)}>
        <HighContrast className="mr-2 h-4 w-4" />
        {highContrast ? "Contrast Off" : "High Contrast"}
      </Button>
    </div>
  )
}
