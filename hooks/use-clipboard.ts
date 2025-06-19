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

import { useState, useCallback } from "react"

export function useClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string) => {
    if (typeof window === "undefined") return false

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        setCopiedText(text)
        return true
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const success = document.execCommand("copy")
        document.body.removeChild(textArea)

        if (success) {
          setCopiedText(text)
        }

        return success
      }
    } catch (error) {
      console.error("Failed to copy text:", error)
      return false
    }
  }, [])

  const readFromClipboard = useCallback(async () => {
    if (typeof window === "undefined") return null

    try {
      if (navigator.clipboard && window.isSecureContext) {
        const text = await navigator.clipboard.readText()
        return text
      }
    } catch (error) {
      console.error("Failed to read from clipboard:", error)
    }

    return null
  }, [])

  return {
    copiedText,
    copyToClipboard,
    readFromClipboard,
    isSupported: typeof window !== "undefined" && !!navigator.clipboard,
  }
}
