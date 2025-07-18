"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useAbandonmentRescue } from "@/lib/abandonment/rescue-funnel"
import { DiscountRescueModal } from "@/components/abandonment/discount-rescue-modal"
import { ChatIntervention } from "@/components/abandonment/chat-intervention"
import { useRouter } from "next/navigation"

interface AbandonmentContextType {
  applyDiscount: (email?: string) => void
  currentDiscount: number
  continueBooking: () => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

export function AbandonmentProvider({ children }: { children: ReactNode }) {
  const {
    showDiscountModal,
    setShowDiscountModal,
    showChatPrompt,
    setShowChatPrompt,
    currentDiscount,
    sendSmsReminder,
  } = useAbandonmentRescue({
    exitIntentEnabled: true,
    inactivityTimeoutMs: 60000, // 1 minute for demo purposes
    discountSteps: [10, 15, 20],
  })

  const [capturedEmail, setCapturedEmail] = useState<string | undefined>()
  const router = useRouter()

  const applyDiscount = (email?: string) => {
    if (email) {
      setCapturedEmail(email)
      // In a real app, you would store this email for marketing
    }

    // Apply discount to localStorage or context
    localStorage.setItem("appliedDiscount", currentDiscount.toString())
  }

  const continueBooking = () => {
    setShowChatPrompt(false)
    router.push("/cart")
  }

  const handleEmailCapture = (email: string) => {
    setCapturedEmail(email)
    applyDiscount(email)
  }

  return (
    <AbandonmentContext.Provider
      value={{
        applyDiscount,
        currentDiscount,
        continueBooking,
      }}
    >
      {children}

      <DiscountRescueModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        discountPercentage={currentDiscount}
        onEmailCapture={handleEmailCapture}
      />

      <ChatIntervention
        isOpen={showChatPrompt}
        onClose={() => setShowChatPrompt(false)}
        onContinueBooking={continueBooking}
      />
    </AbandonmentContext.Provider>
  )
}

export function useAbandonment() {
  const context = useContext(AbandonmentContext)
  if (context === undefined) {
    throw new Error("useAbandonment must be used within an AbandonmentProvider")
  }
  return context
}
