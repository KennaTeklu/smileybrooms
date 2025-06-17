/// <reference lib="webworker" />

import {
  SERVICE_TIERS,
  CLEANLINESS_DIFFICULTY,
  BASE_ROOM_RATES,
  STRATEGIC_ADDONS,
  PREMIUM_EXCLUSIVE_SERVICES,
  AUTOMATIC_TIER_UPGRADES,
  MINIMUM_JOB_VALUES,
} from "../pricing-data"

// Define the input configuration type (duplicated for worker)
export type ServiceConfig = {
  selectedRooms: Record<string, number>
  selectedTier: ServiceTierId // 'standard', 'premium', 'elite'
  cleanlinessLevel: CleanlinessLevelId // 'LIGHT', 'MEDIUM', 'HEAVY', 'BIOHAZARD'
  selectedAddons: { id: string; quantity?: number }[] // For add-ons with quantity like windows, grout
  propertySizeSqFt?: number // For automatic upgrades
  propertyType?: "rental" | "owner_occupied" // For automatic upgrades
  hasPets?: boolean // For automatic upgrades
  isPostRenovation?: boolean // For automatic upgrades
  hasMoldWaterDamage?: boolean // For automatic upgrades
  isBiohazardSituation?: boolean // For automatic upgrades
  // Add other relevant inputs for automatic upgrades
  frequency?: string // Keep for recurring logic if still needed
  paymentFrequency?: "per_service" | "monthly" | "yearly" // Keep for recurring logic if still needed
}

// Define the output result type (duplicated for worker)
export type PriceResult = {
  baseRoomPrice: number
  tierMultiplier: number
  cleanlinessMultiplier: number
  addOnsTotal: number
  premiumExclusiveTotal: number
  subtotal: number
  finalPrice: number
  enforcedTier?: ServiceTierId // If an automatic upgrade occurred
  enforcementReason?: string // Reason for enforcement
  estimatedDuration: number // in minutes
  breakdown: {
    category: string
    amount: number
    description: string
    details?: string
  }[]
  warnings?: string[] // For biohazard waiver, etc.
}

// Define the room types and their base prices (duplicated for worker)
const roomTypes = [
  { id: "bedroom", basePrice: 30 },
  { id: "bathroom", basePrice: 35 },
  { id: "kitchen", basePrice: 45 },
  { id: "living_room", basePrice: 40 },
  { id: "dining_room", basePrice: 25 },
  { id: "office", basePrice: 30 },
  { id: "laundry_room", basePrice: 20 },
  { id: "hallway", basePrice: 15 },
  { id: "staircase", basePrice: 25 },
  { id: "basement", basePrice: 50 },
  { id: "garage", basePrice: 40 },
  { id: "patio", basePrice: 30 },
  { id: "other", basePrice: 25 },
]

// Define the frequency options and their discounts (duplicated for worker)
const frequencyOptions = [
  { id: "one_time", discount: 0 },
  { id: "weekly", discount: 0.15 },
  { id: "biweekly", discount: 0.1 },
  { id: "monthly", discount: 0.05 },
  { id: "semi_annual", discount: 0.02 },
  { id: "annually", discount: 0.01 },
  { id: "vip_daily", discount: 0.25 },
]

// Define the cleanliness level multipliers (duplicated for worker)
const cleanlinessMultipliers = [
  { level: 1, multiplier: 0.8 },
  { level: 2, multiplier: 1.0 },
  { level: 3, multiplier: 1.2 },
  { level: 4, multiplier: 1.5 },
  { level: 5, multiplier: 2.0 },
]

// Define types for ServiceTierId and CleanlinessLevelId
type ServiceTierId = "standard" | "premium" | "elite"
type CleanlinessLevelId = "LIGHT" | "MEDIUM" | "HEAVY" | "BIOHAZARD"

