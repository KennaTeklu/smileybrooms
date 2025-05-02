"use client"

import { createContext, useContext } from "react"
import type { CartItem } from "@/lib/cart-context"

type CartContextType = {
  cart: {
    items: CartItem[]
    totalItems: number
    totalPrice: number
  }
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
