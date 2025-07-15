"use client"

import type React from "react"
import { createContext, useReducer, useContext, useEffect, useCallback } from "react"
import type { CartItem } from "@/lib/cart/types"

// Define the shape of the cart state
interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

// Define action types
type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "ADD_MULTIPLE_ITEMS"; items: CartItem[] } // New action type

// Define the cart context type
interface CartContextType {
  cart: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  addMultipleItems: (items: CartItem[]) => void // New function
}

// Initial cart state
const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
}

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { totalItems, totalPrice }
}

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let updatedItems: CartItem[]

  switch (action.type) {
    case "ADD_ITEM":
      updatedItems = [...state.items]
      const existingItemIndex = updatedItems.findIndex((item) => item.id === action.item.id)

      if (existingItemIndex > -1) {
        // If item exists, update quantity
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.item.quantity,
        }
      } else {
        // Otherwise, add new item
        updatedItems.push(action.item)
      }
      return { ...state, items: updatedItems, ...calculateTotals(updatedItems) }

    case "REMOVE_ITEM":
      updatedItems = state.items.filter((item) => item.id !== action.id)
      return { ...state, items: updatedItems, ...calculateTotals(updatedItems) }

    case "UPDATE_QUANTITY":
      updatedItems = state.items
        .map((item) => (item.id === action.id ? { ...item, quantity: action.quantity } : item))
        .filter((item) => item.quantity > 0) // Remove if quantity drops to 0
      return { ...state, items: updatedItems, ...calculateTotals(updatedItems) }

    case "CLEAR_CART":
      return { ...initialCartState }

    case "ADD_MULTIPLE_ITEMS": // Handle new action
      updatedItems = [...state.items]
      action.items.forEach((newItem) => {
        const existingIndex = updatedItems.findIndex((item) => item.id === newItem.id)
        if (existingIndex > -1) {
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + newItem.quantity,
          }
        } else {
          updatedItems.push(newItem)
        }
      })
      return { ...state, items: updatedItems, ...calculateTotals(updatedItems) }

    default:
      return state
  }
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider component
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage
  const init = (initialState: CartState) => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("smileyBroomsCart")
        return storedCart ? JSON.parse(storedCart) : initialState
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        return initialState
      }
    }
    return initialState
  }

  const [cart, dispatch] = useReducer(cartReducer, initialCartState, init)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("smileyBroomsCart", JSON.stringify(cart))
    }
  }, [cart])

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", item })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", id })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", id, quantity })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" })
  }, [])

  const addMultipleItems = useCallback((items: CartItem[]) => {
    dispatch({ type: "ADD_MULTIPLE_ITEMS", items })
  }, [])

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, addMultipleItems }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
