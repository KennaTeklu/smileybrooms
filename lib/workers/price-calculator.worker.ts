// This is a Web Worker file that handles complex price calculations
// It runs in a separate thread to avoid blocking the main UI thread

// Define the input configuration type
type ServiceConfig = {
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

// Define the output result type
type PriceResult = {
  basePrice: number
  adjustments: Record<string, number>
  finalPrice: number
  estimatedDuration: number // in minutes
  breakdown: {
    category: string
    amount: number
    description: string
  }[]
}

// Base prices per room type
const BASE_PRICES = {
  bathroom: 35,
  bedroom: 30,
  kitchen: 45,
  living_room: 40,
  dining_room: 25,
  office: 30,
  laundry_room: 20,
  hallway: 15,
  staircase: 25,
  basement: 50,
  garage: 40,
  patio: 30,
  other: 25,
}

// Multipliers for service type
const SERVICE_TYPE_MULTIPLIERS = {
  standard: 1.0,
  detailing: 1.5,
}

// Multipliers for frequency
const FREQUENCY_MULTIPLIERS = {
  one_time: 1.0,
  weekly: 0.8,
  biweekly: 0.85,
  monthly: 0.9,
  semi_annual: 0.95,
  annually: 0.98,
  vip_daily: 0.7,
}

// Multipliers for cleanliness level (1-5, where 5 is extremely dirty)
const CLEANLINESS_MULTIPLIERS = {
  1: 0.9, // Very clean, just maintenance
  2: 1.0, // Standard cleanliness
  3: 1.1, // Moderately dirty
  4: 1.25, // Very dirty
  5: 1.5, // Extremely dirty
}

// Calculate the price based on the service configuration
function calculatePrice(config: ServiceConfig): PriceResult {
  // Start with base calculation
  let basePrice = 0
  const breakdown: PriceResult["breakdown"] = []

  // Calculate base price for each room type
  for (const [roomType, count] of Object.entries(config.rooms)) {
    if (count > 0 && BASE_PRICES[roomType as keyof typeof BASE_PRICES]) {
      const roomBasePrice = BASE_PRICES[roomType as keyof typeof BASE_PRICES] * count
      basePrice += roomBasePrice

      breakdown.push({
        category: "Rooms",
        amount: roomBasePrice,
        description: `${count} × ${roomType.replace(/_/g, " ")}`,
      })
    }
  }

  // Apply service type multiplier
  const serviceTypeMultiplier = SERVICE_TYPE_MULTIPLIERS[config.serviceType]
  const serviceTypeAdjustment = basePrice * (serviceTypeMultiplier - 1)
  basePrice = basePrice * serviceTypeMultiplier

  if (serviceTypeAdjustment !== 0) {
    breakdown.push({
      category: "Service Type",
      amount: serviceTypeAdjustment,
      description: `${config.serviceType} service (${serviceTypeMultiplier}x)`,
    })
  }

  // Apply frequency multiplier
  const frequencyMultiplier = FREQUENCY_MULTIPLIERS[config.frequency as keyof typeof FREQUENCY_MULTIPLIERS] || 1.0
  const frequencyAdjustment = basePrice * (1 - frequencyMultiplier)
  basePrice = basePrice * frequencyMultiplier

  if (frequencyAdjustment !== 0) {
    breakdown.push({
      category: "Frequency",
      amount: -frequencyAdjustment, // Negative because it's a discount
      description: `${config.frequency.replace(/_/g, " ")} service (${frequencyMultiplier}x)`,
    })
  }

  // Apply cleanliness level multiplier
  const cleanlinessMultiplier =
    CLEANLINESS_MULTIPLIERS[config.cleanlinessLevel as keyof typeof CLEANLINESS_MULTIPLIERS] || 1.0
  const cleanlinessAdjustment = basePrice * (cleanlinessMultiplier - 1)
  basePrice = basePrice * cleanlinessMultiplier

  if (cleanlinessAdjustment !== 0) {
    breakdown.push({
      category: "Cleanliness",
      amount: cleanlinessAdjustment,
      description: `Level ${config.cleanlinessLevel} cleanliness (${cleanlinessMultiplier}x)`,
    })
  }

  // Apply any special discounts
  let discountTotal = 0
  if (config.discounts) {
    for (const [discountName, discountAmount] of Object.entries(config.discounts)) {
      discountTotal += discountAmount
      breakdown.push({
        category: "Discount",
        amount: -discountAmount, // Negative because it's a discount
        description: discountName,
      })
    }
  }

  // Apply any add-ons
  let addonTotal = 0
  if (config.addons) {
    for (const [addonName, addonAmount] of Object.entries(config.addons)) {
      addonTotal += addonAmount
      breakdown.push({
        category: "Add-on",
        amount: addonAmount,
        description: addonName,
      })
    }
  }

  // Calculate final price
  const finalPrice = Math.max(0, basePrice - discountTotal + addonTotal)

  // Estimate duration based on price (rough estimate: $1 = 1 minute)
  const estimatedDuration = Math.round(finalPrice * 0.8)

  // Return the result
  return {
    basePrice: basePrice,
    adjustments: {
      serviceType: serviceTypeAdjustment,
      frequency: -frequencyAdjustment, // Negative because it's a discount
      cleanliness: cleanlinessAdjustment,
      discounts: -discountTotal, // Negative because it's a discount
      addons: addonTotal,
    },
    finalPrice: finalPrice,
    estimatedDuration: estimatedDuration,
    breakdown: breakdown,
  }
}

// Set up the Web Worker message handler
self.onmessage = (e: MessageEvent<ServiceConfig>) => {
  try {
    // Simulate complex calculation with artificial delay for demonstration
    // In a real scenario, this would be a genuinely complex calculation
    const startTime = Date.now()

    // Calculate the price
    const result = calculatePrice(e.data)

    // Ensure minimum processing time of 100ms to demonstrate the worker's effect
    const processingTime = Date.now() - startTime
    if (processingTime < 100) {
      setTimeout(() => {
        self.postMessage(result)
      }, 100 - processingTime)
    } else {
      self.postMessage(result)
    }
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : "Unknown error" })
  }
}

// Export empty type to satisfy TypeScript
export {}
