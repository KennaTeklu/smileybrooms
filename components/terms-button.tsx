"use client"

import type React from "react"

import { useState } from "react"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import EnhancedTermsModal from "./enhanced-terms-modal"
import { saveTermsAcceptance } from "@/lib/terms-utils"

interface TermsButtonProps {
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
  initialTab?: "terms" | "privacy"
  className?: string
  children?: React.ReactNode
}

export default function TermsButton({
  variant = "link",
  size = "default",
  initialTab = "terms",
  className,
  children,
}: TermsButtonProps) {
  const [showTerms, setShowTerms] = useState(false)

  const handleOpenTerms = () => {
    setShowTerms(true)
  }

  const handleAccept = () => {
    saveTermsAcceptance()
    setShowTerms(false)
  }

  return (
    <>
      <Button variant={variant} size={size} onClick={handleOpenTerms} className={className}>
        {children || (
          <>
            <FileText className="h-4 w-4 mr-2" />
            {initialTab === "terms" ? "Terms & Conditions" : "Privacy Policy"}
          </>
        )}
      </Button>

      {showTerms && (
        <EnhancedTermsModal
          isOpen={showTerms}
          onClose={() => setShowTerms(false)}
          onAccept={handleAccept}
          initialTab={initialTab}
          continuousScroll={true}
        />
      )}
    </>
  )
}
