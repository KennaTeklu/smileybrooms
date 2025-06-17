"use client"

import { useState, useEffect } from "react"

// Define the input configuration type
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
  paymentFrequency?: string // Added paymentFrequency
}

// Define the output result type
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

// Fallback calculation function for browsers that don't support Web Workers
const fallbackCalculatePrice = (config: ServiceConfig): PriceResult => {
  // This is a simplified version of the calculation
  // In a real app, you'd duplicate the logic from the worker

  // Define the frequency options and their discounts (duplicated for fallback)
  const frequencyOptions = [
    { id: "one_time", discount: 0 },
    { id: "weekly", discount: 0.15 },
    { id: "biweekly", discount: 0.1 },
    { id: "monthly", discount: 0.05 },
    { id: "semi_annual", discount: 0.02 },
    { id: "annually", discount: 0.01 },
    { id: "vip_daily", discount: 0.25 },
  ]

  // Define the cleanliness level multipliers (duplicated for fallback)
  const cleanlinessMultipliers = [
    { level: 1, multiplier: 0.8 },
    { level: 2, multiplier: 1.0 },
    { level: 3, multiplier: 1.2 },
    { level: 4, multiplier: 1.5 },
    { level: 5, multiplier: 2.0 },
  ]

  // Calculate base price
  let basePrice = 0
  for (const [roomType, count] of Object.entries(config.rooms)) {
    if (count > 0) {
      // Simplified room pricing
      const roomPrice =
        {
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
        }[roomType] || 25

      basePrice += roomPrice * count
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

  // Apply payment frequency discount
  let paymentDiscount = 0
  if (config.paymentFrequency === "annually") {
    paymentDiscount = 0.1
  }
  const priceAfterPayment = priceAfterFrequency * (1 - paymentDiscount)

  // Apply discounts and addons (simplified)
  let discountTotal = 0
  if (config.discounts) {
    discountTotal = Object.values(config.discounts).reduce((sum, val) => sum + val, 0)
  }

  let addonTotal = 0
  if (config.addons) {
    addonTotal = Object.values(config.addons).reduce((sum, val) => sum + val, 0)
  }

  // Final prices after all adjustments (for simplicity, applying to both for fallback)
  const finalFirstServicePrice = Math.max(0, firstServicePrice - discountTotal + addonTotal)
  const finalRecurringServicePrice = Math.max(0, priceAfterPayment - discountTotal + addonTotal)

  // Return simplified result
  return {
    basePrice,
    adjustments: {
      serviceType: priceAfterServiceType - basePrice,
      frequency: priceAfterCleanliness - priceAfterFrequency,
      cleanliness: priceAfterCleanliness - priceAfterServiceType,
      discounts: -discountTotal,
      addons: addonTotal,
      paymentFrequency: priceAfterFrequency - priceAfterPayment,
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
}

export function usePriceWorker() {
  const [worker, setWorker] = useState<Worker | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)

  // Initialize the worker
  useEffect(() => {
    // Check if Web Workers are supported
    if (typeof Worker !== "undefined") {
      try {
        // Create the worker
        const priceWorker = new Worker(new URL("./workers/price-calculator.worker.ts", import.meta.url))
        setWorker(priceWorker)

        // Clean up on unmount
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
    // If Web Workers aren't supported, use the fallback
    if (!isSupported || !worker) {
      return fallbackCalculatePrice(config)
    }

    setIsCalculating(true)

    try {
      // Create a promise that resolves when the worker responds
      const result = await new Promise<PriceResult>((resolve, reject) => {
        // Set up one-time message handler
        const handleMessage = (e: MessageEvent) => {
          worker.removeEventListener("message", handleMessage)
          if (e.data.error) {
            reject(new Error(e.data.error))
          } else {
            resolve(e.data)
          }
        }

        // Set up error handler
        const handleError = (error: ErrorEvent) => {
          worker.removeEventListener("error", handleError)
          reject(error)
        }

        // Add event listeners
        worker.addEventListener("message", handleMessage)
        worker.addEventListener("error", handleError)

        // Send the configuration to the worker
        worker.postMessage(config)
      })

      return result
    } catch (error) {
      console.error("Error in price calculation worker:", error)
      // Fall back to synchronous calculation
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
