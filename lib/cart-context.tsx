"use client"

import { createContext, useContext, useReducer, type ReactNode, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { CartOperations } from "@/lib/cart/operations"
import { cartDB } from "@/lib/cart/persistence"
import type { CartItem, NormalizedCartState } from "@/lib/cart/types" // Import types from cart/types

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
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; payload: string }
  | { type: "SET_CART"; payload: NormalizedCartState } // Payload is NormalizedCartState from persistence

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

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // This case is now primarily for UI updates, actual persistence handled by CartOperations
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
      // When loading from persistence, recalculate totals to ensure consistency
      const { totalItems, subtotalPrice, totalPrice, couponDiscount, fullHouseDiscount, inPersonPaymentTotal } =
        calculateCartTotals(action.payload.items, state.couponCode) // Use existing coupon code

      return {
        ...action.payload,
        totalItems,
        subtotalPrice,
        totalPrice,
        couponDiscount,
        fullHouseDiscount,
        inPersonPaymentTotal,
        couponCode: state.couponCode, // Preserve coupon code from current state if any
      }
    }

    default:
      return state
  }
}

type CartContextType = {
  cart: CartState
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  applyCoupon: (couponCode: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState, (init) => {
    // Initializer function for useReducer to load from IndexedDB
    const loadInitial = async () => {
      await cartDB.init()
      const savedCart = await cartDB.loadCart()
      if (savedCart) {
        const { totalItems, subtotalPrice, totalPrice, couponDiscount, fullHouseDiscount, inPersonPaymentTotal } =
          calculateCartTotals(savedCart.items, null) // Recalculate totals on load
        return {
          ...savedCart,
          totalItems,
          subtotalPrice,
          totalPrice,
          couponDiscount,
          fullHouseDiscount,
          inPersonPaymentTotal,
          couponCode: null, // Coupon code is not persisted with cart state, needs re-application
        }
      }
      return init
    }
    // This is a hack to make useReducer's initializer async.
    // In a real app, you'd typically load data in a useEffect and then dispatch SET_CART.
    // For v0's immediate preview, this pattern is sometimes used.
    loadInitial().then((loadedState) => {
      dispatch({ type: "SET_CART", payload: loadedState })
    })
    return init // Return initial state immediately, then update via dispatch
  })

  const { toast } = useToast()
  const cartOperationsRef = useRef<CartOperations | null>(null)

  // Initialize CartOperations instance
  useEffect(() => {
    cartOperationsRef.current = new CartOperations()
    // Ensure cartDB is initialized
    cartDB.init().catch(console.error)
  }, [])

  // Effect to save cart state to IndexedDB whenever it changes
  useEffect(() => {
    const saveCartState = async () => {
      if (cartOperationsRef.current && cart.conflictResolution.nodeId) {
        try {
          // Only save the NormalizedCartState part
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
  }, [cart, toast]) // Depend on the entire cart object

  const addItem = async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    if (!cartOperationsRef.current) return

    try {
      const updatedNormalizedCart = await cartOperationsRef.current.addItem(cart, {
        ...item,
        quantity: item.quantity || 1,
      })
      dispatch({ type: "SET_CART", payload: updatedNormalizedCart }) // Update local state from persisted state

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

  const removeItem = async (id: string) => {
    if (!cartOperationsRef.current) return

    try {
      const updatedNormalizedCart = await cartOperationsRef.current.removeItem(cart, id, "") // SKU might be needed for composite key
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
      const updatedNormalizedCart = await cartOperationsRef.current.updateQuantity(cart, id, "", quantity) // SKU might be needed
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
      // CartOperations doesn't have a direct clearCart method, so we simulate it
      const clearedState = await cartOperationsRef.current.loadInitialState() // Loads an empty cart state
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
