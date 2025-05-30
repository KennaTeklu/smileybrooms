"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
      } else {
        return [...prevItems, { ...item, quantity }]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
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
