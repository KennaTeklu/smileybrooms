// Define constants for the application

export const APP_NAME = "Smiley Brooms"
export const APP_VERSION = "1.0.0"
export const CONTACT_EMAIL = "support@smileybrooms.com"
export const PHONE_NUMBER = "+1 (800) 555-0123"

// Coupon codes and their discounts
export const VALID_COUPONS = [
  { code: "SMILEY20", discount: 0.2, description: "20% off your entire service" },
  { code: "FIRSTCLEAN10", discount: 0.1, description: "10% off your first cleaning" },
  { code: "WELCOMEHOME", discount: 0.15, description: "15% off for new customers" },
  { code: "SPRINGCLEAN", discount: 0.25, description: "25% off seasonal cleaning" },
]

// Other general constants
export const MAX_ROOM_COUNT = 10
export const MIN_CLEANLINESS_LEVEL = 0
export const MAX_CLEANLINESS_LEVEL = 100
export const DEFAULT_CLEANLINESS_LEVEL = 50

// Navigation paths
export const PATH_HOME = "/"
export const PATH_PRICING = "/pricing"
export const PATH_CHECKOUT = "/checkout"
export const PATH_SUCCESS = "/success"
export const PATH_CANCELED = "/canceled"
export const PATH_ABOUT = "/about"
export const PATH_CAREERS = "/careers"
export const PATH_CONTACT = "/contact"
export const PATH_PRIVACY = "/privacy"
export const PATH_TERMS = "/terms"
export const PATH_ACCESSIBILITY = "/accessibility"
export const PATH_DOWNLOAD = "/download"
export const PATH_EMAIL_SUMMARY = "/email-summary"
export const PATH_TECH_STACK = "/tech-stack"
export const PATH_CART = "/cart"
export const PATH_CALCULATOR = "/calculator"

// API routes
export const API_CHATBOT = "/api/chatbot"
export const API_STRIPE_CHECKOUT = "/api/stripe/checkout"

// Local Storage Keys
export const LS_CART_ITEMS = "smileybrooms_cart_items"
export const LS_ACCESSIBILITY_SETTINGS = "smileybrooms_accessibility_settings"
export const LS_TOUR_COMPLETED = "smileybrooms_tour_completed"

// Timeouts and Delays (in milliseconds)
export const DEBOUNCE_DELAY = 300
export const API_TIMEOUT = 10000

// Accessibility settings defaults
export const DEFAULT_ACCESSIBILITY_SETTINGS = {
  highContrast: false,
  textSize: "medium",
  animationsReduced: false,
  keyboardNavigation: false,
}

// Stripe related constants
export const STRIPE_CURRENCY = "usd"
export const STRIPE_MIN_AMOUNT = 0.5 // Minimum amount for Stripe payments in USD

// Email related constants
export const EMAIL_SENDER = "no-reply@smileybrooms.com"
export const EMAIL_SUBJECT_ORDER_CONFIRMATION = "Your Smiley Brooms Cleaning Confirmation!"
export const EMAIL_SUBJECT_QUOTE_REQUEST = "New Cleaning Quote Request from Smiley Brooms"
