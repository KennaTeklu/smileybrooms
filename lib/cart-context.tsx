"use client"

import React, { createContext, useReducer, useContext, useEffect, useCallback } from "react"
import type { CartItem } from "./cart/types" // Ensure CartItem type is correctly imported
import { calculateCartTotals } from "./cart/utils" // Assuming this utility exists

// Define the shape of the cart state
interface CartState {
  items: CartItem[]
  totalItems: number
  subtotalPrice: number
  totalPrice: number
  couponCode: string | null
  couponDiscount: number
  fullHouseDiscount: number
  inPersonPaymentTotal: number
}

// Define the actions that can be dispatched to modify the cart state
type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "ADD_MULTIPLE_ITEMS"; payload: CartItem[] }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "REMOVE_COUPON" }
  | { type: "SET_CART"; payload: CartState } // For loading from persistence

// Define the shape of the CartContext
interface CartContextType extends CartState {
  addItem: (item: CartItem) => void
  addMultipleItems: (items: CartItem[]) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void
}

// Initial state for the cart
const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  subtotalPrice: 0,
  totalPrice: 0,
  couponCode: null,
  couponDiscount: 0,
  fullHouseDiscount: 0,
  inPersonPaymentTotal: 0,
}

// Reducer function to manage cart state changes
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let updatedItems: CartItem[]
  let newCouponCode = state.couponCode
  let newCouponDiscount = state.couponDiscount

  switch (action.type) {
    case "ADD_ITEM":
      updatedItems = [...state.items]
      const existingItemIndex = updatedItems.findIndex((item) => item.id === action.payload.id)

      if (existingItemIndex > -1) {
        // If item exists, update its quantity
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        }
      } else {
        // Otherwise, add new item
        updatedItems.push(action.payload)
      }
      break

    case "ADD_MULTIPLE_ITEMS":
      updatedItems = [...state.items]
      action.payload.forEach((newItem) => {
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
      break

    case "REMOVE_ITEM":
      updatedItems = state.items.filter((item) => item.id !== action.payload)
      break

    case "UPDATE_QUANTITY":
      updatedItems = state.items
        .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0) // Remove if quantity drops to 0 or less
      break

    case "CLEAR_CART":
      updatedItems = []
      newCouponCode = null
      newCouponDiscount = 0
      break

    case "APPLY_COUPON":
      // This is a simplified example. In a real app, you'd validate the coupon
      // and calculate the discount based on the cart contents.
      newCouponCode = action.payload
      newCouponDiscount = state.subtotalPrice * 0.1 // Example: 10% discount
      break

    case "REMOVE_COUPON":
      newCouponCode = null
      newCouponDiscount = 0
      break

    case "SET_CART":
      // Used for loading initial state from persistence
      return action.payload

    default:
      return state
  }

  // Recalculate totals after any item modification
  return {
    ...state,
    items: updatedItems,
    ...calculateCartTotals(updatedItems, newCouponCode, newCouponDiscount),
    couponCode: newCouponCode,
    couponDiscount: newCouponDiscount,
  }
}

// Create the CartContext
const CartContext = createContext<CartContextType | undefined>(undefined)

// CartProvider component to wrap the application
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or use initialCartState
  const initializeState = (): CartState => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("smileyBroomsCart")
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart)
          // Ensure the parsed cart has all necessary properties and is valid
          if (parsedCart && Array.isArray(parsedCart.items)) {
            // Recalculate totals to ensure consistency with current logic
            return {
              ...initialCartState, // Start with default to ensure all keys are present
              ...parsedCart,
              ...calculateCartTotals(parsedCart.items, parsedCart.couponCode, parsedCart.couponDiscount),
            }
          }
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        // Clear corrupted data
        if (typeof window !== "undefined") {
          localStorage.removeItem("smileyBroomsCart")
        }
      }
    }
    return initialCartState
  }

  const [cart, dispatch] = useReducer(cartReducer, initialCartState, initializeState)

  // Effect to save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("smileyBroomsCart", JSON.stringify(cart))
    }
  }, [cart])

  // Memoized dispatch functions
  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }, [])

  const addMultipleItems = useCallback((items: CartItem[]) => {
    dispatch({ type: "ADD_MULTIPLE_ITEMS", payload: items })
  }, [])

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" })
  }, [])

  const applyCoupon = useCallback((code: string) => {
    dispatch({ type: "APPLY_COUPON", payload: code })
  }, [])

  const removeCoupon = useCallback(() => {
    dispatch({ type: "REMOVE_COUPON" })
  }, [])

  const contextValue = React.useMemo(
    () => ({
      ...cart,
      addItem,
      addMultipleItems,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [cart, addItem, addMultipleItems, removeItem, updateQuantity, clearCart, applyCoupon, removeCoupon],
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
