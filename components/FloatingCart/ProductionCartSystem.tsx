"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { CartPanel } from "./CartPanel"
import CartButton from "./CartButton"
import { useCart } from "@/lib/cart-context"
import { useCartPanelVisibility } from "@/contexts/cart-panel-visibility-context" // Import the new hook

export function ProductionCartSystem() {
  const { cart } = useCart()
  const { isCartPanelOpen, openCartPanel, closeCartPanel } = useCartPanelVisibility() // Use the new context
  const cartPanelRef = useRef<HTMLDivElement>(null)

  // Close cart panel if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartPanelRef.current && !cartPanelRef.current.contains(event.target as Node)) {
        closeCartPanel()
      }
    }

    if (isCartPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isCartPanelOpen, closeCartPanel])

  // Handle keyboard accessibility (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isCartPanelOpen) {
        closeCartPanel()
      }
    }

    if (isCartPanelOpen) {
      document.addEventListener("keydown", handleKeyDown)
    } else {
      document.removeEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isCartPanelOpen, closeCartPanel])

  // Only render the floating button if there are items in the cart
  if (cart.totalItems === 0) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <CartButton onClick={openCartPanel} /> {/* Use openCartPanel from context */}
      </div>
      <AnimatePresence>
        {isCartPanelOpen && (
          <CartPanel ref={cartPanelRef} isOpen={isCartPanelOpen} onClose={closeCartPanel} cart={cart} />
        )}
      </AnimatePresence>
    </>
  )
}
