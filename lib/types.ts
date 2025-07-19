export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
  category?: string
  metadata?: Record<string, any> // For additional details like roomConfig, tier, frequency
}

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
    addressType: "residential" | "commercial" | "other"
    address: string
    address2?: string
    city: string
    state: string
    zipCode: string
    specialInstructions?: string
    allowVideoRecording: boolean // Moved from payment
    videoConsentDetails?: string // Moved from payment
    agreeToTerms: boolean // Moved from payment
  }
  payment: {
    paymentMethod: "card" | "paypal" | "apple" | "google"
    // Removed allowVideoRecording, videoConsentDetails, agreeToTerms
  }
}
