export const SERVICE_TIERS = {
  STANDARD: { id: "standard", name: "Standard", multiplier: 1.0 },
  PREMIUM: { id: "premium", name: "Premium", multiplier: 3.0 },
  ELITE: { id: "elite", name: "Elite", multiplier: 5.0 },
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
