"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

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
