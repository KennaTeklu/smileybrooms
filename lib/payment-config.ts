import { getDeviceType } from "./device-detection"
import { ApplePaySession } from "apple-pay-js"

export interface ContactInfo {
  website: string
  phone: string
  email?: string
}

export const CONTACT_INFO: ContactInfo = {
  website: "smileybrooms.com",
  phone: "(661) 602-3000",
  email: "info@smileybrooms.com",
}

export interface PaymentMethod {
  id: string
  name: string
  type: "digital_wallet" | "contact"
  icon?: string
  description?: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "apple_pay",
    name: "Apple Pay",
    type: "digital_wallet",
    icon: "🍎",
    description: "Pay securely with Touch ID or Face ID",
  },
  {
    id: "google_pay",
    name: "Google Pay",
    type: "digital_wallet",
    icon: "🟢",
    description: "Pay quickly with your Google account",
  },
  {
    id: "contact_payment",
    name: "Call to Pay",
    type: "contact",
    icon: "📞",
    description: "Pay with cash, Zelle, or over the phone",
  },
]

export function getDeviceOptimizedPaymentMethods(): PaymentMethod[] {
  const deviceType = getDeviceType()

  switch (deviceType) {
    case "ios":
      return [
        PAYMENT_METHODS.find((m) => m.id === "apple_pay")!,
        PAYMENT_METHODS.find((m) => m.id === "contact_payment")!,
      ]
    case "android":
    case "desktop":
    default:
      return [
        PAYMENT_METHODS.find((m) => m.id === "google_pay")!,
        PAYMENT_METHODS.find((m) => m.id === "contact_payment")!,
      ]
  }
}

export function supportsDigitalWallet(): boolean {
  if (typeof window === "undefined") return false

  const deviceType = getDeviceType()

  if (deviceType === "ios") {
    return "ApplePaySession" in window && ApplePaySession.canMakePayments()
  }

  if (deviceType === "android" || deviceType === "desktop") {
    return "PaymentRequest" in window
  }

  return false
}

export function getPrimaryPaymentMethod(): PaymentMethod {
  const methods = getDeviceOptimizedPaymentMethods()
  return methods[0]
}

export function getContactInfo(): ContactInfo {
  return CONTACT_INFO
}

export function createContactDownload(): string {
  const contactData = `
SmileyBrooms Cleaning Service
Website: ${CONTACT_INFO.website}
Phone: ${CONTACT_INFO.phone}
Email: ${CONTACT_INFO.email}

Available Payment Methods:
- Cash (in person)
- Zelle
- Phone payment
- Credit/Debit card over phone

Call us to complete your booking!
  `.trim()

  const blob = new Blob([contactData], { type: "text/plain" })
  return URL.createObjectURL(blob)
}
