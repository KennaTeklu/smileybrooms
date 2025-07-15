"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define the structure for a single item in the cart
export interface CartItem {
  id: string // Unique ID for the item (e.g., generated from room config)
  name: string // Display name of the item (e.g., "Bedroom Cleaning - Standard")
  price: number // Price per unit of the item
  quantity: number // Number of units of this item
  imageUrl?: string // Optional image for the item
  // Add specific room configuration details for better identification and display
  roomType?: string
  selectedTier?: string
  selectedAddOns?: string[]
  selectedReductions?: string[]
  priceId?: string
  sourceSection?: string
  metadata?: Record<string, any>
  paymentFrequency?: "per_service" | "monthly" | "yearly"
  isFullHousePromoApplied?: boolean // New field for full house promo
  paymentType?: "online" | "in_person" // Added paymentType
}

// Define the structure for the entire cart state
export interface CartState {
  items: CartItem[]
  totalItems: number
  subtotalPrice: number // Renamed from totalPrice to subtotalPrice
  totalPrice: number // New field for total after discounts/taxes
  couponCode: string | null
  couponDiscount: number
  fullHouseDiscount: number // New field for full house discount
  inPersonPaymentTotal: number
  lastModified: number // Timestamp for CRDT
}

// Define action types for the reducer
type CartActionType = "ADD_ITEM" | "REMOVE_ITEM" | "UPDATE_QUANTITY" | "CLEAR_CART" | "SET_CART" | "ADD_MULTIPLE_ITEMS"

// Define the structure for cart actions
interface CartAction {
  type: CartActionType
  payload?: any
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
  lastModified: Date.now(),
}

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return { totalItems, totalPrice }
}

// Define valid coupons and their effects
const VALID_COUPONS: { [key: string]: { type: "percentage" | "fixed"; value: number; maxDiscount?: number } } = {
  V0DISCOUNT: { type: "percentage", value: 0.15, maxDiscount: 50 }, // 15% off, max $50
  FREECLEAN: { type: "fixed", value: 25 }, // $25 off
}

// Helper function to calculate cart totals with discounts
const calculateCartTotals = (
  items: CartItem[],
  couponCode: string | null,
): {
  totalItems: number
  subtotalPrice: number
  totalPrice: number
  couponDiscount: number
  fullHouseDiscount: number
  inPersonPaymentTotal: number
} => {
  const onlineItems = items.filter((item) => item.paymentType !== "in_person")
  const inPersonItems = items.filter((item) => item.paymentType === "in_person")

  const subtotalPrice = items.reduce((totals, item) => totals + item.price * item.quantity, 0)
  const onlineSubtotal = onlineItems.reduce((totals, item) => totals + item.price * item.quantity, 0)
  const inPersonPaymentTotal = inPersonItems.reduce((totals, item) => totals + item.price * item.quantity, 0)

  let couponDiscount = 0
  let fullHouseDiscount = 0
  let finalOnlinePrice = onlineSubtotal

  // Apply coupon discount only to online items
  if (couponCode && VALID_COUPONS[couponCode.toUpperCase()]) {
    const coupon = VALID_COUPONS[couponCode.toUpperCase()]
    if (coupon.type === "percentage") {
      couponDiscount = onlineSubtotal * coupon.value
      if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
        couponDiscount = coupon.maxDiscount
      }
    } else if (coupon.type === "fixed") {
      couponDiscount = coupon.value
    }
    finalOnlinePrice = Math.max(0, onlineSubtotal - couponDiscount) // Ensure price doesn't go below zero
  }

  // Apply full house discount if applicable (only if at least one item has the flag and it's an online item)
  const hasFullHousePromo = onlineItems.some((item) => item.isFullHousePromoApplied)
  if (hasFullHousePromo) {
    fullHouseDiscount = finalOnlinePrice * 0.05 // 5% off the price after coupon
    finalOnlinePrice = Math.max(0, finalOnlinePrice - fullHouseDiscount)
  }

  return {
    totalItems: items.reduce((totals, item) => totals + item.quantity, 0),
    subtotalPrice, // This includes all items
    totalPrice: finalOnlinePrice, // This is the total for online payment
    couponDiscount,
    fullHouseDiscount,
    inPersonPaymentTotal, // Return the total for in-person payment
  }
}

