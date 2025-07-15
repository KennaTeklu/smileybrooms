"use client"

import type React from "react"
import { createContext, useReducer, useContext, useEffect, useCallback } from "react"
import { toast } from "@/components/ui/use-toast"

// Define the shape of a single item in the cart
export interface CartItem {
  id: string // Unique identifier for the item (e.g., product ID, or a generated ID for custom services)
  name: string
  price: number
  quantity: number
  image?: string
  paymentType?: "online" | "in_person" // Indicates if payment is online or in-person (e.g., for custom quotes)
  metadata?: { [key: string]: any } // Flexible metadata for specific item details (e.g., room config)
}

// Define the shape of the cart state
interface CartState {
  items: CartItem[]
  lastUpdated: number // Timestamp of the last update
}

// Define the actions that can be dispatched to modify the cart state
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string } // payload is item.id
  | { type: "UPDATE_ITEM_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_MULTIPLE_ITEMS"; payload: CartItem[] } // New action for batch adding

// Define the CartContextType
interface CartContextType {
  cart: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  addMultipleItems: (items: CartItem[]) => void
}

// Initial state for the cart
const initialCartState: CartState = {
  items: [],
  lastUpdated: Date.now(),
}

// Reducer function to manage cart state changes
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)
      if (existingItemIndex > -1) {
        // If item exists, update its quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
        )
        return { ...state, items: updatedItems, lastUpdated: Date.now() }
      }
      // If item does not exist, add it
      return { ...state, items: [...state.items, action.payload], lastUpdated: Date.now() }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        lastUpdated: Date.now(),
      }
    case "UPDATE_ITEM_QUANTITY": {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
          lastUpdated: Date.now(),
        }
      }
      const updatedItems = state.items.map((item) => (item.id === id ? { ...item, quantity: quantity } : item))
      return { ...state, items: updatedItems, lastUpdated: Date.now() }
    }
    case "CLEAR_CART":
      return { ...initialCartState, lastUpdated: Date.now() }
    case "ADD_MULTIPLE_ITEMS": {
      let newItems = [...state.items]
      action.payload.forEach((newItem) => {
        const existingItemIndex = newItems.findIndex((item) => item.id === newItem.id)
        if (existingItemIndex > -1) {
          // If item exists, update its quantity
          newItems = newItems.map((item, index) =>
            index === existingItemIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item,
          )
        } else {
          // If item does not exist, add it
          newItems.push(newItem)
        }
      })
      return { ...state, items: newItems, lastUpdated: Date.now() }
    }
    default:
      return state
  }
}

// Create the CartContext
const CartContext = createContext<CartContextType | undefined>(undefined)

// CartProvider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage or use initialCartState
  const init = (initialState: CartState) => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("smiley-brooms-cart")
        return storedCart ? JSON.parse(storedCart) : initialState
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        // Clear corrupted data if parsing fails
        localStorage.removeItem("smiley-brooms-cart")
        return initialState
      }
    }
    return initialState
  }

  const [cart, dispatch] = useReducer(cartReducer, initialCartState, init)

  // Persist cart state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("smiley-brooms-cart", JSON.stringify(cart))
    }
  }, [cart])

  // Action dispatch functions
  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
    toast({
      title: "Item Added",
      description: `${item.name} added to your cart.`,
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
      variant: "destructive",
    })
  }, [])

  const updateItemQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_ITEM_QUANTITY", payload: { id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" })
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    })
  }, [])

  const addMultipleItems = useCallback((items: CartItem[]) => {
    if (items.length > 0) {
      dispatch({ type: "ADD_MULTIPLE_ITEMS", payload: items })
      toast({
        title: "Items Added",
        description: `${items.length} items added to your cart.`,
      })
    }
  }, [])

  const value = {
    cart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    addMultipleItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
