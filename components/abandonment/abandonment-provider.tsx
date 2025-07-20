"use client"

import { createContext, useContext, type ReactNode } from "react"
import { rescueFunnel } from "@/lib/abandonment/rescue-funnel"
import { ChatIntervention } from "@/components/abandonment/chat-intervention"
import { DiscountRescueModal } from "@/components/abandonment/discount-rescue-modal" // Import the modal
import { useRouter } from "next/navigation"

interface AbandonmentContextType {
  continueBooking: () => void
  applyDiscount: (code: string) => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

export function AbandonmentProvider({ children }: { children: ReactNode }) {
  const { showChatPrompt, setShowChatPrompt, showDiscountModal, setShowDiscountModal, currentDiscount } = rescueFunnel({
    exitIntentEnabled: true,
    inactivityTimeoutMs: 60000, // 1 minute for demo purposes
  })

  const router = useRouter()

  const continueBooking = () => {
    setShowChatPrompt(false)
    setShowDiscountModal(false)
    router.push("/cart")
  }

  const applyDiscount = (code: string) => {
    console.log(`Discount code applied: ${code}`)
    // In a real application, you would apply the discount to the cart/session here
    continueBooking() // Then continue to booking
  }

  return (
    <AbandonmentContext.Provider
      value={{
        continueBooking,
        applyDiscount,
      }}
    >
      {children}

      <DiscountRescueModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        discount={currentDiscount}
        onApplyDiscount={applyDiscount}
        onContinueBooking={continueBooking}
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
