"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react"
import type { CartItem, CartContextType, CartSummary } from "@/lib/types"

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("smileybrooms_cart")
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("smileybrooms_cart", JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addItem = useCallback((item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
        }
        return updatedItems
      } else {
        return [...prevItems, item]
      }
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === id)

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]
        if (quantity <= 0) {
          updatedItems.splice(existingItemIndex, 1) // Remove if quantity is 0 or less
        } else {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: quantity,
          }
        }
        return updatedItems
      }
      return prevItems
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const calculateSummary = useMemo(() => {
    const summary: CartSummary = {
      subTotal: 0,
      discounts: 0,
      taxes: 0,
      shipping: 0,
      total: 0,
    }

    cartItems.forEach((item) => {
      summary.subTotal += item.price * item.quantity
    })

    // Example: Apply a 10% discount if subtotal is over $200
    if (summary.subTotal > 200) {
      summary.discounts = summary.subTotal * 0.1
    }

    // Example: Flat shipping fee
    summary.shipping = cartItems.length > 0 ? 15 : 0

    // Example: 8% sales tax
    summary.taxes = (summary.subTotal - summary.discounts) * 0.08

    summary.total = summary.subTotal - summary.discounts + summary.shipping + summary.taxes

    return summary
  }, [cartItems])

  const cart: CartContextType["cart"] = useMemo(
    () => ({
      items: cartItems,
      totalPrice: calculateSummary.total,
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      summary: calculateSummary,
    }),
    [cartItems, calculateSummary],
  )

  const contextValue = useMemo(
    () => ({
      cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [cart, addItem, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
