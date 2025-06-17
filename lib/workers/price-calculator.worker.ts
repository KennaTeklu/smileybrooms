/// <reference lib="webworker" />

import {
  SERVICE_TIERS,
  CLEANLINESS_DIFFICULTY,
  BASE_ROOM_RATES,
  STRATEGIC_ADDONS, // New import
  PREMIUM_EXCLUSIVE_SERVICES, // New import
  AUTOMATIC_TIER_UPGRADES, // Will be used in next phases
} from "../pricing-config"

// Define the input configuration type
export type ServiceConfig = {
  rooms: Record<string, number>
  serviceTier: "standard" | "premium" | "elite"
  frequency: string
  cleanlinessLevel: number
  specialRequests?: string[]
  discounts?: Record<string, number>
  zipCode?: string
  squareFootage?: number
  propertyType?: string
  petOwners?: boolean
  postRenovation?: boolean
  moldWaterDamage?: boolean
  biohazardSituations?: boolean
  selectedAddons?: { id: string; quantity?: number }[] // Updated to include quantity for per-unit addons
  selectedExclusiveServices?: string[]
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
  enforcedTier?: "standard" | "premium" | "elite"
  enforcedTierReason?: string
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

self.onmessage = (event: MessageEvent<ServiceConfig>) => {
  try {
    const config = event.data

    let currentServiceTier = config.serviceTier
    let enforcedTierReason: string | undefined

    const cleanlinessLevelData = Object.values(CLEANLINESS_DIFFICULTY).find((c) => c.level === config.cleanlinessLevel)

    // --- Automatic Tier Upgrades (Preliminary check, full logic in Phase 17) ---
    if (cleanlinessLevelData?.name === "Biohazard" && currentServiceTier !== SERVICE_TIERS.ELITE.id) {
      currentServiceTier = SERVICE_TIERS.ELITE.id
      enforcedTierReason = AUTOMATIC_TIER_UPGRADES.find((u) => u.condition === "biohazard_situations")?.message
    }
    // Add other preliminary checks here if needed for immediate enforcement feedback

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

    const serviceTierMultiplier =
      SERVICE_TIERS[currentServiceTier.toUpperCase() as keyof typeof SERVICE_TIERS]?.multiplier || 1.0
    const priceAfterServiceTier = basePrice * serviceTierMultiplier
    breakdown.push({
      category: "Service Tier Multiplier",
      amount: priceAfterServiceTier - basePrice,
      description: `${SERVICE_TIERS[currentServiceTier.toUpperCase() as keyof typeof SERVICE_TIERS]?.name} tier (${serviceTierMultiplier}x)`,
    })

    const cleanlinessMultiplier = cleanlinessLevelData?.multipliers[currentServiceTier] || 1.0
    const priceAfterCleanliness = priceAfterServiceTier * cleanlinessMultiplier
    breakdown.push({
      category: "Cleanliness Level Multiplier",
      amount: priceAfterCleanliness - priceAfterServiceTier,
      description: `${cleanlinessLevelData?.name} level (${cleanlinessMultiplier}x)`,
    })

    let currentTotal = priceAfterCleanliness

    // --- Strategic Add-Ons Calculation ---
    let addonsTotal = 0
    if (config.selectedAddons && config.selectedAddons.length > 0) {
      for (const selectedAddon of config.selectedAddons) {
        const addon = STRATEGIC_ADDONS.find((a) => a.id === selectedAddon.id)
        if (addon) {
          let addonPrice = addon.prices[currentServiceTier]
          // Handle "Included in Elite"
          if (addon.includedInElite && currentServiceTier === SERVICE_TIERS.ELITE.id) {
            addonPrice = 0 // Price is 0 if included in Elite
          }

          const quantity = selectedAddon.quantity || 1 // Default quantity to 1 if not specified
          const totalAddonCost = addonPrice * quantity
          addonsTotal += totalAddonCost
          breakdown.push({
            category: `Add-On: ${addon.name}`,
            amount: totalAddonCost,
            description: `${addon.name} (${quantity}${addon.unit || ""}) at ${currentServiceTier} tier`,
          })
        }
      }
    }
    currentTotal += addonsTotal

    // --- Premium-Exclusive Services Calculation ---
    let exclusiveServicesTotal = 0
    if (config.selectedExclusiveServices && config.selectedExclusiveServices.length > 0) {
      if (currentServiceTier === SERVICE_TIERS.ELITE.id) {
        for (const selectedServiceId of config.selectedExclusiveServices) {
          const service = PREMIUM_EXCLUSIVE_SERVICES.find((s) => s.id === selectedServiceId)
          if (service) {
            let serviceCost = service.price
            // Handle per-room exclusive services
            if (service.unit === "/room") {
              const totalRooms = Object.values(config.rooms).reduce((sum, count) => sum + count, 0)
              serviceCost *= totalRooms
            }
            exclusiveServicesTotal += serviceCost
            breakdown.push({
              category: `Exclusive Service: ${service.name}`,
              amount: serviceCost,
              description: `${service.name} (Elite Only)`,
            })
          }
        }
      } else {
        // If exclusive services are selected but not Elite tier, they are ignored or an error could be thrown
        // For now, we'll just ignore them as per the prompt's focus on calculation.
        // A UI phase will handle preventing selection or showing warnings.
      }
    }
    currentTotal += exclusiveServicesTotal

    // Calculate the one-time price (first service price)
    const firstServicePrice = currentTotal // This is the price before frequency discounts

    // Apply frequency discount for recurring price
    const selectedFrequency = frequencyOptions.find((f) => f.id === config.frequency)
    const frequencyDiscount = selectedFrequency ? selectedFrequency.discount : 0
    const recurringServicePriceBeforePaymentDiscount = currentTotal * (1 - frequencyDiscount)
    breakdown.push({
      category: "Frequency Discount",
      amount: -(currentTotal - recurringServicePriceBeforePaymentDiscount),
      description: `${selectedFrequency?.name} discount (${(frequencyDiscount * 100).toFixed(0)}%)`,
    })

    // Apply payment frequency discount (assuming 'yearly' is the only one with a discount here)
    const paymentDiscount = 0
    const recurringServicePrice = recurringServicePriceBeforePaymentDiscount * (1 - paymentDiscount)

    // Apply general discounts (from config.discounts)
    let discountTotal = 0
    if (config.discounts) {
      discountTotal = Object.values(config.discounts).reduce((sum, val) => sum + val, 0)
      if (discountTotal > 0) {
        breakdown.push({
          category: "General Discounts",
          amount: -discountTotal,
          description: "Applied general discounts",
        })
      }
    }

    const finalFirstServicePrice = Math.max(0, firstServicePrice - discountTotal)
    const finalRecurringServicePrice = Math.max(0, recurringServicePrice - discountTotal)

    const result: PriceResult = {
      basePrice, // This is the initial base price before multipliers
      adjustments: {
        serviceTier: priceAfterServiceTier - basePrice,
        cleanliness: priceAfterCleanliness - priceAfterServiceTier,
        addons: addonsTotal,
        exclusiveServices: exclusiveServicesTotal,
        frequency: currentTotal - recurringServicePriceBeforePaymentDiscount, // Difference due to frequency
        discounts: -discountTotal,
      },
      firstServicePrice: Math.round(finalFirstServicePrice * 100) / 100,
      recurringServicePrice: Math.round(finalRecurringServicePrice * 100) / 100,
      estimatedDuration: Math.round(finalFirstServicePrice * 0.8), // Duration based on first service
      breakdown: breakdown,
      enforcedTier: enforcedTierReason ? currentServiceTier : undefined,
      enforcedTierReason: enforcedTierReason,
    }

    self.postMessage(result)
  } catch (error: any) {
    self.postMessage({ error: error.message || "An unknown error occurred during calculation." })
  }
}
