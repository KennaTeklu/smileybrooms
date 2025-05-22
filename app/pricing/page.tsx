"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Contact, Home, Building2, Settings } from "lucide-react"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomIcons, roomDisplayNames } from "@/lib/room-tiers"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getMatrixServices } from "@/lib/matrix-services"
import { ConfigurationManager } from "@/components/configuration-manager"
import { FrequencySelector } from "@/components/frequency-selector"
import { CleaningTimeEstimator } from "@/components/cleaning-time-estimator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RoomCategory } from "@/components/room-category"
import { RequestQuoteButton } from "@/components/request-quote-button"
import { ServiceSummaryCard } from "@/components/service-summary-card"

interface RoomCount {
  [key: string]: number
}

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  totalPrice: number
}

export default function PricingPage() {
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
      const newConfig: RoomConfig = {
        roomName: roomType,
        selectedTier: tiers[0].name,
        selectedAddOns: [],
        selectedReductions: [],
        totalPrice: tiers[0].price,
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
        const selectedTier = tiers.find((tier) => tier.name === room.tier)

        if (selectedTier) {
          newRoomConfigs.push({
            roomName: roomType,
            selectedTier: selectedTier.name,
            selectedAddOns: [],
            selectedReductions: [],
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

  // Calculate base price (sum of all Quick Clean prices)
  const calculateBasePrice = () => {
    return Object.entries(roomCounts).reduce((total, [roomType, count]) => {
      if (count > 0) {
        const config = getRoomConfig(roomType)
        return total + config.totalPrice * count
      }
      return total
    }, 0)
  }

  // Calculate tier upgrades
  const calculateTierUpgrades = () => {
    return roomConfigurations
      .filter((config) => config.selectedTier !== "ESSENTIAL CLEAN")
      .map((config) => {
        const tiers = getRoomTiers(config.roomName)
        const baseTier = tiers[0]
        const selectedTier = tiers.find((tier) => tier.name === config.selectedTier)

        return {
          roomName: roomDisplayNames[config.roomName] || config.roomName,
          tierName: config.selectedTier,
          price: (selectedTier?.price || 0) - baseTier.price,
        }
      })
  }

  // Calculate add-ons
  const calculateAddOns = () => {
    const configAddOns = roomConfigurations.flatMap((config) => {
      const addOns = getRoomAddOns(config.roomName)
      return config.selectedAddOns.map((addOnId) => {
        const addOn = addOns.find((a) => a.id === addOnId)
        return {
          roomName: roomDisplayNames[config.roomName] || config.roomName,
          name: addOn?.name || "Unknown Add-on",
          price: addOn?.price || 0,
        }
      })
    })

    // Add matrix add-ons
    const matrixAddOns = Object.entries(matrixSelections).flatMap(([roomType, selection]) => {
      const { add } = getMatrixServices(roomType)
      return selection.addServices.map((serviceId) => {
        const service = add.find((s) => s.id === serviceId)
        return {
          roomName: roomDisplayNames[roomType] || roomType,
          name: service?.name || "Unknown Service",
          price: service?.price || 0,
        }
      })
    })

    return [...configAddOns, ...matrixAddOns]
  }

  // Calculate reductions
  const calculateReductions = () => {
    const configReductions = roomConfigurations.flatMap((config) => {
      const reductions = getRoomReductions(config.roomName)
      return config.selectedReductions.map((reductionId) => {
        const reduction = reductions.find((r) => r.id === reductionId)
        return {
          roomName: roomDisplayNames[config.roomName] || config.roomName,
          name: reduction?.name || "Unknown Reduction",
          discount: reduction?.discount || 0,
        }
      })
    })

    // Add matrix reductions
    const matrixReductions = Object.entries(matrixSelections).flatMap(([roomType, selection]) => {
      const { remove } = getMatrixServices(roomType)
      return selection.removeServices.map((serviceId) => {
        const service = remove.find((s) => s.id === serviceId)
        return {
          roomName: roomDisplayNames[roomType] || roomType,
          name: service?.name || "Unknown Service",
          discount: service?.price || 0,
        }
      })
    })

    return [...configReductions, ...matrixReductions]
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = calculateBasePrice()
    const tierUpgradesTotal = calculateTierUpgrades().reduce((sum, item) => sum + item.price, 0)
    const addOnsTotal = calculateAddOns().reduce((sum, item) => sum + item.price, 0)
    const reductionsTotal = calculateReductions().reduce((sum, item) => sum + item.discount, 0)

    // Calculate subtotal before frequency discount
    const subtotal = basePrice + tierUpgradesTotal + addOnsTotal - reductionsTotal + serviceFee

    // Apply frequency discount
    const discountAmount = subtotal * (frequencyDiscount / 100)

    return subtotal - discountAmount
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
      addOns: calculateAddOns(),
      reductions: calculateReductions(),
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

  return (
    <div className="container mx-auto py-10 px-4 mt-16">
      <h1 className="text-4xl font-bold text-center mb-2">Pricing Calculator</h1>
      <p className="text-center text-gray-500 mb-10">Customize your cleaning service to fit your needs and budget</p>

      <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Residential Services</span>
          </TabsTrigger>
          <TabsTrigger value="detailing" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>Commercial Services</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-8">
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
                  <Contact className="h-5 w-5" />
                </span>
                CUSTOM SPACES
              </CardTitle>
              <CardDescription>Need something not listed above? Request a custom space</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="text-4xl mb-4">{roomIcons.other}</div>
                <h3 className="font-medium text-xl mb-2">Other Space</h3>
                <p className="text-gray-500 mb-4 text-center max-w-md">
                  Have a unique space that needs cleaning? Contact us for a custom quote.
                </p>
                {/* Replace the regular button with our RequestQuoteButton component */}
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
                        <ScrollArea className="h-[400px] pr-4">
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
                                      <span className="text-xl">{roomIcons[roomType]}</span>
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {roomDisplayNames[roomType]} ({roomCounts[roomType]})
                                      </p>
                                      <p className="text-sm text-gray-500">{config.selectedTier}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">${config.totalPrice.toFixed(2)}</p>
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
                                    >
                                      <Settings className="h-3 w-3" />
                                      Edit
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
                      basePrice={calculateBasePrice()}
                      tierUpgrades={calculateTierUpgrades()}
                      addOns={calculateAddOns()}
                      reductions={calculateReductions()}
                      serviceFee={serviceFee}
                      frequencyDiscount={frequencyDiscount}
                      totalPrice={calculateTotalPrice()}
                      onBookNow={() => setShowCheckoutPreview(true)}
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
                        totalAddOns={calculateAddOns().length}
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
                          totalPrice: calculateTotalPrice(),
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

        <TabsContent value="detailing">
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
    </div>
  )
}
