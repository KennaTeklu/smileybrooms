// Define the structure for your checkout data
export interface CheckoutData {
  contact: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  address: {
    fullName: string // Populated from contact
    email: string // Populated from contact
    phone: string // Populated from contact
    addressType: "residential" | "commercial" | "other"
    address: string
    address2?: string
    city: string
    state: string // e.g., "AZ"
    zipCode: string
    specialInstructions?: string
  }
  payment: {
    method: "credit_card" | "paypal" | "apple_pay"
    cardDetails: {
      cardNumber: string
      expiryDate: string
      cvc: string
      cardholderName: string
    }
    billingAddressSameAsService: boolean
    billingAddress: {
      address: string
      address2?: string
      city: string
      state: string
      zipCode: string
    }
  }
  review: {
    agreedToTerms: boolean
  }
}

// Define the structure for a cart item
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  // Add specific room details for consistent identification
  roomType: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  description?: string
}

// This file can be used for global types if needed.
// For now, specific types are defined where they are used (e.g., CartItem in cart-context.tsx)
// or imported from other modules (e.g., RoomConfig from room-context.tsx).
