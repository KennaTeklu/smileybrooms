"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export type CartItem = {
  id: string
  name: string
  price: number
  priceId: string
  quantity: number
  image?: string
  description?: string
  metadata?: Record<string, string>
}

type CartState = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  lastUpdated: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "RESTORE_CART"; payload: CartState }

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  lastUpdated: Date.now(),
}

const CART_STORAGE_KEY = "shopping-cart-v1"

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
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)

      let updatedItems: CartItem[]

      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + action.payload.quantity }
          }
          return item
        })
      } else {
        updatedItems = [...state.items, action.payload]
      }

      const { totalItems, totalPrice } = calculateCartTotals(updatedItems)

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
        lastUpdated: Date.now(),
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      const { totalItems, totalPrice } = calculateCartTotals(updatedItems)

      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
        lastUpdated: Date.now(),
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
        lastUpdated: Date.now(),
      }
    }

    case "CLEAR_CART":
      return {
        ...initialState,
        lastUpdated: Date.now(),
      }

    case "RESTORE_CART":
      return action.payload

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
  isItemInCart: (id: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)
  const { toast } = useToast()

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartState

        // Validate the cart data structure
        if (
          parsedCart &&
          Array.isArray(parsedCart.items) &&
          typeof parsedCart.totalItems === "number" &&
          typeof parsedCart.totalPrice === "number"
        ) {
          dispatch({ type: "RESTORE_CART", payload: parsedCart })
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      // If there's an error, we'll just start with an empty cart
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
      toast({
        title: "Cart Save Error",
        description: "We couldn't save your cart. Please make sure cookies are enabled.",
        variant: "destructive",
      })
    }
  }, [cart, toast])

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const quantity = item.quantity || 1

    if (quantity <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Quantity must be greater than zero.",
        variant: "destructive",
      })
      return
    }

    dispatch({
      type: "ADD_ITEM",
      payload: { ...item, quantity },
    })

    toast({
      title: "Item added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })

    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Quantity must be greater than zero.",
        variant: "destructive",
      })
      return
    }

    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })

    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const isItemInCart = (id: string) => {
    return cart.items.some((item) => item.id === id)
  }

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, isItemInCart }}>
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
