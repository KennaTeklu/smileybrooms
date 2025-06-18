import type { CartItem } from "./cart-context"

export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""

export const DEFAULT_CLEANING_PRICE = 100 // Example default price
export const DEFAULT_ADDON_PRICE = 25 // Example default addon price

export const MIN_ROOMS = 1
export const MAX_ROOMS = 10

export const DEFAULT_ROOM_CONFIG = {
  selectedTier: "Essential Clean",
  totalPrice: DEFAULT_CLEANING_PRICE,
  detailedTasks: [],
  notIncludedTasks: [],
  upsellMessage: "",
}

export const DEFAULT_CART_ITEM: CartItem = {
  id: "default-item",
  name: "Default Cleaning Service",
  price: DEFAULT_CLEANING_PRICE,
  priceId: "price_default_cleaning",
  quantity: 1,
  image: "/placeholder.svg",
  sourceSection: "default",
  metadata: {},
  paymentFrequency: "per_service",
}

// Panel Design Constants from User's Guide
export const panelDimensions = {
  desktop: { width: "min(480px, 33vw)", height: "100vh" },
  mobile: { width: "100vw", height: "85vh", position: "bottom-up" },
  transition: "cubic-bezier(0.32, 0.72, 0, 1)", // Stack Overflow's #1 easing curve
}

export const NOTIFICATION_DISCOUNT_AMOUNT = 0.99 // $0.99 discount for notification opt-in