// Reducer function to manage cart state
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let updatedItems: CartItem[]
  let newTotals: { totalItems: number; totalPrice: number }

  switch (action.type) {
    case "ADD_ITEM":
      const newItem = action.payload as CartItem
      updatedItems = [...state.items]
      const existingItemIndex = updatedItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        }
      } else {
        // Add new item
        updatedItems.push(newItem)
      }
      newTotals = calculateTotals(updatedItems)
      return { ...state, items: updatedItems, ...newTotals, lastModified: Date.now() }

    case "ADD_MULTIPLE_ITEMS":
      const newItems = action.payload as CartItem[]
      const currentItems = [...state.items]

      newItems.forEach((newItem) => {
        const existingIndex = currentItems.findIndex((item) => item.id === newItem.id)
        if (existingIndex > -1) {
          currentItems[existingIndex] = {
            ...currentItems[existingIndex],
            quantity: currentItems[existingIndex].quantity + newItem.quantity,
          }
        } else {
          currentItems.push(newItem)
        }
      })
      newTotals = calculateTotals(currentItems)
      return { ...state, items: currentItems, ...newTotals, lastModified: Date.now() }

    case "REMOVE_ITEM":
      updatedItems = state.items.filter((item) => item.id !== action.payload)
      newTotals = calculateTotals(updatedItems)
      return { ...state, items: updatedItems, ...newTotals, lastModified: Date.now() }

    case "UPDATE_QUANTITY":
      const { id, quantity } = action.payload
      updatedItems = state.items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0) // Remove if quantity becomes 0
      newTotals = calculateTotals(updatedItems)
      return { ...state, items: updatedItems, ...newTotals, lastModified: Date.now() }

    case "CLEAR_CART":
      return { ...initialCartState, lastModified: Date.now() }

    case "SET_CART":
      // Used for loading from persistence
      const loadedState = action.payload as CartState
      return { ...loadedState, lastModified: Date.now() }

    default:
      return state
  }
}

// Create the Cart Context
interface CartContextType {
  cart: CartState
  addItem: (item: CartItem) => void
  addMultipleItems: (items: CartItem[]) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (couponCode: string) => boolean // Returns true if coupon is valid
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

// Create the Cart Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState)
  const { toast } = useToast()

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const loadCart = async () => {
      const storedCart = localStorage.getItem("cart-state")
      if (storedCart) {
        try {
          const parsedCart: CartState = JSON.parse(storedCart)
          dispatch({ type: "SET_CART", payload: parsedCart })
        } catch (error) {
          console.error("Failed to parse stored cart:", error)
        }
      }
    }
    loadCart()
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart-state", JSON.stringify(cart))
  }, [cart])

  const addItem = useCallback(
    (item: CartItem) => {
      dispatch({ type: "ADD_ITEM", payload: item })
      if (toast) {
        toast({
          title: "Added to cart",
          description: `${item.name} has been added to your cart`,
          duration: 3000,
        })
      }
    },
    [toast],
  )

  const addMultipleItems = useCallback(
    (items: CartItem[]) => {
      dispatch({ type: "ADD_MULTIPLE_ITEMS", payload: items })
      if (toast) {
        toast({
          title: "Items Added!",
          description: `${items.length} items have been added to your cart.`,
          duration: 3000,
        })
      }
    },
    [toast],
  )

  const removeItem = useCallback(
    (id: string) => {
      dispatch({ type: "REMOVE_ITEM", payload: id })
      if (toast) {
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart",
          duration: 3000,
        })
      }
    },
    [toast],
  )

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" })
    if (toast) {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
        duration: 3000,
      })
    }
  }, [toast])

  const applyCoupon = useCallback(
    (couponCode: string): boolean => {
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
    },
    [toast],
  )

  return (
    <CartContext.Provider
      value={{ cart, addItem, addMultipleItems, removeItem, updateQuantity, clearCart, applyCoupon }}
    >
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
