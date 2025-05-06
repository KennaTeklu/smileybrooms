"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

// Define types
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  priceId?: string
  image?: string
  metadata?: Record<string, any>
  paymentFrequency?: "per_service" | "monthly" | "yearly"
}

interface CartContextType {
  cart: {
    items: CartItem[]
    totalItems: number
    totalPrice: number
  }
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<{
    items: CartItem[]
    totalItems: number
    totalPrice: number
  }>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  })

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        // Reset cart if parsing fails
        setCart({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        })
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Add item to cart
  const addItem = (item: Omit<CartItem, "id">) => {
    setCart((prevCart) => {
      // Check if item with same properties already exists
      const existingItemIndex = prevCart.items.findIndex((i) => {
        // For custom items with metadata, we need to check if they have the same metadata
        if (item.metadata) {
          // For items with customer data, we consider them unique
          if (item.metadata.customer) {
            return false
          }

          // For other items with metadata, compare the metadata
          return (
            i.name === item.name &&
            i.price === item.price &&
            JSON.stringify(i.metadata) === JSON.stringify(item.metadata)
          )
        }

        // For regular items, just check name and price
        return i.name === item.name && i.price === item.price && !i.metadata
      })

      let newItems: CartItem[]

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        newItems = [...prevCart.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + (item.quantity || 1),
        }
      } else {
        // Add new item
        newItems = [
          ...prevCart.items,
          {
            ...item,
            id: uuidv4(),
            quantity: item.quantity || 1,
          },
        ]
      }

      // Calculate new totals
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return {
        items: newItems,
        totalItems,
        totalPrice,
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== id)
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return {
        items: newItems,
        totalItems,
        totalPrice,
      }
    })
  }

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => (item.id === id ? { ...item, quantity } : item))
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return {
        items: newItems,
        totalItems,
        totalPrice,
      }
    })
  }

  // Clear cart
  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
