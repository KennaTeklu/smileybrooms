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
