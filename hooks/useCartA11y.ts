"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface A11yState {
  statusMessage: string
  isAnnouncing: boolean
}

interface CartA11yOptions {
  enableAnnouncements?: boolean
  announcementDelay?: number
}

export function useCartA11y(options: CartA11yOptions = {}) {
  const { enableAnnouncements = true, announcementDelay = 500 } = options
  const [a11yState, setA11yState] = useState<A11yState>({
    statusMessage: "",
    isAnnouncing: false,
  })

  const timeoutRef = useRef<NodeJS.Timeout>()
  const focusTrapRef = useRef<HTMLDivElement>(null)

  const announce = useCallback(
    (message: string) => {
      if (!enableAnnouncements) return

      setA11yState({
        statusMessage: message,
        isAnnouncing: true,
      })

      // Clear announcement after delay
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setA11yState((prev) => ({
          ...prev,
          statusMessage: "",
          isAnnouncing: false,
        }))
      }, announcementDelay)
    },
    [enableAnnouncements, announcementDelay],
  )

  const announceCartUpdate = useCallback(
    (action: string, itemName?: string, itemCount?: number) => {
      let message = ""

      switch (action) {
        case "add":
          message = itemName
            ? `${itemName} added to cart. ${itemCount} items total.`
            : `Item added to cart. ${itemCount} items total.`
          break
        case "remove":
          message = itemName
            ? `${itemName} removed from cart. ${itemCount} items total.`
            : `Item removed from cart. ${itemCount} items total.`
          break
        case "clear":
          message = "Cart cleared. 0 items in cart."
          break
        case "open":
          message = `Cart opened. ${itemCount} items in cart.`
          break
        case "close":
          message = "Cart closed."
          break
        default:
          message = `Cart updated. ${itemCount} items total.`
      }

      announce(message)
    },
    [announce],
  )

  const trapFocus = useCallback((isTrapped: boolean) => {
    if (!focusTrapRef.current) return

    if (isTrapped) {
      // Store currently focused element
      const activeElement = document.activeElement as HTMLElement

      // Focus first focusable element in cart
      const focusableElements = focusTrapRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length > 0) {
        ;(focusableElements[0] as HTMLElement).focus()
      }

      // Handle tab key navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }

      document.addEventListener("keydown", handleKeyDown)

      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        // Restore focus to previously active element
        if (activeElement) {
          activeElement.focus()
        }
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    a11yState,
    announce,
    announceCartUpdate,
    trapFocus,
    focusTrapRef,
  }
}
