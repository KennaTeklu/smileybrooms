"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { cartDB } from "@/lib/cart/persistence" // Import cartDB

export type CartItem = {
  id: string
  name: string
  unitPrice: number // Changed from 'price' to 'unitPrice'
  priceId: string
  quantity: number
  image?: string
  sourceSection?: string
  metadata?: Record<string, any>
  paymentFrequency?: "per_service" | "monthly" | "yearly"
  isFullHousePromoApplied?: boolean // New field for full house promo
  paymentType?: "online" | "in_person" // Added paymentType
  // New fields for room configuration details
  roomType?: string
  selectedTier?: string
  selectedAddOns?: string[]
  selectedReductions?: string[]
}

type CartState = {
  items: CartItem[]
  totalItems: number
  subtotalPrice: number // Renamed from totalPrice to subtotalPrice
  totalPrice: number // New field for total after discounts/taxes
  couponCode: string | null
  couponDiscount: number
  fullHouseDiscount: number // New field for full house discount
  inPersonPaymentTotal: number
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
  fullHouseDiscount: 0,
  inPersonPaymentTotal: 0, // Added
}

// Define valid coupons and their effects
const VALID_COUPONS: { [key: string]: { type: "percentage" | "fixed"; value: number; maxDiscount?: number } } = {
  V0DISCOUNT: { type: "percentage", value: 0.15, maxDiscount: 50 }, // 15% off, max $50
  FREECLEAN: { type: "fixed", value: 25 }, // $25 off
}

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

  const subtotalPrice = items.reduce((totals, item) => totals + item.unitPrice * item.quantity, 0) // Changed to item.unitPrice
  const onlineSubtotal = onlineItems.reduce((totals, item) => totals + item.unitPrice * item.quantity, 0) // Changed to item.unitPrice
  const inPersonPaymentTotal = inPersonItems.reduce((totals, item) => totals + item.unitPrice * item.quantity, 0) // Changed to item.unitPrice

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
    subtotalPrice: Math.round(subtotalPrice * 100) / 100,
    totalPrice: Math.round(finalOnlinePrice * 100) / 100, // This is the total for online payment
    couponDiscount: Math.round(couponDiscount * 100) / 100,
    fullHouseDiscount: Math.round(fullHouseDiscount * 100) / 100,
    inPersonPaymentTotal: Math.round(inPersonPaymentTotal * 100) / 100, // Return the total for in-person payment
  }
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)

      let updatedItems: CartItem[]

      if (existingItemIndex !== -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
        )
      } else {
        const enhancedItem = {
          ...action.payload,
          paymentType: action.payload.paymentType || "online",
        }
        updatedItems = [...state.items, enhancedItem]
      }

      const { totalItems, subtotalPrice, totalPrice, couponDiscount, fullHouseDiscount, inPersonPaymentTotal } =
        calculateCartTotals(updatedItems, state.couponCode)

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotalPrice,
        totalPrice,
        couponDiscount,
        fullHouseDiscount,
        inPersonPaymentTotal,
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload)
      const { totalItems, subtotalPrice, totalPrice, couponDiscount, fullHouseDiscount, inPersonPaymentTotal } =
        calculateCartTotals(updatedItems, state.couponCode)

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotalPrice,
        totalPrice,
        couponDiscount,
        fullHouseDiscount,
        inPersonPaymentTotal, // Added
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, quantity: action.payload.quantity }
        }
        return item
      })

      const { totalItems, subtotalPrice, totalPrice, couponDiscount, fullHouseDiscount, inPersonPaymentTotal } =
        calculateCartTotals(updatedItems, state.couponCode)

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotalPrice,
        totalPrice,
        couponDiscount,
        fullHouseDiscount,
        inPersonPaymentTotal, // Added
      }
    }

    case "APPLY_COUPON": {
      const newCouponCode = action.payload.toUpperCase()
      const { totalItems, subtotalPrice, totalPrice, couponDiscount, fullHouseDiscount, inPersonPaymentTotal } =
        calculateCartTotals(state.items, newCouponCode)

      return {
        ...state,
        couponCode: newCouponCode,
        couponDiscount,
        totalItems,
        subtotalPrice,
        totalPrice,
        fullHouseDiscount,
        inPersonPaymentTotal, // Added
      }
    }

    case "CLEAR_CART":
      return initialState

    case "SET_CART": // For loading from localStorage
      // Recalculate totals to ensure consistency with current coupon/full house logic
      const { totalItems, subtotalPrice, totalPrice, couponDiscount, fullHouseDiscount, inPersonPaymentTotal } =
        calculateCartTotals(action.payload.items, action.payload.couponCode)
      return {
        ...action.payload,
        totalItems,
        subtotalPrice,
        totalPrice,
        couponDiscount,
        fullHouseDiscount,
        inPersonPaymentTotal, // Added
      }

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
  const [isCartLoaded, setIsCartLoaded] = useState(false) // New state to track if cart is loaded

  // Load cart from IndexedDB/localStorage on initial mount
  useEffect(() => {
    const loadCartFromDB = async () => {
      try {
        await cartDB.init() // Ensure IndexedDB is initialized
        const loadedCart = await cartDB.loadCart()
        if (loadedCart) {
          dispatch({ type: "SET_CART", payload: loadedCart })
        }
      } catch (error) {
        console.error("Error loading cart from persistence:", error)
        if (toast) {
          toast({
            title: "Error loading cart",
            description: "There was an error loading your saved cart.",
            variant: "destructive",
          })
        }
      } finally {
        setIsCartLoaded(true) // Mark cart as loaded regardless of success or failure
      }
    }
    loadCartFromDB()
  }, [toast]) // Run only once on mount

  // Save cart to IndexedDB/localStorage whenever it changes, but only after initial load
  useEffect(() => {
    if (!isCartLoaded) return // Prevent saving initial empty state before loading from DB

    const saveCartToDB = async () => {
      try {
        await cartDB.saveCart(cart)
      } catch (error) {
        console.error("Error saving cart to persistence:", error)
        if (toast) {
          toast({
            title: "Error saving cart",
            description: "There was an error saving your cart. Please try again.",
            variant: "destructive",
          })
        }
      }
    }
    saveCartToDB()
  }, [cart, isCartLoaded, toast]) // Depend on cart and isCartLoaded

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
