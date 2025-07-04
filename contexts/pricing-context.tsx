"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { usePriceWorker } from "@/lib/use-price-worker" // Correct import path
import type { ServiceConfig, PriceCalculationResult } from "@/lib/workers/price-calculator.worker"
import {
  ROOM_CONFIG,
  ADDON_CONFIG,
  EXCLUSIVE_SERVICE_CONFIG,
  SERVICE_TIERS,
  CLEANLINESS_DIFFICULTY, // Changed from CLEANLINESS_LEVELS
  FREQUENCY_OPTIONS,
  PROPERTY_TYPES,
  MINIMUM_JOB_VALUES,
  AUTOMATIC_TIER_UPGRADES, // Import for context-side enforcement
} from "@/lib/pricing-config" // All imports now from pricing-config.ts
import type { AddonId, CleanlinessLevelId, ExclusiveServiceId, ServiceTierId } from "@/lib/types"

interface PricingContextType {
  config: ServiceConfig
  setConfig: React.Dispatch<React.SetStateAction<ServiceConfig>>
  calculatedPrice: PriceCalculationResult | null
  loading: boolean
  error: Error | null
  updateRoomCount: (roomType: string, count: number) => void
  toggleAddon: (addonId: AddonId) => void
  toggleExclusiveService: (serviceId: ExclusiveServiceId) => void
  isAddonSelected: (addonId: AddonId) => boolean
  isExclusiveServiceSelected: (serviceId: ExclusiveServiceId) => boolean
  getAddonPrice: (addonId: AddonId) => number
  getExclusiveServicePrice: (serviceId: ExclusiveServiceId) => number
  getServiceTierMultiplier: (tierId: ServiceTierId) => number
  getCleanlinessLevelMultiplier: (levelId: CleanlinessLevelId) => number
  getFrequencyDiscount: (frequency: string) => number
  getMinJobValue: (propertyType: string, serviceTier: ServiceTierId) => number
  ROOM_CONFIG: typeof ROOM_CONFIG
  ADDON_CONFIG: typeof ADDON_CONFIG
  EXCLUSIVE_SERVICE_CONFIG: typeof EXCLUSIVE_SERVICE_CONFIG
  SERVICE_TIERS: typeof SERVICE_TIERS
  CLEANLINESS_LEVELS: typeof CLEANLINESS_DIFFICULTY // Mapped to CLEANLINESS_DIFFICULTY
  FREQUENCY_OPTIONS: typeof FREQUENCY_OPTIONS
  PROPERTY_TYPES: typeof PROPERTY_TYPES
  enforcedTierReason: string | undefined // Expose enforced tier reason
}

