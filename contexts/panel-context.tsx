"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type PanelState = {
  id: string
  isExpanded: boolean
  width: number
  position: number
}

type PanelContextType = {
  panels: Record<string, PanelState>
  registerPanel: (id: string, position: number) => void
  updatePanel: (id: string, isExpanded: boolean, width?: number) => void
  getDisplacement: (id: string, position: number) => number
}

const PanelContext = createContext<PanelContextType | undefined>(undefined)

export function PanelProvider({ children }: { children: ReactNode }) {
  const [panels, setPanels] = useState<Record<string, PanelState>>({})

  const registerPanel = useCallback((id: string, position: number) => {
    setPanels((prev) => ({
      ...prev,
      [id]: { id, isExpanded: false, width: 48, position },
    }))
  }, [])

  const updatePanel = useCallback((id: string, isExpanded: boolean, width = 48) => {
    setPanels((prev) => ({
      ...prev,
      [id]: { ...prev[id], isExpanded, width },
    }))
  }, [])

  const getDisplacement = useCallback(
    (id: string, position: number) => {
      let displacement = 0
      Object.values(panels).forEach((panel) => {
        if (panel.id !== id && panel.isExpanded && panel.position > position) {
          displacement += panel.width - 48
        }
      })
      return displacement
    },
    [panels],
  )

  return (
    <PanelContext.Provider value={{ panels, registerPanel, updatePanel, getDisplacement }}>
      {children}
    </PanelContext.Provider>
  )
}

export const usePanelContext = () => {
  const context = useContext(PanelContext)
  if (!context) throw new Error("usePanelContext must be used within PanelProvider")
  return context
}
