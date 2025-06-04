export interface CartItem {
  id: string
  sku: string
  type: "service" | "product" | "subscription"
  unitPrice: number
  quantity: number
  meta: Record<string, any>
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
