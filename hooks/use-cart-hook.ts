"use client"
import { useContext } from "react"
import { CartContext } from "@/lib/cart-context"

export function useCart() {
  const cartContext = useContext(CartContext)

  if (!cartContext) {
    console.error("useCart must be used within a CartProvider")
    return {
      cart: { items: [], totalItems: 0, totalPrice: 0 },
      addItem: () => {},
      removeItem: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
    }
  }

  return cartContext
}
