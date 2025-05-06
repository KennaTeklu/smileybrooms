/**
 * Terms Entry Manager Component
 *
 * IMPORTANT: Company name is always "smileybrooms" (lowercase, one word)
 *
 * This component manages the display of the terms modal based on context state
 * and enforces terms acceptance before allowing access to protected pages.
 */

"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import EnhancedTermsModal from "./enhanced-terms-modal"
import { useTerms } from "@/lib/terms-context"

export function TermsEntryManager() {
  const { showTermsModal, closeTermsModal, acceptTerms, isTermsAccepted, isPathCritical, openTermsModal } = useTerms()

  const pathname = usePathname()
  const router = useRouter()

  // Check if current path requires terms acceptance
  useEffect(() => {
    if (typeof window !== "undefined") {
      const browserAccepted = localStorage.getItem("browserTermsAccepted") === "true"

      // If browser has already accepted, don't show modal
      if (browserAccepted) {
        return
      }

      // If not on homepage and terms not accepted, show terms modal
      if (pathname !== "/" && !isTermsAccepted) {
        openTermsModal()

        // After a small delay, show the confirmation popup directly
        // This ensures the modal appears consistently across different entry points
        setTimeout(() => {
          // Use a custom event to communicate with the modal component
          const event = new CustomEvent("showTermsConfirmation")
          window.dispatchEvent(event)
        }, 1000)
      }
    }
  }, [pathname, isTermsAccepted, openTermsModal])

  // For development/testing - accessible via window.resetTerms()
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.resetTerms = () => {
        // Import dynamically to avoid issues with SSR
        import("@/lib/terms-utils").then(({ resetTermsStorage }) => {
          resetTermsStorage()
          window.location.reload()
        })
      }
    }
  }, [])

  // Determine if the current path requires forced acceptance
  // All paths except homepage require forced acceptance
  const forceAccept = pathname !== "/"

  return (
    <>
      {showTermsModal && (
        <EnhancedTermsModal
          isOpen={showTermsModal}
          onClose={closeTermsModal}
          onAccept={acceptTerms}
          initialTab="terms"
          continuousScroll={true}
          forceAccept={forceAccept}
        />
      )}
    </>
  )
}
