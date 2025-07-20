import type React from "react"
import { rescueFunnel } from "@/lib/abandonment/rescue-funnel"

export function AbandonmentProvider({ children }: { children: React.ReactNode }) {
  const {
    showDiscountModal,
    setShowDiscountModal,
    showChatPrompt,
    setShowChatPrompt,
    currentDiscount,
    sendSmsReminder,
  } = rescueFunnel()

  return (
    <>
      {children}
      {/* Discount Modal and Chat Prompt components will be rendered here based on the rescueFunnel logic */}
    </>
  )
}
