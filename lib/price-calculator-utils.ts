import { PRICE_CONFIG } from "./price-config"

export function calculatePrice(data: {
  rooms: Record<string, number>
  serviceType: "standard" | "detailing"
  cleanlinessLevel: number
  frequency: keyof typeof PRICE_CONFIG.multipliers.frequency
  paymentFrequency: keyof typeof PRICE_CONFIG.multipliers.payment
  allowVideo: boolean
}): number {
  // 1. Calculate base price
  const base = Object.entries(data.rooms).reduce((total, [roomType, count]) => {
    // Skip if room type doesn't exist in config or count is 0
    if (count <= 0 || !PRICE_CONFIG.roomRates[data.serviceType][roomType]) return total
    return total + count * PRICE_CONFIG.roomRates[data.serviceType][roomType]
  }, 0)

  // If no rooms selected, return 0
  if (base === 0) return 0

  // 2. Apply service type multiplier
  let total = base * PRICE_CONFIG.multipliers.serviceType[data.serviceType]

  // 3. Apply cleanliness multiplier
  total *= PRICE_CONFIG.multipliers.cleanliness[data.cleanlinessLevel - 1]

  // 4. Apply frequency adjustments (surcharge first, then discount)
  const freq = PRICE_CONFIG.multipliers.frequency[data.frequency]
  total = total * (1 + freq.surcharge) * (1 - freq.discount)

  // 5. Apply payment frequency discount
  total *= 1 - PRICE_CONFIG.multipliers.payment[data.paymentFrequency]

  // 6. Apply video discount
  if (data.allowVideo) total -= PRICE_CONFIG.multipliers.videoDiscount

  // 7. Add service fee
  total += PRICE_CONFIG.serviceFee

  // Ensure proper currency formatting (round to 2 decimal places)
  return Math.round(total * 100) / 100
}

// Verification function for testing
export function testPricingCalculation() {
  const testCases = [
    {
      input: {
        rooms: { bedroom: 2, bathroom: 1 },
        serviceType: "standard" as const,
        cleanlinessLevel: 2,
        frequency: "weekly" as const,
        paymentFrequency: "monthly" as const,
        allowVideo: true,
      },
      expected: 66.29,
    },
    {
      input: {
        rooms: { kitchen: 1, living_room: 1 },
        serviceType: "detailing" as const,
        cleanlinessLevel: 3,
        frequency: "one_time" as const,
        paymentFrequency: "per_service" as const,
        allowVideo: false,
      },
      expected: (75 + 60) * 1.8 * 1.7 + PRICE_CONFIG.serviceFee, // 229.5 + service fee
    },
  ]

  testCases.forEach(({ input, expected }, index) => {
    const result = calculatePrice(input)
    console.log(`Test Case ${index + 1}:`)
    console.log(`Expected: $${expected.toFixed(2)}`)
    console.log(`Received: $${result.toFixed(2)}`)
    console.log(`Status: ${Math.abs(result - expected) < 0.01 ? "PASS" : "FAIL"}`)
    console.log("------------------------")
  })
}
