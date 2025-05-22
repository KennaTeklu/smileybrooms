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

export const TIER_PRICES = {
  essential: 0,
  advanced: 15,
  premium: 30,
}

export const ADD_ON_PRICES = {
  inside_fridge: 25,
  inside_oven: 20,
  inside_cabinets: 30,
  garage_organization: 50,
  basement_cleaning: 40,
  attic_cleaning: 35,
}

export const REDUCTION_PRICES = {
  bring_own_supplies: -10,
  eco_friendly_discount: -5,
  senior_discount: -15,
  student_discount: -10,
}

export const SERVICE_AREAS = ["Downtown", "Midtown", "Uptown", "Suburbs", "Metro Area"]

export const PAYMENT_METHODS = ["credit_card", "debit_card", "paypal", "apple_pay", "google_pay"] as const

export const BOOKING_STATUSES = ["pending", "confirmed", "in_progress", "completed", "cancelled"] as const
