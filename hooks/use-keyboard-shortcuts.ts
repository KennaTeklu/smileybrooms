"use client"

import { useEffect, useCallback } from "react"

type ShortcutHandler = () => void

interface KeyboardShortcuts {
  [key: string]: ShortcutHandler
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts, enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      const pressedKeys: string[] = []
      if (event.altKey) pressedKeys.push("alt")
      if (event.ctrlKey) pressedKeys.push("ctrl")
      if (event.metaKey) pressedKeys.push("meta") // Command key on Mac
      if (event.shiftKey) pressedKeys.push("shift")

      // Add the key itself, converting to lowercase for consistency
      const key = event.key.toLowerCase()
      if (key !== "alt" && key !== "ctrl" && key !== "meta" && key !== "shift") {
        pressedKeys.push(key)
      }

      const shortcutKey = pressedKeys.sort().join("+")

      if (shortcuts[shortcutKey]) {
        event.preventDefault() // Prevent default browser behavior for the shortcut
        shortcuts[shortcutKey]()
      }
    },
    [shortcuts, enabled],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])
}
