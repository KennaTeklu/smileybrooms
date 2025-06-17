export const SERVICE_TIERS = {
  STANDARD: { id: "standard", name: "Standard", multiplier: 1.0 },
  PREMIUM: { id: "premium", name: "Premium", multiplier: 3.0 },
  ELITE: { id: "elite", name: "Elite", multiplier: 5.0 },
}

export const CLEANLINESS_LEVELS = {
  LIGHT: { level: 1, name: "Light", multipliers: { standard: 1.0, premium: 1.0, elite: 1.0 } },
  MEDIUM: { level: 2, name: "Medium", multipliers: { standard: 2.0, premium: 2.5, elite: 3.0 } },
  HEAVY: { level: 3, name: "Heavy", multipliers: { standard: 3.0, premium: 4.0, elite: 6.0 } },
  BIOHAZARD: { level: 4, name: "Biohazard", multipliers: { standard: 4.0, premium: 8.0, elite: 12.0 } },
}

export const ROOM_CONFIG = {
  bedroom: { standard: 40, premium: 120, elite: 200 },
  bathroom: { standard: 60, premium: 180, elite: 300 },
  kitchen: { standard: 100, premium: 300, elite: 500 },
  livingRoom: { standard: 80, premium: 240, elite: 400 },
  homeOffice: { standard: 70, premium: 210, elite: 350 },
}

export const ADDON_CONFIG = {
  appliance_interiors: {
    name: "Appliance Interiors",
    price: 50,
    eliteIncluded: true,
  },
  window_cleaning: {
    name: "Window Cleaning",
    price: 8,
    unit: "/window",
    eliteIncluded: false,
  },
  grout_restoration: {
    name: "Grout Restoration",
    price: 1.5,
    unit: "/sq ft",
    eliteIncluded: false,
  },
  air_duct_sanitization: {
    name: "Air Duct Sanitization",
    price: 300,
    eliteIncluded: false,
  },
}

export const EXCLUSIVE_SERVICE_CONFIG = {
  microbial_certification: {
    name: "Microbial Certification",
    price: 499,
    eliteOnly: true,
  },
  allergen_elimination: {
    name: "Allergen Elimination",
    price: 200,
    unit: "/room",
    eliteOnly: true,
  },
  emergency_2hr_response: {
    name: "Emergency 2-Hr Response",
    price: 1000,
    eliteOnly: true,
  },
}

export const FREQUENCY_OPTIONS = {
  "one-time": { name: "One Time", discount: 0 },
  weekly: { name: "Weekly", discount: 0.1 },
  biweekly: { name: "Bi-weekly", discount: 0.05 },
  monthly: { name: "Monthly", discount: 0.02 },
}

export const PROPERTY_TYPES = {
  studio: { name: "Studio", sqft: "< 500" },
  "3br_home": { name: "3BR Home", sqft: "1000-2000" },
  "5br_mansion": { name: "5BR Mansion", sqft: "3000+" },
}

export const MINIMUM_JOB_VALUES = {
  studio: { standard: 200, premium: 600, elite: 1000 },
  "3br_home": { standard: 500, premium: 1500, elite: 2500 },
  "5br_mansion": { standard: 900, premium: 2700, elite: 4500 },
}

export const CLEANLINESS_DIFFICULTY = {
  LIGHT: { level: 1, name: "Light", multipliers: { standard: 1.0, premium: 1.0, elite: 1.0 } },
  MEDIUM: { level: 2, name: "Medium", multipliers: { standard: 2.0, premium: 2.5, elite: 3.0 } },
  HEAVY: { level: 3, name: "Heavy", multipliers: { standard: 3.0, premium: 4.0, elite: 6.0 } },
  BIOHAZARD: { level: 4, name: "Biohazard", multipliers: { standard: 4.0, premium: 8.0, elite: 12.0 } },
}

export const BASE_ROOM_RATES = {
  bedroom: { standard: 40, premium: 120, elite: 200 },
  bathroom: { standard: 60, premium: 180, elite: 300 },
  kitchen: { standard: 100, premium: 300, elite: 500 },
  livingRoom: { standard: 80, premium: 240, elite: 400 },
  homeOffice: { standard: 70, premium: 210, elite: 350 },
}

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
]

export const PREMIUM_EXCLUSIVE_SERVICES = [
  { id: "microbial_certification", name: "Microbial Certification", price: 499, unit: "" },
  { id: "allergen_elimination", name: "Allergen Elimination", price: 200, unit: "/room" },
  { id: "emergency_2hr_response", name: "Emergency 2-Hr Response", price: 1000, unit: "" },
]

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
]
