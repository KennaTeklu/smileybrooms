"use client"

import type React from "react"
import { createContext, useReducer, useContext, useEffect, useCallback } from "react"

// Define the shape of a single item in the cart
export interface CartItem {
  id: string // Unique ID for the item (e.g., roomType-tier-addons-reductions)
  name: string // Display name (e.g., "Bedroom Cleaning - Standard")
  price: number // Price per unit
  quantity: number // Number of units (e.g., number of bedrooms)
  image?: string // Optional image URL
  metadata?: {
    [key: string]: any // Flexible metadata for additional details (e.g., frequency, roomType, selectedTier, selectedAddOns, selectedReductions)
  }
  paymentType?: "online" | "in_person" // How this item is paid for
}

// Define the shape of the cart state
interface CartState {
  items: CartItem[]
}

// Define the actions that can be dispatched to modify the cart
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_MULTIPLE_ITEMS"; payload: CartItem[] }

// Define the shape of the CartContext
interface CartContextType {
  cart: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  addMultipleItems: (items: CartItem[]) => void
}

// Create the CartContext
const CartContext = createContext<CartContextType | undefined>(undefined)

// Reducer function to manage cart state
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)

      if (existingItemIndex > -1) {
        // If item exists, update its quantity
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        }
        return { ...state, items: updatedItems }
      } else {
        // Otherwise, add new item
        return { ...state, items: [...state.items, action.payload] }
      }
    }
    case "ADD_MULTIPLE_ITEMS": {
      const updatedItems = [...state.items]
      action.payload.forEach((newItem) => {
        const existingItemIndex = updatedItems.findIndex((item) => item.id === newItem.id)
        if (existingItemIndex > -1) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
          }
        } else {
          updatedItems.push(newItem)
        }
      })
      return { ...state, items: updatedItems }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0) // Remove if quantity drops to 0 or less
      return { ...state, items: updatedItems }
    }
    case "CLEAR_CART":
      return { ...state, items: [] }
    default:
      return state
  }
}

// CartProvider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage
  const initializer = useCallback((initialState: CartState) => {
    try {
      const storedCart = localStorage.getItem("smiley-brooms-cart")
      return storedCart ? JSON.parse(storedCart) : initialState
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error)
      return initialState // Return initial state if parsing fails
    }
  }, [])

  const [cart, dispatch] = useReducer(cartReducer, { items: [] }, initializer)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("smiley-brooms-cart", JSON.stringify(cart))
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [cart])

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" })
  }, [])

  const addMultipleItems = useCallback((items: CartItem[]) => {
    dispatch({ type: "ADD_MULTIPLE_ITEMS", payload: items })
  }, [])

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, addMultipleItems }}>
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
