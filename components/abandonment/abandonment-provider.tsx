"use client"

import { createContext, useContext, type ReactNode } from "react"
import { rescueFunnel } from "@/lib/abandonment/rescue-funnel"
import { ChatIntervention } from "@/components/abandonment/chat-intervention"
import { DiscountRescueModal } from "@/components/abandonment/discount-rescue-modal" // Import the modal
import { useRouter } from "next/navigation"

interface AbandonmentContextType {
  continueBooking: () => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

export function AbandonmentProvider({ children }: { children: ReactNode }) {
  const { showDiscountModal, setShowDiscountModal, showChatPrompt, setShowChatPrompt, currentDiscount } = rescueFunnel({
    exitIntentEnabled: true,
    inactivityTimeoutMs: 60000, // 1 minute for demo purposes
  })

  const router = useRouter()

  const continueBooking = () => {
    setShowChatPrompt(false)
    setShowDiscountModal(false) // Close discount modal if open
    router.push("/cart")
  }

  const handleApplyDiscount = (code: string) => {
    console.log("Applying discount code:", code)
    // Here you would typically integrate with your cart/discount logic
    setShowDiscountModal(false)
    router.push("/cart") // Redirect to cart after applying discount
  }

  return (
    <AbandonmentContext.Provider
      value={{
        continueBooking,
      }}
    >
      {children}

      <DiscountRescueModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onApplyDiscount={handleApplyDiscount}
        discountPercentage={currentDiscount?.percentage || 10} // Default to 10% if not set
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
