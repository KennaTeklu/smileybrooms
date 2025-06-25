"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CartPanelVisibilityContextType {
  isCartPanelOpen: boolean
  openCartPanel: () => void
  closeCartPanel: () => void
}

const CartPanelVisibilityContext = createContext<CartPanelVisibilityContextType | undefined>(undefined)

export function CartPanelVisibilityProvider({ children }: { children: ReactNode }) {
  const [isCartPanelOpen, setIsCartPanelOpen] = useState(false)

  const openCartPanel = () => setIsCartPanelOpen(true)
  const closeCartPanel = () => setIsCartPanelOpen(false)

  return (
    <CartPanelVisibilityContext.Provider value={{ isCartPanelOpen, openCartPanel, closeCartPanel }}>
      {children}
    </CartPanelVisibilityContext.Provider>
  )
}

export function useCartPanelVisibility() {
  const context = useContext(CartPanelVisibilityContext)
  if (context === undefined) {
    throw new Error("useCartPanelVisibility must be used within a CartPanelVisibilityProvider")
  }
  return context
}
