"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { cartDB } from "@/lib/cart/persistence" // Import cartDB
import type { CartContextType, Cart } from "@/lib/types"
import { calculateCartTotals } from "@/lib/cart/utils"
import { applyCouponCode } from "@/lib/cart/operations"

type CartItem = {
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

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    subtotalPrice: 0,
    totalPrice: 0,
    couponCode: null,
    couponDiscount: 0,
    fullHouseDiscount: 0,
    inPersonPaymentTotal: 0,
  })

  const { toast } = useToast()
  const [isCartLoaded, setIsCartLoaded] = useState(false) // New state to track if cart is loaded

  // Load cart from IndexedDB/localStorage on initial mount
  useEffect(() => {
    const loadCartFromDB = async () => {
      try {
        await cartDB.init() // Ensure IndexedDB is initialized
        const loadedCart = await cartDB.loadCart()
        if (loadedCart) {
          setCart(
            calculateCartTotals({
              ...loadedCart,
              items: loadedCart.items.map((item: any) => ({
                ...item,
                unitPrice: item.unitPrice ?? item.price, // Use unitPrice if present, otherwise fallback to price
              })),
            }),
          )
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

  const addItem = useCallback((item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex((i) => i.id === item.id)
      let updatedItems

      if (existingItemIndex > -1) {
        updatedItems = prevCart.items.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      } else {
        updatedItems = [...prevCart.items, { ...item, unitPrice: item.unitPrice ?? item.price }] // Ensure unitPrice is set on add
      }
      return calculateCartTotals({ ...prevCart, items: updatedItems })
    })
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
      return calculateCartTotals({ ...prevCart, items: updatedItems })
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setCart((prevCart) => {
      const updatedItems = prevCart.items.filter((item) => item.id !== itemId)
      return calculateCartTotals({ ...prevCart, items: updatedItems })
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart(
      calculateCartTotals({
        items: [],
        totalItems: 0,
        subtotalPrice: 0,
        totalPrice: 0,
        couponCode: null,
        couponDiscount: 0,
        fullHouseDiscount: 0,
        inPersonPaymentTotal: 0,
      }),
    )
  }, [])

  const applyCoupon = useCallback((code: string) => {
    setCart((prevCart) => {
      const updatedCart = applyCouponCode(prevCart, code)
      return calculateCartTotals(updatedCart)
    })
  }, [])

  return (
    <CartContext.Provider value={{ cart, addItem, updateQuantity, removeItem, clearCart, applyCoupon }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
