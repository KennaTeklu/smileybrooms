"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MobileOptimizedTermsModal } from "@/components/mobile-optimized-terms-modal"

type TermsContextType = {
  termsAccepted: boolean
  privacyAccepted: boolean
  cookiesAccepted: boolean
  acceptTerms: () => void
  acceptPrivacy: () => void
  acceptCookies: () => void
  resetTerms: () => void
  openTermsModal?: () => void
  closeTermsModal?: () => void
  showTermsModal?: boolean
}

const TermsContext = createContext<TermsContextType>({
  termsAccepted: false,
  privacyAccepted: false,
  cookiesAccepted: false,
  acceptTerms: () => {},
  acceptPrivacy: () => {},
  acceptCookies: () => {},
  resetTerms: () => {},
})

interface TermsProviderProps {
  children: ReactNode
}

export function TermsProvider({ children }: TermsProviderProps) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [cookiesAccepted, setCookiesAccepted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Load acceptance status from localStorage on initial render
  useEffect(() => {
    try {
      const savedTerms = localStorage.getItem("termsAccepted")
      const savedPrivacy = localStorage.getItem("privacyAccepted")
      const savedCookies = localStorage.getItem("cookiesAccepted")

      if (savedTerms) setTermsAccepted(true)
      if (savedPrivacy) setPrivacyAccepted(true)
      if (savedCookies) setCookiesAccepted(true)
    } catch (error) {
      console.error("Failed to load terms acceptance status:", error)
    }
  }, [])

  const openTermsModal = () => {
    setShowTermsModal(true)
  }

  const closeTermsModal = () => {
    setShowTermsModal(false)
  }

  const acceptTerms = () => {
    setTermsAccepted(true)
    try {
      localStorage.setItem("termsAccepted", "true")
    } catch (error) {
      console.error("Failed to save terms acceptance status:", error)
    }
    closeTermsModal()
  }

  const acceptPrivacy = () => {
    setPrivacyAccepted(true)
    try {
      localStorage.setItem("privacyAccepted", "true")
    } catch (error) {
      console.error("Failed to save privacy acceptance status:", error)
    }
  }

  const acceptCookies = () => {
    setCookiesAccepted(true)
    try {
      localStorage.setItem("cookiesAccepted", "true")
    } catch (error) {
      console.error("Failed to save cookies acceptance status:", error)
    }
  }

  const resetTerms = () => {
    setTermsAccepted(false)
    setPrivacyAccepted(false)
    setCookiesAccepted(false)
    try {
      localStorage.removeItem("termsAccepted")
      localStorage.removeItem("privacyAccepted")
      localStorage.removeItem("cookiesAccepted")
    } catch (error) {
      console.error("Failed to reset terms acceptance status:", error)
    }
  }

  return (
    <TermsContext.Provider
      value={{
        termsAccepted,
        privacyAccepted,
        cookiesAccepted,
        showTermsModal,
        openTermsModal,
        closeTermsModal,
        acceptTerms,
        acceptPrivacy,
        acceptCookies,
        resetTerms,
      }}
    >
      {children}

      {showTermsModal && (
        <MobileOptimizedTermsModal
          isOpen={showTermsModal}
          onClose={closeTermsModal}
          title="Terms and Conditions"
          content={`
         # Terms and Conditions
         
         ## 1. Introduction
         
         Welcome to SmileyBrooms! These Terms and Conditions govern your use of our website, mobile applications, and services. By accessing or using our services, you agree to be bound by these Terms.
         
         ## 2. Services
         
         SmileyBrooms provides home cleaning services, including but not limited to regular cleaning, deep cleaning, move-in/move-out cleaning, and office cleaning. All services are subject to availability in your area.
         
         ## 3. User Responsibilities
         
         Users are responsible for providing accurate information when booking services, ensuring access to the premises at the scheduled time, and maintaining a safe environment for our cleaning professionals.
         
         ## 4. Payment Terms
         
         Payment is required at the time of booking. We accept major credit cards and digital payment methods. Prices are subject to change without notice. Cancellation fees may apply for bookings cancelled less than 24 hours before the scheduled service.
         
         ## 5. Privacy Policy
         
         Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our services, you consent to our data practices as described in our Privacy Policy.
         
         ## 6. Termination
         
         We reserve the right to terminate or suspend your access to our services at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
         
         ## 7. Liability
         
         SmileyBrooms is not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, resulting from your access to or use of, or inability to access or use, the services.
         
         ## 8. Changes to Terms
         
         We may modify these Terms at any time. Your continued use of our services after any changes indicates your acceptance of the modified Terms.
         `}
          onAccept={acceptTerms}
          acceptLabel="Accept Terms"
          cancelLabel="Cancel"
        />
      )}
    </TermsContext.Provider>
  )
}

export const useTerms = () => {
  const context = useContext(TermsContext)
  if (!context) {
    throw new Error("useTerms must be used within a TermsProvider")
  }
  return context
}
