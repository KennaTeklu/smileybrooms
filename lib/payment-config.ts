import type { DeviceType } from "./device-detection"

export type PaymentMethod = "card" | "apple_pay" | "google_pay" | "paypal" | "amazon_pay" | "bank_transfer"

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
    primary: "apple_pay",
    secondary: ["card", "paypal"],
    theme: "light-blur",
  },
  android: {
    primary: "google_pay",
    secondary: ["card", "paypal", "amazon_pay"],
    theme: "material-dark",
  },
  desktop: {
    primary: "card",
    secondary: ["paypal", "bank_transfer"],
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
  apple_pay: {
    id: "apple_pay",
    name: "Apple Pay",
    icon: "apple",
    theme: "black",
    priority: 1,
    supportedDevices: ["ios"],
  },
  google_pay: {
    id: "google_pay",
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
  amazon_pay: {
    id: "amazon_pay",
    name: "Amazon Pay",
    icon: "shopping-cart",
    theme: "orange",
    priority: 4,
    supportedDevices: ["android", "desktop"],
  },
  bank_transfer: {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: "landmark",
    theme: "standard",
    priority: 5,
    supportedDevices: ["desktop"],
  },
}

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
