"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { advancedMatchCriteria, getItemSignature } from "@/lib/cart-matching"
import { usePanelManager } from "@/lib/panel-manager-context" // Import usePanelManager

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
      const similarItemIndex = state.items.findIndex((item) => advancedMatchCriteria(item, action.payload))

      let updatedItems: CartItem[]

      if (similarItemIndex >= 0) {
        updatedItems = state.items.map((item, index) => {
          if (index === similarItemIndex) {
            return { ...item, quantity: item.quantity + action.payload.quantity }
          }
          return item
        })
      } else {
        const itemSignature = getItemSignature(action.payload)
        const enhancedItem = {
          ...action.payload,
          id: action.payload.id.includes("custom-cleaning") ? `custom-cleaning-${itemSignature}` : action.payload.id,
        }
        updatedItems = [...state.items, enhancedItem]
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
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      const { totalItems, totalPrice } = calculateCartTotals(updatedItems)

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
  const { toast } = useToast()
  const { setActivePanel, activePanel } = usePanelManager() // Use panel manager

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartState
        parsedCart.items.forEach((item) => {
          dispatch({ type: "ADD_ITEM", payload: item })
        })
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      dispatch({ type: "CLEAR_CART" })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
      if (toast) {
        toast({
          title: "Error saving cart",
          description: "There was an error saving your cart. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [cart, toast])

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { ...item, quantity: item.quantity || 1 },
    })

    if (toast) {
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
        duration: 3000,
      })
    }

    // Automatically open the cart panel after adding an item
    // Only open if it's not already the active panel
    if (activePanel !== "cart") {
      setTimeout(() => {
        setActivePanel("cart")
      }, 300) // Small delay for toast to appear first
    }
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })

    if (toast) {
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
        duration: 3000,
      })
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })

    if (toast) {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
        duration: 3000,
      })
    }
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
