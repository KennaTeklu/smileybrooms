import type React from "react"
/**
 * Very small PricingEngine shim
 * – calculates a rough total from rooms & add-ons
 * – provides formatForDisplay so existing code renders without errors
 *
 * Replace this with your full pricing logic whenever ready.
 */

type RoomItem = { room: string; unitPrice: number; quantity?: number }
type AddOnItem = { name: string; price: number; quantity?: number }

interface CalculateParams {
  rooms: RoomItem[]
  addOns: AddOnItem[]
  frequency: string
  cleanlinessMultiplier: number
  discountCodes: string[]
  paymentMethod: string
}

interface PricingDisplay {
  roomDisplay: {
    room: string
    adjustedRate: number
    baseRate: number
    icon?: React.ReactNode
    image?: string
    description?: string
  }[]
  addOnDisplay: {
    name: string
    price: number
    badge?: string
    icon?: React.ReactNode
  }[]
  discounts: { name: string; amount: number }[]
  total: number
}

function calculate({
  rooms,
  addOns,
}: CalculateParams): Omit<PricingDisplay, "roomDisplay" | "addOnDisplay" | "discounts"> {
  const roomTotal = rooms.reduce((sum, r) => sum + (r.unitPrice || 0) * (r.quantity ?? 1), 0)
  const addOnTotal = addOns.reduce((sum, a) => sum + (a.price || 0) * (a.quantity ?? 1), 0)

  return { total: roomTotal + addOnTotal }
}

function formatForDisplay(
  calcResult: { total: number },
  _opts = { showDetailed: true, includeImages: true },
): PricingDisplay {
  return {
    roomDisplay: [],
    addOnDisplay: [],
    discounts: [],
    total: Number(calcResult.total.toFixed(2)),
  }
}

export const PricingEngine = { calculate, formatForDisplay }
