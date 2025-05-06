/**
 * Terms and Conditions utility functions
 */

// Check if user has accepted terms
export function hasAcceptedTerms(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("termsAccepted") === "true"
}

// Save terms acceptance
export function saveTermsAcceptance(): void {
  if (typeof window === "undefined") return
  localStorage.setItem("termsAccepted", "true")
  localStorage.setItem("termsAcceptedDate", new Date().toISOString())
}

// Get terms acceptance date
export function getTermsAcceptanceDate(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("termsAcceptedDate")
}

// Check if this is user's first visit to a page
export function isFirstVisit(pageKey: string): boolean {
  if (typeof window === "undefined") return true
  return !localStorage.getItem(pageKey)
}

// Mark page as visited
export function markPageAsVisited(pageKey: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(pageKey, "true")
}

// Get scroll position for a document
export function getScrollPosition(docType: "terms" | "privacy"): number {
  if (typeof window === "undefined") return 0
  const position = localStorage.getItem(`${docType}_scroll_position`)
  return position ? Number.parseInt(position, 10) : 0
}

// Save scroll position for a document
export function saveScrollPosition(docType: "terms" | "privacy", position: number): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`${docType}_scroll_position`, position.toString())
}

// Get sections viewed for a document
export function getSectionsViewed(docType: "terms" | "privacy"): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  const sectionsViewed = localStorage.getItem(`${docType}_sections_viewed`)
  return sectionsViewed ? JSON.parse(sectionsViewed) : {}
}

// Save sections viewed for a document
export function saveSectionsViewed(docType: "terms" | "privacy", sections: Record<string, boolean>): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`${docType}_sections_viewed`, JSON.stringify(sections))
}

// Check if user has scrolled to the bottom of the page
export function hasScrolledToBottom(tolerance = 200): boolean {
  if (typeof window === "undefined") return false
  const scrollPosition = window.scrollY + window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  return scrollPosition >= documentHeight - tolerance
}

// Set a flag to force terms modal to show on next navigation
export function forceShowTerms(): void {
  if (typeof window === "undefined") return
  localStorage.setItem("forceShowTerms", "true")
}

// Check if terms modal should be forcibly shown
export function shouldForceShowTerms(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("forceShowTerms") === "true"
}

// Clear the force show terms flag
export function clearForceShowTerms(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("forceShowTerms")
}

// Reset all terms-related storage (for testing)
export function resetTermsStorage(): void {
  if (typeof window === "undefined") return
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
}
