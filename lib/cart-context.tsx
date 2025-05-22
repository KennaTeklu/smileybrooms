"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  type: "service" | "room" | "addon" | "reduction"
  details?: {
    rooms?: Record<string, any>
    frequency?: string
    tier?: string
    addOns?: string[]
    reductions?: string[]
    totalRooms?: number
    basePrice?: number
    tierUpgrade?: number
    addOnPrice?: number
    reductionPrice?: number
    frequencyMultiplier?: number
    serviceFee?: number
  }
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  lastAddedItem?: CartItem
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SET_LAST_ADDED"; payload: CartItem }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
          price: action.payload.price, // Update with new price
        }
        return {
          ...state,
          items: updatedItems,
          lastAddedItem: action.payload,
        }
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        lastAddedItem: action.payload,
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
          )
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "OPEN_CART":
      return {
        ...state,
        isOpen: true,
      }

    case "CLOSE_CART":
      return {
        ...state,
        isOpen: false,
      }

    case "SET_LAST_ADDED":
      return {
        ...state,
        lastAddedItem: action.payload,
      }

    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  lastAddedItem?: CartItem
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getCartTotal: () => number
  getItemCount: () => number
  setLastAddedItem: (item: CartItem) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("smiley-brooms-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        parsedCart.items?.forEach((item: CartItem) => {
          dispatch({ type: "ADD_ITEM", payload: item })
        })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "smiley-brooms-cart",
      JSON.stringify({
        items: state.items,
        timestamp: Date.now(),
      }),
    )
  }, [state.items])

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const openCart = () => {
    dispatch({ type: "OPEN_CART" })
  }

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" })
  }

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const setLastAddedItem = (item: CartItem) => {
    dispatch({ type: "SET_LAST_ADDED", payload: item })
  }

  const value: CartContextType = {
    items: state.items,
    isOpen: state.isOpen,
    lastAddedItem: state.lastAddedItem,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getCartTotal,
    getItemCount,
    setLastAddedItem,
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
