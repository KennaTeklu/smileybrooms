"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the cart item type
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  type: string
  details?: {
    rooms?: Array<{
      type: string
      count: number
      tier: string
    }>
    addOns?: Array<{
      roomName: string
      name: string
      price: number
    }>
    reductions?: Array<{
      roomName: string
      name: string
      discount: number
    }>
    frequency?: string
    serviceFee?: number
    frequencyDiscount?: number
  }
}

// Define the cart context type
interface CartContextType {
  cart: {
    items: CartItem[]
  }
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getItemCount: () => number
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Create a provider component
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart state
  const [cart, setCart] = useState<{ items: CartItem[] }>({ items: [] })

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [cart])

  // Add an item to the cart
  const addItem = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if the item already exists in the cart
      const existingItemIndex = prevCart.items.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Update the existing item
        const updatedItems = [...prevCart.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        }
        return { ...prevCart, items: updatedItems }
      } else {
        // Add the new item
        return { ...prevCart, items: [...prevCart.items, item] }
      }
    })
  }

  // Remove an item from the cart
  const removeItem = (itemId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((item) => item.id !== itemId),
    }))
  }

  // Update the quantity of an item in the cart
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    }))
  }

  // Clear the cart
  const clearCart = () => {
    setCart({ items: [] })
  }

  // Calculate the total price of all items in the cart
  const getCartTotal = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Get the total number of items in the cart
  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  // Create the context value
  const contextValue: CartContextType = {
    cart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

// Create a hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
