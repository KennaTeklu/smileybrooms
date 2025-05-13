"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTerms } from "@/lib/terms-context"
import PremiumTermsModal from "@/components/premium-terms-modal"

export function TermsEntryManager() {
  const pathname = usePathname()
  const { termsAccepted, openTermsModal } = useTerms()

  // Check if terms should be shown on certain pages
  useEffect(() => {
    // Skip terms check on the terms page itself to avoid loops
    if (pathname === "/terms") return

    // Pages that require terms acceptance
    const requiresTerms = ["/checkout", "/services", "/pricing", "/contact"].some((path) => pathname.startsWith(path))

    // Show terms modal if not accepted and on a page that requires it
    if (requiresTerms && !termsAccepted) {
      // Small delay to ensure the UI is ready
      const timer = setTimeout(() => {
        openTermsModal?.()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pathname, termsAccepted, openTermsModal])

  return <PremiumTermsModal />
}
