export interface CartItem {
  id: string
  sku: string
  type: "service" | "product" | "subscription"
  unitPrice: number
  quantity: number
  meta: Record<string, any>
  name: string // Added for clarity in review step
  price: number // Added for clarity in review step
  image?: string // Added for clarity in review step
  paymentType?: "online" | "in_person" // Added for clarity in review step
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

// New types for checkout process
export interface CheckoutData {
  contact: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  address: {
    fullName: string
    email: string
    phone: string
    address: string
    address2: string
    city: string
    state: string
    zipCode: string
    specialInstructions: string
    addressType: "residential" | "commercial" | "other"
  }
  payment: {
    paymentMethod: "card" | "paypal" | "apple" | "google"
    allowVideoRecording: boolean
    videoConsentDetails?: string // New field for timestamp of consent
    agreeToTerms: boolean
  }
}
