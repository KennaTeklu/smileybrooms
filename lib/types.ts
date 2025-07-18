import type { ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  sourceSection?: string // e.g., "rooms", "addons", "packages"
  metadata?: {
    [key: string]: any
    roomType?: string // e.g., "bedroom", "bathroom"
    roomConfig?: RoomConfig // Detailed room configuration
    detailedTasks?: string[] // Tasks included in the service
    notIncludedTasks?: string[] // Tasks explicitly not included
    upsellMessage?: string // Message for upsell opportunities
  }
}

export interface CartSummary {
  subTotal: number
  discounts: number
  taxes: number
  shipping: number
  total: number
}

export interface CartContextType {
  cart: {
    items: CartItem[]
    totalPrice: number
    totalItems: number
    summary: CartSummary
  }
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export interface RoomConfig {
  id: string
  name: string
  basePrice: number
  timeEstimate: string
  detailedTasks: string[]
  notIncludedTasks: string[]
  upsellMessage?: string
}

export interface RoomContextType {
  selectedRooms: { [key: string]: number }
  roomConfigs: { [key: string]: RoomConfig[] }
  addRoom: (roomType: string, tierId: string) => void
  removeRoom: (roomType: string, tierId: string) => void
  updateRoomQuantity: (roomType: string, tierId: string, quantity: number) => void
  getRoomQuantity: (roomType: string, tierId: string) => number
  getRoomConfig: (roomType: string, tierId: string) => RoomConfig | undefined
  getDetailedPricingBreakdown: () => PricingBreakdown
  getTotalPrice: () => number
  clearRooms: () => void
}

export interface PricingBreakdown {
  subtotal: number
  discounts: Array<{ name: string; amount: number }>
  total: number
  roomBreakdowns: Array<{
    roomType: string
    basePrice: number
    tierAdjustment: number
    addOnTotal: number
    quantity: number
    roomTotal: number
  }>
}

export interface AccessibilityPreferences {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReaderMode: boolean
  keyboardNavigation: boolean
  textAlignment: "left" | "center" | "right" | "justify"
  fontFamily: string
  language: string
}

export interface AccessibilityContextType {
  preferences: AccessibilityPreferences
  updatePreference: <K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) => void
  resetPreferences: () => void
}

export interface FeatureFlag {
  key: string
  enabled: boolean
  description: string
}

export interface FeatureFlagContextType {
  featureFlags: FeatureFlag[]
  isFeatureEnabled: (key: string) => boolean
  setFeatureFlag: (key: string, enabled: boolean) => void
}

export interface TourContextType {
  currentStep: number
  startTour: () => void
  nextStep: () => void
  prevStep: () => void
  endTour: () => void
  isActive: boolean
  tourSteps: TourStep[]
}

export interface TourStep {
  id: string
  title: string
  content: ReactNode
  targetSelector: string
  placement: "top" | "bottom" | "left" | "right" | "center"
  action?: () => void
  isOptional?: boolean
}
