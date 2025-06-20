export interface CartItem {
  id: string
  sku: string
  type: "service" | "product" | "subscription"
  unitPrice: number
  quantity: number
  meta: {
    serviceTier?: string // e.g., "Standard", "Premium", "Elite"
    cleanlinessLevel?: string // e.g., "Light", "Medium", "Heavy", "Biohazard"
    roomType?: string // e.g., "bedroom", "bathroom"
    addOns?: { id: string; quantity?: number }[] // Array of selected add-ons with optional quantity
    exclusiveServices?: string[] // Array of selected exclusive service IDs
    propertySize?: string // e.g., "Studio", "3BR Home", "5BR Mansion"
    isRentalProperty?: boolean
    hasPets?: boolean
    isPostRenovation?: boolean
    hasMoldWaterDamage?: boolean
    isBiohazardSituation?: boolean
    enforcedTierReason?: string // Reason for automatic tier upgrade
    // Add any other relevant metadata from the pricing structure
    [key: string]: any // Allow for existing or future arbitrary meta properties
  }
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
