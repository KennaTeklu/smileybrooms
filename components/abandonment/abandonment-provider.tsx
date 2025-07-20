"use client"

import { createContext, useContext, type ReactNode } from "react"
import { rescueFunnel } from "@/lib/abandonment/rescue-funnel"
import { HelpPrompt } from "@/components/abandonment/help-prompt" // Import the new HelpPrompt component

type AbandonmentContextType = {}

const AbandonmentContext = createContext<AbandonmentContextType | undefined>(undefined)

export function AbandonmentProvider({ children }: { children: ReactNode }) {
  const { showHelpPrompt, setShowHelpPrompt } = rescueFunnel({
    inactivityTimeoutMs: 2592000000, // 1 month
    enableChatIntervention: true,
  })

  return (
    <AbandonmentContext.Provider value={{}}>
      {children}

      <HelpPrompt isOpen={showHelpPrompt} onClose={() => setShowHelpPrompt(false)} />
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
