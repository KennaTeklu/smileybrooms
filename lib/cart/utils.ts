import type { CartItem, CompositeKey } from "./types"

// Generate composite key for cart items
export function generateCompositeKey(id: string, sku: string): CompositeKey {
  const primary = id
  const secondary = sku
  const hash = btoa(`${primary}:${secondary}`).replace(/[^a-zA-Z0-9]/g, "")

  return {
    primary,
    secondary,
    hash,
  }
}

// Normalize incoming item data
export function normalizeCartItem(item: Partial<CartItem>): CartItem {
  return {
    id: item.id || crypto.randomUUID(),
    sku: item.sku || `sku-${Date.now()}`,
    type: item.type || "service",
    unitPrice: Math.max(0, item.unitPrice || 0),
    quantity: Math.max(1, Math.floor(item.quantity || 1)),
    meta: item.meta || {},
  }
}

interface CartSummary {
  subTotal: number
  discounts: number
  shipping: number
  taxes: number
  grandTotal: number
}

// Calculate cart summary with memoization
const summaryCache = new Map<string, CartSummary>()

export function calculateCartSummary(items: CartItem[]): CartSummary {
  const cacheKey = items.map((item) => `${item.id}:${item.quantity}:${item.unitPrice}`).join("|")

  if (summaryCache.has(cacheKey)) {
    return summaryCache.get(cacheKey)!
  }

  const subTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discounts = subTotal * 0.05 // 5% discount example
  const shipping = subTotal > 100 ? 0 : 15 // Free shipping over $100
  const taxes = (subTotal - discounts + shipping) * 0.08 // 8% tax
  const grandTotal = subTotal - discounts + shipping + taxes

  const summary: CartSummary = {
    subTotal: Math.round(subTotal * 100) / 100,
    discounts: Math.round(discounts * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  }

  summaryCache.set(cacheKey, summary)
  return summary
}

// Validate quantity input
export function validateQuantity(quantity: number): number {
  if (isNaN(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer")
  }
  return Math.floor(quantity)
}
