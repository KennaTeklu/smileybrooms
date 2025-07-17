"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Contact, Home, Building2 } from "lucide-react"
import { roomDisplayNames } from "@/lib/room-tiers"
import { RoomCategory } from "@/components/room-category"
import { RequestQuoteButton } from "@/components/request-quote-button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"
import { useRoomContext, type RoomConfig } from "@/lib/room-context"
import { Separator } from "@/components/ui/separator"
import { generateRoomCartItemId, getRoomCartItemDisplayName } from "@/lib/cart/item-utils"
import { getRoomTiers } from "@/lib/room-tiers"

function PricingContent() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("standard")

  const { roomCounts, roomConfigs, updateRoomCount, updateRoomConfig, getSelectedRoomTypes, getCalculatedRoomPrice } =
    useRoomContext()

  // local highlight-on-map state (was crashing before because undefined)
  const [selectedRoomForMap, setSelectedRoomForMap] = useState<string | null>(null)

  const [serviceFee, setServiceFee] = useState(25)

  const coreRooms = ["bedroom", "bathroom", "kitchen", "livingRoom", "diningRoom"]
  const additionalSpaces = ["homeOffice", "laundryRoom", "entryway", "hallway", "stairs"]

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
        selectedTier: getRoomTiers(roomType)[0]?.id || "default-essential",
        selectedAddOns: [],
        selectedReductions: [],
        totalPrice: 0, // Will be calculated by RoomContext
        detailedTasks: [],
        notIncludedTasks: [],
        upsellMessage: "",
      }
    )
  }

  const getActiveRoomConfigs = () => {
    return Object.keys(roomCounts).filter((roomType) => roomCounts[roomType] > 0)
  }

  const handleAddRoomToCart = (roomType: string) => {
    const config = getRoomConfig(roomType)
    if (config && roomCounts[roomType] > 0) {
      // Use the new getCalculatedRoomPrice function to ensure latest price
      const calculatedPrice = getCalculatedRoomPrice(roomType, config)

      const cartItem = {
        id: generateRoomCartItemId(config),
        name: getRoomCartItemDisplayName(config),
        price: calculatedPrice, // Use the calculated price
        priceId: `${config.roomName}-${config.selectedTier}-price`, // Example priceId
        quantity: roomCounts[roomType],
        roomType: config.roomName,
        selectedTier: config.selectedTier,
        selectedAddOns: config.selectedAddOns,
        selectedReductions: config.selectedReductions,
        image: `/images/${roomType}-professional.png`, // Example image path
        sourceSection: "Pricing Page",
      }
      addItem(cartItem)
    } else {
      toast({
        title: "Cannot add to cart",
        description: `Please select at least one ${roomDisplayNames[roomType]} to add to cart.`,
        variant: "destructive",
      })
    }
  }

  const handleAddAllRoomsToCart = () => {
    const selectedRooms = getActiveRoomConfigs()
    if (selectedRooms.length === 0) {
      toast({
        title: "No Rooms Selected",
        description: "Please select at least one room before adding to cart.",
        variant: "destructive",
      })
      return
    }

    selectedRooms.forEach((roomType) => {
      const config = getRoomConfig(roomType)
      if (config && roomCounts[roomType] > 0) {
        // Use the new getCalculatedRoomPrice function to ensure latest price
        const calculatedPrice = getCalculatedRoomPrice(roomType, config)

        const cartItem = {
          id: generateRoomCartItemId(config),
          name: getRoomCartItemDisplayName(config),
          price: calculatedPrice, // Use the calculated price
          priceId: `${config.roomName}-${config.selectedTier}-price`, // Example priceId
          quantity: roomCounts[roomType],
          roomType: config.roomName,
          selectedTier: config.selectedTier,
          selectedAddOns: config.selectedAddOns,
          selectedReductions: config.selectedReductions,
          image: `/images/${roomType}-professional.png`, // Example image path
          sourceSection: "Pricing Page - Add All",
        }
        addItem(cartItem)
      }
    })
    toast({
      title: "All Rooms Added!",
      description: "All selected rooms have been added to your cart.",
      variant: "success",
    })
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
    <main className="container mx-auto px-2 pt-2 md:px-4 lg:px-6">
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

        <TabsContent value="standard" id="standard-tab" role="tabpanel" className="space-y-6">
          {/* Core Rooms Category */}
          <RoomCategory
            title="Core Rooms"
            description="Essential areas for a standard clean."
            rooms={coreRooms} // Use the defined array
            variant="primary"
            onRoomSelect={setSelectedRoomForMap}
          />

          <Separator />

          {/* Additional Spaces Category */}
          <RoomCategory
            title="Additional Spaces"
            description="Expand your cleaning to other areas."
            rooms={additionalSpaces} // Use the defined array
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
                  <span className="flex items-center justify-तर w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    ✓
                  </span>
                  SELECTED ROOMS
                </CardTitle>
                <CardDescription>
                  You have selected {getActiveRoomConfigs().length} room{getActiveRoomConfigs().length !== 1 ? "s" : ""}
                  . Click "Customize" on any room to adjust details.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getActiveRoomConfigs().map((roomType) => {
                    const config = getRoomConfig(roomType)
                    return (
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
                          {roomType.startsWith("other-custom-") && "✨"} {/* Icon for custom spaces */}
                        </div>
                        <span className="font-medium text-sm text-center">
                          {roomDisplayNames[roomType] || config.roomName} ({roomCounts[roomType]})
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {config.selectedTier.replace(/-/g, " ").toUpperCase()}
                        </span>
                        <span className="text-sm font-bold mt-2">
                          {config.isPriceTBD ? "Email for Pricing" : `$${config.totalPrice.toFixed(2)}`}
                        </span>
                        {/* Removed "Add to Cart" button here as it's handled by the CollapsibleAddAllPanel */}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Removed "IMPLEMENTATION NOTES" accordion */}
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
