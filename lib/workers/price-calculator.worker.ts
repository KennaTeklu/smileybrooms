// lib/workers/price-calculator.worker.ts

import {
  BASE_ROOM_RATES, // Changed from ROOM_PRICES in ../constants
  CLEANLINESS_DIFFICULTY, // Changed from CLEANLINESS_LEVEL_MULTIPLIERS in ../constants
  PREMIUM_EXCLUSIVE_SERVICES, // Changed from EXCLUSIVE_SERVICE_PRICING in ../constants
  STRATEGIC_ADDONS, // Changed from ADDON_PRICING in ../constants
  FREQUENCY_OPTIONS, // Changed from FREQUENCY_DISCOUNTS in ../constants
  MINIMUM_JOB_VALUES,
  SERVICE_TIERS,
} from "../pricing-config" // All imports now from pricing-config.ts

import type { AddonId, CleanlinessLevelId, ExclusiveServiceId, ServiceTierId } from "../types"

export interface ServiceConfig {
  rooms: Record<string, number>
  serviceTier: ServiceTierId
  cleanlinessLevel: CleanlinessLevelId
  frequency: string
  paymentFrequency: string
  selectedAddons: { id: AddonId; quantity?: number }[] // Updated to match context type
  selectedExclusiveServices: ExclusiveServiceId[]
  waiverSigned: boolean
  propertySizeSqFt: number
  propertyType: "studio" | "3br_home" | "5br_mansion" | null
  isRentalProperty: boolean
  hasPets: boolean
  isPostRenovation: boolean
  hasMoldWaterDamage: boolean
}

export interface PriceBreakdownItem {
  item: string
  value: number
  type: "room" | "addon" | "exclusiveService" | "discount" | "adjustment"
  description?: string // Added description for more detail
}

export interface PriceCalculationResult {
  total: number
  breakdown: PriceBreakdownItem[]
  firstServicePrice: number
  recurringServicePrice: number
  estimatedDuration: number
  enforcedTier?: ServiceTierId
  enforcedTierReason?: string
}

