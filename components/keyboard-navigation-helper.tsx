"use client"

import { useEffect } from "react"

interface KeyboardNavigationHelperProps {
  selector: string
  onKeyDown?: (event: KeyboardEvent, elements: HTMLElement[], currentIndex: number) => void
}

export function KeyboardNavigationHelper({ selector, onKeyDown }: KeyboardNavigationHelperProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[]
      if (elements.length === 0) return

      const currentElement = document.activeElement as HTMLElement
      const currentIndex = elements.indexOf(currentElement)

      // If a custom handler is provided, use it
      if (onKeyDown) {
        onKeyDown(event, elements, currentIndex)
        return
      }

      // Default navigation behavior
      if (currentIndex === -1) return

      // Arrow key navigation
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % elements.length
        elements[nextIndex].focus()
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault()
        const prevIndex = (currentIndex - 1 + elements.length) % elements.length
        elements[prevIndex].focus()
      } else if (event.key === "Home") {
        event.preventDefault()
        elements[0].focus()
      } else if (event.key === "End") {
        event.preventDefault()
        elements[elements.length - 1].focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [selector, onKeyDown])

  // This component doesn't render anything visible
  return null
}
