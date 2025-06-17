"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { usePriceWorker, type ServiceConfig, type PriceResult } from "@/lib/use-price-worker"
import { AUTOMATIC_TIER_UPGRADES, SERVICE_TIERS, CLEANLINESS_DIFFICULTY } from "@/lib/pricing-config"
import { roomConfig } from "@/lib/room-config"

// Define the initial state structure for the pricing calculator
interface PricingState {
  serviceTier: "standard" | "premium" | "elite"
  selectedRooms: Record<string, number>
  cleanlinessLevel: number // Corresponds to CLEANLINESS_DIFFICULTY level (1-4)
  frequency: string // e.g., 'one_time', 'weekly'
  paymentFrequency: "per_service" | "monthly" | "yearly"
  propertyType: "Studio" | "3BR Home" | "5BR Mansion" | "Other" // Simplified for now
  squareFootage: number | null
  petOwners: boolean
  rentalProperty: boolean
  postRenovation: boolean
  moldWaterDamage: boolean
  biohazardSituations: boolean
  selectedAddons: { id: string; quantity?: number }[]
  selectedExclusiveServices: string[]
  waiverSigned: boolean // For biohazard
  enforcedTier: "standard" | "premium" | "elite" | null
  enforcedTierReason: string | null
  calculatedPrice: PriceResult | null
  isCalculating: boolean
}

// Define the context value type
interface PricingContextType extends PricingState {
  setServiceTier: (tier: "standard" | "premium" | "elite") => void
  setSelectedRooms: (rooms: Record<string, number>) => void
  setCleanlinessLevel: (level: number) => void
  setFrequency: (freq: string) => void
  setPaymentFrequency: (freq: "per_service" | "monthly" | "yearly") => void
  setPropertyType: (type: "Studio" | "3BR Home" | "5BR Mansion" | "Other") => void
  setSquareFootage: (sqft: number | null) => void
  setPetOwners: (value: boolean) => void
  setRentalProperty: (value: boolean) => void
  setPostRenovation: (value: boolean) => void
  setMoldWaterDamage: (value: boolean) => void
  setBiohazardSituations: (value: boolean) => void
  toggleAddon: (addonId: string, quantity?: number) => void
  toggleExclusiveService: (serviceId: string) => void
  setWaiverSigned: (value: boolean) => void
  resetCalculator: () => void
}

// Create the context
export const PricingContext = createContext<PricingContextType | undefined>(undefined)

// Custom hook to use the pricing context
export const usePricing = () => {
  const context = useContext(PricingContext)
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider")
  }
  return context
}