function calculatePrice(config: ServiceConfig): PriceCalculationResult {
  let currentTotal = 0
  const breakdown: PriceBreakdownItem[] = []
  let enforcedTier: ServiceTierId | undefined = undefined
  let enforcedTierReason: string | undefined = undefined

  // Determine the effective service tier, applying automatic upgrades
  let effectiveServiceTier = config.serviceTier

  // Simplified automatic tier upgrades for worker (full logic in context)
  if (
    config.hasMoldWaterDamage ||
    config.isPostRenovation ||
    config.cleanlinessLevel === CLEANLINESS_DIFFICULTY.BIOHAZARD.level
  ) {
    effectiveServiceTier = SERVICE_TIERS.ELITE.id
    enforcedTier = SERVICE_TIERS.ELITE.id
    enforcedTierReason = config.hasMoldWaterDamage
      ? "Mold/water damage situations require Elite service."
      : config.isPostRenovation
        ? "Post-renovation cleanings require Elite service."
        : "Biohazard situations require Elite service."
  } else if (config.hasPets || config.isRentalProperty || (config.propertySizeSqFt && config.propertySizeSqFt > 3000)) {
    if (effectiveServiceTier === SERVICE_TIERS.STANDARD.id) {
      effectiveServiceTier = SERVICE_TIERS.PREMIUM.id
      enforcedTier = SERVICE_TIERS.PREMIUM.id
      enforcedTierReason = config.hasPets
        ? "Homes with pets require Premium service."
        : config.isRentalProperty
          ? "Rental properties require Premium service."
          : "For homes over 3,000 sq ft, Premium service is required."
    }
  }

  // --- Room Pricing ---
  for (const roomType in config.rooms) {
    const roomCount = config.rooms[roomType]
    const roomPrice = BASE_ROOM_RATES[roomType as keyof typeof BASE_ROOM_RATES]?.[effectiveServiceTier] || 0
    const roomTotal = roomCount * roomPrice

    if (roomCount > 0) {
      breakdown.push({
        item: `${roomType} (${roomCount})`,
        value: roomTotal,
        type: "room",
        description: `Base rate for ${roomCount} ${roomType}(s) at ${effectiveServiceTier} tier`,
      })
    }
    currentTotal += roomTotal
  }

  // --- Service Tier Multiplier ---
  const tierMultiplier = SERVICE_TIERS[effectiveServiceTier].multiplier
  const priceAfterTierMultiplier = currentTotal * tierMultiplier
  breakdown.push({
    item: `Service Tier Multiplier (${SERVICE_TIERS[effectiveServiceTier].name})`,
    value: priceAfterTierMultiplier - currentTotal,
    type: "adjustment",
    description: `${SERVICE_TIERS[effectiveServiceTier].name} tier (${tierMultiplier}x)`,
  })
  currentTotal = priceAfterTierMultiplier

  // --- Cleanliness Level Multiplier ---
  const cleanlinessLevelData = Object.values(CLEANLINESS_DIFFICULTY).find((c) => c.level === config.cleanlinessLevel)
  const cleanlinessMultiplier = cleanlinessLevelData?.multipliers[effectiveServiceTier] || 1.0
  const priceAfterCleanlinessMultiplier = currentTotal * cleanlinessMultiplier
  breakdown.push({
    item: `Cleanliness Level Multiplier (${cleanlinessLevelData?.name})`,
    value: priceAfterCleanlinessMultiplier - currentTotal,
    type: "adjustment",
    description: `${cleanlinessLevelData?.name} level (${cleanlinessMultiplier}x)`,
  })
  currentTotal = priceAfterCleanlinessMultiplier

  // --- Addon Pricing ---
  let addonsTotal = 0
  for (const selectedAddon of config.selectedAddons) {
    const addon = STRATEGIC_ADDONS.find((a) => a.id === selectedAddon.id)
    if (addon) {
      let addonPrice = addon.prices[effectiveServiceTier]
      if (addon.includedInElite && effectiveServiceTier === SERVICE_TIERS.ELITE.id) {
        addonPrice = 0 // Included in Elite, so price is 0
      }
      const quantity = selectedAddon.quantity || 1
      const totalAddonCost = addonPrice * quantity
      addonsTotal += totalAddonCost
      breakdown.push({
        item: `Add-On: ${addon.name}`,
        value: totalAddonCost,
        type: "addon",
        description: `${addon.name} (${quantity}${addon.unit || ""}) at ${effectiveServiceTier} tier`,
      })
    }
  }
  currentTotal += addonsTotal

  // --- Exclusive Service Pricing ---
  let exclusiveServicesTotal = 0
  if (effectiveServiceTier === SERVICE_TIERS.ELITE.id) {
    for (const serviceId of config.selectedExclusiveServices) {
      const service = PREMIUM_EXCLUSIVE_SERVICES.find((s) => s.id === serviceId)
      if (service) {
        let serviceCost = service.price
        if (service.unit === "/room") {
          const totalRooms = Object.values(config.rooms).reduce((sum, count) => sum + count, 0)
          serviceCost *= totalRooms
        }
        exclusiveServicesTotal += serviceCost
        breakdown.push({
          item: `Exclusive Service: ${service.name}`,
          value: serviceCost,
          type: "exclusiveService",
          description: `${service.name} (Elite Only)`,
        })
      }
    }
  }
  currentTotal += exclusiveServicesTotal

  // --- Minimum Job Value Enforcement ---
  let minimumEnforcedAmount = 0
  if (config.propertyType && MINIMUM_JOB_VALUES[config.propertyType]) {
    const minimumValueForTier = MINIMUM_JOB_VALUES[config.propertyType][effectiveServiceTier]
    if (minimumValueForTier && currentTotal < minimumValueForTier) {
      minimumEnforcedAmount = minimumValueForTier - currentTotal
      currentTotal = minimumValueForTier
      breakdown.push({
        item: `Minimum Job Value Enforcement`,
        value: minimumEnforcedAmount,
        type: "adjustment",
        description: `Minimum job value of $${minimumValueForTier} enforced for ${config.propertyType} at ${effectiveServiceTier} tier`,
      })
    }
  }

  // Calculate the one-time price (first service price)
  const firstServicePrice = currentTotal

  // Apply frequency discount for recurring price
  const selectedFrequency = FREQUENCY_OPTIONS[config.frequency]
  const frequencyDiscount = selectedFrequency ? selectedFrequency.discount : 0
  const recurringServicePriceBeforePaymentDiscount = currentTotal * (1 - frequencyDiscount)
  breakdown.push({
    item: `Frequency Discount (${selectedFrequency?.name || config.frequency})`,
    value: -(currentTotal - recurringServicePriceBeforePaymentDiscount),
    type: "discount",
    description: `${selectedFrequency?.name} discount (${(frequencyDiscount * 100).toFixed(0)}%)`,
  })

  const paymentDiscount = 0 // No payment frequency discount defined in pricing-config.ts yet
  const recurringServicePrice = recurringServicePriceBeforePaymentDiscount * (1 - paymentDiscount)

  // Apply waiver discount (if signed)
  const WAIVER_DISCOUNT = 0.15 // Local constant for WAIVER_DISCOUNT
  if (config.waiverSigned) {
    const waiverDiscountAmount = currentTotal * WAIVER_DISCOUNT
    breakdown.push({
      item: "Waiver Discount",
      value: -waiverDiscountAmount,
      type: "discount",
      description: `Waiver discount (${(WAIVER_DISCOUNT * 100).toFixed(0)}%)`,
    })
    currentTotal -= waiverDiscountAmount
  }

  return {
    total: Number.parseFloat(currentTotal.toFixed(2)),
    breakdown,
    firstServicePrice: Number.parseFloat(firstServicePrice.toFixed(2)),
    recurringServicePrice: Number.parseFloat(recurringServicePrice.toFixed(2)),
    estimatedDuration: Math.round(firstServicePrice * 0.8), // Example estimation
    enforcedTier: enforcedTier,
    enforcedTierReason: enforcedTierReason,
  }
}

self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data

  if (type === "calculatePrice") {
    try {
      // Example calculation logic
      const basePrice = payload.basePrice || 0
      const quantity = payload.quantity || 1
      const applyDiscount = payload.applyDiscount || false

      let totalPrice = basePrice * quantity

      if (applyDiscount) {
        totalPrice -= totalPrice * 0.15 // Use local WAIVER_DISCOUNT value
      }

      // Simulate some heavy computation
      for (let i = 0; i < 1000000; i++) {
        Math.sqrt(i)
      }

      self.postMessage({ totalPrice })
    } catch (error) {
      console.error("Error in worker calculation:", error)
      // Post an error message back to the main thread
      self.postMessage({ error: error instanceof Error ? error.message : String(error) })
    }
  } else if (type === "calculateServicePrice") {
    const config: ServiceConfig = payload
    const result = calculatePrice(config)
    self.postMessage(result)
  }
}
