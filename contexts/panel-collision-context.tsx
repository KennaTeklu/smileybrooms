"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface PanelState {
  id: string
  isExpanded: boolean
  position: { top: number; right: number }
  width: number
  height: number
}

interface PanelCollisionContextType {
  panels: Record<string, PanelState>
  registerPanel: (id: string, state: Omit<PanelState, "id">) => void
  updatePanel: (id: string, updates: Partial<Omit<PanelState, "id">>) => void
  getAdjustedPosition: (id: string, basePosition: { top: number; right: number }) => { top: number; right: number }
}

const PanelCollisionContext = createContext<PanelCollisionContextType | undefined>(undefined)

export function PanelCollisionProvider({ children }: { children: React.ReactNode }) {
  const [panels, setPanels] = useState<Record<string, PanelState>>({})

  const registerPanel = useCallback((id: string, state: Omit<PanelState, "id">) => {
    setPanels((prev) => ({
      ...prev,
      [id]: { id, ...state },
    }))
  }, [])

  const updatePanel = useCallback((id: string, updates: Partial<Omit<PanelState, "id">>) => {
    setPanels((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }))
  }, [])

  const getAdjustedPosition = useCallback(
    (id: string, basePosition: { top: number; right: number }) => {
      const currentPanel = panels[id]
      if (!currentPanel) return basePosition

      const adjustedPosition = { ...basePosition }

      // Check for collisions with other expanded panels
      Object.values(panels).forEach((panel) => {
        if (panel.id === id || !panel.isExpanded) return

        const currentTop = adjustedPosition.top
        const currentBottom = currentTop + (currentPanel.height || 200)
        const panelTop = panel.position.top
        const panelBottom = panelTop + panel.height

        // Check if panels would overlap vertically
        if (currentTop < panelBottom && currentBottom > panelTop) {
          // Push the current panel down to avoid collision
          adjustedPosition.top = panelBottom + 10
        }
      })

      return adjustedPosition
    },
    [panels],
  )

  return (
    <PanelCollisionContext.Provider
      value={{
        panels,
        registerPanel,
        updatePanel,
        getAdjustedPosition,
      }}
    >
      {children}
    </PanelCollisionContext.Provider>
  )
}

export function usePanelCollision() {
  const context = useContext(PanelCollisionContext)
  if (!context) {
    throw new Error("usePanelCollision must be used within a PanelCollisionProvider")
  }
  return context
}
