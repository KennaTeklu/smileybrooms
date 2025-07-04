"use client"

import { useState, useCallback } from "react"

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * NOTE – This is a **simple, synchronous fallback**.  It is intentionally
 * lightweight and robust so the UI never crashes if Workers are unavailable
 * (which is the case in the preview environment that reported the error).
 * If you still want a Worker-powered version later, we can add it behind
 * a feature flag once the preview build supports it.
 * ──────────────────────────────────────────────────────────────────────────────
 */

export type ServiceConfig = {
  rooms: Record<string, number>
  serviceTier: "standard" | "premium" | "elite"
  frequency: string
  cleanlinessLevel: number
  selectedAddons?: { id: string; quantity?: number }[]
  selectedExclusiveServices?: string[]
  discounts?: Record<string, number>
}

export type PriceResult = {
  firstServicePrice: number
  recurringServicePrice: number
  estimatedDuration: number
}

/**
 * A rock-solid, deterministic price calculator that never throws.
 * It is deliberately **minimal** – substitute with real logic later.
 */
const calculatePriceSynchronously = (config: ServiceConfig): PriceResult => {
  const roomCount = Object.values(config.rooms).reduce((sum, n) => sum + n, 0)

  // Base price heuristic
  const base = 75
  const tierMultiplier = config.serviceTier === "elite" ? 1.6 : config.serviceTier === "premium" ? 1.3 : 1

  const cleanlinessMultiplier = config.cleanlinessLevel >= 4 ? 1.4 : config.cleanlinessLevel >= 2 ? 1.2 : 1

  const firstServicePrice = Math.round(base * tierMultiplier * cleanlinessMultiplier + roomCount * 25)

  // Simple frequency discount
  const frequencyDiscount =
    config.frequency === "weekly"
      ? 0.15
      : config.frequency === "biweekly"
        ? 0.1
        : config.frequency === "monthly"
          ? 0.05
          : 0

  const recurringServicePrice = Math.round(firstServicePrice * (1 - frequencyDiscount))

  // Duration estimation (minutes)
  const estimatedDuration = roomCount * 45

  return { firstServicePrice, recurringServicePrice, estimatedDuration }
}

/**
 * Hook that mimics the previous worker API but runs entirely on the client.
 */
export function usePriceWorker() {
  const [result, setResult] = useState<PriceResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculatePrice = useCallback((config: ServiceConfig) => {
    try {
      setLoading(true)
      const res = calculatePriceSynchronously(config)
      setResult(res)
      setError(null)
    } catch (e) {
      console.error(e)
      setError(`Price calculation failed: ${(e as Error).message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  return { calculatePrice, result, loading, error }
}
