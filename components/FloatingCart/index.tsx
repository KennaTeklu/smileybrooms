"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart-context"
import { useCartPosition } from "@/hooks/useCartPosition"
import { useCartA11y } from "@/hooks/useCartA11y"
import { CartButton } from "./CartButton"
import { CartPanel } from "./CartPanel"
import { cn } from "@/lib/utils"
import styles from "./cart.module.css"

interface FloatingCartProps {
  className?: string
}

export function FloatingCart({ className }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { cart } = useCart()
  const { cartRef, boundary } = useCartPosition()
  const { a11yState, announceCartUpdate, trapFocus, focusTrapRef } = useCartA11y()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleOpenCart = () => {
    setIsOpen(true)
    announceCartUpdate("open", undefined, cart.totalItems)
  }

  const handleCloseCart = () => {
    setIsOpen(false)
    announceCartUpdate("close", undefined, cart.totalItems)
  }

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleCloseCart()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      trapFocus(true)

      // Prevent body scroll
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, trapFocus])

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Fixed Cart Container */}
      <div ref={cartRef} className={cn(styles.cartContainer, className)} data-testid="floating-cart-container">
        <CartButton itemCount={cart.totalItems} totalPrice={cart.totalPrice} onClick={handleOpenCart} isOpen={isOpen} />
      </div>

      {/* Cart Panel with Animation */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className={styles.cartBackdrop}
              onClick={handleCloseCart}
              aria-label="Close cart"
              data-testid="cart-backdrop"
            />

            {/* Cart Panel */}
            <div ref={focusTrapRef}>
              <CartPanel isOpen={isOpen} onClose={handleCloseCart} cart={cart} />
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Screen Reader Announcements */}
      <div id="cart-status" aria-live="polite" aria-atomic="true" className="sr-only">
        {a11yState.statusMessage}
      </div>
    </>
  )
}
