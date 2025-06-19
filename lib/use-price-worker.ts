/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
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
}

// Define the output result type
export type PriceResult = {
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

// Fallback calculation function for browsers that don't support Web Workers
const fallbackCalculatePrice = (config: ServiceConfig): PriceResult => {
  // This is a simplified version of the calculation
  // In a real app, you'd duplicate the logic from the worker

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
  basePrice *= serviceMultiplier

  // Apply frequency discount
  const frequencyMultiplier =
    {
      one_time: 1.0,
      weekly: 0.8,
      biweekly: 0.85,
      monthly: 0.9,
      semi_annual: 0.95,
      annually: 0.98,
      vip_daily: 0.7,
    }[config.frequency] || 1.0

  basePrice *= frequencyMultiplier

  // Apply cleanliness level multiplier
  const cleanlinessMultiplier =
    {
      1: 0.9,
      2: 1.0,
      3: 1.1,
      4: 1.25,
      5: 1.5,
    }[config.cleanlinessLevel] || 1.0

  basePrice *= cleanlinessMultiplier

  // Apply discounts and addons
  let discountTotal = 0
  if (config.discounts) {
    discountTotal = Object.values(config.discounts).reduce((sum, val) => sum + val, 0)
  }

  let addonTotal = 0
  if (config.addons) {
    addonTotal = Object.values(config.addons).reduce((sum, val) => sum + val, 0)
  }

  const finalPrice = Math.max(0, basePrice - discountTotal + addonTotal)

  // Return simplified result
  return {
    basePrice,
    adjustments: {
      serviceType: basePrice * (serviceMultiplier - 1),
      frequency: basePrice * (1 - frequencyMultiplier),
      cleanliness: basePrice * (cleanlinessMultiplier - 1),
      discounts: -discountTotal,
      addons: addonTotal,
    },
    finalPrice,
    estimatedDuration: Math.round(finalPrice * 0.8),
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
