"use client"

import { useState } from "react"
import { RoomConfigContext } from "@/contexts/room-config-context"
import { RoomCountsContext } from "@/contexts/room-counts-context"
import RoomCategory from "@/components/room-category"
import Footer from "@/components/footer"
import { BuySubscribeButtons } from "@/components/buy-subscribe-buttons"

const roomDisplayNames: { [key: string]: string } = {
  bedroom: "Bedrooms",
  bathroom: "Bathrooms",
  kitchen: "Kitchens",
  living_room: "Living Rooms",
  dining_room: "Dining Rooms",
  office: "Offices",
  other: "Other Rooms",
}

export default function Page() {
  const [roomCounts, setRoomCounts] = useState({
    bedroom: 0,
    bathroom: 0,
    kitchen: 0,
    living_room: 0,
    dining_room: 0,
    office: 0,
    other: 0,
  })

  const [roomConfigs, setRoomConfigs] = useState<{
    [key: string]: {
      selectedTier: string
      selectedAddOns: string[]
      selectedReductions: string[]
      totalPrice: number
    }
  }>({})

  const [globalFrequency, setGlobalFrequency] = useState("one_time")
  const [globalFrequencyDiscount, setGlobalFrequencyDiscount] = useState(0)

  return (
    <RoomCountsContext.Provider value={{ roomCounts, setRoomCounts }}>
      <RoomConfigContext.Provider value={{ roomConfigs, setRoomConfigs }}>
        <main className="container mx-auto py-12">
          <h1 className="text-3xl font-bold mb-6">Get a Quote for Your Cleaning Needs</h1>

          {/* Room Categories */}
          {Object.entries(roomDisplayNames).map(([roomType, roomName]) => (
            <RoomCategory key={roomType} roomType={roomType} roomName={roomName} />
          ))}

          {/* Buy/Subscribe Buttons */}
          {Object.values(roomCounts).some((count) => count > 0) && (
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
                  frequency: globalFrequency,
                  frequencyDiscount: globalFrequencyDiscount,
                }))}
              totalPrice={Object.entries(roomCounts).reduce((total, [roomType, count]) => {
                const config = roomConfigs[roomType]
                return total + (config?.totalPrice || 0) * count
              }, 0)}
              frequency={globalFrequency}
              frequencyDiscount={globalFrequencyDiscount}
              onPurchase={(type) => {
                // Handle purchase/subscription logic here
                console.log(`${type} clicked with frequency: ${globalFrequency}`)
                // This would typically redirect to Stripe checkout
              }}
            />
          )}

          <Footer />
        </main>
      </RoomConfigContext.Provider>
    </RoomCountsContext.Provider>
  )
}
