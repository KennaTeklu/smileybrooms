"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CartButton } from "./CartButton"
import { CartPanel } from "./CartPanel"
import { useCart } from "@/lib/cart-context"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useCartPosition } from "@/hooks/useCartPosition"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useCartA11y } from "@/hooks/useCartA11y"
import { cn } from "@/lib/utils"
import { FLOATING_LAYERS } from "@/lib/floating-system"

export function FloatingCart() {
  const { cartItems, getTotalItems, getTotalPrice } = useCart()
  const itemCount = getTotalItems()
  const totalPrice = getTotalPrice()
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Use the modified useCartPosition hook for fixed top-right positioning
  const { cartRef: buttonContainerRef, styles: buttonContainerStyles } = useCartPosition({
    mode: "fixed-viewport",
    position: "top-right", // Position at top-right
    topOffset: 100, // 100px from top of viewport
    rightOffset: 20, // 20px from right edge of viewport
  })

  useClickOutside(panelRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return // Click was on the button, don't close panel
    }
    setIsPanelOpen(false)
  })

  useKeyboardShortcuts({
    "alt+c": () => setIsPanelOpen((prev) => !prev),
    Escape: () => setIsPanelOpen(false),
  })

  useCartA11y({ isPanelOpen, itemCount, totalPrice })

  useEffect(() => {
    if (itemCount === 0 && isPanelOpen) {
      setIsPanelOpen(false)
    }
  }, [itemCount, isPanelOpen])

  const handleButtonClick = () => {
    setIsPanelOpen((prev) => !prev)
  }

  return (
    <div
      ref={buttonContainerRef}
      className={cn(
        `z-[${FLOATING_LAYERS.CART_BUTTON}] transition-all duration-300 ease-out`,
        itemCount === 0 && "hidden", // Hide if no items
      )}
      style={buttonContainerStyles} // Apply calculated styles for top positioning
    >
      <CartButton
        ref={buttonRef}
        itemCount={itemCount}
        totalPrice={totalPrice}
        onClick={handleButtonClick}
        isOpen={isPanelOpen}
        disabled={itemCount === 0}
      />

      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -20, scale: 0.95 }} // Changed y to -20 for top positioning
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }} // Changed y to -20 for top positioning
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute top-full right-0 mt-4 w-80 sm:w-96 max-h-[80vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col" // Changed to top-full and mt-4
            id="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-panel-title"
          >
            <CartPanel onClose={() => setIsPanelOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
