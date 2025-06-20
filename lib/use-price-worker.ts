"use client"

import { useState, useEffect } from "react"
import {
  SERVICE_TIERS,
  CLEANLINESS_DIFFICULTY,
  BASE_ROOM_RATES,
  STRATEGIC_ADDONS,
  PREMIUM_EXCLUSIVE_SERVICES,
  AUTOMATIC_TIER_UPGRADES,
  MINIMUM_JOB_VALUES,
} from "./pricing-config"

// Define the input configuration type (aligned with worker)
export type ServiceConfig = {
  rooms: Record<string, number>
  serviceTier: "standard" | "premium" | "elite"
  frequency: string
  cleanlinessLevel: number
  specialRequests?: string[]
  discounts?: Record<string, number>
  zipCode?: string
  squareFootage?: number
  propertyType?: "Studio" | "3BR Home" | "5BR Mansion" | string
  petOwners?: boolean
  postRenovation?: boolean
  moldWaterDamage?: boolean
  biohazardSituations?: boolean
  selectedAddons?: { id: string; quantity?: number }[]
  selectedExclusiveServices?: string[]
}

// Define the output result type (aligned with worker)
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

// Fallback calculation function for browsers that don't support Web Workers
const fallbackCalculatePrice = (config: ServiceConfig): PriceResult => {
  let currentServiceTier = config.serviceTier
  let enforcedTierReason: string | undefined

  const cleanlinessLevelData = Object.values(CLEANLINESS_DIFFICULTY).find((c) => c.level === config.cleanlinessLevel)

  // --- Automatic Tier Upgrades (Simplified for fallback, full logic in Phase 17) ---
  if (cleanlinessLevelData?.name === "Biohazard" && currentServiceTier !== SERVICE_TIERS.ELITE.id) {
    currentServiceTier = SERVICE_TIERS.ELITE.id
    enforcedTierReason = AUTOMATIC_TIER_UPGRADES.find((u) => u.condition === "biohazard_situations")?.message
  }
  // Add other preliminary checks here if needed for immediate enforcement feedback

  let basePrice = 0
  const breakdown = []

  // 1. Base Room Price Calculation (Tier-Specific)
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

  // 2. Service Tier Multiplier Application
  const serviceTierMultiplier =
    SERVICE_TIERS[currentServiceTier.toUpperCase() as keyof typeof SERVICE_TIERS]?.multiplier || 1.0
  const priceAfterServiceTier = basePrice * serviceTierMultiplier
  breakdown.push({
    category: "Service Tier Multiplier",
    amount: priceAfterServiceTier - basePrice,
    description: `${SERVICE_TIERS[currentServiceTier.toUpperCase() as keyof typeof SERVICE_TIERS]?.name} tier (${serviceTierMultiplier}x)`,
  })

  // 3. Cleanliness Difficulty Multiplier Application (Tier & Level Dependent)
  const cleanlinessMultiplier = cleanlinessLevelData?.multipliers[currentServiceTier] || 1.0
  const priceAfterCleanliness = priceAfterServiceTier * cleanlinessMultiplier
  breakdown.push({
    category: "Cleanliness Level Multiplier",
    amount: priceAfterCleanliness - priceAfterServiceTier,
    description: `${cleanlinessLevelData?.name} level (${cleanlinessMultiplier}x)`,
  })

  let currentTotal = priceAfterCleanliness

  // 4. Strategic Add-Ons Calculation (Tier-Specific)
  let addonsTotal = 0
  if (config.selectedAddons && config.selectedAddons.length > 0) {
    for (const selectedAddon of config.selectedAddons) {
      const addon = STRATEGIC_ADDONS.find((a) => a.id === selectedAddon.id)
      if (addon) {
        let addonPrice = addon.prices[currentServiceTier]
        if (addon.includedInElite && currentServiceTier === SERVICE_TIERS.ELITE.id) {
          addonPrice = 0
        }
        const quantity = selectedAddon.quantity || 1
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

  // 5. Premium-Exclusive Services Calculation (Elite-Only)
  let exclusiveServicesTotal = 0
  if (config.selectedExclusiveServices && config.selectedExclusiveServices.length > 0) {
    if (currentServiceTier === SERVICE_TIERS.ELITE.id) {
      for (const selectedServiceId of config.selectedExclusiveServices) {
        const service = PREMIUM_EXCLUSIVE_SERVICES.find((s) => s.id === selectedServiceId)
        if (service) {
          let serviceCost = service.price
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
    }
  }
  currentTotal += exclusiveServicesTotal

  // 6. Minimum Job Value Enforcement
  let minimumEnforcedAmount = 0
  if (config.propertyType && MINIMUM_JOB_VALUES[config.propertyType as keyof typeof MINIMUM_JOB_VALUES]) {
    const minimumForTier =
      MINIMUM_JOB_VALUES[config.propertyType as keyof typeof MINIMUM_JOB_VALUES][currentServiceTier]
    if (minimumForTier && currentTotal < minimumForTier) {
      minimumEnforcedAmount = minimumForTier - currentTotal
      currentTotal = minimumForTier
      breakdown.push({
        category: "Minimum Job Value Enforcement",
        amount: minimumEnforcedAmount,
        description: `Minimum job value of $${minimumForTier} enforced for ${config.propertyType} at ${currentServiceTier} tier`,
      })
    }
  }

  // Calculate the one-time price (first service price)
  const firstServicePrice = currentTotal

  // Apply frequency discount for recurring price
  const frequencyOptions = [
    { id: "one_time", discount: 0 },
    { id: "weekly", discount: 0.15 },
    { id: "biweekly", discount: 0.1 },
    { id: "monthly", discount: 0.05 },
    { id: "semi_annual", discount: 0.02 },
    { id: "annually", discount: 0.01 },
    { id: "vip_daily", discount: 0.25 },
  ]
  const selectedFrequency = frequencyOptions.find((f) => f.id === config.frequency)
  const frequencyDiscount = selectedFrequency ? selectedFrequency.discount : 0
  const recurringServicePriceBeforePaymentDiscount = currentTotal * (1 - frequencyDiscount)
  breakdown.push({
    category: "Frequency Discount",
    amount: -(currentTotal - recurringServicePriceBeforePaymentDiscount),
    description: `${selectedFrequency?.name} discount (${(frequencyDiscount * 100).toFixed(0)}%)`,
  })

  const paymentDiscount = 0 // No payment frequency discount defined in pricing-config.ts yet
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

  return {
    basePrice,
    adjustments: {
      serviceTier: priceAfterServiceTier - basePrice,
      cleanliness: priceAfterCleanliness - priceAfterServiceTier,
      addons: addonsTotal,
      exclusiveServices: exclusiveServicesTotal,
      minimumEnforcement: minimumEnforcedAmount,
      frequency: currentTotal - recurringServicePriceBeforePaymentDiscount,
      discounts: -discountTotal,
    },
    firstServicePrice: Math.round(finalFirstServicePrice * 100) / 100,
    recurringServicePrice: Math.round(finalRecurringServicePrice * 100) / 100,
    estimatedDuration: Math.round(finalFirstServicePrice * 0.8),
    breakdown: breakdown,
    enforcedTier: enforcedTierReason ? currentServiceTier : undefined,
    enforcedTierReason: enforcedTierReason,
  }
}

export function usePriceWorker() {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)

  // Initialize the worker
  useEffect(() => {
    if (typeof Worker !== "undefined") {
      try {
        const priceWorker = new Worker(new URL("./workers/price-calculator.worker.ts", import.meta.url))
        setWorker(priceWorker)

        return () => {
          priceWorker.terminate()
        }
      } catch (error) {
        console.error("Error creating Web Worker:", error)
        setIsSupported(false)
      }
    } else {
      console.warn("Web Workers are not supported in this browser")
      setIsSupported(false)
    }
  }, [])

  // Function to calculate price using the worker
  const calculatePrice = async (config: ServiceConfig): Promise<PriceResult> => {
    if (!isSupported || !worker) {
      console.warn("Using fallback price calculation.")
      return fallbackCalculatePrice(config)
    }

    setIsCalculating(true)

    try {
      const result = await new Promise<PriceResult>((resolve, reject) => {
        const handleMessage = (e: MessageEvent) => {
          worker.removeEventListener("message", handleMessage)
          worker.removeEventListener("error", handleError) // Ensure error listener is also removed
          if (e.data.error) {
            reject(new Error(e.data.error))
          } else {
            resolve(e.data)
          }
        }

        const handleError = (error: ErrorEvent) => {
          worker.removeEventListener("message", handleMessage) // Ensure message listener is also removed
          worker.removeEventListener("error", handleError)
          reject(error)
        }

        worker.addEventListener("message", handleMessage)
        worker.addEventListener("error", handleError)

        worker.postMessage(config)
      })

      return result
    } catch (error) {
      console.error("Error in price calculation worker:", error)
      // Fall back to synchronous calculation on worker error
      return fallbackCalculatePrice(config)
    } finally {
      setIsCalculating(false)
    }
  }

  return {
    calculatePrice,
    isCalculating,
    isSupported,
  }
}
