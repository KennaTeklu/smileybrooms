"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Contact, Home, Building2, ChevronDown, ChevronUp } from "lucide-react"
import { roomDisplayNames } from "@/lib/room-tiers"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RoomCategory } from "@/components/room-category"
import { RequestQuoteButton } from "@/components/request-quote-button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"
import { useRoomContext, type RoomConfig } from "@/lib/room-context"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

function PricingContent() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("standard")
  const [isContentCollapsed, setIsContentCollapsed] = useState(false)
  const isSmallScreen = useMediaQuery("(max-width: 768px)")

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

  // Check if user has multiple selections to show collapse option
  const hasMultipleSelections = Object.values(roomCounts).reduce((sum, count) => sum + count, 0) > 1

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

  // Auto-collapse content when multiple selections are made to prioritize the button
  useEffect(() => {
    if (hasMultipleSelections && !isSmallScreen) {
      setIsContentCollapsed(true)
    }
  }, [hasMultipleSelections, isSmallScreen])

  return (
    <div className="relative">
      {/* Floating Button Space Indicator */}
      {hasMultipleSelections && (
        <div
          className={`fixed top-4 right-4 ${isSmallScreen ? "w-72" : "w-80"} h-20 pointer-events-none z-40 bg-blue-100/20 dark:bg-blue-900/20 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 flex items-center justify-center`}
        >
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Add All to Cart Button Area</p>
        </div>
      )}

      {/* Content Collapse Toggle */}
      {hasMultipleSelections && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 mb-4"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {getActiveRoomConfigs().length} room{getActiveRoomConfigs().length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsContentCollapsed(!isContentCollapsed)}
              className="flex items-center gap-2"
            >
              {isContentCollapsed ? (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show Details
                </>
              ) : (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Minimize for Better Cart Access
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content with Enhanced Spacing for Button */}
      <main
        className={`container mx-auto px-4 pt-2 transition-all duration-500 ${
          hasMultipleSelections
            ? isSmallScreen
              ? "pr-4" // Less padding on mobile
              : "pr-96" // More space for desktop floating button
            : "pr-4"
        }`}
      >
        <AnimatePresence>
          {!isContentCollapsed && (
            <motion.div
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
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
                    title="CORE ROOMS"
                    description="Select the rooms you want cleaned in your home"
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
                    title="ADDITIONAL SPACES"
                    description="Select any additional areas that need cleaning"
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

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="implementation-notes">
                      <AccordionTrigger className="font-bold text-gray-500">IMPLEMENTATION NOTES</AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>
                            <strong>ROOM SELECTION:</strong> Select rooms above, then click "Customize" to configure
                            each room
                          </li>
                          <li>
                            <strong>GUIDED CHECKOUT:</strong> Multi-step wizard guides you through all configuration
                            options
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
                      <CardDescription>
                        Our premium cleaning services for businesses and commercial spaces
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Content for commercial services will be implemented in future rounds.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed State Summary */}
        {isContentCollapsed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Selected Rooms Summary */}
            <Card className="shadow-lg border-2 border-green-200 dark:border-green-800">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-b border-green-200 dark:border-green-800/30">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    ✓
                  </span>
                  SELECTED ROOMS ({getActiveRoomConfigs().length})
                </CardTitle>
                <CardDescription>
                  Your selections are ready. Use the floating "Add All to Cart" button to proceed.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getActiveRoomConfigs().map((roomType) => (
                    <motion.div
                      key={roomType}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center p-4 border-2 border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-blue-900/20"
                    >
                      <div className="text-3xl mb-2">
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
                      <span className="font-bold text-sm text-center text-blue-900 dark:text-blue-100">
                        {roomDisplayNames[roomType]} ({roomCounts[roomType]})
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setIsContentCollapsed(false)}
                    className="flex items-center gap-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Modify Selections
                  </Button>
                  <RequestQuoteButton showIcon={true} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default PricingContent
export { PricingContent }
