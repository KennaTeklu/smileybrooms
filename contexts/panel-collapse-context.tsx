"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface PanelCollapseContextType {
  collapseAll: boolean
  triggerCollapseAll: () => void
  resetCollapseAll: () => void
}

const PanelCollapseContext = createContext<PanelCollapseContextType | undefined>(undefined)

export function PanelCollapseProvider({ children }: { children: React.ReactNode }) {
  const [collapseAll, setCollapseAll] = useState(false)

  const triggerCollapseAll = useCallback(() => {
    setCollapseAll(true)
    // Reset after a short delay to allow panels to respond
    setTimeout(() => setCollapseAll(false), 100)
  }, [])

  const resetCollapseAll = useCallback(() => {
    setCollapseAll(false)
  }, [])

  return (
    <PanelCollapseContext.Provider value={{ collapseAll, triggerCollapseAll, resetCollapseAll }}>
      {children}
    </PanelCollapseContext.Provider>
  )
}

export function usePanelCollapse() {
  const context = useContext(PanelCollapseContext)
  if (context === undefined) {
    throw new Error("usePanelCollapse must be used within a PanelCollapseProvider")
  }
  return context
}
