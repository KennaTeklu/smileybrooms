"use client"

import type React from "react"
import { useState } from "react"
import { BuySubscribeButtons } from "./buy-subscribe-buttons"

interface RoomCounts {
  [key: string]: number
}

interface RoomConfig {
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  totalPrice: number
}

interface RoomConfigs {
  [key: string]: RoomConfig
}

interface MinimalHeroProps {
  roomCounts: RoomCounts
  roomDisplayNames: { [key: string]: string }
  roomConfigs: RoomConfigs
}

const MinimalHero: React.FC<MinimalHeroProps> = ({ roomCounts, roomDisplayNames, roomConfigs }) => {
  const [frequency, setFrequency] = useState<"ONE_TIME" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY">("ONE_TIME")

  const handleFrequencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFrequency(event.target.value as "ONE_TIME" | "WEEKLY" | "BI_WEEKLY" | "MONTHLY")
  }

  return (
    <div>
      <h1>Clean Home, Happy Life</h1>
      <p>Select your rooms and frequency for a sparkling clean home.</p>

      {/* Room Categories */}
      <div>
        <h2>Rooms</h2>
        <ul>
          {Object.entries(roomCounts).map(([roomType, count]) => (
            <li key={roomType}>
              {roomDisplayNames[roomType] || roomType}: {count}
            </li>
          ))}
        </ul>
      </div>

      {/* Frequency Selection */}
      <div>
        <label htmlFor="frequency">Frequency:</label>
        <select id="frequency" value={frequency} onChange={handleFrequencyChange}>
          <option value="ONE_TIME">One Time</option>
          <option value="WEEKLY">Weekly</option>
          <option value="BI_WEEKLY">Bi-Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>
      </div>

      {/* Buy/Subscribe Buttons */}
      {Object.values(roomCounts).some((count) => count > 0) && (
        <div className="mt-8">
          <BuySubscribeButtons
            selectedRooms={Object.entries(roomCounts)
              .filter(([_, count]) => count > 0)
              .map(([roomType, count]) => ({
                roomType,
                roomName: roomDisplayNames[roomType] || roomType,
                roomCount: count,
                selectedTier: roomConfigs[roomType]?.selectedTier || "ESSENTIAL CLEAN",
                selectedAddOns: roomConfigs[roomType]?.selectedAddOns || [],
                selectedReductions: roomConfigs[roomType]?.selectedReductions || [],
                totalPrice: roomConfigs[roomType]?.totalPrice || 0,
                frequency: frequency,
                frequencyDiscount: 0,
              }))}
            totalPrice={Object.entries(roomCounts).reduce((total, [roomType, count]) => {
              const config = roomConfigs[roomType]
              return total + (config?.totalPrice || 0) * count
            }, 0)}
            frequency={frequency}
            frequencyDiscount={0}
            onPurchase={(type) => {
              console.log(`${type} clicked with frequency: ${frequency}`)
              // This would typically redirect to Stripe checkout
            }}
          />
        </div>
      )}
    </div>
  )
}

export default MinimalHero
