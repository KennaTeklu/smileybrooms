"use client"

import { useState, useCallback } from "react"

export function useClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  useState(() => {
    setIsSupported("clipboard" in navigator)
  })

  const copyToClipboard = useCallback(
    async (text: string) => {
      if (!isSupported) {
        // Fallback for older browsers
        try {
          const textArea = document.createElement("textarea")
          textArea.value = text
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)
          setCopiedText(text)
          return true
        } catch (error) {
          console.error("Fallback copy failed:", error)
          return false
        }
      }

      try {
        await navigator.clipboard.writeText(text)
        setCopiedText(text)
        return true
      } catch (error) {
        console.error("Copy to clipboard failed:", error)
        return false
      }
    },
    [isSupported],
  )

  const readFromClipboard = useCallback(async () => {
    if (!isSupported) return null

    try {
      const text = await navigator.clipboard.readText()
      return text
    } catch (error) {
      console.error("Read from clipboard failed:", error)
      return null
    }
  }, [isSupported])

  return {
    copiedText,
    isSupported,
    copyToClipboard,
    readFromClipboard,
  }
}
