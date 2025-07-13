"use client"

import { useEffect } from "react"

interface KeyboardShortcuts {
  [key: string]: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key
      const ctrl = event.ctrlKey
      const alt = event.altKey
      const shift = event.shiftKey
      const meta = event.metaKey

      // Create a key combination string
      let combination = ""
      if (ctrl) combination += "Ctrl+"
      if (alt) combination += "Alt+"
      if (shift) combination += "Shift+"
      if (meta) combination += "Meta+"
      combination += key

      // Check for exact key match first
      if (shortcuts[key]) {
        event.preventDefault()
        shortcuts[key]()
        return
      }

      // Check for combination match
      if (shortcuts[combination]) {
        event.preventDefault()
        shortcuts[combination]()
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [shortcuts])
}
