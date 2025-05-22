"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AddedToCartNotification } from "@/components/added-to-cart-notification"

// Define the cart item type
export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  // Add other properties as needed
}

// Define the cart context type
type CartContextType = {
  cart: {
    items: CartItem[]
    totalItems: number
    totalPrice: number
  }
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Create the cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  // State for the cart
  const [cart, setCart] = useState<{
    items: CartItem[]
    totalItems: number
    totalPrice: number
  }>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  })

  // State for the notification
  const [notification, setNotification] = useState<{
    isVisible: boolean
    itemName: string
  }>({
    isVisible: false,
    itemName: "",
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Add an item to the cart
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart
      const existingItemIndex = prevCart.items.findIndex((cartItem) => cartItem.id === item.id)

      let updatedItems: CartItem[]

      if (existingItemIndex >= 0) {
        // If the item is already in the cart, update its quantity
        updatedItems = [...prevCart.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        }
      } else {
        // If the item is not in the cart, add it
        updatedItems = [...prevCart.items, item]
      }

      // Calculate the new total items and price
      const newTotalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)
      const newTotalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)

      // Show notification
      setNotification({
        isVisible: true,
        itemName: item.name,
      })

      return {
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      }
    })
  }

  // Remove an item from the cart
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      // Filter out the item to remove
      const updatedItems = prevCart.items.filter((item) => item.id !== itemId)

      // Calculate the new total items and price
      const newTotalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)
      const newTotalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)

      return {
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      }
    })
  }

  // Update the quantity of an item in the cart
  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((prevCart) => {
      // Find the item to update
      const updatedItems = prevCart.items.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity }
        }
        return item
      })

      // Calculate the new total items and price
      const newTotalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)
      const newTotalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0)

      return {
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      }
    })
  }

  // Clear the cart
  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    })
  }

  // Close the notification
  const closeNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }))
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
      <AddedToCartNotification
        isVisible={notification.isVisible}
        itemName={notification.itemName}
        onClose={closeNotification}
      />
    </CartContext.Provider>
  )
}

// Create a hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
