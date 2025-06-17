/// <reference lib="webworker" />

// Define the input configuration type (duplicated for worker)
export type ServiceConfig = {
  rooms: Record<string, number>
  serviceType: "standard" | "detailing"
  frequency: string
  cleanlinessLevel: number
  specialRequests?: string[]
  discounts?: Record<string, number>
  addons?: Record<string, number>
  zipCode?: string
  squareFootage?: number
}

// Define the output result type (duplicated for worker)
export type PriceResult = {
  basePrice: number
  adjustments: Record<string, number>
  firstServicePrice: number // Added for first service
  recurringServicePrice: number // Added for recurring services
  estimatedDuration: number // in minutes
  breakdown: {
    category: string
    amount: number
    description: string
  }[]
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

self.onmessage = (event: MessageEvent<ServiceConfig>) => {
  try {
    const config = event.data

    // Calculate base price
    let basePrice = 0
    for (const [roomType, count] of Object.entries(config.rooms)) {
      if (count > 0) {
        const room = roomTypes.find((r) => r.id === roomType)
        if (room) {
          basePrice += room.basePrice * count
        }
      }
    }

    // Apply service type multiplier
    const serviceMultiplier = config.serviceType === "detailing" ? 1.5 : 1.0
    const priceAfterServiceType = basePrice * serviceMultiplier

    // Apply cleanliness level multiplier
    const cleanlinessMultiplier =
      cleanlinessMultipliers.find((c) => c.level === config.cleanlinessLevel)?.multiplier || 1.0
    const priceAfterCleanliness = priceAfterServiceType * cleanlinessMultiplier

    // Calculate the one-time price (first service price)
    const firstServicePrice = priceAfterCleanliness

    // Apply frequency discount for recurring price
    const selectedFrequency = frequencyOptions.find((f) => f.id === config.frequency)
    const frequencyDiscount = selectedFrequency ? selectedFrequency.discount : 0
    const priceAfterFrequency = priceAfterCleanliness * (1 - frequencyDiscount)

    // Apply payment frequency discount (assuming 'yearly' is the only one with a discount here)
    const paymentDiscount = 0
    // If config.paymentFrequency was passed:
    // if (config.paymentFrequency === "yearly") { paymentDiscount = 0.1; }
    const recurringServicePrice = priceAfterFrequency * (1 - paymentDiscount)

    // Apply discounts and addons (simplified)
    let discountTotal = 0
    if (config.discounts) {
      discountTotal = Object.values(config.discounts).reduce((sum, val) => sum + val, 0)
    }

    let addonTotal = 0
    if (config.addons) {
      addonTotal = Object.values(config.addons).reduce((sum, val) => sum + val, 0)
    }

    // Final prices after all adjustments (for simplicity, applying to both)
    const finalFirstServicePrice = Math.max(0, firstServicePrice - discountTotal + addonTotal)
    const finalRecurringServicePrice = Math.max(0, recurringServicePrice - discountTotal + addonTotal)

    const result: PriceResult = {
      basePrice,
      adjustments: {
        serviceType: priceAfterServiceType - basePrice,
        frequency: priceAfterCleanliness - priceAfterFrequency,
        cleanliness: priceAfterCleanliness - priceAfterServiceType,
        discounts: -discountTotal,
        addons: addonTotal,
      },
      firstServicePrice: Math.round(finalFirstServicePrice * 100) / 100,
      recurringServicePrice: Math.round(finalRecurringServicePrice * 100) / 100,
      estimatedDuration: Math.round(finalFirstServicePrice * 0.8), // Duration based on first service
      breakdown: [
        {
          category: "Base Price",
          amount: basePrice,
          description: "Base price for selected rooms",
        },
      ],
    }

    self.postMessage(result)
  } catch (error: any) {
    self.postMessage({ error: error.message || "An unknown error occurred during calculation." })
  }
}
