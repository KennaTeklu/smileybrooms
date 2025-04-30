"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import { trackAddToCart, trackRemoveFromCart, trackViewCart } from "./analytics-utils"

export type CartItem = {
  id: string
  name: string
  price: number
  priceId: string
  quantity: number
  image?: string
  sourceSection?: string
  metadata?: Record<string, any>
  paymentFrequency?: "per_service" | "monthly" | "yearly"
}

type CartState = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
}

const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  return items.reduce(
    (totals, item) => {
      return {
        totalItems: totals.totalItems + item.quantity,
        totalPrice: totals.totalPrice + item.price * item.quantity,
      }
    },
    { totalItems: 0, totalPrice: 0 },
  )
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // Check if there's a similar item with the same service type and address
      const similarItemIndex = state.items.findIndex((item) => {
        // For custom cleaning services, check if they have the same service type, address, and payment frequency
        if (
          item.priceId === "price_custom_cleaning" &&
          action.payload.priceId === "price_custom_cleaning" &&
          item.metadata?.serviceType === action.payload.metadata?.serviceType &&
          item.metadata?.frequency === action.payload.metadata?.frequency &&
          item.paymentFrequency === action.payload.paymentFrequency
        ) {
          // Check if addresses match
          const itemAddress = item.metadata?.customer?.address?.toLowerCase()
          const payloadAddress = action.payload.metadata?.customer?.address?.toLowerCase()
          return itemAddress && payloadAddress && itemAddress === payloadAddress
        }

        // For standard products, just check the ID
        return item.id === action.payload.id
      })

      let updatedItems: CartItem[]

      if (similarItemIndex >= 0) {
        updatedItems = state.items.map((item, index) => {
          if (index === similarItemIndex) {
            return { ...item, quantity: item.quantity + action.payload.quantity }
          }
          return item
        })
      } else {
        updatedItems = [...state.items, action.payload]

        // Track the add to cart event with analytics
        try {
          trackAddToCart({
            id: action.payload.id,
            name: action.payload.name,
            price: action.payload.price,
            sourceSection: action.payload.sourceSection || "Unknown",
          })
        } catch (error) {
          console.error("Error tracking add to cart:", error)
        }
      }

      const { totalItems, totalPrice } = calculateCartTotals(updatedItems)

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      }
    }

    case "REMOVE_ITEM": {
      // Find the item before removing it to track the event
      const itemToRemove = state.items.find((item) => item.id === action.payload)

      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      const { totalItems, totalPrice } = calculateCartTotals(updatedItems)

      // Track the remove from cart event with analytics
      if (itemToRemove) {
        try {
          trackRemoveFromCart({
            id: itemToRemove.id,
            name: itemToRemove.name,
            price: itemToRemove.price,
          })
        } catch (error) {
          console.error("Error tracking remove from cart:", error)
        }
      }

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, quantity: action.payload.quantity }
        }
        return item
      })

      const { totalItems, totalPrice } = calculateCartTotals(updatedItems)

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      }
    }

    case "CLEAR_CART":
      return initialState

    default:
      return state
  }
}

type CartContextType = {
  cart: CartState
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart) as CartState
      parsedCart.items.forEach((item) => {
        dispatch({ type: "ADD_ITEM", payload: item })
      })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))

    // Track cart view when cart changes and has items
    if (cart.items.length > 0) {
      try {
        trackViewCart(cart.items, cart.totalPrice)
      } catch (error) {
        console.error("Error tracking cart view:", error)
      }
    }
  }, [cart])

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { ...item, quantity: item.quantity || 1 },
    })
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

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
