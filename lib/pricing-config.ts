// lib/pricing-config.ts

// 2.1 Service Tiers
export const SERVICE_TIERS = {
  STANDARD: { id: "standard", name: "Standard", multiplier: 1.0, description: "Basic surface cleaning" },
  PREMIUM: { id: "premium", name: "Premium", multiplier: 3.0, description: "Deep sanitization + premium products" },
  ELITE: { id: "elite", name: "Elite", multiplier: 5.0, description: "White-glove service + guarantees" },
}

// 2.2 Cleanliness Difficulty Multipliers
export const CLEANLINESS_DIFFICULTY = {
  LIGHT: { level: 1, name: "Light", multipliers: { standard: 1.0, premium: 1.0, elite: 1.0 } },
  MEDIUM: { level: 2, name: "Medium", multipliers: { standard: 2.0, premium: 2.5, elite: 3.0 } },
  HEAVY: { level: 3, name: "Heavy", multipliers: { standard: 3.0, premium: 4.0, elite: 6.0 } },
  BIOHAZARD: { level: 4, name: "Biohazard", multipliers: { standard: 4.0, premium: 8.0, elite: 12.0 } },
}

// 2.3 Base Room Rates ($) - Per room type and service tier
export const BASE_ROOM_RATES = {
  master_bedroom: { standard: 54.28, premium: 162.84, elite: 271.4 }, // Adjusted from previous
  bedroom: { standard: 40, premium: 120, elite: 200 },
  bathroom: { standard: 60, premium: 180, elite: 300 },
  kitchen: { standard: 100, premium: 300, elite: 500 },
  living_room: { standard: 80, premium: 240, elite: 400 },
  dining_room: { standard: 25.63, premium: 76.89, elite: 128.15 }, // Adjusted from previous
  office: { standard: 70, premium: 210, elite: 350 },
  playroom: { standard: 25.64, premium: 76.92, elite: 128.2 }, // Adjusted from previous
  mudroom: { standard: 21.73, premium: 65.19, elite: 108.65 }, // Adjusted from previous
  laundry_room: { standard: 13.46, premium: 40.38, elite: 67.3 }, // Adjusted from previous
  sunroom: { standard: 22.25, premium: 66.75, elite: 111.25 }, // Adjusted from previous
  guest_room: { standard: 35.42, premium: 106.26, elite: 177.1 }, // Adjusted from previous
  garage: { standard: 83.99, premium: 251.97, elite: 419.95 }, // Adjusted from previous
}

// 2.4 Strategic Add-Ons
export const STRATEGIC_ADDONS = [
  {
    id: "appliance_interiors",
    name: "Appliance Interiors",
    prices: { standard: 50, premium: 100, elite: 0 },
    includedInElite: true,
    unit: "",
  },
  { id: "window_cleaning", name: "Window Cleaning", prices: { standard: 8, premium: 15, elite: 20 }, unit: "/window" },
  {
    id: "grout_restoration",
    name: "Grout Restoration",
    prices: { standard: 1.5, premium: 3, elite: 5 },
    unit: "/sq ft",
  },
  {
    id: "air_duct_sanitization",
    name: "Air Duct Sanitization",
    prices: { standard: 300, premium: 500, elite: 800 },
    unit: "",
  },
]

// 2.5 Premium-Exclusive Services (Elite Only)
export const PREMIUM_EXCLUSIVE_SERVICES = [
  { id: "microbial_certification", name: "Microbial Certification", price: 499, unit: "" },
  { id: "allergen_elimination", name: "Allergen Elimination", price: 200, unit: "/room" },
  { id: "emergency_2hr_response", name: "Emergency 2-Hr Response", price: 1000, unit: "" },
]

// 2.6 Minimum Job Values (based on property size/type)
export const MINIMUM_JOB_VALUES = {
  studio: { standard: 200, premium: 600, elite: 1000 },
  "3br_home": { standard: 500, premium: 1500, elite: 2500 },
  "5br_mansion": { standard: 900, premium: 2700, elite: 4500 },
}

