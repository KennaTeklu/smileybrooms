"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTerms } from "@/lib/terms-context"
import EnhancedTermsModal from "@/components/enhanced-terms-modal"

export function TermsEntryManager() {
  const { hasAcceptedTerms, acceptTerms } = useTerms()
  const [showTerms, setShowTerms] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check if user has already accepted terms
    if (!hasAcceptedTerms) {
      // Don't show terms on the homepage initially
      if (pathname !== "/") {
        setShowTerms(true)
      }
    }
  }, [hasAcceptedTerms, pathname])

  const handleAcceptTerms = () => {
    acceptTerms()
    setShowTerms(false)
  }

  const handleCloseTerms = () => {
    // If on homepage, just close the modal
    if (pathname === "/") {
      setShowTerms(false)
    } else {
      // For other pages, redirect to homepage if terms not accepted
      window.location.href = "/"
    }
  }

  return (
    <EnhancedTermsModal
      isOpen={showTerms}
      onClose={handleCloseTerms}
      onAccept={handleAcceptTerms}
      initialTab="terms"
      continuousScroll={true}
      forceAccept={pathname !== "/"}
    />
  )
}
