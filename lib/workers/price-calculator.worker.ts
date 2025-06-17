// lib/workers/price-calculator.worker.ts

import { expose } from "threads"

interface Config {
  basePrice: number
  rooms: { [key: string]: number }
  guests: {
    adult: number
    child: number
  }
  guestPrices: {
    adult: number
    child: number
  }
  taxRate: number
  discount?: number
}

interface BreakdownItem {
  item: string
  value: number
  type: string
}

interface CalculationResult {
  total: number
  breakdown: BreakdownItem[]
}

function calculatePrice(config: Config): CalculationResult {
  let currentTotal = config.basePrice
  const breakdown: BreakdownItem[] = [{ item: "Base Price", value: config.basePrice, type: "base" }]

  for (const roomType in config.rooms) {
    if (config.rooms.hasOwnProperty(roomType)) {
      const roomCount = config.rooms[roomType]
      const roomTotal = roomCount * 50 // Example price per room type

      breakdown.push({
        item: `${roomType} (${roomCount})`,
        value: roomTotal,
        type: "room",
      })
      currentTotal += roomTotal
    }
  }

  const adultGuestTotal = config.guests.adult * config.guestPrices.adult
  breakdown.push({
    item: `Adult Guests (${config.guests.adult})`,
    value: adultGuestTotal,
    type: "guest",
  })
  currentTotal += adultGuestTotal

  const childGuestTotal = config.guests.child * config.guestPrices.child
  breakdown.push({
    item: `Child Guests (${config.guests.child})`,
    value: childGuestTotal,
    type: "guest",
  })
  currentTotal += childGuestTotal

  const taxAmount = currentTotal * config.taxRate
  breakdown.push({ item: "Tax", value: taxAmount, type: "tax" })
  currentTotal += taxAmount

  if (config.discount) {
    const discountAmount = currentTotal * config.discount
    breakdown.push({ item: "Discount", value: -discountAmount, type: "discount" })
    currentTotal -= discountAmount
  }

  return {
    total: currentTotal,
    breakdown: breakdown,
  }
}

expose(calculatePrice)
