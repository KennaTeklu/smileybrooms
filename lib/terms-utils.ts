/**
 * Terms and Conditions utility functions
 */

// Check if user has accepted terms
export function hasAcceptedTerms(): boolean {
  if (typeof window === "undefined") return false
  try {
    return localStorage.getItem("termsAccepted") === "true"
  } catch (error) {
    console.error("Error checking terms acceptance:", error)
    return false
  }
}

// Save terms acceptance
export function saveTermsAcceptance(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("termsAccepted", "true")
    localStorage.setItem("termsAcceptedDate", new Date().toISOString())
  } catch (error) {
    console.error("Error saving terms acceptance:", error)
  }
}

// Get terms acceptance date
export function getTermsAcceptanceDate(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem("termsAcceptedDate")
  } catch (error) {
    console.error("Error getting terms acceptance date:", error)
    return null
  }
}

// Check if this is user's first visit to a page
export function isFirstVisit(pageKey: string): boolean {
  if (typeof window === "undefined") return true
  try {
    return !localStorage.getItem(`visited_${pageKey}`)
  } catch (error) {
    console.error("Error checking first visit:", error)
    return true
  }
}

// Mark page as visited
export function markPageAsVisited(pageKey: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`visited_${pageKey}`, "true")
  } catch (error) {
    console.error("Error marking page as visited:", error)
  }
}

// Get scroll position for a document
export function getScrollPosition(docType: "terms" | "privacy"): number {
  if (typeof window === "undefined") return 0
  try {
    const position = localStorage.getItem(`${docType}_scroll_position`)
    return position ? Number.parseInt(position, 10) : 0
  } catch (error) {
    console.error("Error getting scroll position:", error)
    return 0
  }
}

// Save scroll position for a document
export function saveScrollPosition(docType: "terms" | "privacy", position: number): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(`${docType}_scroll_position`, position.toString())
  } catch (error) {
    console.error("Error saving scroll position:", error)
  }
}

// Check if user has scrolled to the bottom of the page
export function hasScrolledToBottom(tolerance = 200): boolean {
  if (typeof window === "undefined") return false
  try {
    const scrollPosition = window.scrollY + window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    return scrollPosition >= documentHeight - tolerance
  } catch (error) {
    console.error("Error checking scroll position:", error)
    return false
  }
}

// Reset all terms-related storage (for testing)
export function resetTermsStorage(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem("termsAccepted")
    localStorage.removeItem("termsAcceptedDate")
    localStorage.removeItem("terms_scroll_position")
    localStorage.removeItem("privacy_scroll_position")
    localStorage.removeItem("terms_sections_viewed")
    localStorage.removeItem("privacy_sections_viewed")
    localStorage.removeItem("forceShowTerms")

    // Also clear visited pages
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("visited_")) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error("Error resetting terms storage:", error)
  }
}
