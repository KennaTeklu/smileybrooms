export const SERVICE_TIERS = {
  STANDARD: { id: "standard", name: "Standard", multiplier: 1.0 },
  PREMIUM: { id: "premium", name: "Premium", multiplier: 3.0 },
  ELITE: { id: "elite", name: "Elite", multiplier: 5.0 },
} as const // Added as const for better type inference

export const CLEANLINESS_DIFFICULTY = {
  LIGHT: { level: 1, name: "Light", multipliers: { standard: 1.0, premium: 1.0, elite: 1.0 } },
  MEDIUM: { level: 2, name: "Medium", multipliers: { standard: 2.5, premium: 3.0, elite: 4.0 } },
  HEAVY: { level: 3, name: "Heavy", multipliers: { standard: 4.0, premium: 5.0, elite: 8.0 } },
  BIOHAZARD: { level: 4, name: "Biohazard", multipliers: { standard: 6.0, premium: 10.0, elite: 15.0 } },
} as const // Added as const

export const BASE_ROOM_RATES = {
  bedroom: { standard: 50, premium: 150, elite: 250 },
  bathroom: { standard: 75, premium: 225, elite: 375 },
  kitchen: { standard: 125, premium: 375, elite: 625 },
  livingRoom: { standard: 80, premium: 240, elite: 400 },
  diningRoom: { standard: 70, premium: 210, elite: 350 },
  homeOffice: { standard: 70, premium: 210, elite: 350 },
  laundryRoom: { standard: 60, premium: 180, elite: 300 },
  entryway: { standard: 50, premium: 150, elite: 250 },
  hallway: { standard: 50, premium: 150, elite: 250 },
  stairs: { standard: 60, premium: 180, elite: 300 },
  default: { standard: 50, premium: 150, elite: 250 },
} as const // Added as const

export const STRATEGIC_ADDONS = [
  {
    id: "appliance_interiors",
    name: "Appliance Interiors",
    prices: { standard: 50, premium: 100, elite: 0 },
    includedInElite: true,
  },
  {
    id: "window_cleaning",
    name: "Window Cleaning",
    prices: { standard: 8, premium: 15, elite: 20 },
    unit: "/window",
    includedInElite: false,
  },
  {
    id: "grout_restoration",
    name: "Grout Restoration",
    prices: { standard: 1.5, premium: 3, elite: 5 },
    unit: "/sq ft",
    includedInElite: false,
  },
  {
    id: "air_duct_sanitization",
    name: "Air Duct Sanitization",
    prices: { standard: 300, premium: 500, elite: 800 },
    includedInElite: false,
  },
] as const // Added as const

export const PREMIUM_EXCLUSIVE_SERVICES = [
  { id: "microbial_certification", name: "Microbial Certification", price: 499, unit: "" },
  { id: "allergen_elimination", name: "Allergen Elimination", price: 200, unit: "/room" },
  { id: "emergency_2hr_response", name: "Emergency 2-Hr Response", price: 1000, unit: "" },
] as const // Added as const

export const AUTOMATIC_TIER_UPGRADES = [
  {
    condition: "sq_ft_over_3000",
    threshold: 3000,
    requiredTier: "premium",
    message: "For homes over 3,000 sq ft, Premium service is required.",
  },
  { condition: "rental_property", requiredTier: "premium", message: "Rental properties require Premium service." },
  { condition: "pet_owners", requiredTier: "premium", message: "Homes with pets require Premium service." },
  { condition: "post_renovation", requiredTier: "elite", message: "Post-renovation cleanings require Elite service." },
  {
    condition: "mold_water_damage",
    requiredTier: "elite",
    message: "Mold/water damage situations require Elite service.",
  },
  { condition: "biohazard_situations", requiredTier: "elite", message: "Biohazard situations require Elite service." },
] as const // Added as const

export const MINIMUM_JOB_VALUES = {
  studio: { standard: 200, premium: 600, elite: 1000 },
  "3br_home": { standard: 500, premium: 1500, elite: 2500 },
  "5br_mansion": { standard: 900, premium: 2700, elite: 4500 },
} as const // Added as const

export const BUNDLE_NAMING = {
  STANDARD: "Essentials",
  PREMIUM: "Complete Care",
  ELITE: "Concierge Deep Clean",
} as const // Added as const

// Define and export the missing constants with their actual values or structures
export const ROOM_CONFIG = {
  roomTypes: [
    { id: "bedroom", name: "Bedroom", icon: "🛏️" },
    { id: "bathroom", name: "Bathroom", icon: "🛁" },
    { id: "kitchen", name: "Kitchen", icon: "🍳" },
    { id: "livingRoom", name: "Living Room", icon: "🛋️" },
    { id: "diningRoom", name: "Dining Room", icon: "🍽️" },
    { id: "homeOffice", name: "Home Office", icon: "🖥️" },
    { id: "laundryRoom", name: "Laundry Room", icon: "🧺" },
    { id: "entryway", name: "Entryway", icon: "🚪" },
    { id: "hallway", name: "Hallway", icon: "🚶" },
    { id: "stairs", name: "Stairs", icon: "🪜" },
  ],
} as const

export const ADDON_CONFIG = STRATEGIC_ADDONS.reduce(
  (acc, addon) => {
    acc[addon.id] = addon
    return acc
  },
  {} as Record<string, (typeof STRATEGIC_ADDONS)[number]>,
)

export const EXCLUSIVE_SERVICE_CONFIG = PREMIUM_EXCLUSIVE_SERVICES.reduce(
  (acc, service) => {
    acc[service.id] = service
    return acc
  },
  {} as Record<string, (typeof PREMIUM_EXCLUSIVE_SERVICES)[number]>,
)

export const CLEANLINESS_LEVELS = Object.values(CLEANLINESS_DIFFICULTY).reduce(
  (acc, level) => {
    acc[level.level] = level
    return acc
  },
  {} as Record<number, (typeof CLEANLINESS_DIFFICULTY)[keyof typeof CLEANLINESS_DIFFICULTY]>,
)

export const FREQUENCY_OPTIONS = {
  one_time: { id: "one_time", name: "One-Time", discount: 0 },
  weekly: { id: "weekly", name: "Weekly", discount: 0.15 },
  biweekly: { id: "biweekly", name: "Biweekly", discount: 0.1 },
  monthly: { id: "monthly", name: "Monthly", discount: 0.05 },
  semi_annual: { id: "semi_annual", name: "Semi-Annual", discount: 0.02 },
  annually: { id: "annually", name: "Annual", discount: 0.01 },
  vip_daily: { id: "vip_daily", name: "VIP Daily", discount: 0.25 },
} as const

export const PROPERTY_TYPES = Object.keys(MINIMUM_JOB_VALUES)

// Re-exporting for consistency if other files expect these specific names
export const ROOM_PRICES = BASE_ROOM_RATES
export const CLEANLINESS_LEVEL_MULTIPLIERS = CLEANLINESS_DIFFICULTY
export const FREQUENCY_DISCOUNTS = FREQUENCY_OPTIONS
export const ADDON_PRICING = ADDON_CONFIG
export const EXCLUSIVE_SERVICE_PRICING = EXCLUSIVE_SERVICE_CONFIG
export const WAIVER_DISCOUNT = 0.1 // Example value, adjust as needed based on business logic
