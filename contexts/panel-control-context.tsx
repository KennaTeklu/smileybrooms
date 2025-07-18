"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

type SetExpandedFunction = (expanded: boolean) => void

type PanelControlContextType = {
  registerPanel: (id: string, setExpanded: SetExpandedFunction) => void
  unregisterPanel: (id: string) => void
  collapseAllPanels: () => void
}

const PanelControlContext = createContext<PanelControlContextType | undefined>(undefined)

export function PanelControlProvider({ children }: { children: ReactNode }) {
  const [panelSetters, setPanelSetters] = useState<Map<string, SetExpandedFunction>>(new Map())

  const registerPanel = useCallback((id: string, setExpanded: SetExpandedFunction) => {
    setPanelSetters((prev) => {
      const newMap = new Map(prev)
      newMap.set(id, setExpanded)
      return newMap
    })
  }, [])

  const unregisterPanel = useCallback((id: string) => {
    setPanelSetters((prev) => {
      const newMap = new Map(prev)
      newMap.delete(id)
      return newMap
    })
  }, [])

  const collapseAllPanels = useCallback(() => {
    panelSetters.forEach((setExpanded) => {
      setExpanded(false)
    })
  }, [panelSetters])

  const contextValue = useMemo(
    () => ({
      registerPanel,
      unregisterPanel,
      collapseAllPanels,
    }),
    [registerPanel, unregisterPanel, collapseAllPanels],
  )

  return <PanelControlContext.Provider value={contextValue}>{children}</PanelControlContext.Provider>
}

export const usePanelControl = () => {
  const context = useContext(PanelControlContext)
  if (context === undefined) {
    throw new Error("usePanelControl must be used within a PanelControlProvider")
  }
  return context
}
