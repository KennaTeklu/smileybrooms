export type PaymentMethod = "apple_pay" | "google_pay" | "contact_for_alternatives"

export interface DeviceInfo {
  type: "ios" | "android" | "desktop" | "unknown"
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
}

export function supportsDigitalWallet(deviceType: string): boolean {
  return deviceType === "ios" || deviceType === "android"
}

export function getPrimaryPaymentMethod(deviceType: string): PaymentMethod {
  switch (deviceType) {
    case "ios":
      return "apple_pay"
    case "android":
    case "desktop":
    case "unknown":
    default:
      return "google_pay"
  }
}

export function getContactInfo() {
  return {
    website: "smileybrooms.com",
    phone: "6616023000",
    phoneFormatted: "(661) 602-3000",
  }
}

export function getPaymentMethodDisplayName(method: PaymentMethod): string {
  switch (method) {
    case "apple_pay":
      return "Apple Pay"
    case "google_pay":
      return "Google Pay"
    case "contact_for_alternatives":
      return "Call for Payment Options"
    default:
      return "Unknown Payment Method"
  }
}

export function shouldShowSinglePaymentOption(deviceType: string): boolean {
  // Always show simplified options for better UX
  return true
}

export function getPreferredPaymentMethod(deviceType: string): PaymentMethod | null {
  return getPrimaryPaymentMethod(deviceType)
}

export interface PaymentMethodOption {
  id: PaymentMethod
  name: string
  description: string
}

export function getDeviceOptimizedPaymentMethods(deviceType: string): PaymentMethodOption[] {
  const methods: PaymentMethodOption[] = []

  if (deviceType === "ios") {
    methods.push({
      id: "apple_pay",
      name: "Apple Pay",
      description: "Fast, secure checkout with Apple Pay.",
    })
  } else if (deviceType === "android") {
    methods.push({
      id: "google_pay",
      name: "Google Pay",
      description: "Fast, secure checkout with Google Pay.",
    })
  } else {
    methods.push({
      id: "google_pay",
      name: "Google Pay",
      description: "Fast, secure checkout with Google Pay.",
    })
  }

  methods.push({
    id: "contact_for_alternatives",
    name: "Call for Payment Options",
    description: "Prefer another method? Contact us to arrange cash, Zelle, or other options.",
  })

  return methods
}
