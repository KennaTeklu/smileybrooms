"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { coreRooms, additionalSpaces } from "@/lib/room-tiers"
import RoomCategory from "@/components/room-category"
import PriceBreakdown from "@/components/price-breakdown"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRoomContext, type RoomConfig } from "@/lib/room-context"
import { useToast } from "@/components/ui/use-toast" // Import useToast

function PricingContent() {
  const { toast } = useToast()
  const { addItem, totalItems, totalPrice } = useCart()
  const { rooms: selectedRooms } = useRoomContext()
  const [activeTab, setActiveTab] = useState("residential")

  const {
    roomCounts,
    roomConfigs,
    selectedRoomForMap,
    updateRoomCount,
    updateRoomConfig,
    setSelectedRoomForMap,
    getSelectedRoomTypes,
  } = useRoomContext()

  const [serviceFee, setServiceFee] = useState(25)

  const getRoomConfig = (roomType: string): RoomConfig => {
    return (
      roomConfigs[roomType] || {
        roomName: roomType,
        selectedTier: "ESSENTIAL CLEAN",
        selectedAddOns: [],
        selectedReductions: [],
        basePrice: 25,
        tierUpgradePrice: 0,
        addOnsPrice: 0,
        reductionsPrice: 0,
        totalPrice: 25,
      }
    )
  }

  const getActiveRoomConfigs = () => {
    return getSelectedRoomTypes()
  }

  useEffect(() => {
    const totalRooms = Object.values(roomCounts).reduce((sum, count) => sum + count, 0)
    if (totalRooms <= 2) {
      setServiceFee(25)
    } else if (totalRooms <= 5) {
      setServiceFee(35)
    } else {
      setServiceFee(45)
    }
  }, [roomCounts])

  const hasSelectedRooms = selectedRooms.length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="residential" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="residential">Residential Services</TabsTrigger>
          <TabsTrigger value="commercial">Commercial Services</TabsTrigger>
        </TabsList>
        <TabsContent value="residential" className="mt-6">
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold">Choose Your Core Spaces</h2>
            <p className="text-gray-600 dark:text-gray-400">Select the main rooms you want sparkling clean.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreRooms.map((room) => (
              <RoomCategory
                key={room}
                roomType={room}
                roomCounts={roomCounts}
                onRoomCountChange={updateRoomCount}
                onRoomConfigChange={updateRoomConfig}
                getRoomConfig={getRoomConfig}
                onRoomSelect={setSelectedRoomForMap}
              />
            ))}
          </div>

          <div className="my-12">
            <h2 className="mb-2 text-2xl font-bold">Enhance Your Clean</h2>
            <p className="text-gray-600 dark:text-gray-400">Add extra areas for a truly comprehensive service.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {additionalSpaces.map((room) => (
              <RoomCategory
                key={room}
                roomType={room}
                roomCounts={roomCounts}
                onRoomCountChange={updateRoomCount}
                onRoomConfigChange={updateRoomConfig}
                getRoomConfig={getRoomConfig}
                onRoomSelect={setSelectedRoomForMap}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="commercial" className="mt-6">
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed p-8 text-center text-gray-500">
            <p>Commercial services coming soon! Please contact us for a custom quote.</p>
          </div>
        </TabsContent>
      </Tabs>

      {hasSelectedRooms && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-950 md:relative md:mt-12 md:rounded-lg">
          <PriceBreakdown />
          <div className="mt-4 flex justify-end">
            <Link href="/checkout" passHref>
              <Button size="lg" className="w-full md:w-auto">
                Proceed to Checkout (${totalPrice.toFixed(2)})
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default PricingContent
