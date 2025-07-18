"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Define a type for the panel setter function
type PanelSetter = (value: boolean) => void

type PanelControlContextType = {
  registerPanel: (setter: PanelSetter) => () => void
  collapseAllPanels: () => void
}

const PanelControlContext = createContext<PanelControlContextType | undefined>(undefined)

export function PanelControlProvider({ children }: { children: ReactNode }) {
  // Using a Set to store unique setter functions
  const [panelSetters, setPanelSetters] = useState<Set<PanelSetter>>(new Set())

  const registerPanel = useCallback((setter: PanelSetter) => {
    setPanelSetters((prevSet) => {
      const newSet = new Set(prevSet)
      newSet.add(setter)
      return newSet
    })
    // Return an unregister function for cleanup
    return () => {
      setPanelSetters((prevSet) => {
        const newSet = new Set(prevSet)
        newSet.delete(setter)
        return newSet
      })
    }
  }, [])

  const collapseAllPanels = useCallback(() => {
    panelSetters.forEach((setter) => setter(false))
  }, [panelSetters])

  return (
    <PanelControlContext.Provider value={{ registerPanel, collapseAllPanels }}>{children}</PanelControlContext.Provider>
  )
}

export const usePanelControl = () => {
  const context = useContext(PanelControlContext)
  if (context === undefined) {
    throw new Error("usePanelControl must be used within a PanelControlProvider")
  }
  return context
}
