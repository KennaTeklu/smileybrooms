"use client"

import React, { createContext, useReducer, useContext, useEffect, useCallback } from "react"

// Define the shape of a single item in the cart
export interface CartItem {
  id: string // Unique ID for the item (e.g., product ID + selected options)
  name: string // Display name of the item
  price: number // Price per unit of the item
  quantity: number // Quantity of this item
  imageUrl?: string // Optional image URL for the item
  // Specific room configuration details for unique identification
  roomType: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
}

// Define the shape of the cart state
interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

// Define the actions that can be dispatched to modify the cart state
type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "ADD_MULTIPLE_ITEMS"; items: CartItem[] } // New action for batch adding
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QUANTITY"; id: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState } // Action to load initial state

// Define the context value
interface CartContextType {
  cart: CartState
  addItem: (item: CartItem) => void
  addMultipleItems: (items: CartItem[]) => void // New function for batch adding
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

// Initial cart state
const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
}

// Reducer function to manage cart state
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.item.id)

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + action.item.quantity } : item,
        )
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.item.quantity,
          totalPrice: state.totalPrice + action.item.price * action.item.quantity,
        }
      } else {
        // New item, add to cart
        return {
          ...state,
          items: [...state.items, action.item],
          totalItems: state.totalItems + action.item.quantity,
          totalPrice: state.totalPrice + action.item.price * action.item.quantity,
        }
      }
    }
    case "ADD_MULTIPLE_ITEMS": {
      let newItems = [...state.items]
      let newTotalItems = state.totalItems
      let newTotalPrice = state.totalPrice

      action.items.forEach((newItem) => {
        const existingItemIndex = newItems.findIndex((item) => item.id === newItem.id)

        if (existingItemIndex > -1) {
          // Item exists, update quantity
          newItems = newItems.map((item, index) =>
            index === existingItemIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item,
          )
        } else {
          // New item, add to cart
          newItems.push(newItem)
        }
        newTotalItems += newItem.quantity
        newTotalPrice += newItem.price * newItem.quantity
      })

      return {
        ...state,
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      }
    }
    case "REMOVE_ITEM": {
      const itemToRemove = state.items.find((item) => item.id === action.id)
      if (!itemToRemove) return state

      const updatedItems = state.items.filter((item) => item.id !== action.id)
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
      }
    }
    case "UPDATE_QUANTITY": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.id)

      if (existingItemIndex > -1) {
        const itemToUpdate = state.items[existingItemIndex]
        const quantityDifference = action.quantity - itemToUpdate.quantity

        if (action.quantity <= 0) {
          // Remove item if quantity is 0 or less
          const updatedItems = state.items.filter((item) => item.id !== action.id)
          return {
            ...state,
            items: updatedItems,
            totalItems: state.totalItems - itemToUpdate.quantity,
            totalPrice: state.totalPrice - itemToUpdate.price * itemToUpdate.quantity,
          }
        } else {
          // Update quantity
          const updatedItems = state.items.map((item, index) =>
            index === existingItemIndex ? { ...item, quantity: action.quantity } : item,
          )
          return {
            ...state,
            items: updatedItems,
            totalItems: state.totalItems + quantityDifference,
            totalPrice: state.totalPrice + itemToUpdate.price * quantityDifference,
          }
        }
      }
      return state // Item not found
    }
    case "CLEAR_CART":
      return initialCartState
    case "LOAD_CART":
      return action.payload
    default:
      return state
  }
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart Provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage
  const initializer = useCallback((init: CartState) => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("smileybrooms_cart")
        return storedCart ? JSON.parse(storedCart) : init
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        // If parsing fails, return initial state to prevent app crash
        return init
      }
    }
    return init
  }, [])

  const [cart, dispatch] = useReducer(cartReducer, initialCartState, initializer)

  // Persist cart state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("smileybrooms_cart", JSON.stringify(cart))
    }
  }, [cart])

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", item })
  }, [])

  const addMultipleItems = useCallback((items: CartItem[]) => {
    dispatch({ type: "ADD_MULTIPLE_ITEMS", items })
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

  const contextValue = React.useMemo(
    () => ({
      cart,
      addItem,
      addMultipleItems,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [cart, addItem, addMultipleItems, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
