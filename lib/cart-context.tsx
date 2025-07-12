"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"

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
  subtotal: number
  tax: number
  couponDiscount: number
  appliedCoupon: string | null
  total: number
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

const calculateCartTotals = (items: CartItem[], appliedCoupon: string | null, couponDiscountValue: number) => {
  let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Apply coupon discount to subtotal
  let effectiveCouponDiscount = 0
  if (appliedCoupon && couponDiscountValue > 0) {
    effectiveCouponDiscount = Math.min(subtotal, couponDiscountValue) // Ensure discount doesn't exceed subtotal
    subtotal -= effectiveCouponDiscount
  }

  const taxRate = 0.08 // 8% tax
  const tax = subtotal * taxRate
  const total = subtotal + tax

  return {
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0), // Original subtotal before coupon
    tax,
    couponDiscount: effectiveCouponDiscount,
    total,
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast()
  const [cart, setCart] = useState<CartState>({
    items: [],
    subtotal: 0,
    tax: 0,
    couponDiscount: 0,
    appliedCoupon: null,
    total: 0,
  })

  // Load cart from localStorage on initial mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("smiley-brooms-cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Recalculate totals to ensure consistency with current logic
        const { subtotal, tax, couponDiscount, total } = calculateCartTotals(
          parsedCart.items,
          parsedCart.appliedCoupon,
          parsedCart.couponDiscount,
        )
        setCart({ ...parsedCart, subtotal, tax, couponDiscount, total })
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
    (currentItems: CartItem[], currentCoupon: string | null, currentCouponDiscount: number) => {
      const { subtotal, tax, couponDiscount, total } = calculateCartTotals(
        currentItems,
        currentCoupon,
        currentCouponDiscount,
      )
      setCart((prev) => ({
        ...prev,
        subtotal: prev.items.reduce((sum, item) => sum + item.price * item.quantity, 0), // Keep original subtotal
        tax,
        couponDiscount,
        total,
      }))
    },
    [cart.items],
  ) // Dependency on cart.items to ensure recalculation when items change

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

        const { subtotal, tax, couponDiscount, total } = calculateCartTotals(
          updatedItems,
          prev.appliedCoupon,
          prev.couponDiscount,
        )
        return { ...prev, items: updatedItems, subtotal, tax, couponDiscount, total }
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
        const { subtotal, tax, couponDiscount, total } = calculateCartTotals(
          updatedItems,
          prev.appliedCoupon,
          prev.couponDiscount,
        )
        return { ...prev, items: updatedItems, subtotal, tax, couponDiscount, total }
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

      const { subtotal, tax, couponDiscount, total } = calculateCartTotals(
        updatedItems,
        prev.appliedCoupon,
        prev.couponDiscount,
      )
      return { ...prev, items: updatedItems, subtotal, tax, couponDiscount, total }
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart({
      items: [],
      subtotal: 0,
      tax: 0,
      couponDiscount: 0,
      appliedCoupon: null,
      total: 0,
    })
    toast({
      title: "Cart Cleared",
      description: "Your shopping cart has been emptied.",
    })
  }, [toast])

  const applyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      // Simulate API call for coupon validation
      return new Promise((resolve) => {
        setTimeout(() => {
          let discountValue = 0
          let isValid = false
          switch (code.toUpperCase()) {
            case "SMILEY10":
              discountValue = cart.subtotal * 0.1 // 10% off subtotal
              isValid = true
              break
            case "WELCOME25":
              discountValue = 25 // $25 off
              isValid = true
              break
            case "FRESHSTART":
              discountValue = cart.subtotal * 0.15 // 15% off
              isValid = true
              break
            default:
              isValid = false
          }

          if (isValid) {
            setCart((prev) => {
              const { subtotal, tax, couponDiscount, total } = calculateCartTotals(
                prev.items,
                code.toUpperCase(),
                discountValue,
              )
              return { ...prev, appliedCoupon: code.toUpperCase(), couponDiscount, subtotal, tax, total }
            })
            resolve(true)
          } else {
            resolve(false)
          }
        }, 500) // Simulate network delay
      })
    },
    [cart.subtotal], // Depend on subtotal to calculate percentage discounts correctly
  )

  const removeCoupon = useCallback(async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setCart((prev) => {
          const { subtotal, tax, couponDiscount, total } = calculateCartTotals(prev.items, null, 0)
          return { ...prev, appliedCoupon: null, couponDiscount, subtotal, tax, total }
        })
        resolve()
      }, 300)
    })
  }, [])

  // Recalculate totals when items or coupon state changes
  useEffect(() => {
    updateCartTotals(cart.items, cart.appliedCoupon, cart.couponDiscount)
  }, [cart.items, cart.appliedCoupon, cart.couponDiscount, updateCartTotals])

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
