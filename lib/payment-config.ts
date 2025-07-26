import { isIOS, isAndroid, supportsApplePay, supportsGooglePay } from "./device-detection"

export interface ContactInfo {
  website: string
  phone: string
  displayPhone: string
  email: string
  businessName: string
}

export const CONTACT_INFO: ContactInfo = {
  website: "smileybrooms.com",
  phone: "6616023000",
  displayPhone: "(661) 602-3000",
  email: "info@smileybrooms.com",
  businessName: "Smiley Brooms Cleaning Service",
}

export interface PaymentMethod {
  id: string
  name: string
  type: "digital_wallet" | "contact" | "card"
  icon: string
  description: string
  available: boolean
  primary?: boolean
}

export function getDeviceOptimizedPaymentMethods(): PaymentMethod[] {
  const methods: PaymentMethod[] = []

  // Add device-specific digital wallet first
  if (isIOS() && supportsApplePay()) {
    methods.push({
      id: "apple_pay",
      name: "Apple Pay",
      type: "digital_wallet",
      icon: "🍎",
      description: "Pay securely with Touch ID or Face ID",
      available: true,
      primary: true,
    })
  } else if ((isAndroid() || !isIOS()) && supportsGooglePay()) {
    methods.push({
      id: "google_pay",
      name: "Google Pay",
      type: "digital_wallet",
      icon: "🟢",
      description: "Pay quickly with Google Pay",
      available: true,
      primary: true,
    })
  }

  // Add card payment
  methods.push({
    id: "card",
    name: "Credit/Debit Card",
    type: "card",
    icon: "💳",
    description: "Pay with your credit or debit card",
    available: true,
    primary: methods.length === 0,
  })

  // Always add contact option as fallback
  methods.push({
    id: "contact",
    name: "Call to Pay",
    type: "contact",
    icon: "📞",
    description: "Pay with cash, Zelle, or card over phone",
    available: true,
  })

  return methods
}

export function supportsDigitalWallet(): boolean {
  return supportsApplePay() || supportsGooglePay()
}

export function getPrimaryPaymentMethod(): PaymentMethod {
  const methods = getDeviceOptimizedPaymentMethods()
  return methods.find((method) => method.primary) || methods[0]
}

export function getContactInfo(): ContactInfo {
  return CONTACT_INFO
}

export function createContactDownload(): string {
  const contactData = `
${CONTACT_INFO.businessName}
Website: ${CONTACT_INFO.website}
Phone: ${CONTACT_INFO.displayPhone}
Email: ${CONTACT_INFO.email}

Available Payment Methods:
- Cash (in person)
- Zelle
- Phone payment
- Credit/Debit card over phone

Call us to complete your booking!
  `.trim()

  return contactData
}

export interface PaymentConfig {
  stripePublishableKey: string
  supportedMethods: string[]
  currency: string
  country: string
  contactInfo: ContactInfo
}

export const paymentConfig: PaymentConfig = {
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  supportedMethods: ["card", "apple_pay", "google_pay"],
  currency: "usd",
  country: "US",
  contactInfo: CONTACT_INFO,
}
