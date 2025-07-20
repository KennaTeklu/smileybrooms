"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAbandonmentRescue } from "@/lib/abandonment/rescue-funnel"
import { ChatIntervention } from "@/components/abandonment/chat-intervention"
import { useRouter } from "next/navigation"

interface AbandonmentContextType {
  continueBooking: () => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

export function AbandonmentProvider({ children }: { children: ReactNode }) {
  const { showChatPrompt, setShowChatPrompt } = useAbandonmentRescue({
    exitIntentEnabled: true,
    inactivityTimeoutMs: 60000, // 1 minute for demo purposes
    // discountSteps removed as per request
  })

  const router = useRouter()

  const continueBooking = () => {
    setShowChatPrompt(false)
    router.push("/cart")
  }

  return (
    <AbandonmentContext.Provider
      value={{
        continueBooking,
      }}
    >
      {children}

      {/* DiscountRescueModal removed as per request */}

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
