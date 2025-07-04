"use client"

import { useState, useCallback } from "react"
import type { ServiceConfig, PriceCalculationResult } from "@/lib/workers/price-calculator.worker"

/**
 * Fallback, main-thread price calculator.
 *
 * •  Keeps the same public API that the rest of the codebase expects:
 *      – calculatePrice(config)
 *      – isCalculating  (boolean)
 *      – isSupported    (boolean)
 * •  Removes the need for a Web Worker in environments where Workers
 *    are unavailable (like the preview that raised the error).
 *
 * Replace the simple algorithm below with your full logic whenever
 * you are ready to re-enable a Worker implementation.
 */

// ────────────────────────────────────────────────────────────
// VERY simple estimator — swap with real worker logic later.
const calculatePriceSynchronously = (config: ServiceConfig): PriceCalculationResult => {
  // Count total rooms
  const rooms = Object.values(config.rooms).reduce((sum, count) => sum + count, 0)

  // Base heuristics
  const baseRate = 60
  const tierMultiplier = config.serviceTier === "elite" ? 1.6 : config.serviceTier === "premium" ? 1.3 : 1

  const cleanlinessMultiplier = config.cleanlinessLevel >= 4 ? 1.4 : config.cleanlinessLevel >= 2 ? 1.2 : 1

  const firstServicePrice = Math.round(baseRate * tierMultiplier * cleanlinessMultiplier + rooms * 25)

  const frequencyDiscount =
    config.frequency === "weekly"
      ? 0.15
      : config.frequency === "biweekly"
        ? 0.1
        : config.frequency === "monthly"
          ? 0.05
          : 0

  const recurringServicePrice = Math.round(firstServicePrice * (1 - frequencyDiscount))

  // Minimal object that satisfies PriceCalculationResult
  return {
    firstServicePrice,
    recurringServicePrice,
    estimatedDuration: rooms * 45, // minutes
    enforcedTierReason: undefined,
  } as PriceCalculationResult
}
// ────────────────────────────────────────────────────────────

export function usePriceWorker() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSupported] = useState(true) // always true for fallback

  const calculatePrice = useCallback(async (config: ServiceConfig): Promise<PriceCalculationResult> => {
    setIsCalculating(true)
    try {
      // In a real worker version this would postMessage/await.
      const result = calculatePriceSynchronously(config)
      return result
    } finally {
      setIsCalculating(false)
    }
  }, [])

  return { calculatePrice, isCalculating, isSupported }
}
