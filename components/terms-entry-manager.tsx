"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import EnhancedTermsModal from "./enhanced-terms-modal"
import {
  hasAcceptedTerms,
  saveTermsAcceptance,
  isFirstVisit,
  markPageAsVisited,
  hasScrolledToBottom,
  shouldForceShowTerms,
  clearForceShowTerms,
  resetTermsStorage,
} from "@/lib/terms-utils"

export function TermsEntryManager() {
  const [showTerms, setShowTerms] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isHomepage = pathname === "/"
  const bottomTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasShownTermsRef = useRef(false)
  const [termsBlocking, setTermsBlocking] = useState(false)

  // For development/testing - accessible via window.resetTerms()
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.resetTerms = resetTermsStorage
    }
  }, [])

  useEffect(() => {
    // Check if terms should be forced to show (e.g., after redirection)
    if (shouldForceShowTerms()) {
      setShowTerms(true)
      clearForceShowTerms()
      return
    }

    // Don't show terms if already accepted
    if (hasAcceptedTerms()) return

    // Generate a unique key for this page
    const pageKey = `visited_${pathname}`

    // Check if this is the first visit to this page
    const firstVisit = isFirstVisit(pageKey)

    if (isHomepage) {
      // For homepage, we need to detect scrolling to bottom
      const handleScroll = () => {
        if (hasShownTermsRef.current) return

        if (hasScrolledToBottom()) {
          // Clear any existing timer
          if (bottomTimerRef.current) {
            clearTimeout(bottomTimerRef.current)
          }

          // Set a new timer for 3 seconds
          bottomTimerRef.current = setTimeout(() => {
            if (hasScrolledToBottom() && !hasAcceptedTerms()) {
              setShowTerms(true)
              hasShownTermsRef.current = true
            }
          }, 3000)
        } else {
          // Clear timer if user scrolls away from bottom
          if (bottomTimerRef.current) {
            clearTimeout(bottomTimerRef.current)
            bottomTimerRef.current = null
          }
        }
      }

      window.addEventListener("scroll", handleScroll)
      return () => {
        window.removeEventListener("scroll", handleScroll)
        if (bottomTimerRef.current) {
          clearTimeout(bottomTimerRef.current)
        }
      }
    } else if (firstVisit) {
      // For non-homepage, show terms on first visit and block navigation
      setShowTerms(true)
      setTermsBlocking(true)
      markPageAsVisited(pageKey)
    }
  }, [pathname, isHomepage])

  const handleAccept = () => {
    saveTermsAcceptance()
    setShowTerms(false)
    setTermsBlocking(false)
  }

  const handleClose = () => {
    if (termsBlocking && !isHomepage) {
      // If terms are blocking and we're not on homepage, redirect to homepage
      router.push("/")
    } else {
      setShowTerms(false)
    }
  }

  return (
    <>
      {showTerms && (
        <EnhancedTermsModal
          isOpen={showTerms}
          onClose={handleClose}
          onAccept={handleAccept}
          initialTab="terms"
          continuousScroll={true}
          forceAccept={termsBlocking && !isHomepage}
        />
      )}
    </>
  )
}
