"use client"

import { useEffect, type RefObject } from "react"

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current

      // If the element doesn't exist or the click is inside it, do nothing
      if (!el || el.contains(event.target as Node)) {
        return
      }

      // Call the handler only for clicks outside
      handler(event)
    }

    // Add event listeners with capture phase to ensure they fire before other handlers
    document.addEventListener("mousedown", listener, true)
    document.addEventListener("touchstart", listener, true)

    return () => {
      document.removeEventListener("mousedown", listener, true)
      document.removeEventListener("touchstart", listener, true)
    }
  }, [ref, handler])
}
