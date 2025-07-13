"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
// Import the new matching utilities
import { advancedMatchCriteria, getItemSignature } from "@/lib/cart-matching"

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
  subtotalPrice: number // Renamed from totalPrice to subtotalPrice
  totalPrice: number // New field for total after discounts/taxes
  couponCode: string | null
  couponDiscount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "SET_CART"; payload: CartState } // New action for loading from localStorage

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotalPrice: 0,
  totalPrice: 0,
  couponCode: null,
  couponDiscount: 0,
}

// Define valid coupons and their effects
const VALID_COUPONS: { [key: string]: { type: "percentage" | "fixed"; value: number; maxDiscount?: number } } = {
  V0DISCOUNT: { type: "percentage", value: 0.15, maxDiscount: 50 }, // 15% off, max $50
  FREECLEAN: { type: "fixed", value: 25 }, // $25 off
}

const calculateCartTotals = (
  items: CartItem[],
  couponCode: string | null,
): { totalItems: number; subtotalPrice: number; totalPrice: number; couponDiscount: number } => {
  const subtotalPrice = items.reduce((totals, item) => totals + item.price * item.quantity, 0)
  let couponDiscount = 0
  let finalPrice = subtotalPrice

  if (couponCode && VALID_COUPONS[couponCode.toUpperCase()]) {
    const coupon = VALID_COUPONS[couponCode.toUpperCase()]
    if (coupon.type === "percentage") {
      couponDiscount = subtotalPrice * coupon.value
      if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
        couponDiscount = coupon.maxDiscount
      }
    } else if (coupon.type === "fixed") {
      couponDiscount = coupon.value
    }
    finalPrice = Math.max(0, subtotalPrice - couponDiscount) // Ensure price doesn't go below zero
  }

  return {
    totalItems: items.reduce((totals, item) => totals + item.quantity, 0),
    subtotalPrice,
    totalPrice: finalPrice,
    couponDiscount,
  }
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

      const { totalItems, subtotalPrice, totalPrice, couponDiscount } = calculateCartTotals(
        updatedItems,
        state.couponCode,
      )

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotalPrice,
        totalPrice,
        couponDiscount,
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      const { totalItems, subtotalPrice, totalPrice, couponDiscount } = calculateCartTotals(
        updatedItems,
        state.couponCode,
      )

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotalPrice,
        totalPrice,
        couponDiscount,
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, quantity: action.payload.quantity }
        }
        return item
      })

      const { totalItems, subtotalPrice, totalPrice, couponDiscount } = calculateCartTotals(
        updatedItems,
        state.couponCode,
      )

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotalPrice,
        totalPrice,
        couponDiscount,
      }
    }

    case "APPLY_COUPON": {
      const newCouponCode = action.payload.toUpperCase()
      const { totalItems, subtotalPrice, totalPrice, couponDiscount } = calculateCartTotals(state.items, newCouponCode)

      return {
        ...state,
        couponCode: newCouponCode,
        couponDiscount,
        totalItems,
        subtotalPrice,
        totalPrice,
      }
    }

    case "CLEAR_CART":
      return initialState

    case "SET_CART": // For loading from localStorage
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
  applyCoupon: (couponCode: string) => boolean // Returns true if coupon is valid
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)
  const { toast } = useToast()

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartState
        // Recalculate totals to ensure consistency with current coupon logic
        const { totalItems, subtotalPrice, totalPrice, couponDiscount } = calculateCartTotals(
          parsedCart.items,
          parsedCart.couponCode,
        )
        dispatch({
          type: "SET_CART",
          payload: {
            ...parsedCart,
            totalItems,
            subtotalPrice,
            totalPrice,
            couponDiscount,
          },
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

  const applyCoupon = (couponCode: string): boolean => {
    if (VALID_COUPONS[couponCode.toUpperCase()]) {
      dispatch({ type: "APPLY_COUPON", payload: couponCode })
      if (toast) {
        toast({
          title: "Coupon Applied!",
          description: `Coupon "${couponCode.toUpperCase()}" has been applied.`,
          variant: "success",
        })
      }
      return true
    } else {
      if (toast) {
        toast({
          title: "Invalid Coupon",
          description: `The coupon code "${couponCode}" is not valid.`,
          variant: "destructive",
        })
      }
      return false
    }
  }

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, applyCoupon }}>
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
