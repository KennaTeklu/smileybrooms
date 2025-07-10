"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Contact, Home, Building2 } from "lucide-react"
import { roomDisplayNames } from "@/lib/room-tiers"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RoomCategory } from "@/components/room-category"
import { RequestQuoteButton } from "@/components/request-quote-button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"
import { useRoomContext, type RoomConfig } from "@/lib/room-context"

function PricingContent() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("standard")

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

  const coreRooms = ["bedroom", "bathroom", "kitchen", "livingRoom", "diningRoom", "homeOffice"]
  const additionalSpaces = ["laundryRoom", "entryway", "hallway", "stairs"]

  const handleRoomCountChange = (roomType: string, count: number) => {
    const newCount = Math.max(0, count)
    updateRoomCount(roomType, newCount)

    if (newCount > 0 && (roomCounts[roomType] || 0) === 0) {
      if (!selectedRoomForMap) {
        setSelectedRoomForMap(roomType)
      }
    }

    if (newCount === 0 && (roomCounts[roomType] || 0) > 0) {
      if (selectedRoomForMap === roomType) {
        const activeRooms = Object.entries(roomCounts)
          .filter(([key, currentCount]) => key !== roomType && currentCount > 0)
          .map(([key]) => key)
        setSelectedRoomForMap(activeRooms.length > 0 ? activeRooms[0] : null)
      }
    }
  }

  const handleRoomConfigChange = (roomType: string, config: RoomConfig) => {
    updateRoomConfig(roomType, config)
  }

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

  return (
    <main className="container mx-auto px-4 pt-2">
      <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-2 mb-2" aria-label="Service types">
          <TabsTrigger value="standard" className="flex items-center gap-2" aria-controls="standard-tab">
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Residential Services</span>
          </TabsTrigger>
          <TabsTrigger value="detailing" className="flex items-center gap-2" aria-controls="detailing-tab">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            <span>Commercial Services</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" id="standard-tab" role="tabpanel" className="space-y-4">
          {/* Core Rooms Category */}
          <RoomCategory
            title="Choose Your Core Spaces"
            description="Select the main rooms you want sparkling clean."
            rooms={coreRooms}
            roomCounts={roomCounts}
            onRoomCountChange={handleRoomCountChange}
            onRoomConfigChange={handleRoomConfigChange}
            getRoomConfig={getRoomConfig}
            variant="primary"
            onRoomSelect={setSelectedRoomForMap}
          />

          {/* Additional Spaces Category */}
          <RoomCategory
            title="Enhance Your Clean"
            description="Add extra areas for a truly comprehensive service."
            rooms={additionalSpaces}
            roomCounts={roomCounts}
            onRoomCountChange={handleRoomCountChange}
            onRoomConfigChange={handleRoomConfigChange}
            getRoomConfig={getRoomConfig}
            variant="secondary"
            onRoomSelect={setSelectedRoomForMap}
          />

          {/* Custom Space Card */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-700/30">
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700/30">
                  <Contact className="h-5 w-5" aria-hidden="true" />
                </span>
                CUSTOM SPACES
              </CardTitle>
              <CardDescription>Need something not listed above? Request a custom space</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="text-4xl mb-4" aria-hidden="true">
                  🏠
                </div>
                <h3 className="font-medium text-xl mb-2">Other Space</h3>
                <p className="text-gray-500 mb-4 text-center max-w-md">
                  Have a unique space that needs cleaning? Contact us for a custom quote.
                </p>
                <RequestQuoteButton showIcon={true} />
              </div>
            </CardContent>
          </Card>

          {/* Selected Rooms Summary */}
          {getActiveRoomConfigs().length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-800/30">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    ✓
                  </span>
                  SELECTED ROOMS
                </CardTitle>
                <CardDescription>
                  You have selected {getActiveRoomConfigs().length} room{getActiveRoomConfigs().length !== 1 ? "s" : ""}
                  . Click "Customize" on any room to configure cleaning options and add to cart.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getActiveRoomConfigs().map((roomType) => (
                    <div
                      key={roomType}
                      className="flex flex-col items-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/20"
                    >
                      <div className="text-2xl mb-2">
                        {roomType === "bedroom" && "🛏️"}
                        {roomType === "bathroom" && "🚿"}
                        {roomType === "kitchen" && "🍳"}
                        {roomType === "livingRoom" && "🛋️"}
                        {roomType === "diningRoom" && "🍽️"}
                        {roomType === "homeOffice" && "💻"}
                        {roomType === "laundryRoom" && "🧺"}
                        {roomType === "entryway" && "🚪"}
                        {roomType === "hallway" && "🚶"}
                        {roomType === "stairs" && "🪜"}
                      </div>
                      <span className="font-medium text-sm text-center">
                        {roomDisplayNames[roomType]} ({roomCounts[roomType]})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="implementation-notes">
              <AccordionTrigger className="font-bold text-gray-500">IMPLEMENTATION NOTES</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>ROOM SELECTION:</strong> Select rooms above, then click "Customize" to configure each room
                  </li>
                  <li>
                    <strong>GUIDED CHECKOUT:</strong> Multi-step wizard guides you through all configuration options
                  </li>
                  <li>
                    <strong>TIER STACKING:</strong> Combine multiple tiers per room for customized cleaning
                  </li>
                  <li>
                    <strong>SERVICE INHERITANCE:</strong> Higher tiers include all lower-tier services
                  </li>
                  <li>
                    <strong>CUSTOM PRESETS:</strong> Save frequent configurations for future use
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="detailing" id="detailing-tab" role="tabpanel">
          <Card>
            <CardHeader>
              <CardTitle>Commercial Services</CardTitle>
              <CardDescription>Our premium cleaning services for businesses and commercial spaces</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Content for commercial services will be implemented in future rounds.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default PricingContent
export { PricingContent }
