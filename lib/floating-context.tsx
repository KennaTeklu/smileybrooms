"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface FloatingControlsState {
  accessibilityPanelVisible: boolean
  sharePanelVisible: boolean
  setAccessibilityPanelVisible: (visible: boolean) => void
  setSharePanelVisible: (visible: boolean) => void
  toggleAccessibilityPanel: () => void
  toggleSharePanel: () => void
  hideAllPanels: () => void
}

const FloatingControlsContext = createContext<FloatingControlsState | undefined>(undefined)

export function FloatingControlsProvider({ children }: { children: React.ReactNode }) {
  const [accessibilityPanelVisible, setAccessibilityPanelVisible] = useState(false)
  const [sharePanelVisible, setSharePanelVisible] = useState(false)
  const pathname = usePathname()

  // Reset panel states on page navigation
  useEffect(() => {
    setAccessibilityPanelVisible(false)
    setSharePanelVisible(false)
  }, [pathname])

  const toggleAccessibilityPanel = () => {
    setAccessibilityPanelVisible((prev) => !prev)
    if (!accessibilityPanelVisible) {
      setSharePanelVisible(false)
    }
  }

  const toggleSharePanel = () => {
    setSharePanelVisible((prev) => !prev)
    if (!sharePanelVisible) {
      setAccessibilityPanelVisible(false)
    }
  }

  const hideAllPanels = () => {
    setAccessibilityPanelVisible(false)
    setSharePanelVisible(false)
  }

  return (
    <FloatingControlsContext.Provider
      value={{
        accessibilityPanelVisible,
        sharePanelVisible,
        setAccessibilityPanelVisible,
        setSharePanelVisible,
        toggleAccessibilityPanel,
        toggleSharePanel,
        hideAllPanels,
      }}
    >
      {children}
    </FloatingControlsContext.Provider>
  )
}

export function useFloatingControls() {
  const context = useContext(FloatingControlsContext)
  if (context === undefined) {
    throw new Error("useFloatingControls must be used within a FloatingControlsProvider")
  }
  return context
}
