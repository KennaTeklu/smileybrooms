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
    agreeToTerms: boolean
  }
}