self.onmessage = (event: MessageEvent<ServiceConfig>) => {
  try {
    const config = event.data
    const {
      selectedRooms,
      selectedTier,
      cleanlinessLevel,
      selectedAddons,
      propertySizeSqFt,
      propertyType,
      hasPets,
      isPostRenovation,
      hasMoldWaterDamage,
      isBiohazardSituation,
      frequency,
      paymentFrequency,
    } = config

    const breakdown: PriceResult["breakdown"] = []
    const warnings: string[] = []

    // 1. Determine Enforced Tier (Automatic Tier Upgrades)
    let currentTier = selectedTier
    let enforcedTier: ServiceTierId | undefined
    let enforcementReason: string | undefined

    for (const upgradeRule of AUTOMATIC_TIER_UPGRADES) {
      let conditionMet = false
      if (upgradeRule.condition === "square_footage" && propertySizeSqFt && propertySizeSqFt > upgradeRule.threshold) {
        conditionMet = true
      } else if (upgradeRule.condition === "property_type" && propertyType === upgradeRule.value) {
        conditionMet = true
      } else if (upgradeRule.condition === "pet_owners" && hasPets === upgradeRule.value) {
        conditionMet = true
      } else if (upgradeRule.condition === "post_renovation" && isPostRenovation === upgradeRule.value) {
        conditionMet = true
      } else if (upgradeRule.condition === "mold_water_damage" && hasMoldWaterDamage === upgradeRule.value) {
        conditionMet = true
      } else if (upgradeRule.condition === "biohazard_situation" && isBiohazardSituation === upgradeRule.value) {
        conditionMet = true
      }

      if (conditionMet) {
        const requiredTierIndex = Object.values(SERVICE_TIERS).findIndex((t) => t.id === upgradeRule.requiredTier)
        const currentTierIndex = Object.values(SERVICE_TIERS).findIndex((t) => t.id === currentTier)

        if (requiredTierIndex > currentTierIndex) {
          currentTier = upgradeRule.requiredTier
          enforcedTier = upgradeRule.requiredTier
          enforcementReason = upgradeRule.message
          break // Apply the highest required tier and stop
        }
      }
    }

    // If biohazard cleanliness is selected, enforce Elite if not already enforced higher
    if (cleanlinessLevel === CLEANLINESS_DIFFICULTY.BIOHAZARD.id) {
      const eliteTierIndex = Object.values(SERVICE_TIERS).findIndex((t) => t.id === SERVICE_TIERS.ELITE.id)
      const currentTierIndex = Object.values(SERVICE_TIERS).findIndex((t) => t.id === currentTier)
      if (eliteTierIndex > currentTierIndex) {
        currentTier = SERVICE_TIERS.ELITE.id
        enforcedTier = SERVICE_TIERS.ELITE.id
        enforcementReason = enforcementReason
          ? `${enforcementReason} and Biohazard conditions.`
          : "Biohazard conditions require Elite service."
      }
      warnings.push("Biohazard cleaning requires a signed waiver and specialized protocols.")
    }

    // 2. Base Room Price Calculation
    let baseRoomPrice = 0
    Object.entries(selectedRooms).forEach(([roomId, count]) => {
      if (count > 0) {
        const roomRate = BASE_ROOM_RATES[roomId]?.[currentTier]
        if (roomRate) {
          baseRoomPrice += roomRate * count
          breakdown.push({
            category: "Rooms",
            amount: roomRate * count,
            description: `${count} x ${roomId.replace(/_/g, " ")} (${SERVICE_TIERS[currentTier.toUpperCase() as ServiceTierId].name})`,
          })
        }
      }
    })

    // 3. Apply Service Tier Multiplier (already implicitly applied by using tiered room rates)
    // This step is now integrated into baseRoomPrice calculation.
    // We can add a breakdown entry for clarity if needed, but the multiplier is baked into the rates.
    const tierMultiplierValue = SERVICE_TIERS[currentTier.toUpperCase() as ServiceTierId].multiplier
    // breakdown.push({
    //   category: "Service Tier Multiplier",
    //   amount: baseRoomPrice * (tierMultiplierValue - 1), // Show the additional cost from multiplier
    //   description: `${SERVICE_TIERS[currentTier.toUpperCase() as ServiceTierId].name} (${tierMultiplierValue}x)`,
    // });

    // 4. Apply Cleanliness Multiplier
    const cleanlinessMultiplierValue =
      CLEANLINESS_DIFFICULTY[cleanlinessLevel.toUpperCase() as CleanlinessLevelId].multipliers[currentTier]
    const priceAfterCleanliness = baseRoomPrice * cleanlinessMultiplierValue
    breakdown.push({
      category: "Cleanliness Adjustment",
      amount: priceAfterCleanliness - baseRoomPrice,
      description: `${CLEANLINESS_DIFFICULTY[cleanlinessLevel.toUpperCase() as CleanlinessLevelId].name} (${cleanlinessMultiplierValue}x)`,
    })

    // 5. Add-Ons Addition
    let addOnsTotal = 0
    selectedAddons.forEach((addon) => {
      const strategicAddon = STRATEGIC_ADDONS.find((a) => a.id === addon.id)
      if (strategicAddon) {
        let addonPrice = strategicAddon.prices[currentTier]
        if (strategicAddon.includedInElite && currentTier === SERVICE_TIERS.ELITE.id) {
          addonPrice = 0 // Included in Elite
        }
        const quantity = addon.quantity || 1
        addOnsTotal += addonPrice * quantity
        breakdown.push({
          category: "Strategic Add-On",
          amount: addonPrice * quantity,
          description: `${quantity} x ${strategicAddon.name} (${SERVICE_TIERS[currentTier.toUpperCase() as ServiceTierId].name})`,
        })
      }
      const premiumExclusive = PREMIUM_EXCLUSIVE_SERVICES.find((a) => a.id === addon.id)
      if (premiumExclusive && premiumExclusive.eliteOnly && currentTier === SERVICE_TIERS.ELITE.id) {
        const quantity = addon.quantity || 1
        addOnsTotal += premiumExclusive.price * quantity
        breakdown.push({
          category: "Premium Exclusive Service",
          amount: premiumExclusive.price * quantity,
          description: `${quantity} x ${premiumExclusive.name}`,
        })
      }
    })

    // Subtotal before minimums and final adjustments
    const subtotal = priceAfterCleanliness + addOnsTotal
    breakdown.push({ category: "Subtotal", amount: subtotal, description: "Base + Cleanliness + Add-ons" })

    // 6. Minimum Enforcement
    let finalPrice = subtotal
    const selectedPropertySizeCategory =
      Object.keys(MINIMUM_JOB_VALUES).find((key) => {
        // Simple heuristic for property size category, needs refinement based on actual input
        if (propertySizeSqFt) {
          if (propertySizeSqFt <= 1000) return key === "Studio"
          if (propertySizeSqFt <= 3000) return key === "3BR Home"
          return key === "5BR Mansion"
        }
        return false
      }) || "Studio" // Default if no sqft provided

    const minimumValue = MINIMUM_JOB_VALUES[selectedPropertySizeCategory]?.[currentTier]
    if (minimumValue && finalPrice < minimumValue) {
      finalPrice = minimumValue
      breakdown.push({
        category: "Minimum Job Value",
        amount: minimumValue - subtotal,
        description: `Adjusted to minimum for ${selectedPropertySizeCategory} (${SERVICE_TIERS[currentTier.toUpperCase() as ServiceTierId].name})`,
      })
    }

    // Recurring pricing logic (simplified, adapt from existing if needed)
    const firstServicePrice = finalPrice
    let recurringServicePrice = 0

    if (frequency && frequency !== "one_time") {
      const roomConfig = {
        frequencyMultipliers: {
          weekly: 0.85,
          biweekly: 0.9,
          monthly: 0.95,
          semi_annual: 0.98,
          annually: 0.99,
          vip_daily: 0.75,
        },
      }
      const frequencyOption = roomConfig.frequencyMultipliers[frequency as keyof typeof roomConfig.frequencyMultipliers] // Re-use from roomConfig if it's still relevant for discounts
      if (frequencyOption) {
        recurringServicePrice = finalPrice * frequencyOption // Assuming frequencyOption is a multiplier for recurring
      }
      // Apply payment frequency discount if applicable (e.g., yearly)
      if (paymentFrequency === "yearly") {
        recurringServicePrice *= 1 - 0.1 // 10% discount for annual
      }
    } else {
      recurringServicePrice = 0 // No recurring price for one-time
    }

    // Estimated Duration (simplified, can be refined)
    const estimatedDuration = Math.round(finalPrice / 10) // Example: $100 = 10 minutes

    self.postMessage({
      baseRoomPrice,
      tierMultiplier: tierMultiplierValue,
      cleanlinessMultiplier: cleanlinessMultiplierValue,
      addOnsTotal,
      premiumExclusiveTotal: 0, // This needs to be calculated separately if not part of addOnsTotal
      subtotal,
      finalPrice: Math.round(finalPrice * 100) / 100,
      firstServicePrice: Math.round(firstServicePrice * 100) / 100,
      recurringServicePrice: Math.round(recurringServicePrice * 100) / 100,
      enforcedTier,
      enforcementReason,
      estimatedDuration,
      breakdown,
      warnings,
    })
  } catch (error: any) {
    console.error("Error in price calculation worker:", error)
    self.postMessage({ error: error.message || "An unknown error occurred during calculation." })
  }
}
