type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  description: string
  handler: (event: KeyboardEvent) => void
}

class KeyboardNavigationManager {
  private shortcuts: KeyboardShortcut[] = []
  private enabled = true

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.handleKeyDown.bind(this))
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return

    // Skip if user is typing in an input, textarea, or contentEditable element
    const target = event.target as HTMLElement
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable
    ) {
      return
    }

    for (const shortcut of this.shortcuts) {
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        (shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey) &&
        (shortcut.altKey === undefined || event.altKey === shortcut.altKey) &&
        (shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey)
      ) {
        shortcut.handler(event)
        event.preventDefault()
        return
      }
    }
  }

  public registerShortcut(shortcut: KeyboardShortcut) {
    this.shortcuts.push(shortcut)
  }

  public registerShortcuts(shortcuts: KeyboardShortcut[]) {
    this.shortcuts.push(...shortcuts)
  }

  public removeShortcut(key: string, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean) {
    this.shortcuts = this.shortcuts.filter(
      (shortcut) =>
        shortcut.key !== key ||
        shortcut.ctrlKey !== ctrlKey ||
        shortcut.altKey !== altKey ||
        shortcut.shiftKey !== shiftKey,
    )
  }

  public enable() {
    this.enabled = true
  }

  public disable() {
    this.enabled = false
  }

  public getShortcuts() {
    return this.shortcuts
  }
}

// Singleton instance
export const keyboardManager = typeof window !== "undefined" ? new KeyboardNavigationManager() : null

// Hook for using keyboard shortcuts
export function useKeyboardNavigation() {
  return keyboardManager
}

// Keyboard navigation utilities

/**
 * Enables enhanced keyboard navigation for the application
 */
export function enableEnhancedKeyboardNavigation() {
  // Track if we're in keyboard navigation mode
  let keyboardMode = false

  // Add a class to the body when using keyboard navigation
  const handleFirstTab = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation")
      keyboardMode = true
      window.removeEventListener("keydown", handleFirstTab)
      window.addEventListener("mousedown", handleMouseDown)
    }
  }

  // Remove the class when clicking with the mouse
  const handleMouseDown = () => {
    document.body.classList.remove("keyboard-navigation")
    keyboardMode = false
    window.removeEventListener("mousedown", handleMouseDown)
    window.addEventListener("keydown", handleFirstTab)
  }

  // Initialize the listeners
  window.addEventListener("keydown", handleFirstTab)

  // Enhanced keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    // Only process if we're in keyboard mode
    if (!keyboardMode) return

    // Ctrl+/ to open help menu
    if (e.ctrlKey && e.key === "/") {
      e.preventDefault()
      // Open help menu logic here
      console.log("Help menu shortcut triggered")
    }

    // Alt+S to skip to main content
    if (e.altKey && e.key === "s") {
      e.preventDefault()
      const mainContent = document.querySelector("main")
      if (mainContent) {
        // Focus the main content
        mainContent.setAttribute("tabindex", "-1")
        mainContent.focus()
        // Remove tabindex after focus to avoid keyboard trap
        setTimeout(() => {
          mainContent.removeAttribute("tabindex")
        }, 100)
      }
    }

    // Alt+M to open main menu
    if (e.altKey && e.key === "m") {
      e.preventDefault()
      const mainMenu = document.querySelector("nav")
      if (mainMenu) {
        const firstLink = mainMenu.querySelector("a")
        if (firstLink) {
          firstLink.focus()
        }
      }
    }
  })

  return {
    cleanup: () => {
      window.removeEventListener("keydown", handleFirstTab)
      window.removeEventListener("mousedown", handleMouseDown)
    },
  }
}

/**
 * Creates a focus trap within a specified element
 */
export function createFocusTrap(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
  )

  if (focusableElements.length === 0) return { cleanup: () => {} }

  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    // Allow escape to close/exit
    if (e.key === "Escape") {
      // Close/exit logic here
    }
  }

  element.addEventListener("keydown", handleKeyDown)

  return {
    activate: () => {
      firstElement.focus()
    },
    cleanup: () => {
      element.removeEventListener("keydown", handleKeyDown)
    },
  }
}

/**
 * Adds skip links for keyboard navigation
 */
export function addSkipLinks() {
  // Create skip link element
  const skipLink = document.createElement("a")
  skipLink.href = "#main-content"
  skipLink.className = "skip-link"
  skipLink.textContent = "Skip to main content"

  // Style the skip link
  skipLink.style.position = "absolute"
  skipLink.style.top = "-40px"
  skipLink.style.left = "0"
  skipLink.style.padding = "8px 16px"
  skipLink.style.background = "#000"
  skipLink.style.color = "#fff"
  skipLink.style.zIndex = "9999"
  skipLink.style.transition = "top 0.2s"
  skipLink.style.textDecoration = "none"
  skipLink.style.borderRadius = "0 0 4px 0"

  // Show the skip link when it receives focus
  skipLink.addEventListener("focus", () => {
    skipLink.style.top = "0"
  })

  skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px"
  })

  // Add the skip link to the DOM
  document.body.insertBefore(skipLink, document.body.firstChild)

  // Add id to the main content if it doesn't exist
  const mainContent = document.querySelector("main")
  if (mainContent && !mainContent.id) {
    mainContent.id = "main-content"
  }

  return {
    cleanup: () => {
      document.body.removeChild(skipLink)
    },
  }
}

export default {
  enableEnhancedKeyboardNavigation,
  createFocusTrap,
  addSkipLinks,
}
