"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"

// Room configuration with prices and frequency multipliers
const ROOM_CONFIG = {
  serviceFee: 50,
  roomPrices: {
    master_bedroom: 54.28,
    bedroom: 35.42,
    bathroom: 43.63,
    kitchen: 54.8,
    living_room: 31.37,
    dining_room: 25.63,
    office: 19.53,
    playroom: 25.64,
    mudroom: 21.73,
    laundry_room: 13.46,
    sunroom: 22.25,
    guest_room: 35.42,
    garage: 83.99,
  },
  frequencyMultipliers: {
    one_time: 2.17,
    weekly: 1.0,
    biweekly: 1.2,
    monthly: 1.54,
    semi_annual: 1.92,
    annually: 2.56,
    vip_daily: 7.5,
  },
}

interface PriceCalculatorProps {
  onCalculationComplete?: (data: {
    rooms: Record<string, number>
    frequency: string
    totalPrice: number
  }) => void
}

export default function PriceCalculator({ onCalculationComplete }: PriceCalculatorProps) {
  const [rooms, setRooms] = useState<Record<string, number>>({
    master_bedroom: 0,
    bedroom: 0,
    bathroom: 0,
    kitchen: 0,
    living_room: 0,
    dining_room: 0,
    office: 0,
    playroom: 0,
    mudroom: 0,
    laundry_room: 0,
    sunroom: 0,
    guest_room: 0,
    garage: 0,
  })

  const [frequency, setFrequency] = useState("one_time")
  const [totalPrice, setTotalPrice] = useState(0)
  const [showItemized, setShowItemized] = useState(false)
  const [itemizedDetails, setItemizedDetails] = useState<Array<{ label: string; amount: number | null }>>([])

  // Calculate price whenever rooms or frequency changes
  useEffect(() => {
    calculatePrice()
  }, [rooms, frequency])

  const handleRoomChange = (roomType: string, value: string) => {
    setRooms((prev) => ({
      ...prev,
      [roomType]: Number.parseInt(value),
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatRoomName = (name: string) => {
    return name.replace(/_/g, " ").toUpperCase()
  }

  const calculateDiscount = (newPrice: number, originalPrice: number) => {
    return (((originalPrice - newPrice) / originalPrice) * 100).toFixed(2)
  }

  const calculatePrice = () => {
    // Calculate base price from room selections
    const basePrice = Object.entries(ROOM_CONFIG.roomPrices).reduce((total, [roomType, price]) => {
      const numRooms = rooms[roomType as keyof typeof rooms] || 0
      return total + price * numRooms
    }, 0)

    // Get frequency multiplier
    const frequencyMultiplier =
      ROOM_CONFIG.frequencyMultipliers[frequency as keyof typeof ROOM_CONFIG.frequencyMultipliers]

    // Check if there are any room selections
    const hasRoomSelections = Object.values(rooms).some((value) => value > 0)

    // Calculate total price with service fee if there are room selections
    const calculatedTotalPrice = hasRoomSelections ? basePrice * frequencyMultiplier + ROOM_CONFIG.serviceFee : 0

    setTotalPrice(calculatedTotalPrice)

    // Generate itemized details
    const details: Array<{ label: string; amount: number | null }> = []

    // Add room details
    Object.entries(ROOM_CONFIG.roomPrices).forEach(([roomType, price]) => {
      const numRooms = rooms[roomType as keyof typeof rooms] || 0
      if (numRooms > 0) {
        details.push({
          label: `${formatRoomName(roomType)} (${numRooms})`,
          amount: price * numRooms,
        })
      }
    })

    // Add frequency adjustment if applicable
    if (hasRoomSelections && frequency !== "one_time") {
      const oneTimePrice = basePrice * ROOM_CONFIG.frequencyMultipliers.one_time
      const currentPrice = basePrice * frequencyMultiplier
      const priceDifference = currentPrice - oneTimePrice

      if (priceDifference < 0) {
        const discountPercentage = calculateDiscount(currentPrice, oneTimePrice)
        details.push({
          label: `${frequency.charAt(0).toUpperCase() + frequency.slice(1).replace("_", " ")} Discount (${discountPercentage}% off)`,
          amount: null,
        })
      } else if (frequency === "annually") {
        details.push({
          label: "Commitment Fee",
          amount: null,
        })
      } else if (frequency === "vip_daily") {
        details.push({
          label: "VIP Premium Daily User",
          amount: null,
        })
      }
    }

    // Add service fee
    if (hasRoomSelections) {
      details.push({
        label: "Service Fee",
        amount: ROOM_CONFIG.serviceFee,
      })
    }

    setItemizedDetails(details)

    // Call the callback if provided
    if (onCalculationComplete) {
      onCalculationComplete({
        rooms,
        frequency,
        totalPrice: calculatedTotalPrice,
      })
    }
  }

  return (
    <div className="calculator-container flex flex-col md:flex-row gap-6">
      <div className="calculator-display flex-1 md:mr-8">
        <form id="price-calculator" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(ROOM_CONFIG.roomPrices).map(([roomType, price]) => (
              <Card
                key={roomType}
                className="p-6 hover:shadow-md transition-all hover:-translate-y-1 hover:border-primary"
              >
                <label
                  htmlFor={roomType}
                  className="block mb-3 font-semibold text-gray-700 dark:text-gray-300 pl-6 relative"
                >
                  <span className="absolute left-0 top-1/2 transform -translate-y-1/2">🧹</span>
                  {formatRoomName(roomType)}:
                </label>
                <Select
                  value={rooms[roomType as keyof typeof rooms].toString()}
                  onValueChange={(value) => handleRoomChange(roomType, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="0" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Card>
            ))}
          </div>
        </form>
      </div>

      <div className="price-display w-full md:w-[400px] sticky top-0 pt-8">
        <div className="total-price-container bg-gradient-to-r from-indigo-500 to-indigo-700 p-8 rounded-xl text-white flex justify-between items-center mb-6 shadow-lg relative overflow-hidden">
          <div>
            <p className="text-lg">Total Estimated Price:</p>
            <span id="total_price" className="text-4xl font-bold block mt-2">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <ChevronDown
            className={`h-8 w-8 cursor-pointer transition-transform ${showItemized ? "rotate-180" : ""}`}
            onClick={() => setShowItemized(!showItemized)}
          />
        </div>

        <Card
          className={`frequency-selection bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white mb-6 transition-all ${showItemized ? "mb-0" : ""}`}
        >
          <div className="p-6">
            <label htmlFor="frequency" className="block mb-4 text-xl">
              Choose Frequency:
            </label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="bg-white/90 border-white/30 text-gray-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one_time">One-Time Cleaning</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Biweekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="semi_annual">Semi-Annually (2x a year)</SelectItem>
                <SelectItem value="annually">Annually (Yearly)</SelectItem>
                <SelectItem value="vip_daily">VIP Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div
          className={`itemized-bill bg-white/90 backdrop-blur-md rounded-xl border border-white/30 shadow-md overflow-hidden transition-all duration-300 ${showItemized ? "max-h-[500px] opacity-100 mt-6" : "max-h-0 opacity-0"}`}
        >
          <ul id="itemized-list" className="divide-y">
            {itemizedDetails.map((item, index) => (
              <li key={index} className="p-4 flex justify-between items-center hover:bg-blue-50/50 transition-colors">
                <span>{item.label}</span>
                {item.amount !== null && (
                  <>
                    <span className="flex-1 border-b border-dotted border-gray-300 mx-4"></span>
                    <span>{formatCurrency(item.amount)}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-500 italic p-4">
            1. Tax & fees included.
            <br />
            2. Discount applied at checkout
          </p>
        </div>
      </div>
    </div>
  )
}
