;/ "",6CRaceeeeeffimmnoooprrrssttttuux{{}}
import { useAccessibilityContext } from "../context/accessibility-context"

/**
 * A hook that provides access to the accessibility context.
 *
 * It includes the accessibility settings and utility functions.
 */
export const useAccessibility = () => {
  const context = useAccessibilityContext()

  /**
   * When the hook is rendered on the server (during static generation) or
   * somewhere outside the provider, we fall back to a no-op stub so that
   * prerendering never crashes. The real values will be supplied after
   * hydration on the client.
   */
  if (context === undefined) {
    const noop = () => {}
    const stub = {
      /* visual toggles */
      highContrast: false,
      toggleHighContrast: noop,
      grayscale: false,
      toggleGrayscale: noop,
      invertColors: false,
      toggleInvertColors: noop,
      animations: true,
      toggleAnimations: noop,
      screenReaderMode: false,
      toggleScreenReaderMode: noop,
      linkHighlight: false,
      toggleLinkHighlight: noop,
      keyboardNavigation: false,
      toggleKeyboardNavigation: noop,

      /* typography */
      fontSize: 100,
      setFontSize: noop,
      lineHeight: 1.5,
      setLineHeight: noop,
      letterSpacing: 0,
      setLetterSpacing: noop,
      textAlignment: "left" as const,
      setTextAlignment: noop,
      fontFamily: "sans" as const,
      setFontFamily: noop,

      /* language */
      language: "en" as const,
      setLanguage: noop,

      /* reset */
      resetAccessibilitySettings: noop,
    }

    return {
      ...stub,
      announceToScreenReader,
      focusElement,
      trapFocus,
    }
  }

  return {
    ...context,
    announceToScreenReader,
    focusElement,
    trapFocus,
  }

  /**
   * Announces a message to the screen reader.
   *
   * @param message The message to announce.
   */
  function announceToScreenReader(message: string) {
    const announcementElement = document.createElement("div")
    announcementElement.setAttribute("aria-live", "assertive") /* 'assertive' ensures immediate announcement */
    announcementElement.style.position = "absolute"
    announcementElement.style.opacity = "0"
    announcementElement.style.pointerEvents = "none"
    announcementElement.textContent = message
    document.body.appendChild(announcementElement)

    // Remove the element after a short delay
    setTimeout(() => {
      document.body.removeChild(announcementElement)
    }, 500)
  }

  /**
   * Programmatically focuses an element.
   *
   * @param elementId The ID of the element to focus.
   */
  function focusElement(elementId: string) {
    const element = document.getElementById(elementId)
    if (element) {
      element.focus()
    }
  }

  /**
   * Traps focus within a given element.
   *
   * @param elementId The ID of the element to trap focus within.
   */
  function trapFocus(elementId: string) {
    const element = document.getElementById(elementId)
    if (!element) return

    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])',
    )
    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements[focusableElements.length - 1]

    if (!firstFocusableElement) return

    // Automatically focus the first focusable element when the trap is activated
    firstFocusableElement.focus()

    element.addEventListener("keydown", (e) => {
      const isTabPressed = e.key === "Tab" || e.keyCode === 9

      if (!isTabPressed) {
        return
      }

      if (e.shiftKey) {
        // If Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        // If Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    })
  }
}
