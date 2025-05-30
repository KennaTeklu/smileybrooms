"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  priceId?: string // For Stripe Price ID
  metadata?: Record<string, any> // For additional item details
}

interface CartContextType {
  cartItems: CartItem[]
  totalPrice: number
  totalItems: number
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Load cart from localStorage on initial mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("smileybrooms_cart")
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
      // Optionally clear corrupted cart
      localStorage.removeItem("smileybrooms_cart")
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("smileybrooms_cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems]
          updatedItems[existingItemIndex].quantity += quantity
          return updatedItems
        } else {
          return [...prevItems, { ...item, quantity }]
        }
      })
      toast({
        title: "Item added to cart",
        description: `${item.name} (${quantity}) added.`,
        duration: 2000,
      })
    },
    [toast],
  )

  const removeFromCart = useCallback(
    (id: string) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
        duration: 2000,
      })
    },
    [toast],
  )

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      )
      return updatedItems
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
      duration: 2000,
    })
  }, [toast])

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const value = {
    cartItems,
    totalPrice,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
