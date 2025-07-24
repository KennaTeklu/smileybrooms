import type { DeviceType } from "./device-detection"

export type PaymentMethod = "apple_pay" | "google_pay" | "contact_for_alternatives"

export interface PaymentMethodConfig {
  id: PaymentMethod
  name: string
  description: string
  icon: string
  theme: string
  priority: number
  supportedDevices: DeviceType[]
  isDigitalWallet: boolean
}

export interface DevicePaymentConfig {
  primary: PaymentMethod
  fallback: PaymentMethod
  theme: string
}

// Simplified payment configuration - only 2 options per device type
export const paymentConfig: Record<DeviceType, DevicePaymentConfig> = {
  ios: {
    primary: "apple_pay",
    fallback: "contact_for_alternatives",
    theme: "light-blur",
  },
  android: {
    primary: "google_pay",
    fallback: "contact_for_alternatives",
    theme: "material-dark",
  },
  desktop: {
    primary: "google_pay",
    fallback: "contact_for_alternatives",
    theme: "standard",
  },
  unknown: {
    primary: "google_pay",
    fallback: "contact_for_alternatives",
    theme: "standard",
  },
}

// Payment method definitions
export const paymentMethods: Record<PaymentMethod, PaymentMethodConfig> = {
  apple_pay: {
    id: "apple_pay",
    name: "Apple Pay",
    description: "Pay securely with Touch ID, Face ID, or passcode",
    icon: "apple",
    theme: "black",
    priority: 1,
    supportedDevices: ["ios"],
    isDigitalWallet: true,
  },
  google_pay: {
    id: "google_pay",
    name: "Google Pay",
    description: "Pay quickly and securely with Google Pay",
    icon: "smartphone",
    theme: "blue",
    priority: 1,
    supportedDevices: ["android", "desktop", "unknown"],
    isDigitalWallet: true,
  },
  contact_for_alternatives: {
    id: "contact_for_alternatives",
    name: "Other Payment Options",
    description: "Call us for cash, Zelle, or other payment methods",
    icon: "phone",
    theme: "green",
    priority: 2,
    supportedDevices: ["ios", "android", "desktop", "unknown"],
    isDigitalWallet: false,
  },
}

export function getDeviceOptimizedPaymentMethods(deviceType: DeviceType): PaymentMethodConfig[] {
  const config = paymentConfig[deviceType] || paymentConfig.unknown

  return [paymentMethods[config.primary], paymentMethods[config.fallback]].filter((method) =>
    method.supportedDevices.includes(deviceType),
  )
}

export function getPrimaryPaymentMethod(deviceType: DeviceType): PaymentMethod {
  return paymentConfig[deviceType]?.primary || paymentConfig.unknown.primary
}

export function supportsDigitalWallet(deviceType: DeviceType): boolean {
  const primaryMethod = getPrimaryPaymentMethod(deviceType)
  return paymentMethods[primaryMethod].isDigitalWallet
}

export function getContactInfo() {
  return {
    website: "smileybrooms.com",
    phone: "6616023000",
    phoneFormatted: "(661) 602-3000",
  }
}
