"use client"

import { useMemo } from "react"

import { useRef } from "react"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

// Define a type for panel configuration
interface PanelConfig {
  isFullscreen: boolean // Does this panel take over the whole screen?
  zIndex: number // What z-index should it have when active?
}

// Define the context value
interface PanelManagerContextType {
  activePanel: string | null
  setActivePanel: (panelId: string | null) => void
  registerPanel: (panelId: string, config: PanelConfig) => void
  unregisterPanel: (panelId: string) => void
  getPanelConfig: (panelId: string) => PanelConfig | undefined
}

const PanelManagerContext = createContext<PanelManagerContextType | undefined>(undefined)

export function PanelManagerProvider({ children }: { children: React.ReactNode }) {
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const panelConfigs = useRef<Map<string, PanelConfig>>(new Map())

  const registerPanel = useCallback((panelId: string, config: PanelConfig) => {
    panelConfigs.current.set(panelId, config)
  }, [])

  const unregisterPanel = useCallback(
    (panelId: string) => {
      panelConfigs.current.delete(panelId)
      if (activePanel === panelId) {
        setActivePanel(null) // If the active panel unmounts, clear active state
      }
    },
    [activePanel],
  )

  const getPanelConfig = useCallback((panelId: string) => {
    return panelConfigs.current.get(panelId)
  }, [])

  // Effect to manage body overflow when a fullscreen panel is active
  useEffect(() => {
    const activeConfig = activePanel ? getPanelConfig(activePanel) : undefined
    if (activeConfig?.isFullscreen) {
      document.body.style.overflow = "hidden"
      document.body.classList.add("panel-locked")
    } else {
      document.body.style.overflow = ""
      document.body.classList.remove("panel-locked")
    }
  }, [activePanel, getPanelConfig])

  const contextValue = useMemo(
    () => ({
      activePanel,
      setActivePanel,
      registerPanel,
      unregisterPanel,
      getPanelConfig,
    }),
    [activePanel, setActivePanel, registerPanel, unregisterPanel, getPanelConfig],
  )

  return <PanelManagerContext.Provider value={contextValue}>{children}</PanelManagerContext.Provider>
}

export function usePanelManager() {
  const context = useContext(PanelManagerContext)
  if (context === undefined) {
    throw new Error("usePanelManager must be used within a PanelManagerProvider")
  }
  return context
}
