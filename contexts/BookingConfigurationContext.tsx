// contexts/BookingConfigurationContext.tsx
"use client"

import { createContext, useState, useContext, type ReactNode, useEffect, useCallback } from "react"
import {
  SERVICE_TIERS,
  CLEANLINESS_DIFFICULTY,
  AUTOMATIC_TIER_UPGRADES,
  ROOM_TYPES_FOR_SELECTION,
  FREQUENCY_OPTIONS,
  PAYMENT_FREQUENCY_OPTIONS,
  PROPERTY_SIZE_OPTIONS,
} from "@/lib/pricing-config"

// Define the shape of the state
interface BookingState {
  selectedTier: string // 'standard', 'premium', 'elite'
  selectedRooms: Record<string, number> // { 'bedroom': 2, 'bathroom': 1 }
  cleanlinessLevel: number // 1, 2, 3, 4 (Light, Medium, Heavy, Biohazard)
  propertySizeId: string // 'studio', '3br_home', '5br_mansion', 'custom'
  squareFootage: number | null // For custom property size
  selectedAddOns: Record<string, number> // { 'window_cleaning': 5, 'grout_restoration': 100 }
  selectedPremiumExclusiveServices: string[] // ['microbial_certification']
  frequency: string // 'one_time', 'weekly', etc.
  paymentFrequency: string // 'per_service', 'monthly', 'yearly'
  // Conditions for automatic upgrades
  isRentalProperty: boolean
  hasPets: boolean
  isPostRenovation: boolean
  hasMoldWaterDamage: boolean
  waiverSigned: boolean // For biohazard
  enforcedTier: string | null // Tier enforced by rules
  enforcementMessage: string | null // Message explaining enforcement
}

// Define the shape of the context value
interface BookingContextType {
  bookingState: BookingState
  updateBookingState: (updates: Partial<BookingState>) => void
  resetBookingState: () => void
  calculateEnforcedTier: () => { tier: string | null; message: string | null }
}

const BookingConfigurationContext = createContext<BookingContextType | undefined>(undefined)

const initialBookingState: BookingState = {
  selectedTier: SERVICE_TIERS.STANDARD.id,
  selectedRooms: ROOM_TYPES_FOR_SELECTION.reduce((acc, room) => ({ ...acc, [room.id]: 0 }), {}),
  cleanlinessLevel: CLEANLINESS_DIFFICULTY.MEDIUM.level, // Default to Medium
  propertySizeId: PROPERTY_SIZE_OPTIONS[0].id, // Default to Studio
  squareFootage: null,
  selectedAddOns: {},
  selectedPremiumExclusiveServices: [],
  frequency: FREQUENCY_OPTIONS[0].id, // Default to One-Time
  paymentFrequency: PAYMENT_FREQUENCY_OPTIONS[0].id, // Default to Pay Per Service
  isRentalProperty: false,
  hasPets: false,
  isPostRenovation: false,
  hasMoldWaterDamage: false,
  waiverSigned: false,
  enforcedTier: null,
  enforcementMessage: null,
}

export const BookingConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const [bookingState, setBookingState] = useState<BookingState>(initialBookingState)

  const updateBookingState = useCallback((updates: Partial<BookingState>) => {
    setBookingState((prev) => ({ ...prev, ...updates }))
  }, [])

  const resetBookingState = useCallback(() => {
    setBookingState(initialBookingState)
  }, [])

  const calculateEnforcedTier = useCallback(() => {
    let enforcedTier: string | null = null
    let enforcementMessage: string | null = null

    // Determine the highest required tier based on conditions
    let highestRequiredTierIndex = 0 // Standard

    AUTOMATIC_TIER_UPGRADES.forEach((rule) => {
      let conditionMet = false
      switch (rule.condition) {
        case "square_footage":
          if (bookingState.squareFootage && bookingState.squareFootage > rule.threshold!) {
            conditionMet = true
          }
          break
        case "property_type":
          if (bookingState.isRentalProperty && rule.value === "rental") {
            conditionMet = true
          }
          break
        case "pet_owners":
          if (bookingState.hasPets && rule.value === true) {
            conditionMet = true
          }
          break
        case "post_renovation":
          if (bookingState.isPostRenovation && rule.value === true) {
            conditionMet = true
          }
          break
        case "mold_water_damage":
          if (bookingState.hasMoldWaterDamage && rule.value === true) {
            conditionMet = true
          }
          break
        case "cleanliness_level":
          if (bookingState.cleanlinessLevel === rule.value && rule.value === CLEANLINESS_DIFFICULTY.BIOHAZARD.level) {
            conditionMet = true
          }
          break
      }

      if (conditionMet) {
        const ruleTierIndex = Object.values(SERVICE_TIERS).findIndex((tier) => tier.id === rule.requiredTier)
        if (ruleTierIndex > highestRequiredTierIndex) {
          highestRequiredTierIndex = ruleTierIndex
          enforcedTier = rule.requiredTier
          enforcementMessage = rule.message
        }
      }
    })

    return { tier: enforcedTier, message: enforcementMessage }
  }, [bookingState])

  // Effect to update enforced tier and potentially selected tier
  useEffect(() => {
    const { tier: newEnforcedTier, message: newEnforcementMessage } = calculateEnforcedTier()

    setBookingState((prev) => {
      let updatedTier = prev.selectedTier
      if (
        newEnforcedTier &&
        Object.values(SERVICE_TIERS).findIndex((t) => t.id === prev.selectedTier) <
          Object.values(SERVICE_TIERS).findIndex((t) => t.id === newEnforcedTier)
      ) {
        updatedTier = newEnforcedTier // Auto-upgrade if current tier is lower than enforced
      }

      return {
        ...prev,
        enforcedTier: newEnforcedTier,
        enforcementMessage: newEnforcementMessage,
        selectedTier: updatedTier,
      }
    })
  }, [
    bookingState.cleanlinessLevel,
    bookingState.propertySizeId,
    bookingState.squareFootage,
    bookingState.isRentalProperty,
    bookingState.hasPets,
    bookingState.isPostRenovation,
    bookingState.hasMoldWaterDamage,
    calculateEnforcedTier,
  ])

  const value = {
    bookingState,
    updateBookingState,
    resetBookingState,
    calculateEnforcedTier,
  }

  return <BookingConfigurationContext.Provider value={value}>{children}</BookingConfigurationContext.Provider>
}

export const useBookingConfiguration = () => {
  const context = useContext(BookingConfigurationContext)
  if (context === undefined) {
    throw new Error("useBookingConfiguration must be used within a BookingConfigurationProvider")
  }
  return context
}