// Pricing Provider Component
export function PricingProvider({ children }: { children: React.ReactNode }) {
  const { calculatePrice, isCalculating } = usePriceWorker()

  const initialRooms: Record<string, number> = {}
  roomConfig.roomTypes.forEach((room) => {
    initialRooms[room.id] = 0
  })

  const [state, setState] = useState<PricingState>({
    serviceTier: "standard",
    selectedRooms: initialRooms,
    cleanlinessLevel: CLEANLINESS_DIFFICULTY.MEDIUM.level, // Default to Average
    frequency: "one_time",
    paymentFrequency: "per_service",
    propertyType: "Other",
    squareFootage: null,
    petOwners: false,
    rentalProperty: false,
    postRenovation: false,
    moldWaterDamage: false,
    biohazardSituations: false,
    selectedAddons: [],
    selectedExclusiveServices: [],
    waiverSigned: false,
    enforcedTier: null,
    enforcedTierReason: null,
    calculatedPrice: null,
    isCalculating: false,
  })

  // --- State Setters ---
  const setServiceTier = useCallback((tier: "standard" | "premium" | "elite") => {
    setState((prevState) => ({ ...prevState, serviceTier: tier, enforcedTier: null, enforcedTierReason: null }))
  }, [])
  const setSelectedRooms = useCallback((rooms: Record<string, number>) => {
    setState((prevState) => ({ ...prevState, selectedRooms: rooms }))
  }, [])
  const setCleanlinessLevel = useCallback((level: number) => {
    setState((prevState) => ({ ...prevState, cleanlinessLevel: level }))
  }, [])
  const setFrequency = useCallback((freq: string) => {
    setState((prevState) => ({ ...prevState, frequency: freq }))
  }, [])
  const setPaymentFrequency = useCallback((freq: "per_service" | "monthly" | "yearly") => {
    setState((prevState) => ({ ...prevState, paymentFrequency: freq }))
  }, [])
  const setPropertyType = useCallback((type: "Studio" | "3BR Home" | "5BR Mansion" | "Other") => {
    setState((prevState) => ({ ...prevState, propertyType: type }))
  }, [])
  const setSquareFootage = useCallback((sqft: number | null) => {
    setState((prevState) => ({ ...prevState, squareFootage: sqft }))
  }, [])
  const setPetOwners = useCallback((value: boolean) => {
    setState((prevState) => ({ ...prevState, petOwners: value }))
  }, [])
  const setRentalProperty = useCallback((value: boolean) => {
    setState((prevState) => ({ ...prevState, rentalProperty: value }))
  }, [])
  const setPostRenovation = useCallback((value: boolean) => {
    setState((prevState) => ({ ...prevState, postRenovation: value }))
  }, [])
  const setMoldWaterDamage = useCallback((value: boolean) => {
    setState((prevState) => ({ ...prevState, moldWaterDamage: value }))
  }, [])
  const setBiohazardSituations = useCallback((value: boolean) => {
    setState((prevState) => ({ ...prevState, biohazardSituations: value }))
  }, [])

  const toggleAddon = useCallback((addonId: string, quantity = 1) => {
    setState((prevState) => {
      const existingAddon = prevState.selectedAddons.find((a) => a.id === addonId)
      if (existingAddon) {
        return {
          ...prevState,
          selectedAddons: prevState.selectedAddons.filter((a) => a.id !== addonId),
        }
      } else {
        return {
          ...prevState,
          selectedAddons: [...prevState.selectedAddons, { id: addonId, quantity }],
        }
      }
    })
  }, [])

  const toggleExclusiveService = useCallback((serviceId: string) => {
    setState((prevState) => {
      if (prevState.selectedExclusiveServices.includes(serviceId)) {
        return {
          ...prevState,
          selectedExclusiveServices: prevState.selectedExclusiveServices.filter((id) => id !== serviceId),
        }
      } else {
        return {
          ...prevState,
          selectedExclusiveServices: [...prevState.selectedExclusiveServices, serviceId],
        }
      }
    })
  }, [])

  const setWaiverSigned = useCallback((value: boolean) => {
    setState((prevState) => ({ ...prevState, waiverSigned: value }))
  }, [])

  const resetCalculator = useCallback(() => {
    setState({
      serviceTier: "standard",
      selectedRooms: initialRooms,
      cleanlinessLevel: CLEANLINESS_DIFFICULTY.MEDIUM.level,
      frequency: "one_time",
      paymentFrequency: "per_service",
      propertyType: "Other",
      squareFootage: null,
      petOwners: false,
      rentalProperty: false,
      postRenovation: false,
      moldWaterDamage: false,
      biohazardSituations: false,
      selectedAddons: [],
      selectedExclusiveServices: [],
      waiverSigned: false,
      enforcedTier: null,
      enforcedTierReason: null,
      calculatedPrice: null,
      isCalculating: false,
    })
  }, [initialRooms])

  // --- Automatic Tier Enforcement Logic ---
  useEffect(() => {
    let newEnforcedTier: "standard" | "premium" | "elite" | null = null
    let newEnforcedReason: string | null = null

    // Check for biohazard first, as it's the highest enforcement
    if (state.biohazardSituations) {
      newEnforcedTier = SERVICE_TIERS.ELITE.id
      newEnforcedReason =
        AUTOMATIC_TIER_UPGRADES.find((u) => u.condition === "biohazard_situations")?.message ||
        "Biohazard situations require Elite service."
    } else if (state.postRenovation || state.moldWaterDamage) {
      newEnforcedTier = SERVICE_TIERS.ELITE.id
      newEnforcedReason =
        AUTOMATIC_TIER_UPGRADES.find((u) => u.condition === "post_renovation" || u.condition === "mold_water_damage")
          ?.message || "Post-renovation or mold/water damage requires Elite service."
    } else if (state.squareFootage && state.squareFootage > 3000) {
      newEnforcedTier = SERVICE_TIERS.PREMIUM.id
      newEnforcedReason =
        AUTOMATIC_TIER_UPGRADES.find((u) => u.condition === "sq_ft_over_3000")?.message ||
        "Properties over 3,000 sq ft require Premium service."
    } else if (state.rentalProperty || state.petOwners) {
      newEnforcedTier = SERVICE_TIERS.PREMIUM.id
      newEnforcedReason =
        AUTOMATIC_TIER_UPGRADES.find((u) => u.condition === "rental_property" || u.condition === "pet_owners")
          ?.message || "Rental properties or pet owners require Premium service."
    }

    // If a tier is enforced, ensure the serviceTier state reflects it
    // Only update if the enforced tier is higher than the current selected tier
    const currentTierIndex = ["standard", "premium", "elite"].indexOf(state.serviceTier)
    const enforcedTierIndex = newEnforcedTier ? ["standard", "premium", "elite"].indexOf(newEnforcedTier) : -1

    if (newEnforcedTier && enforcedTierIndex > currentTierIndex) {
      setState((prevState) => ({
        ...prevState,
        serviceTier: newEnforcedTier,
        enforcedTier: newEnforcedTier,
        enforcedTierReason: newEnforcedReason,
      }))
    } else if (!newEnforcedTier && state.enforcedTier) {
      // If no longer enforced, clear the enforcement
      setState((prevState) => ({
        ...prevState,
        enforcedTier: null,
        enforcedTierReason: null,
      }))
    }
  }, [
    state.squareFootage,
    state.rentalProperty,
    state.petOwners,
    state.postRenovation,
    state.moldWaterDamage,
    state.biohazardSituations,
    state.serviceTier, // Include serviceTier to re-evaluate if user manually changes it
  ])

  // --- Price Calculation Effect ---
  useEffect(() => {
    const config: ServiceConfig = {
      serviceTier: state.serviceTier,
      selectedRooms: state.selectedRooms,
      cleanlinessLevel: state.cleanlinessLevel,
      frequency: state.frequency,
      paymentFrequency: state.paymentFrequency,
      propertyType: state.propertyType,
      squareFootage: state.squareFootage || undefined,
      petOwners: state.petOwners,
      rentalProperty: state.rentalProperty,
      postRenovation: state.postRenovation,
      moldWaterDamage: state.moldWaterDamage,
      biohazardSituations: state.biohazardSituations,
      selectedAddons: state.selectedAddons,
      selectedExclusiveServices: state.selectedExclusiveServices,
      // Add other relevant state properties here
    }

    const calculate = async () => {
      setState((prevState) => ({ ...prevState, isCalculating: true }))
      try {
        const result = await calculatePrice(config)
        setState((prevState) => ({ ...prevState, calculatedPrice: result }))
      } catch (error) {
        console.error("Failed to calculate price:", error)
        setState((prevState) => ({ ...prevState, calculatedPrice: null }))
      } finally {
        setState((prevState) => ({ ...prevState, isCalculating: false }))
      }
    }

    calculate()
  }, [
    state.serviceTier,
    state.selectedRooms,
    state.cleanlinessLevel,
    state.frequency,
    state.paymentFrequency,
    state.propertyType,
    state.squareFootage,
    state.petOwners,
    state.rentalProperty,
    state.postRenovation,
    state.moldWaterDamage,
    state.biohazardSituations,
    state.selectedAddons,
    state.selectedExclusiveServices,
    calculatePrice, // Dependency from usePriceWorker
  ])

  const contextValue: PricingContextType = {
    ...state,
    setServiceTier,
    setSelectedRooms,
    setCleanlinessLevel,
    setFrequency,
    setPaymentFrequency,
    setPropertyType,
    setSquareFootage,
    setPetOwners,
    setRentalProperty,
    setPostRenovation,
    setMoldWaterDamage,
    setBiohazardSituations,
    toggleAddon,
    toggleExclusiveService,
    setWaiverSigned,
    resetCalculator,
  }

  return <PricingContext.Provider value={contextValue}>{children}</PricingContext.Provider>
}
