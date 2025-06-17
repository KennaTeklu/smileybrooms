/// <reference lib="webworker" />

import {
  SERVICE_TIERS,
  CLEANLINESS_DIFFICULTY,
  BASE_ROOM_RATES,
  AUTOMATIC_TIER_UPGRADES, // Will be used in next phases
} from "../pricing-config"

// Define the input configuration type
export type ServiceConfig = {
  rooms: Record<string, number>
  serviceTier: "standard" | "premium" | "elite" // Updated from serviceType
  frequency: string
  cleanlinessLevel: number // This will correspond to the 'level' in CLEANLINESS_DIFFICULTY
  specialRequests?: string[]
  discounts?: Record<string, number>
  addons?: Record<string, number> // This will be updated to string[] later
  zipCode?: string
  squareFootage?: number
  propertyType?: string // Added for automatic tier upgrades
  petOwners?: boolean // Added for automatic tier upgrades
  postRenovation?: boolean // Added for automatic tier upgrades
  moldWaterDamage?: boolean // Added for automatic tier upgrades
  biohazardSituations?: boolean // Added for automatic tier upgrades
  selectedAddons?: string[] // New field for selected add-ons by ID
  selectedExclusiveServices?: string[] // New field for selected exclusive services by ID
}

// Define the output result type
export type PriceResult = {
  basePrice: number
  adjustments: Record<string, number>
  firstServicePrice: number
  recurringServicePrice: number
  estimatedDuration: number // in minutes
  breakdown: {
    category: string
    amount: number
    description: string
  }[]
  enforcedTier?: "standard" | "premium" | "elite" // New field for enforced tier
  enforcedTierReason?: string // New field for enforced tier reason
}

// Define the frequency options and their discounts (existing, no change)
const frequencyOptions = [
  { id: "one_time", discount: 0 },
  { id: "weekly", discount: 0.15 },
  { id: "biweekly", discount: 0.1 },
  { id: "monthly", discount: 0.05 },
  { id: "semi_annual", discount: 0.02 },
  { id: "annually", discount: 0.01 },
  { id: "vip_daily", discount: 0.25 },
]

// Removed the old cleanlinessMultipliers array as it's now sourced from pricing-config.ts

self.onmessage = (event: MessageEvent<ServiceConfig>) => {
  try {
    const config = event.data

    let currentServiceTier = config.serviceTier
    let enforcedTierReason: string | undefined

    // --- Automatic Tier Upgrades (Preliminary check, full logic in Phase 17) ---
    // This is a simplified placeholder for now, full enforcement logic will be in Phase 17
    // For example, if biohazard is selected, enforce Elite
    const cleanlinessLevelData = Object.values(CLEANLINESS_DIFFICULTY).find((c) => c.level === config.cleanlinessLevel)

    if (cleanlinessLevelData?.name === "Biohazard" && currentServiceTier !== SERVICE_TIERS.ELITE.id) {
      currentServiceTier = SERVICE_TIERS.ELITE.id
      enforcedTierReason = AUTOMATIC_TIER_UPGRADES.find((u) => u.condition === "biohazard_situations")?.message
    }
    // Add other preliminary checks here if needed for immediate enforcement feedback

    // Calculate base price based on selected rooms and the (potentially enforced) service tier
    let basePrice = 0
    const breakdown = []

    for (const [roomType, count] of Object.entries(config.rooms)) {
      if (count > 0) {
        const roomRate = BASE_ROOM_RATES[roomType as keyof typeof BASE_ROOM_RATES]?.[currentServiceTier]
        if (roomRate !== undefined) {
          basePrice += roomRate * count
          breakdown.push({
            category: `${roomType} (${count})`,
            amount: roomRate * count,
            description: `Base rate for ${count} ${roomType}(s) at ${currentServiceTier} tier`,
          })
        }
      }
    }

    // Apply service tier multiplier
    const serviceTierMultiplier =
      SERVICE_TIERS[currentServiceTier.toUpperCase() as keyof typeof SERVICE_TIERS]?.multiplier || 1.0
    const priceAfterServiceTier = basePrice * serviceTierMultiplier
    breakdown.push({
      category: "Service Tier Multiplier",
      amount: priceAfterServiceTier - basePrice,
      description: `${SERVICE_TIERS[currentServiceTier.toUpperCase() as keyof typeof SERVICE_TIERS]?.name} tier (${serviceTierMultiplier}x)`,
    })

    // Apply cleanliness level multiplier using the new CLEANLINESS_DIFFICULTY data
    const cleanlinessMultiplier = cleanlinessLevelData?.multipliers[currentServiceTier] || 1.0
    const priceAfterCleanliness = priceAfterServiceTier * cleanlinessMultiplier
    breakdown.push({
      category: "Cleanliness Level Multiplier",
      amount: priceAfterCleanliness - priceAfterServiceTier,
      description: `${cleanlinessLevelData?.name} level (${cleanlinessMultiplier}x)`,
    })

    // Calculate the one-time price (first service price)
    const firstServicePrice = priceAfterCleanliness

    // Apply frequency discount for recurring price
    const selectedFrequency = frequencyOptions.find((f) => f.id === config.frequency)
    const frequencyDiscount = selectedFrequency ? selectedFrequency.discount : 0
    const priceAfterFrequency = priceAfterCleanliness * (1 - frequencyDiscount)

    // Apply payment frequency discount (assuming 'yearly' is the only one with a discount here)
    const paymentDiscount = 0
    const recurringServicePrice = priceAfterFrequency * (1 - paymentDiscount)

    // Apply discounts and addons (simplified, will be updated in Phase 11)
    let discountTotal = 0
    if (config.discounts) {
      discountTotal = Object.values(config.discounts).reduce((sum, val) => sum + val, 0)
    }

    let addonTotal = 0
    // The 'addons' field in config will be replaced by 'selectedAddons' and 'selectedExclusiveServices' in Phase 11
    if (config.addons) {
      addonTotal = Object.values(config.addons).reduce((sum, val) => sum + val, 0)
    }

    // Final prices after all adjustments (for simplicity, applying to both)
    const finalFirstServicePrice = Math.max(0, firstServicePrice - discountTotal + addonTotal)
    const finalRecurringServicePrice = Math.max(0, recurringServicePrice - discountTotal + addonTotal)

    const result: PriceResult = {
      basePrice,
      adjustments: {
        serviceTier: priceAfterServiceTier - basePrice,
        cleanliness: priceAfterCleanliness - priceAfterServiceTier,
        frequency: priceAfterCleanliness - priceAfterFrequency,
        discounts: -discountTotal,
        addons: addonTotal,
      },
      firstServicePrice: Math.round(finalFirstServicePrice * 100) / 100,
      recurringServicePrice: Math.round(finalRecurringServicePrice * 100) / 100,
      estimatedDuration: Math.round(finalFirstServicePrice * 0.8), // Duration based on first service
      breakdown: breakdown, // Use the detailed breakdown
      enforcedTier: enforcedTierReason ? currentServiceTier : undefined,
      enforcedTierReason: enforcedTierReason,
    }

    self.postMessage(result)
  } catch (error: any) {
    self.postMessage({ error: error.message || "An unknown error occurred during calculation." })
  }
}
