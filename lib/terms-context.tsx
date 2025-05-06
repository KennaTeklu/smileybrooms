"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  hasAcceptedTerms as checkTermsAccepted, // Renamed import to avoid conflict
  saveTermsAcceptance,
  getTermsAcceptanceDate,
  shouldForceShowTerms,
  clearForceShowTerms,
  forceShowTerms,
} from "./terms-utils"

// Define the terms version to track when terms are updated
const CURRENT_TERMS_VERSION = "1.0.0"

// Define the context type
interface TermsContextType {
  hasAcceptedTerms: boolean
  acceptTerms: () => void
  resetTerms: () => void
  termsAcceptanceDate: string | null
  termsVersion: string | null
  showTermsModal: boolean

  // Actions
  openTermsModal: () => void
  closeTermsModal: () => void
  declineTerms: () => void

  // Utilities
  isPathCritical: (path: string) => boolean
  requireTermsAcceptance: () => void
  getConsentStatus: () => {
    accepted: boolean
    date: string | null
    version: string | null
  }
}

// Create the context
const TermsContext = createContext<TermsContextType | undefined>(undefined)

// Provider props
interface TermsProviderProps {
  children: ReactNode
}

// Create the provider component
export function TermsProvider({ children }: TermsProviderProps) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false)
  const [termsAcceptanceDate, setTermsAcceptanceDate] = useState<string | null>(null)
  const [termsVersion, setTermsVersion] = useState<string | null>(null)
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false)

  const pathname = usePathname()
  const router = useRouter()

  // Initialize state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load terms acceptance status from localStorage on initial render
      const savedStatus = localStorage.getItem("termsAccepted")
      if (savedStatus === "true") {
        setHasAcceptedTerms(true)
      }

      // Check if browser-level permission was granted
      const browserAccepted = localStorage.getItem("browserTermsAccepted") === "true"

      if (browserAccepted) {
        // If browser permission was granted, auto-accept terms
        setIsTermsAccepted(true)
        setTermsAcceptanceDate(localStorage.getItem("termsAcceptedDate"))
        setTermsVersion(localStorage.getItem("termsVersion") || CURRENT_TERMS_VERSION)
        // Don't show modal if browser already accepted
        setShowTermsModal(false)
      } else {
        // Regular initialization - using the imported function, not the state variable
        const accepted = checkTermsAccepted() // Fixed: using the renamed import
        const acceptanceDate = getTermsAcceptanceDate()
        const version = localStorage.getItem("termsVersion") || null

        setIsTermsAccepted(accepted)
        setTermsAcceptanceDate(acceptanceDate)
        setTermsVersion(version)

        // Check if terms should be forced to show
        if (shouldForceShowTerms()) {
          setShowTermsModal(true)
          clearForceShowTerms()
        }
      }
    }
  }, [])

  // Check if current path requires terms acceptance
  useEffect(() => {
    // If not on homepage and terms not accepted, show modal
    if (pathname && pathname !== "/" && !isTermsAccepted) {
      setShowTermsModal(true)
    }
  }, [pathname, isTermsAccepted])

  // Check if terms version has changed and needs reacceptance
  useEffect(() => {
    if (isTermsAccepted && termsVersion && termsVersion !== CURRENT_TERMS_VERSION) {
      // Terms have been updated since user last accepted
      setShowTermsModal(true)
    }
  }, [isTermsAccepted, termsVersion])

  // Open terms modal
  const openTermsModal = useCallback(() => {
    setShowTermsModal(true)
  }, [])

  // Close terms modal
  const closeTermsModal = useCallback(() => {
    // Only allow closing if on homepage or terms are accepted
    if (pathname === "/" || isTermsAccepted) {
      setShowTermsModal(false)
    } else {
      // If not on homepage and terms not accepted, redirect to home
      router.push("/")
      setShowTermsModal(false)
    }
  }, [pathname, isTermsAccepted, router])

  // Accept terms
  const acceptTerms = useCallback(() => {
    setHasAcceptedTerms(true)
    localStorage.setItem("termsAccepted", "true")

    saveTermsAcceptance()

    // Save current terms version
    if (typeof window !== "undefined") {
      localStorage.setItem("termsVersion", CURRENT_TERMS_VERSION)

      // Also mark as accepted at browser level for consistency
      localStorage.setItem("browserTermsAccepted", "true")
    }

    // Update state
    setIsTermsAccepted(true)
    setTermsAcceptanceDate(new Date().toISOString())
    setTermsVersion(CURRENT_TERMS_VERSION)
    setShowTermsModal(false)
  }, [])

  const resetTerms = () => {
    setHasAcceptedTerms(false)
    localStorage.removeItem("termsAccepted")
  }

  // Decline terms
  const declineTerms = useCallback(() => {
    // If not on homepage, redirect to home
    if (pathname && pathname !== "/") {
      router.push("/")
    }

    setShowTermsModal(false)
  }, [pathname, router])

  // Check if path is critical (all paths except homepage are critical)
  const isPathCritical = useCallback((path: string): boolean => {
    return path !== "/"
  }, [])

  // Force terms acceptance
  const requireTermsAcceptance = useCallback(() => {
    if (!isTermsAccepted) {
      forceShowTerms()
    }
  }, [isTermsAccepted])

  // Get consent status for analytics/logging
  const getConsentStatus = useCallback(() => {
    return {
      accepted: isTermsAccepted,
      date: termsAcceptanceDate,
      version: termsVersion,
    }
  }, [isTermsAccepted, termsAcceptanceDate, termsVersion])

  // Create context value
  const contextValue: TermsContextType = {
    hasAcceptedTerms,
    acceptTerms,
    resetTerms,
    termsAcceptanceDate,
    termsVersion,
    showTermsModal,
    openTermsModal,
    closeTermsModal,
    declineTerms,
    isPathCritical,
    requireTermsAcceptance,
    getConsentStatus,
  }

  return <TermsContext.Provider value={contextValue}>{children}</TermsContext.Provider>
}

// Custom hook to use the terms context
export function useTerms() {
  const context = useContext(TermsContext)
  if (context === undefined) {
    throw new Error("useTerms must be used within a TermsProvider")
  }
  return context
}
