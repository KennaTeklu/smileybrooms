"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface PanelVisibilityContextType {
  arePanelsVisible: boolean
  togglePanelsVisibility: () => void
}

const PanelVisibilityContext = createContext<PanelVisibilityContextType | undefined>(undefined)

export function PanelVisibilityProvider({ children }: { children: ReactNode }) {
  const [arePanelsVisible, setArePanelsVisible] = useState(true) // Default to visible

  const togglePanelsVisibility = () => {
    setArePanelsVisible((prev) => !prev)
  }

  return (
    <PanelVisibilityContext.Provider value={{ arePanelsVisible, togglePanelsVisibility }}>
      {children}
    </PanelVisibilityContext.Provider>
  )
}

export function usePanelVisibility() {
  const context = useContext(PanelVisibilityContext)
  if (context === undefined) {
    throw new Error("usePanelVisibility must be used within a PanelVisibilityProvider")
  }
  return context
}
