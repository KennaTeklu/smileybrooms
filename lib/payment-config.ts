import type { DeviceType } from "./device-detection"

export type PaymentMethod = "card" | "apple" | "google" | "paypal"

export interface PaymentMethodConfig {
  id: PaymentMethod
  name: string
  icon: string
  theme: string
  priority: number
  supportedDevices: DeviceType[]
}

export interface DevicePaymentConfig {
  primary: PaymentMethod
  secondary: PaymentMethod[]
  theme: string
}

// Payment configuration by device type
export const paymentConfig: Record<DeviceType, DevicePaymentConfig> = {
  ios: {
    primary: "apple",
    secondary: ["card", "paypal"],
    theme: "light-blur",
  },
  android: {
    primary: "google",
    secondary: ["card", "paypal"],
    theme: "material-dark",
  },
  desktop: {
    primary: "card",
    secondary: ["paypal"],
    theme: "standard",
  },
  unknown: {
    primary: "card",
    secondary: ["paypal"],
    theme: "standard",
  },
}

// Payment method details
export const paymentMethods: Record<PaymentMethod, PaymentMethodConfig> = {
  card: {
    id: "card",
    name: "Credit or Debit Card",
    icon: "credit-card",
    theme: "standard",
    priority: 3,
    supportedDevices: ["ios", "android", "desktop", "unknown"],
  },
  apple: {
    id: "apple",
    name: "Apple Pay",
    icon: "apple",
    theme: "black",
    priority: 1,
    supportedDevices: ["ios"],
  },
  google: {
    id: "google",
    name: "Google Pay",
    icon: "smartphone",
    theme: "material",
    priority: 1,
    supportedDevices: ["android"],
  },
  paypal: {
    id: "paypal",
    name: "PayPal",
    icon: "paypal",
    theme: "blue",
    priority: 2,
    supportedDevices: ["ios", "android", "desktop", "unknown"],
  },
}

export const PAYMENT_METHODS: {
  value: PaymentMethod
  label: string
  icon: string // Placeholder for icon path or component name
  description: string
}[] = [
  {
    value: "card",
    label: "Credit/Debit Card",
    icon: "CreditCard",
    description: "Visa, Mastercard, American Express",
  },
  {
    value: "paypal",
    label: "PayPal",
    icon: "PayPal",
    description: "Pay with your PayPal account",
  },
  {
    value: "apple",
    label: "Apple Pay",
    icon: "Apple",
    description: "Fast and secure payment with Apple Pay",
  },
  {
    value: "google",
    label: "Google Pay",
    icon: "Google",
    description: "Quick checkout with Google Pay",
  },
]

export function getDeviceOptimizedPaymentMethods(deviceType: DeviceType): PaymentMethodConfig[] {
  const config = paymentConfig[deviceType] || paymentConfig.unknown

  // Get all available methods for this device
  const availableMethods = Object.values(paymentMethods).filter((method) =>
    method.supportedDevices.includes(deviceType),
  )

  // Sort by configured priority
  return availableMethods.sort((a, b) => {
    // Primary method always comes first
    if (a.id === config.primary) return -1
    if (b.id === config.primary) return 1

    // Then sort by secondary array order
    const aIndex = config.secondary.indexOf(a.id)
    const bIndex = config.secondary.indexOf(b.id)

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1

    // Finally sort by priority
    return a.priority - b.priority
  })
}
