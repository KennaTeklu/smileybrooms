export interface CartItem {
  id: string
  sku: string
  type: "service" | "product" | "subscription"
  name: string // Added for direct mapping to Stripe product name
  unitPrice: number
  quantity: number
  description?: string // Added for direct mapping to Stripe product description
  images?: string[] // Added for direct mapping to Stripe product images
  meta?: Record<string, any> // Updated to be optional
}

export interface CartSummary {
  subTotal: number
  discounts: number
  shipping: number
  taxes: number
  grandTotal: number
}

export interface NormalizedCartState {
  items: CartItem[]
  summary: CartSummary
  version: number
  lastModified: number
  conflictResolution: {
    vectorClock: Record<string, number>
    nodeId: string
  }
}

export interface CartAction {
  type: "ADD_ITEM" | "REMOVE_ITEM" | "UPDATE_QUANTITY" | "CLEAR_CART"
  payload: any
  timestamp: number
  nodeId: string
}

export interface CompositeKey {
  primary: string
  secondary: string
  hash: string
}
