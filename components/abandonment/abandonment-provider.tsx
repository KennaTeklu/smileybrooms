"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { rescueFunnel } from "@/lib/abandonment/rescue-funnel" // Updated import
import { useToast } from "@/components/ui/use-toast"
import { DiscountRescueModal } from "./discount-rescue-modal"
import { ChatIntervention } from "./chat-intervention"
import { NEXT_PUBLIC_ABANDONMENT_RESCUE_THRESHOLD_SECONDS, NEXT_PUBLIC_FEATURE_ABANDONMENT_RESCUE } from "@/config" // Declared variables

interface AbandonmentContextType {
  isAbandonmentTriggered: boolean
  isRescueModalOpen: boolean
  isChatInterventionOpen: boolean
  closeRescueModal: () => void
  closeChatIntervention: () => void
  triggerAbandonment: () => void
  triggerRescue: () => void
}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

export function AbandonmentProvider({ children }: { children: React.ReactNode }) {
  const [isAbandonmentTriggered, setIsAbandonmentTriggered] = useState(false)
  const [isRescueModalOpen, setIsRescueModalOpen] = useState(false)
  const [isChatInterventionOpen, setIsChatInterventionOpen] = useState(false)
  const { toast } = useToast()

  const handleAbandonment = useCallback(() => {
    setIsAbandonmentTriggered(true)
    setIsRescueModalOpen(true)
    toast({
      title: "Don't leave yet!",
      description: "Here's a special offer just for you.",
      duration: 5000,
    })
  }, [toast])

  const handleRescue = useCallback(() => {
    if (isAbandonmentTriggered) {
      setIsRescueModalOpen(false)
      setIsChatInterventionOpen(true)
      toast({
        title: "Welcome back!",
        description: "How can we help you today?",
        duration: 3000,
      })
    }
  }, [isAbandonmentTriggered, toast])

  const { resetFunnel } = rescueFunnel({
    // Updated usage
    thresholdSeconds: NEXT_PUBLIC_ABANDONMENT_RESCUE_THRESHOLD_SECONDS
      ? Number.parseInt(NEXT_PUBLIC_ABANDONMENT_RESCUE_THRESHOLD_SECONDS)
      : 30,
    onAbandonment: handleAbandonment,
    onRescue: handleRescue,
    enabled: NEXT_PUBLIC_FEATURE_ABANDONMENT_RESCUE === "true",
  })

  const closeRescueModal = useCallback(() => {
    setIsRescueModalOpen(false)
    setIsAbandonmentTriggered(false)
    resetFunnel() // Reset timer after closing modal
  }, [resetFunnel])

  const closeChatIntervention = useCallback(() => {
    setIsChatInterventionOpen(false)
    setIsAbandonmentTriggered(false)
    resetFunnel() // Reset timer after closing intervention
  }, [resetFunnel])

  const triggerAbandonment = useCallback(() => {
    handleAbandonment()
  }, [handleAbandonment])

  const triggerRescue = useCallback(() => {
    handleRescue()
  }, [handleRescue])

  return (
    <AbandonmentContext.Provider
      value={{
        isAbandonmentTriggered,
        isRescueModalOpen,
        isChatInterventionOpen,
        closeRescueModal,
        closeChatIntervention,
        triggerAbandonment,
        triggerRescue,
      }}
    >
      {children}
      {isRescueModalOpen && <DiscountRescueModal onClose={closeRescueModal} />}
      {isChatInterventionOpen && <ChatIntervention onClose={closeChatIntervention} />}
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