const PricingContext = createContext<PricingContextType | undefined>(undefined)

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ServiceConfig>(() => ({
    rooms: Object.keys(ROOM_CONFIG.roomTypes).reduce(
      (acc, key) => ({ ...acc, [ROOM_CONFIG.roomTypes[key as any].id]: 0 }),
      {},
    ),
    serviceTier: "standard",
    cleanlinessLevel: CLEANLINESS_DIFFICULTY.MEDIUM.level, // Default to medium cleanliness
    frequency: "one_time",
    paymentFrequency: "per_service",
    selectedAddons: [],
    selectedExclusiveServices: [],
    waiverSigned: false,
    propertySizeSqFt: 0,
    propertyType: null,
    isRentalProperty: false,
    hasPets: false,
    isPostRenovation: false,
    hasMoldWaterDamage: false,
  }))

  const { calculatePrice, isCalculating, isSupported } = usePriceWorker()
  const [calculatedPrice, setCalculatedPrice] = useState<PriceCalculationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [enforcedTierReason, setEnforcedTierReason] = useState<string | undefined>(undefined)

  // Effect to calculate price whenever config changes
  useEffect(() => {
    const performCalculation = async () => {
      setLoading(true)
      setError(null)
      try {
        // The usePriceWorker hook now returns a Promise directly
        const result = await calculatePrice(config)
        setCalculatedPrice(result)
        setEnforcedTierReason(result.enforcedTierReason)
      } catch (err) {
        setError(err as Error)
        setCalculatedPrice(null)
        setEnforcedTierReason(undefined)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      performCalculation()
    }, 300) // Debounce calculation to avoid excessive calls

    return () => clearTimeout(debounceTimer)
  }, [config, calculatePrice])

  const updateRoomCount = useCallback((roomType: string, count: number) => {
    setConfig((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomType]: Math.max(0, count),
      },
    }))
  }, [])

  const toggleAddon = useCallback((addonId: AddonId) => {
    setConfig((prev) => {
      const existingAddon = prev.selectedAddons.find((a) => a.id === addonId)
      let newSelectedAddons

      if (existingAddon) {
        // If addon is already selected, remove it
        newSelectedAddons = prev.selectedAddons.filter((a) => a.id !== addonId)
      } else {
        // If addon is not selected, add it with quantity 1
        newSelectedAddons = [...prev.selectedAddons, { id: addonId, quantity: 1 }]
      }

      return { ...prev, selectedAddons: newSelectedAddons }
    })
  }, [])

  const toggleExclusiveService = useCallback((serviceId: ExclusiveServiceId) => {
    setConfig((prev) => {
      const newSelectedExclusiveServices = prev.selectedExclusiveServices.includes(serviceId)
        ? prev.selectedExclusiveServices.filter((id) => id !== serviceId)
        : [...prev.selectedExclusiveServices, serviceId]
      return { ...prev, selectedExclusiveServices: newSelectedExclusiveServices }
    })
  }, [])

  const isAddonSelected = useCallback(
    (addonId: AddonId) => {
      // If service tier is elite and addon is eliteIncluded, it's always selected
      if (config.serviceTier === SERVICE_TIERS.ELITE.id && ADDON_CONFIG[addonId]?.includedInElite) {
        return true
      }
      return config.selectedAddons.some((a) => a.id === addonId)
    },
    [config.selectedAddons, config.serviceTier],
  )

  const isExclusiveServiceSelected = useCallback(
    (serviceId: ExclusiveServiceId) => {
      return config.selectedExclusiveServices.includes(serviceId)
    },
    [config.selectedExclusiveServices],
  )

  const getAddonPrice = useCallback(
    (addonId: AddonId) => {
      return ADDON_CONFIG[addonId]?.prices[config.serviceTier] || 0
    },
    [config.serviceTier],
  )

  const getExclusiveServicePrice = useCallback((serviceId: ExclusiveServiceId) => {
    return EXCLUSIVE_SERVICE_CONFIG[serviceId]?.price || 0
  }, [])

  const getServiceTierMultiplier = useCallback((tierId: ServiceTierId) => {
    return SERVICE_TIERS[tierId]?.multiplier || 1
  }, [])

  const getCleanlinessLevelMultiplier = useCallback(
    (levelId: CleanlinessLevelId) => {
      return CLEANLINESS_DIFFICULTY[levelId]?.multipliers[config.serviceTier] || 1
    },
    [config.serviceTier],
  )

  const getFrequencyDiscount = useCallback((frequency: string) => {
    return FREQUENCY_OPTIONS[frequency]?.discount || 0
  }, [])

  const getMinJobValue = useCallback((propertyType: string, serviceTier: ServiceTierId) => {
    if (propertyType && MINIMUM_JOB_VALUES[propertyType]) {
      return MINIMUM_JOB_VALUES[propertyType][serviceTier] || 0
    }
    return 0
  }, [])

  // Enforce Elite tier rules and other automatic upgrades
  useEffect(() => {
    setConfig((prev) => {
      let newServiceTier = prev.serviceTier
      let newEnforcedReason: string | undefined = undefined
      let newSelectedAddons = [...prev.selectedAddons]
      let newSelectedExclusiveServices = [...prev.selectedExclusiveServices]

      // Check for automatic tier upgrades
      for (const upgrade of AUTOMATIC_TIER_UPGRADES) {
        let conditionMet = false
        switch (upgrade.condition) {
          case "sq_ft_over_3000":
            conditionMet = prev.propertySizeSqFt > upgrade.threshold!
            break
          case "rental_property":
            conditionMet = prev.isRentalProperty
            break
          case "pet_owners":
            conditionMet = prev.hasPets
            break
          case "post_renovation":
            conditionMet = prev.isPostRenovation
            break
          case "mold_water_damage":
            conditionMet = prev.hasMoldWaterDamage
            break
          case "biohazard_situations":
            conditionMet = prev.cleanlinessLevel === CLEANLINESS_DIFFICULTY.BIOHAZARD.level
            break
        }

        if (conditionMet) {
          // Only upgrade if the current tier is lower than the required tier
          const currentTierIndex = Object.values(SERVICE_TIERS).findIndex((t) => t.id === newServiceTier)
          const requiredTierIndex = Object.values(SERVICE_TIERS).findIndex((t) => t.id === upgrade.requiredTier)

          if (requiredTierIndex > currentTierIndex) {
            newServiceTier = upgrade.requiredTier
            newEnforcedReason = upgrade.message
          }
        }
      }

      // If tier is elite, certain addons are automatically included
      if (newServiceTier === SERVICE_TIERS.ELITE.id) {
        const eliteIncludedAddons = Object.values(ADDON_CONFIG)
          .filter((addon) => addon.includedInElite)
          .map((addon) => ({ id: addon.id, quantity: 1 })) // Ensure quantity is set

        // Add elite-included addons if not already present
        eliteIncludedAddons.forEach((eliteAddon) => {
          if (!newSelectedAddons.some((a) => a.id === eliteAddon.id)) {
            newSelectedAddons.push(eliteAddon)
          }
        })

        // Ensure exclusive services are only selectable if Elite tier is chosen
        newSelectedExclusiveServices = newSelectedExclusiveServices.filter((serviceId) =>
          EXCLUSIVE_SERVICE_CONFIG[serviceId]?.eliteOnly ? true : false,
        )
      } else {
        // If tier is not elite, remove elite-only exclusive services and elite-included addons
        newSelectedExclusiveServices = newSelectedExclusiveServices.filter(
          (serviceId) => !EXCLUSIVE_SERVICE_CONFIG[serviceId]?.eliteOnly,
        )
        newSelectedAddons = newSelectedAddons.filter((addon) =>
          ADDON_CONFIG[addon.id]?.includedInElite ? false : true,
        )
      }

      // Only update if there are actual changes to prevent unnecessary re-renders
      if (
        prev.serviceTier !== newServiceTier ||
        prev.selectedAddons.length !== newSelectedAddons.length ||
        prev.selectedExclusiveServices.length !== newSelectedExclusiveServices.length ||
        JSON.stringify(prev.selectedAddons) !== JSON.stringify(newSelectedAddons) ||
        JSON.stringify(prev.selectedExclusiveServices) !== JSON.stringify(newSelectedExclusiveServices)
      ) {
        return {
          ...prev,
          serviceTier: newServiceTier,
          selectedAddons: newSelectedAddons,
          selectedExclusiveServices: newSelectedExclusiveServices,
        }
      }
      return prev // No change, return previous state
    })
  }, [
    config.serviceTier,
    config.propertySizeSqFt,
    config.isRentalProperty,
    config.hasPets,
    config.isPostRenovation,
    config.hasMoldWaterDamage,
    config.cleanlinessLevel,
  ])

  const value = useMemo(
    () => ({
      config,
      setConfig,
      calculatedPrice,
      loading,
      error,
      updateRoomCount,
      toggleAddon,
      toggleExclusiveService,
      isAddonSelected,
      isExclusiveServiceSelected,
      getAddonPrice,
      getExclusiveServicePrice,
      getServiceTierMultiplier,
      getCleanlinessLevelMultiplier,
      getFrequencyDiscount,
      getMinJobValue,
      ROOM_CONFIG,
      ADDON_CONFIG,
      EXCLUSIVE_SERVICE_CONFIG,
      SERVICE_TIERS,
      CLEANLINESS_LEVELS: CLEANLINESS_DIFFICULTY, // Mapped to CLEANLINESS_DIFFICULTY
      FREQUENCY_OPTIONS,
      PROPERTY_TYPES,
      enforcedTierReason,
    }),
    [
      config,
      calculatedPrice,
      loading,
      error,
      updateRoomCount,
      toggleAddon,
      toggleExclusiveService,
      isAddonSelected,
      isExclusiveServiceSelected,
      getAddonPrice,
      getExclusiveServicePrice,
      getServiceTierMultiplier,
      getCleanlinessLevelMultiplier,
      getFrequencyDiscount,
      getMinJobValue,
      enforcedTierReason,
    ],
  )

  return <PricingContext.Provider value={value}>{children}</PricingContext.Provider>
}

export function usePricing() {
  const context = useContext(PricingContext)
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider")
  }
  return context
}
