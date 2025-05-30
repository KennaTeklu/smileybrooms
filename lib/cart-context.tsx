"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  priceId?: string // Stripe Price ID
  metadata?: Record<string, any> // For custom data like rooms, frequency, customer info
}

interface CartState {
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

interface CartContextType {
  cart: CartState
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "smileybrooms_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartState>({ items: [], totalPrice: 0, totalItems: 0 })

  // Load cart from localStorage on initial mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        setCart(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
      // Fallback to empty cart if parsing fails
      setCart({ items: [], totalPrice: 0, totalItems: 0 })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [cart])

  const calculateCartTotals = useCallback((currentItems: CartItem[]) => {
    const newTotalPrice = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const newTotalItems = currentItems.reduce((sum, item) => sum + item.quantity, 0)
    return { newTotalPrice, newTotalItems }
  }, [])

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantityToAdd = 1) => {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.items.findIndex((i) => i.id === item.id)
        let updatedItems: CartItem[]

        if (existingItemIndex > -1) {
          // Item exists, update quantity
          updatedItems = prevCart.items.map((i, index) =>
            index === existingItemIndex ? { ...i, quantity: i.quantity + quantityToAdd } : i,
          )
        } else {
          // New item, add to cart
          updatedItems = [...prevCart.items, { ...item, quantity: quantityToAdd }]
        }

        const { newTotalPrice, newTotalItems } = calculateCartTotals(updatedItems)
        return { items: updatedItems, totalPrice: newTotalPrice, totalItems: newTotalItems }
      })
    },
    [calculateCartTotals],
  )

  const removeItem = useCallback(
    (id: string) => {
      setCart((prevCart) => {
        const updatedItems = prevCart.items.filter((item) => item.id !== id)
        const { newTotalPrice, newTotalItems } = calculateCartTotals(updatedItems)
        return { items: updatedItems, totalPrice: newTotalPrice, totalItems: newTotalItems }
      })
    },
    [calculateCartTotals],
  )

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      setCart((prevCart) => {
        const updatedItems = prevCart.items
          .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
          .filter((item) => item.quantity > 0) // Remove if quantity becomes 0

        const { newTotalPrice, newTotalItems } = calculateCartTotals(updatedItems)
        return { items: updatedItems, totalPrice: newTotalPrice, totalItems: newTotalItems }
      })
    },
    [calculateCartTotals],
  )

  const clearCart = useCallback(() => {
    setCart({ items: [], totalPrice: 0, totalItems: 0 })
  }, [])

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
