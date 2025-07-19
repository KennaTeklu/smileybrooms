/**
 * Shared, **client-safe** constants.
 * Never read sensitive env vars here.
 */

export const ROOM_CONFIG = {
  roomPrices: {
    master_bedroom: 100,
    bedroom: 80,
    bathroom: 90,
    kitchen: 120,
    living_room: 110,
    dining_room: 70,
    office: 95,
    playroom: 85,
    mudroom: 60,
    laundry_room: 75,
    sunroom: 90,
    guest_room: 70,
    garage: 50,
  },
  frequencyMultipliers: {
    one_time: 1.0,
    weekly: 0.8,
    bi_weekly: 0.85,
    monthly: 0.9,
    quarterly: 0.95,
  },
  cleanlinessMultipliers: {
    1: 0.9,
    2: 0.95,
    3: 1.0,
    4: 1.05,
    5: 1.1,
  },
  addOnPrices: {
    "oven-cleaning": 25,
    "fridge-cleaning": 20,
    "window-cleaning": 30,
    "laundry-service": 40,
  },
}

export const APP_CONSTANTS = {
  // General
  APP_NAME: "smileybrooms",
  CONTACT_EMAIL: "support@smileybrooms.com",
  PHONE_NUMBER: "+1 (800) 555-0123",
  ADDRESS: "123 Clean Street, Sparkle City, CA 90210",
}

/**
 * IMPORTANT:
 *  • No reference to NEXT_PUBLIC_FEATURE_KEY here.
 *  • Sensitive FEATURE_KEY is read only on the server via `lib/server/feature-key.ts`.
 */

/**
 * List of all feature-flag keys that the app may look for.
 * Keep the list in sync with any new NEXT_PUBLIC_FEATURE_* env vars you add.
 */
export const FEATURE_KEYS = [
  // General feature flags
  "NEW_PRICING_MODEL",
  "ADVANCED_CART",
  "ROOM_VISUALIZATION",
  "AI_POWERED_CHATBOT",
  "DYNAMIC_PAYMENT_OPTIONS",
  "ENHANCED_ACCESSIBILITY",
  "CAREER_APPLICATION",
  "EMAIL_SUMMARY",
  "TERMS_AGREEMENT_POPUP",
  "DEVICE_OPTIMIZED_THEMES",
  "ADVANCED_SCROLL_PHYSICS",
  "GEOLOCATION_SERVICES",
  "BIOMETRIC_AUTHENTICATION",
  "WEB_SHARE_API",
  "VOICE_COMMANDS",
  "PERFORMANCE_MONITORING",
  "NETWORK_STATUS_INDICATOR",
  "BATTERY_STATUS_OPTIMIZATION",
  "VIBRATION_FEEDBACK",
  "KEYBOARD_SHORTCUTS",
  "CLIPBOARD_INTEGRATION",
  "DRAG_AND_DROP_SUPPORT",
  // E-commerce & marketing
  "FLOATING_CART_BUTTON",
  "ABANDONMENT_RESCUE",
  "CART_HEALTH_DASHBOARD",
  "PRODUCT_CATALOG",
  "SERVICE_MAP",
  // Content & UI
  "CLEANING_CHECKLIST",
  "CLEANING_TEAM_SELECTOR",
  "CLEANING_TIME_ESTIMATOR",
  "ROOM_CONFIGURATOR",
  "MULTI_STEP_CUSTOMIZATION_WIZARD",
  "DYNAMIC_FORM_GENERATION",
  "CONDITIONAL_FIELDS",
  "FORM_VALIDATION",
  "MASKED_INPUTS",
  // Compliance & security
  "COOKIE_CONSENT_MANAGER",
  "GDPR_COMPLIANCE",
  "TOS_GENERATOR",
  "CSRF_PROTECTION",
  "RATE_LIMITING",
  "HONEYPOT_TRAPS",
] as const

// Other constants might exist here, but are omitted for brevity as they were not part of the error.
// Example:
// export const APP_NAME = "SmileyBrooms";
// export const API_VERSION = "1.0";
