import type { DeviceType } from "./device-detection" // Import DeviceType

export const CONTACT_INFO = {
  companyName: "SmileyBrooms.com",
  phoneNumber: "6616023000",
  email: "support@smileybrooms.com",
}

export type PaymentMethod = "applePay" | "googlePay" | "contact"

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
    primary: "applePay",
    fallback: "contact",
    theme: "light-blur",
  },
  android: {
    primary: "googlePay",
    fallback: "contact",
    theme: "material-dark",
  },
  desktop: {
    primary: "googlePay",
    fallback: "contact",
    theme: "standard",
  },
  unknown: {
    primary: "googlePay",
    fallback: "contact",
    theme: "standard",
  },
}

// Payment method definitions
export const paymentMethods: Record<PaymentMethod, PaymentMethodConfig> = {
  applePay: {
    id: "applePay",
    name: "Apple Pay",
    description: "Pay securely with Touch ID, Face ID, or passcode",
    icon: "apple",
    theme: "black",
    priority: 1,
    supportedDevices: ["ios"],
    isDigitalWallet: true,
  },
  googlePay: {
    id: "googlePay",
    name: "Google Pay",
    description: "Pay quickly and securely with Google Pay",
    icon: "smartphone",
    theme: "blue",
    priority: 1,
    supportedDevices: ["android", "desktop", "unknown"],
    isDigitalWallet: true,
  },
  contact: {
    id: "contact",
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
    website: CONTACT_INFO.companyName,
    phone: CONTACT_INFO.phoneNumber,
    phoneFormatted: `(${CONTACT_INFO.phoneNumber.substring(0, 3)}) ${CONTACT_INFO.phoneNumber.substring(
      3,
      6,
    )}-${CONTACT_INFO.phoneNumber.substring(6)}`,
  }
}
