export const ROOM_CONFIG = {
  roomPrices: {
    master_bedroom: 54.28,
    bedroom: 35.42,
    bathroom: 43.63,
    kitchen: 54.8,
    living_room: 31.37,
    dining_room: 25.63,
    office: 19.53,
    playroom: 25.64,
    mudroom: 21.73,
    laundry_room: 13.46,
    sunroom: 22.25,
    guest_room: 35.42,
    garage: 83.99,
  },
  frequencyMultipliers: {
    one_time: 2.17,
    weekly: 1.0,
    biweekly: 1.2,
    monthly: 1.54,
    semi_annual: 1.92,
    annually: 2.56,
    vip_daily: 7.5,
  },
  serviceFee: 50,
}

// Export individual constants for the worker
export const ROOM_PRICES = ROOM_CONFIG.roomPrices

export const SERVICE_TIERS = {
  standard: { multiplier: 1.0, name: "Standard" },
  premium: { multiplier: 3.0, name: "Premium" },
  elite: { multiplier: 5.0, name: "Elite" },
}

export const CLEANLINESS_LEVEL_MULTIPLIERS = {
  light: 1.0,
  average: 1.5,
  heavy: 2.0,
  biohazard: 3.0,
}

export const FREQUENCY_DISCOUNTS = {
  "one-time": 0,
  weekly: 0.1,
  biweekly: 0.05,
  monthly: 0.02,
}

export const ADDON_PRICING = {
  appliance_interiors: 50,
  window_cleaning: 8,
  grout_restoration: 1.5,
  air_duct_sanitization: 300,
}

export const EXCLUSIVE_SERVICE_PRICING = {
  microbial_certification: 499,
  allergen_elimination: 200,
  emergency_2hr_response: 1000,
}

export const WAIVER_DISCOUNT = 0.05

export const MINIMUM_JOB_VALUES = {
  studio: { standard: 200, premium: 600, elite: 1000 },
  "3br_home": { standard: 500, premium: 1500, elite: 2500 },
  "5br_mansion": { standard: 900, premium: 2700, elite: 4500 },
}
