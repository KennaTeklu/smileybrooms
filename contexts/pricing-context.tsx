"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { usePriceWorker } from "@/lib/use-price-worker"
import type { ServiceConfig, PriceCalculationResult } from "@/lib/workers/price-calculator.worker"
import {
  ROOM_CONFIG,
  ADDON_CONFIG,
  EXCLUSIVE_SERVICE_CONFIG,
  SERVICE_TIERS,
  CLEANLINESS_LEVELS,
  FREQUENCY_OPTIONS,
  PROPERTY_TYPES,
  MINIMUM_JOB_VALUES,
} from "@/lib/pricing-config"
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
  CLEANLINESS_LEVELS: typeof CLEANLINESS_LEVELS
  FREQUENCY_OPTIONS: typeof FREQUENCY_OPTIONS
  PROPERTY_TYPES: typeof PROPERTY_TYPES
}

const PricingContext = createContext<PricingContextType | undefined>(undefined)

export function PricingProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ServiceConfig>(() => ({
    rooms: Object.keys(ROOM_CONFIG).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
    serviceTier: "standard",
    cleanlinessLevel: "average",
    frequency: "one-time",
    paymentFrequency: "one-time",
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

  const { result: calculatedPrice, loading, error } = usePriceWorker(config)

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
      const newSelectedAddons = prev.selectedAddons.includes(addonId)
        ? prev.selectedAddons.filter((id) => id !== addonId)
        : [...prev.selectedAddons, addonId]

      // Enforce Elite tier inclusion for certain addons
      if (prev.serviceTier === "elite") {
        // If an addon is part of Elite, it should always be considered selected
        // This logic might need to be more sophisticated if Elite includes some but not all
        // For now, we assume if it's in ADDON_CONFIG and marked as 'eliteIncluded', it's always on.
        // The UI should reflect this by disabling the checkbox for Elite tier.
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
      if (config.serviceTier === "elite" && ADDON_CONFIG[addonId]?.eliteIncluded) {
        return true
      }
      return config.selectedAddons.includes(addonId)
    },
    [config.selectedAddons, config.serviceTier],
  )

  const isExclusiveServiceSelected = useCallback(
    (serviceId: ExclusiveServiceId) => {
      return config.selectedExclusiveServices.includes(serviceId)
    },
    [config.selectedExclusiveServices],
  )

  const getAddonPrice = useCallback((addonId: AddonId) => {
    return ADDON_CONFIG[addonId]?.price || 0
  }, [])

  const getExclusiveServicePrice = useCallback((serviceId: ExclusiveServiceId) => {
    return EXCLUSIVE_SERVICE_CONFIG[serviceId]?.price || 0
  }, [])

  const getServiceTierMultiplier = useCallback((tierId: ServiceTierId) => {
    return SERVICE_TIERS[tierId]?.multiplier || 1
  }, [])

  const getCleanlinessLevelMultiplier = useCallback((levelId: CleanlinessLevelId) => {
    return CLEANLINESS_LEVELS[levelId]?.multiplier || 1
  }, [])

  const getFrequencyDiscount = useCallback((frequency: string) => {
    return FREQUENCY_OPTIONS[frequency]?.discount || 0
  }, [])

  const getMinJobValue = useCallback((propertyType: string, serviceTier: ServiceTierId) => {
    if (propertyType && MINIMUM_JOB_VALUES[propertyType]) {
      return MINIMUM_JOB_VALUES[propertyType][serviceTier] || 0
    }
    return 0
  }, [])

  // Enforce Elite tier rules: if Elite is selected, certain addons are automatically included
  useEffect(() => {
    if (config.serviceTier === "elite") {
      setConfig((prev) => {
        const eliteIncludedAddons = Object.entries(ADDON_CONFIG)
          .filter(([, addon]) => addon.eliteIncluded)
          .map(([id]) => id as AddonId)

        const newSelectedAddons = Array.from(new Set([...prev.selectedAddons, ...eliteIncludedAddons]))

        // Ensure exclusive services are only selectable if Elite tier is chosen
        const newSelectedExclusiveServices = prev.selectedExclusiveServices.filter((serviceId) =>
          EXCLUSIVE_SERVICE_CONFIG[serviceId]?.eliteOnly ? true : false,
        )

        return {
          ...prev,
          selectedAddons: newSelectedAddons,
          selectedExclusiveServices: newSelectedExclusiveServices,
        }
      })
    } else {
      // If tier is not elite, remove elite-only exclusive services and elite-included addons
      setConfig((prev) => {
        const newSelectedExclusiveServices = prev.selectedExclusiveServices.filter(
          (serviceId) => !EXCLUSIVE_SERVICE_CONFIG[serviceId]?.eliteOnly,
        )
        const newSelectedAddons = prev.selectedAddons.filter((addonId) =>
          ADDON_CONFIG[addonId]?.eliteIncluded ? false : true,
        )
        return {
          ...prev,
          selectedExclusiveServices: newSelectedExclusiveServices,
          selectedAddons: newSelectedAddons,
        }
      })
    }
  }, [config.serviceTier])

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
      CLEANLINESS_LEVELS,
      FREQUENCY_OPTIONS,
      PROPERTY_TYPES,
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