// 2.7 Automatic Tier Upgrade Rules
export const AUTOMATIC_TIER_UPGRADES = [
  {
    condition: "square_footage",
    threshold: 3000,
    requiredTier: SERVICE_TIERS.PREMIUM.id,
    message: "For homes over 3,000 sq ft, Premium service is required.",
  },
  {
    condition: "property_type",
    value: "rental",
    requiredTier: SERVICE_TIERS.PREMIUM.id,
    message: "Rental properties require Premium service.",
  },
  {
    condition: "pet_owners",
    value: true,
    requiredTier: SERVICE_TIERS.PREMIUM.id,
    message: "Homes with pets require Premium service.",
  },
  {
    condition: "post_renovation",
    value: true,
    requiredTier: SERVICE_TIERS.ELITE.id,
    message: "Post-renovation cleanups require Elite service.",
  },
  {
    condition: "mold_water_damage",
    value: true,
    requiredTier: SERVICE_TIERS.ELITE.id,
    message: "Mold/water damage situations require Elite service.",
  },
  {
    condition: "cleanliness_level",
    value: CLEANLINESS_DIFFICULTY.BIOHAZARD.level,
    requiredTier: SERVICE_TIERS.ELITE.id,
    message: "Biohazard situations require Elite service.",
  },
]

// 2.8 Frequency Options (Refined from previous, now includes multipliers for recurring)
export const FREQUENCY_OPTIONS = [
  { id: "one_time", label: "One-Time", multiplier: 1.0, isRecurring: false, recurringInterval: null },
  { id: "weekly", label: "Weekly", multiplier: 0.85, isRecurring: true, recurringInterval: "week" }, // 15% discount
  { id: "biweekly", label: "Biweekly", multiplier: 0.9, isRecurring: true, recurringInterval: "week" }, // 10% discount
  { id: "monthly", label: "Monthly", multiplier: 0.95, isRecurring: true, recurringInterval: "month" }, // 5% discount
  { id: "semi_annual", label: "Semi-Annual", multiplier: 0.98, isRecurring: true, recurringInterval: "month" }, // 2% discount
  { id: "annually", label: "Annual", multiplier: 0.99, isRecurring: true, recurringInterval: "year" }, // 1% discount
  { id: "vip_daily", label: "VIP Daily", multiplier: 0.75, isRecurring: true, recurringInterval: "week" }, // 25% discount
]

// 2.9 Payment Frequency Options (Refined)
export const PAYMENT_FREQUENCY_OPTIONS = [
  { id: "per_service", label: "Pay Per Service", multiplier: 1.0 },
  { id: "monthly", label: "Monthly Subscription", multiplier: 1.0 },
  { id: "yearly", label: "Annual Subscription (Save 10%)", multiplier: 0.9 },
]

// Room types for selection (icons will be handled in UI)
export const ROOM_TYPES_FOR_SELECTION = [
  { id: "master_bedroom", name: "Master Bedroom" },
  { id: "bedroom", name: "Bedroom" },
  { id: "bathroom", name: "Bathroom" },
  { id: "kitchen", name: "Kitchen" },
  { id: "living_room", name: "Living Room" },
  { id: "dining_room", name: "Dining Room" },
  { id: "office", name: "Home Office" },
  { id: "playroom", name: "Playroom" },
  { id: "mudroom", name: "Mudroom" },
  { id: "laundry_room", name: "Laundry Room" },
  { id: "sunroom", name: "Sunroom" },
  { id: "guest_room", name: "Guest Room" },
  { id: "garage", name: "Garage" },
]

// Property types for minimum job value
export const PROPERTY_SIZE_OPTIONS = [
  { id: "studio", label: "Studio Apartment" },
  { id: "3br_home", label: "3+ Bedroom Home" },
  { id: "5br_mansion", label: "5+ Bedroom Mansion" },
  { id: "custom", label: "Custom (Enter Sq Ft)" }, // For square footage input
]

// Conditions for automatic tier upgrades (for UI inputs)
export const UPGRADE_CONDITIONS_OPTIONS = [
  { id: "rental_property", label: "Rental Property" },
  { id: "pet_owners", label: "Pet Owners" },
  { id: "post_renovation", label: "Post-Renovation Cleanup" },
  { id: "mold_water_damage", label: "Mold/Water Damage" },
]
