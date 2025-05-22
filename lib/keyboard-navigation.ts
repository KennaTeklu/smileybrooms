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
