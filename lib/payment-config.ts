import { isIOS, isAndroid } from "./device-detection"

export interface ContactInfo {
  website: string
  phone: string
  displayPhone: string
}

export const CONTACT_INFO: ContactInfo = {
  website: "smileybrooms.com",
  phone: "6616023000",
  displayPhone: "(661) 602-3000",
}

export interface PaymentMethod {
  id: string
  name: string
  type: "digital_wallet" | "contact"
  icon: string
  description: string
  available: boolean
}

export function getDeviceOptimizedPaymentMethods(): PaymentMethod[] {
  const methods: PaymentMethod[] = []

  if (isIOS()) {
    methods.push({
      id: "apple_pay",
      name: "Apple Pay",
      type: "digital_wallet",
      icon: "smartphone",
      description: "Pay securely with Apple Pay",
      available: true,
    })
  } else {
    methods.push({
      id: "google_pay",
      name: "Google Pay",
      type: "digital_wallet",
      icon: "smartphone",
      description: "Pay securely with Google Pay",
      available: true,
    })
  }

  methods.push({
    id: "contact_payment",
    name: "Call for Payment",
    type: "contact",
    icon: "phone",
    description: "Pay with cash, Zelle, or other methods over the phone",
    available: true,
  })

  return methods
}

export function supportsDigitalWallet(): boolean {
  return isIOS() || isAndroid() || (typeof window !== "undefined" && "PaymentRequest" in window)
}

export function getPrimaryPaymentMethod(): string {
  if (isIOS()) return "apple_pay"
  return "google_pay"
}

export function getContactInfo(): ContactInfo {
  return CONTACT_INFO
}
