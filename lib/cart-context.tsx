"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { VALID_COUPONS } from "@/lib/constants" // Import VALID_COUPONS

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
  metadata?: Record<string, any> // For custom cleaning details
}

interface CartState {
  items: CartItem[]
  rawSubtotal: number // Sum of item prices * quantities, BEFORE any discounts
  couponDiscount: number
  appliedCoupon: string | null
  subtotalAfterDiscount: number // rawSubtotal - couponDiscount
  tax: number
  total: number // subtotalAfterDiscount + tax
}

interface CartContextType {
  cart: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItemQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => Promise<boolean>
  removeCoupon: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const calculateCartTotals = (
  items: CartItem[],
  appliedCouponCode: string | null,
  couponValue: number, // This will be the value from VALID_COUPONS
  couponType: "percentage" | "fixed" | null, // This will be the type from VALID_COUPONS
): { rawSubtotal: number; couponDiscount: number; subtotalAfterDiscount: number; tax: number; total: number } => {
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  let calculatedCouponDiscount = 0

  if (appliedCouponCode && couponType && couponValue) {
    if (couponType === "percentage") {
      calculatedCouponDiscount = rawSubtotal * (couponValue / 100)
    } else if (couponType === "fixed") {
      calculatedCouponDiscount = couponValue
    }
    // Ensure discount doesn't make subtotal negative
    calculatedCouponDiscount = Math.min(calculatedCouponDiscount, rawSubtotal)
  }

  const subtotalAfterDiscount = rawSubtotal - calculatedCouponDiscount
  const taxRate = 0.08 // 8% tax
  const tax = subtotalAfterDiscount * taxRate
  const total = subtotalAfterDiscount + tax

  return {
    rawSubtotal,
    couponDiscount: calculatedCouponDiscount,
    subtotalAfterDiscount,
    tax,
    total,
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast()
  const [cart, setCart] = useState<CartState>({
    items: [],
    rawSubtotal: 0,
    couponDiscount: 0,
    appliedCoupon: null,
    subtotalAfterDiscount: 0,
    tax: 0,
    total: 0,
  })

  // Load cart from localStorage on initial mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("smiley-brooms-cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartState
        // Recalculate totals to ensure consistency with current logic
        // Find the coupon details from VALID_COUPONS if one was applied
        const appliedCouponDetails = parsedCart.appliedCoupon
          ? VALID_COUPONS.find((c) => c.code === parsedCart.appliedCoupon)
          : null

        const { rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total } = calculateCartTotals(
          parsedCart.items,
          parsedCart.appliedCoupon,
          appliedCouponDetails?.value || 0,
          appliedCouponDetails?.type || null,
        )
        setCart({ ...parsedCart, rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total })
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error)
      // Clear corrupted data if any
      localStorage.removeItem("smiley-brooms-cart")
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("smiley-brooms-cart", JSON.stringify(cart))
  }, [cart])

  const updateCartTotals = useCallback(
    (currentItems: CartItem[], currentAppliedCoupon: string | null) => {
      const appliedCouponDetails = currentAppliedCoupon
        ? VALID_COUPONS.find((c) => c.code === currentAppliedCoupon)
        : null

      const { rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total } = calculateCartTotals(
        currentItems,
        currentAppliedCoupon,
        appliedCouponDetails?.value || 0,
        appliedCouponDetails?.type || null,
      )
      setCart((prev) => ({
        ...prev,
        rawSubtotal,
        couponDiscount,
        subtotalAfterDiscount,
        tax,
        total,
      }))
    },
    [], // No dependencies needed as it takes all necessary data as arguments
  )

  const addItem = useCallback(
    (item: CartItem) => {
      setCart((prev) => {
        const existingItemIndex = prev.items.findIndex((i) => i.id === item.id)
        let updatedItems: CartItem[]

        if (existingItemIndex > -1) {
          updatedItems = prev.items.map((i, index) =>
            index === existingItemIndex ? { ...i, quantity: i.quantity + item.quantity } : i,
          )
        } else {
          updatedItems = [...prev.items, item]
        }

        // Recalculate totals immediately after items change
        const appliedCouponDetails = prev.appliedCoupon
          ? VALID_COUPONS.find((c) => c.code === prev.appliedCoupon)
          : null
        const { rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total } = calculateCartTotals(
          updatedItems,
          prev.appliedCoupon,
          appliedCouponDetails?.value || 0,
          appliedCouponDetails?.type || null,
        )

        return { ...prev, items: updatedItems, rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total }
      })
      toast({
        title: "Item Added to Cart",
        description: `${item.name} has been added.`,
      })
    },
    [toast],
  )

  const removeItem = useCallback(
    (id: string) => {
      setCart((prev) => {
        const updatedItems = prev.items.filter((item) => item.id !== id)

        // Recalculate totals immediately after items change
        const appliedCouponDetails = prev.appliedCoupon
          ? VALID_COUPONS.find((c) => c.code === prev.appliedCoupon)
          : null
        const { rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total } = calculateCartTotals(
          updatedItems,
          prev.appliedCoupon,
          appliedCouponDetails?.value || 0,
          appliedCouponDetails?.type || null,
        )

        return { ...prev, items: updatedItems, rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total }
      })
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart.",
        variant: "destructive",
      })
    },
    [toast],
  )

  const updateItemQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) => {
      const updatedItems = prev.items
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0) // Remove if quantity drops to 0 or less

      // Recalculate totals immediately after items change
      const appliedCouponDetails = prev.appliedCoupon ? VALID_COUPONS.find((c) => c.code === prev.appliedCoupon) : null
      const { rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total } = calculateCartTotals(
        updatedItems,
        prev.appliedCoupon,
        appliedCouponDetails?.value || 0,
        appliedCouponDetails?.type || null,
      )

      return { ...prev, items: updatedItems, rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total }
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      rawSubtotal: 0,
      couponDiscount: 0,
      appliedCoupon: null,
      subtotalAfterDiscount: 0,
      tax: 0,
      total: 0,
    })
    toast({
      title: "Cart Cleared",
      description: "Your shopping cart has been emptied.",
    })
  }, [toast])

  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      const coupon = VALID_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase())

      if (coupon) {
        setCart((prev) => {
          const { rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total } = calculateCartTotals(
            prev.items,
            coupon.code,
            coupon.value,
            coupon.type,
          )
          return { ...prev, appliedCoupon: coupon.code, couponDiscount, rawSubtotal, subtotalAfterDiscount, tax, total }
        })
        return true
      } else {
        return false
      }
    },
    [], // No dependencies needed as it uses VALID_COUPONS and current cart state
  )

  const removeCoupon = useCallback(async () => {
    setCart((prev) => {
      const { rawSubtotal, couponDiscount, subtotalAfterDiscount, tax, total } = calculateCartTotals(
        prev.items,
        null,
        0,
        null,
      )
      return { ...prev, appliedCoupon: null, couponDiscount, rawSubtotal, subtotalAfterDiscount, tax, total }
    })
  }, [])

  // Recalculate totals when items or coupon state changes
  // This useEffect is now less critical as totals are recalculated on each item/coupon action,
  // but it can serve as a fallback or for initial load consistency.
  useEffect(() => {
    updateCartTotals(cart.items, cart.appliedCoupon)
  }, [cart.items, cart.appliedCoupon, updateCartTotals])

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateItemQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
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
