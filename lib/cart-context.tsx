"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { CartOperations } from "@/lib/cart/operations"
import { cartDB } from "@/lib/cart/persistence"
import type { CartItem, NormalizedCartState } from "@/lib/cart/types"

// Define CartState based on NormalizedCartState for consistency
type CartState = NormalizedCartState & {
  totalItems: number
  subtotalPrice: number
  totalPrice: number
  couponCode: string | null
  couponDiscount: number
  fullHouseDiscount: number
  inPersonPaymentTotal: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "ADD_ITEMS"; payload: CartItem[] }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "SET_CART"; payload: NormalizedCartState }

const initialState: CartState = {
  items: [],
  summary: {
    subTotal: 0,
    discounts: 0,
    shipping: 0,
    taxes: 0,
    grandTotal: 0,
  },
  version: 1,
  lastModified: Date.now(),
  conflictResolution: {
    vectorClock: {},
    nodeId: "",
  },
  totalItems: 0,
  subtotalPrice: 0,
  totalPrice: 0,
  couponCode: null,
  couponDiscount: 0,
  fullHouseDiscount: 0,
  inPersonPaymentTotal: 0,
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
    finalOnlinePrice = Math.max(0, onlineSubtotal - couponDiscount)
  }

  // Apply full house discount if applicable
  const hasFullHousePromo = onlineItems.some((item) => item.isFullHousePromoApplied)
  if (hasFullHousePromo) {
    fullHouseDiscount = finalOnlinePrice * 0.05 // 5% off the price after coupon
    finalOnlinePrice = Math.max(0, finalOnlinePrice - fullHouseDiscount)
  }

  return {
    totalItems: items.reduce((totals, item) => totals + item.quantity, 0),
    subtotalPrice,
    totalPrice: finalOnlinePrice,
    couponDiscount,
    fullHouseDiscount,
    inPersonPaymentTotal,
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

    case "ADD_ITEMS": {
      const updatedItems = [...state.items]

      for (const newItem of action.payload) {
        const existingItemIndex = updatedItems.findIndex((item) => item.id === newItem.id)

        if (existingItemIndex !== -1) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
          }
        } else {
          const enhancedItem = {
            ...newItem,
            paymentType: newItem.paymentType || "online",
          }
          updatedItems.push(enhancedItem)
        }
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
        inPersonPaymentTotal,
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
        inPersonPaymentTotal,
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
        inPersonPaymentTotal,
      }
    }

    case "CLEAR_CART":
      return {
        ...initialState,
        conflictResolution: { ...initialState.conflictResolution, nodeId: state.conflictResolution.nodeId },
      }

    case "SET_CART": {
      const { totalItems, subtotalPrice, totalPrice, couponDiscount, fullHouseDiscount, inPersonPaymentTotal } =
        calculateCartTotals(action.payload.items, state.couponCode)

      return {
        ...action.payload,
        totalItems,
        subtotalPrice,
        totalPrice,
        couponDiscount,
        fullHouseDiscount,
        inPersonPaymentTotal,
        couponCode: state.couponCode,
      }
    }

    default:
      return state
  }
}

type CartContextType = {
  cart: CartState
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => Promise<void>
  addItems: (items: (Omit<CartItem, "quantity"> & { quantity?: number })[]) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  applyCoupon: (couponCode: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState)

  // Load persisted cart once on mount
  useEffect(() => {
    const loadPersistedCart = async () => {
      try {
        await cartDB.init()
        const savedCart = await cartDB.loadCart()
        if (savedCart) {
          dispatch({ type: "SET_CART", payload: savedCart })
        }
      } catch (error) {
        console.error("Failed to load cart from IndexedDB:", error)
        toast({
          title: "Error loading cart",
          description: "There was an error restoring your cart.",
          variant: "destructive",
        })
      }
    }

    loadPersistedCart()
  }, [])

  const { toast } = useToast()
  const cartOperationsRef = useRef<CartOperations | null>(null)

  // Initialize CartOperations instance
  useEffect(() => {
    cartOperationsRef.current = new CartOperations()
    cartDB.init().catch(console.error)
  }, [])

  // Effect to save cart state to IndexedDB whenever it changes
  useEffect(() => {
    const saveCartState = async () => {
      if (cartOperationsRef.current && cart.conflictResolution.nodeId) {
        try {
          const { items, summary, version, lastModified, conflictResolution } = cart
          await cartOperationsRef.current.persistState({ items, summary, version, lastModified, conflictResolution })
        } catch (error) {
          console.error("Error saving cart to IndexedDB:", error)
          toast({
            title: "Error saving cart",
            description: "There was an error saving your cart. Please try again.",
            variant: "destructive",
          })
        }
      }
    }
    saveCartState()
  }, [cart, toast])

  const addItem = async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    if (!cartOperationsRef.current) return

    try {
      const updatedNormalizedCart = await cartOperationsRef.current.addItem(cart, {
        ...item,
        quantity: item.quantity || 1,
      })
      dispatch({ type: "SET_CART", payload: updatedNormalizedCart })

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to add item:", error)
      toast({
        title: "Failed to add item",
        description: "There was an error adding the item to your cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addItems = async (items: (Omit<CartItem, "quantity"> & { quantity?: number })[]) => {
    if (!cartOperationsRef.current) return

    try {
      const itemsToAdd = items.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      }))

      const updatedNormalizedCart = await cartOperationsRef.current.addItems(cart, itemsToAdd)
      dispatch({ type: "SET_CART", payload: updatedNormalizedCart })

      toast({
        title: "Added to cart",
        description: `${items.length} item${items.length !== 1 ? "s" : ""} added to your cart`,
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to add items:", error)
      toast({
        title: "Failed to add items",
        description: "There was an error adding items to your cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeItem = async (id: string) => {
    if (!cartOperationsRef.current) return

    try {
      const updatedNormalizedCart = await cartOperationsRef.current.removeItem(cart, id, "")
      dispatch({ type: "SET_CART", payload: updatedNormalizedCart })

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to remove item:", error)
      toast({
        title: "Failed to remove item",
        description: "There was an error removing the item from your cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (!cartOperationsRef.current) return

    try {
      const updatedNormalizedCart = await cartOperationsRef.current.updateQuantity(cart, id, "", quantity)
      dispatch({ type: "SET_CART", payload: updatedNormalizedCart })
    } catch (error) {
      console.error("Failed to update quantity:", error)
      toast({
        title: "Failed to update quantity",
        description: "There was an error updating item quantity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const clearCart = async () => {
    if (!cartOperationsRef.current) return

    try {
      const clearedState = await cartOperationsRef.current.loadInitialState()
      dispatch({ type: "SET_CART", payload: clearedState })

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
        duration: 3000,
      })
    } catch (error) {
      console.error("Failed to clear cart:", error)
      toast({
        title: "Failed to clear cart",
        description: "There was an error clearing your cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const applyCoupon = (couponCode: string): boolean => {
    if (VALID_COUPONS[couponCode.toUpperCase()]) {
      dispatch({ type: "APPLY_COUPON", payload: couponCode })
      toast({
        title: "Coupon Applied!",
        description: `Coupon "${couponCode.toUpperCase()}" has been applied.`,
        variant: "success",
      })
      return true
    } else {
      toast({
        title: "Invalid Coupon",
        description: `The coupon code "${couponCode}" is not valid.`,
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <CartContext.Provider value={{ cart, addItem, addItems, removeItem, updateQuantity, clearCart, applyCoupon }}>
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
