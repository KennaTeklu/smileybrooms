"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Contact, Home, Building2 } from "lucide-react"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomIcons, roomDisplayNames } from "@/lib/room-tiers"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ConfigurationManager } from "@/components/configuration-manager"
import { FrequencySelector } from "@/components/frequency-selector"
import { CleaningTimeEstimator } from "@/components/cleaning-time-estimator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RoomCategory } from "@/components/room-category"
import { RequestQuoteButton } from "@/components/request-quote-button"
import { ServiceSummaryCard } from "@/components/service-summary-card"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart-context"

interface RoomCount {
  [key: string]: number
}

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  reductionsPrice: number
  totalPrice: number
}

export default function PricingPage() {
  const { toast } = useToast()
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("standard")
  const [roomCounts, setRoomCounts] = useState<RoomCount>({
    bedroom: 0,
    bathroom: 0,
    kitchen: 0,
    livingRoom: 0,
    diningRoom: 0,
    homeOffice: 0,
    laundryRoom: 0,
    entryway: 0,
    hallway: 0,
    stairs: 0,
  })

  const [roomConfigurations, setRoomConfigurations] = useState<RoomConfig[]>([])
  const [selectedRoomForMap, setSelectedRoomForMap] = useState<string | null>(null)
  const [serviceFee, setServiceFee] = useState(25) // Default service fee
  const [matrixSelections, setMatrixSelections] = useState<
    Record<string, { addServices: string[]; removeServices: string[] }>
  >({})
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [showComparisonTable, setShowComparisonTable] = useState(false)
  const [showCheckoutPreview, setShowCheckoutPreview] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState("one_time")
  const [frequencyDiscount, setFrequencyDiscount] = useState(0)
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined)
  const [showRoomVisualization, setShowRoomVisualization] = useState(false)
  const [showCleaningChecklist, setShowCleaningChecklist] = useState(false)

  // Core rooms and additional spaces categorization
  const coreRooms = ["bedroom", "bathroom", "kitchen", "livingRoom", "diningRoom", "homeOffice"]
  const additionalSpaces = ["laundryRoom", "entryway", "hallway", "stairs"]

  // Handle room count changes
  const handleRoomCountChange = (roomType: string, count: number) => {
    setRoomCounts((prev) => {
      const newCount = Math.max(0, count)
      return { ...prev, [roomType]: newCount }
    })

    // If incrementing and this is a new room, add default configuration
    if (count > 0 && (roomCounts[roomType] || 0) === 0) {
      const tiers = getRoomTiers(roomType)
      const baseTier = tiers[0]

      const newConfig: RoomConfig = {
        roomName: roomType,
        selectedTier: baseTier.name,
        selectedAddOns: [],
        selectedReductions: [],
        basePrice: baseTier.price,
        tierUpgradePrice: 0,
        addOnsPrice: 0,
        reductionsPrice: 0,
        totalPrice: baseTier.price,
      }

      setRoomConfigurations((prev) => [...prev, newConfig])

      // Set this as the selected room for the service map if none is selected
      if (!selectedRoomForMap) {
        setSelectedRoomForMap(roomType)
      }
    }

    // If decrementing to zero, remove configuration
    if (count === 0 && (roomCounts[roomType] || 0) > 0) {
      setRoomConfigurations((prev) => prev.filter((config) => config.roomName !== roomType))

      // If this was the selected room for the service map, select another one
      if (selectedRoomForMap === roomType) {
        const activeRooms = Object.entries(roomCounts)
          .filter(([key, count]) => key !== roomType && count > 0)
          .map(([key]) => key)

        setSelectedRoomForMap(activeRooms.length > 0 ? activeRooms[0] : null)
      }
    }
  }

  // Handle room configuration changes
  const handleRoomConfigChange = (roomId: string, config: RoomConfig) => {
    setRoomConfigurations((prev) => {
      const index = prev.findIndex((c) => c.roomName === roomId)
      if (index >= 0) {
        const newConfigs = [...prev]
        newConfigs[index] = config
        return newConfigs
      }
      return [...prev, config]
    })
  }

  // Get room configuration
  const getRoomConfig = (roomType: string): RoomConfig => {
    return (
      roomConfigurations.find((config) => config.roomName === roomType) || {
        roomName: roomType,
        selectedTier: getRoomTiers(roomType)[0].name,
        selectedAddOns: [],
        selectedReductions: [],
        basePrice: getRoomTiers(roomType)[0].price,
        tierUpgradePrice: 0,
        addOnsPrice: 0,
        reductionsPrice: 0,
        totalPrice: getRoomTiers(roomType)[0].price,
      }
    )
  }

  // Handle matrix selection changes
  const handleMatrixSelectionChange = (
    roomType: string,
    selection: { addServices: string[]; removeServices: string[] },
  ) => {
    setMatrixSelections((prev) => ({
      ...prev,
      [roomType]: selection,
    }))
  }

  // Handle frequency selection
  const handleFrequencyChange = (frequency: string, discount: number) => {
    setSelectedFrequency(frequency)
    setFrequencyDiscount(discount)
  }

  // Handle saved configuration loading
  const handleLoadConfig = (config: any) => {
    // Reset current configurations
    setRoomCounts({
      bedroom: 0,
      bathroom: 0,
      kitchen: 0,
      livingRoom: 0,
      diningRoom: 0,
      homeOffice: 0,
      laundryRoom: 0,
      entryway: 0,
      hallway: 0,
      stairs: 0,
    })
    setRoomConfigurations([])

    // Load the saved configuration
    const newRoomCounts: RoomCount = { ...roomCounts }
    const newRoomConfigs: RoomConfig[] = []

    config.rooms.forEach((room: any) => {
      const roomType = Object.entries(roomDisplayNames).find(([_, name]) => name === room.type)?.[0] || ""
      if (roomType) {
        newRoomCounts[roomType] = room.count

        const tiers = getRoomTiers(roomType)
        const baseTier = tiers[0]
        const selectedTier = tiers.find((tier) => tier.name === room.tier)

        if (selectedTier) {
          newRoomConfigs.push({
            roomName: roomType,
            selectedTier: selectedTier.name,
            selectedAddOns: [],
            selectedReductions: [],
            basePrice: baseTier.price,
            tierUpgradePrice: selectedTier.price - baseTier.price,
            addOnsPrice: 0,
            reductionsPrice: 0,
            totalPrice: selectedTier.price,
          })
        }
      }
    })

    setRoomCounts(newRoomCounts)
    setRoomConfigurations(newRoomConfigs)

    // Set the first active room as the selected room for the map
    const firstActiveRoom = Object.entries(newRoomCounts).find(([_, count]) => count > 0)?.[0]

    if (firstActiveRoom) {
      setSelectedRoomForMap(firstActiveRoom)
    }
  }

  // Use precalculated values from room configurations
  const getCalculatedTotals = () => {
    let totalBasePrice = 0
    let totalTierUpgrades = 0
    let totalAddOns = 0
    let totalReductions = 0
    let totalRoomsPrice = 0

    const tierUpgradeDetails: Array<{
      roomName: string
      tierName: string
      price: number
      multiplier?: number
    }> = []

    const addOnDetails: Array<{
      roomName: string
      name: string
      price: number
    }> = []

    const reductionDetails: Array<{
      roomName: string
      name: string
      discount: number
    }> = []

    Object.entries(roomCounts).forEach(([roomType, count]) => {
      if (count > 0) {
        const config = getRoomConfig(roomType)
        const roomDisplayName = roomDisplayNames[roomType] || roomType

        // Add to totals (multiply by room count)
        totalBasePrice += (config.basePrice || 0) * count
        totalTierUpgrades += (config.tierUpgradePrice || 0) * count
        totalAddOns += (config.addOnsPrice || 0) * count
        totalReductions += (config.reductionsPrice || 0) * count
        totalRoomsPrice += (config.totalPrice || 0) * count

        // Add tier upgrade details if there's an upgrade
        if (config.tierUpgradePrice > 0) {
          const tiers = getRoomTiers(roomType)
          const selectedTier = tiers.find((tier) => tier.name === config.selectedTier)
          let multiplier = 1
          if (selectedTier?.name === "ADVANCED CLEAN") multiplier = 3
          if (selectedTier?.name === "PREMIUM CLEAN") multiplier = 9

          tierUpgradeDetails.push({
            roomName: roomDisplayName,
            tierName: config.selectedTier,
            price: config.tierUpgradePrice * count,
            multiplier: multiplier,
          })
        }

        // Add add-on details if there are add-ons
        if (config.selectedAddOns.length > 0) {
          const addOns = getRoomAddOns(roomType)
          config.selectedAddOns.forEach((addOnId) => {
            const addOn = addOns.find((a) => a.id === addOnId)
            if (addOn) {
              addOnDetails.push({
                roomName: roomDisplayName,
                name: addOn.name,
                price: addOn.price * count,
              })
            }
          })
        }

        // Add reduction details if there are reductions
        if (config.selectedReductions.length > 0) {
          const reductions = getRoomReductions(roomType)
          config.selectedReductions.forEach((reductionId) => {
            const reduction = reductions.find((r) => r.id === reductionId)
            if (reduction) {
              reductionDetails.push({
                roomName: roomDisplayName,
                name: reduction.name,
                discount: reduction.discount * count,
              })
            }
          })
        }
      }
    })

    // Calculate final total
    const subtotal = totalRoomsPrice + serviceFee
    const discountAmount = subtotal * (frequencyDiscount / 100)
    const finalTotal = subtotal - discountAmount

    return {
      basePrice: totalBasePrice,
      tierUpgrades: tierUpgradeDetails,
      addOns: addOnDetails,
      reductions: reductionDetails,
      serviceFee,
      frequencyDiscount,
      totalPrice: finalTotal,
    }
  }

  // Get active room configurations
  const getActiveRoomConfigs = () => {
    return Object.entries(roomCounts)
      .filter(([_, count]) => count > 0)
      .map(([roomType]) => roomType)
  }

  // Get service summary for checkout preview
  const getServiceSummary = () => {
    return {
      rooms: roomConfigurations.map((config) => ({
        type: roomDisplayNames[config.roomName] || config.roomName,
        count: roomCounts[config.roomName] || 0,
        tier: config.selectedTier,
      })),
      serviceFee,
    }
  }

  // Get selected tiers for all rooms
  const getSelectedTiers = () => {
    const tiers: Record<string, string> = {}
    roomConfigurations.forEach((config) => {
      tiers[config.roomName] = config.selectedTier
    })
    return tiers
  }

  // Handle adding to cart
  const handleAddToCart = () => {
    const calculatedTotals = getCalculatedTotals()

    // Create a cart item with all the details
    const cartItem = {
      id: `cleaning-service-${Date.now()}`,
      name: "Cleaning Service",
      price: calculatedTotals.totalPrice,
      quantity: 1,
      type: "service",
      details: {
        rooms: roomConfigurations.map((config) => ({
          type: roomDisplayNames[config.roomName] || config.roomName,
          count: roomCounts[config.roomName] || 1,
          tier: config.selectedTier,
          basePrice: config.basePrice,
          tierUpgradePrice: config.tierUpgradePrice,
          addOnsPrice: config.addOnsPrice,
          reductionsPrice: config.reductionsPrice,
          totalPrice: config.totalPrice,
        })),
        serviceFee,
        frequencyDiscount,
        frequency: selectedFrequency,
      },
    }

    // Add to cart
    addItem(cartItem)

    // Show toast notification
    toast({
      title: "Added to cart",
      description: "Your cleaning service has been added to the cart",
      duration: 3000,
    })
  }

  // Update service fee based on total rooms
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

  // Get calculated totals for display
  const calculatedTotals = getCalculatedTotals()

  return (
    <main className="container mx-auto py-10 px-4 mt-16">
      <h1 className="text-4xl font-bold text-center mb-2">Pricing Calculator</h1>
      <p className="text-center text-gray-500 mb-10">Customize your cleaning service to fit your needs and budget</p>

      <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8" aria-label="Service types">
          <TabsTrigger value="standard" className="flex items-center gap-2" aria-controls="standard-tab">
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Residential Services</span>
          </TabsTrigger>
          <TabsTrigger value="detailing" className="flex items-center gap-2" aria-controls="detailing-tab">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            <span>Commercial Services</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" id="standard-tab" role="tabpanel" className="space-y-8">
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
                  {roomIcons.other}
                </div>
                <h3 className="font-medium text-xl mb-2">Other Space</h3>
                <p className="text-gray-500 mb-4 text-center max-w-md">
                  Have a unique space that needs cleaning? Contact us for a custom quote.
                </p>
                <RequestQuoteButton showIcon={true} />
              </div>
            </CardContent>
          </Card>

          {getActiveRoomConfigs().length > 0 && (
            <>
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">PRICE SUMMARY</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="shadow-sm">
                      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
                        <CardTitle>Selected Rooms</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <ScrollArea className="h-[400px] pr-4" orientation="vertical" forceScrollable={true}>
                          <div className="space-y-4">
                            {getActiveRoomConfigs().map((roomType) => {
                              const config = roomConfigurations.find((c) => c.roomName === roomType)
                              if (!config) return null

                              return (
                                <div
                                  key={roomType}
                                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/10 transition-colors"
                                >
                                  <div className="flex items-center">
                                    <div className="p-2 rounded-full mr-3 bg-blue-100 dark:bg-blue-900/30">
                                      <span className="text-xl" aria-hidden="true">
                                        {roomIcons[roomType]}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {roomDisplayNames[roomType]} ({roomCounts[roomType]})
                                      </p>
                                      <p className="text-sm text-gray-500">{config.selectedTier}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">${(config.totalPrice || 0).toFixed(2)}</p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs text-blue-600 hover:text-blue-800 p-0 h-6 flex items-center gap-1"
                                      onClick={() => {
                                        // Open the drawer for this room
                                        const roomSelector = document.getElementById(`customize-${roomType}`)
                                        if (roomSelector) {
                                          roomSelector.click()
                                        }
                                      }}
                                      aria-label={`Edit ${roomDisplayNames[roomType]} configuration`}
                                    >
                                      <span className="sr-only">Edit</span>
                                      <span aria-hidden="true">Edit</span>
                                    </Button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <ServiceSummaryCard
                      basePrice={calculatedTotals.basePrice}
                      tierUpgrades={calculatedTotals.tierUpgrades}
                      addOns={calculatedTotals.addOns}
                      reductions={calculatedTotals.reductions}
                      serviceFee={calculatedTotals.serviceFee}
                      frequencyDiscount={calculatedTotals.frequencyDiscount}
                      totalPrice={calculatedTotals.totalPrice}
                      onAddToCart={handleAddToCart}
                      hasItems={getActiveRoomConfigs().length > 0}
                      serviceName="Cleaning Service"
                    />

                    <div className="mt-4">
                      <FrequencySelector
                        onFrequencyChange={handleFrequencyChange}
                        selectedFrequency={selectedFrequency}
                      />
                    </div>

                    <div className="mt-4">
                      <CleaningTimeEstimator
                        roomCounts={roomCounts}
                        selectedTiers={getSelectedTiers()}
                        totalAddOns={calculatedTotals.addOns.length}
                      />
                    </div>

                    <div className="mt-4">
                      <ConfigurationManager
                        currentConfig={{
                          rooms: roomConfigurations.map((config) => ({
                            type: roomDisplayNames[config.roomName],
                            count: roomCounts[config.roomName],
                            tier: config.selectedTier,
                          })),
                          totalPrice: calculatedTotals.totalPrice,
                        }}
                        onLoadConfig={handleLoadConfig}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="implementation-notes">
              <AccordionTrigger className="font-bold text-gray-500">IMPLEMENTATION NOTES</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>TIER STACKING:</strong> Combine multiple tiers per room for customized cleaning
                  </li>
                  <li>
                    <strong>SERVICE INHERITANCE:</strong> Higher tiers include all lower-tier services
                  </li>
                  <li>
                    <strong>CUSTOM PRESETS:</strong> Save frequent configurations for future use
                  </li>
                  <li>
                    <strong>AUTO-UPSELL:</strong> System suggests common add-ons based on your selections
                  </li>
                  <li>
                    <strong>SAFETY LOCKS:</strong> Prevents incompatible service combinations
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

      {/* Room Customization Side Panel */}
      {/* {customizationPanel.roomType && (
        <RoomCustomizationPanel
          isOpen={customizationPanel.isOpen}
          onClose={closeCustomizationPanel}
          roomName={roomDisplayNames[customizationPanel.roomType]}
          roomIcon={roomIcons[customizationPanel.roomType]}
          roomCount={roomCounts[customizationPanel.roomType] || 0}
          baseTier={getRoomTiers(customizationPanel.roomType)[0]}
          tiers={getRoomTiers(customizationPanel.roomType)}
          addOns={getRoomAddOns(customizationPanel.roomType)}
          reductions={getRoomReductions(customizationPanel.roomType)}
          selectedTier={getCurrentRoomConfig()?.selectedTier || getRoomTiers(customizationPanel.roomType)[0].name}
          selectedAddOns={getCurrentRoomConfig()?.selectedAddOns || []}
          selectedReductions={getCurrentRoomConfig()?.selectedReductions || []}
          matrixAddServices={getMatrixServicesForCurrentRoom().add}
          matrixRemoveServices={getMatrixServicesForCurrentRoom().remove}
          selectedMatrixAddServices={getSelectedMatrixServices().addServices}
          selectedMatrixRemoveServices={getSelectedMatrixServices().removeServices}
          frequencyOptions={frequencyOptions}
          selectedFrequency={selectedFrequency}
          onConfigChange={handlePanelConfigChange}
          onMatrixSelectionChange={(selection) => handleMatrixSelectionChange(customizationPanel.roomType, selection)}
          onFrequencyChange={handleFrequencyChange}
        />
      )} */}
    </main>
  )
}
