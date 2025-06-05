"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { X, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { CheckoutButton } from "@/components/checkout-button"

interface CartContentProps {
  onClose: () => void
}

function CartContent({ onClose }: CartContentProps) {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  const handleClearCart = useCallback(() => {
    clearCart()
    // Optionally close cart after clearing
    // onClose()
  }, [clearCart])

  if (cart.items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground">Add some services to get started!</p>
        <Button onClick={onClose} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Cart</h2>
          <Badge variant="secondary">{cart.totalItems}</Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Close cart"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Cart Items - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
              {item.image && (
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="h-12 w-12 rounded object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                {item.sourceSection && <p className="text-xs text-muted-foreground">{item.sourceSection}</p>}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="h-7 w-7 p-0 ml-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total:</span>
          <span className="text-lg font-bold">${cart.totalPrice.toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <CheckoutButton />
          <Button variant="outline" onClick={handleClearCart} className="w-full">
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Cart() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { cart } = useCart()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close cart function
  const closeCart = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Open cart function
  const openCart = useCallback(() => {
    setIsOpen(true)
  }, [])

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Only close if clicking the backdrop itself, not its children
      if (e.target === e.currentTarget) {
        closeCart()
      }
    },
    [closeCart],
  )

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, closeCart])

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Don't render until mounted to avoid SSR issues
  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Cart Trigger Button - Fixed Position */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={openCart}
          className="relative h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          size="sm"
          aria-label="Open shopping cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {cart.totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 text-xs animate-pulse"
            >
              {cart.totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-label="Close cart"
          />

          {/* Cart Panel */}
          <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-xl animate-in slide-in-from-right duration-300">
            <CartContent onClose={closeCart} />
          </div>
        </>
      )}
    </>
  )
}
