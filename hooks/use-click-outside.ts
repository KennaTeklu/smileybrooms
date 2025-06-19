"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import { useEffect, type RefObject } from "react"

type Handler = (event: MouseEvent | TouchEvent) => void

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: "mousedown" | "mouseup" = "mousedown",
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current
      if (!el || el.contains((event.target as Node) || null)) {
        return
      }

      handler(event)
    }

    document.addEventListener(mouseEvent, listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener(mouseEvent, listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler, mouseEvent])
}
