"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle, Contact, CheckCircle2, Settings, ChevronUp } from "lucide-react"
import { RoomConfigurator } from "@/components/room-configurator"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomIcons, roomDisplayNames } from "@/lib/room-tiers"
import { PriceBreakdown } from "@/components/price-breakdown"
import { ServiceMap } from "@/components/service-map"
import { getServiceMap } from "@/lib/service-maps"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SpecialtyServicesPortal } from "@/components/specialty-services-portal"
import { CustomizationMatrix } from "@/components/customization-matrix"
import { getMatrixServices } from "@/lib/matrix-services"
import { ServiceComparisonTable } from "@/components/service-comparison-table"
import { getServiceFeatures } from "@/lib/service-features"
import { BookingTimeline } from "@/components/booking-timeline"
import { ConfigurationManager } from "@/components/configuration-manager"
import { CheckoutPreview } from "@/components/checkout-preview"
import { RoomVisualization } from "@/components/room-visualization"
import { FrequencySelector } from "@/components/frequency-selector"
import { CleaningChecklist } from "@/components/cleaning-checklist"
import { CleaningTimeEstimator } from "@/components/cleaning-time-estimator"
import { CleaningTeamSelector } from "@/components/cleaning-team-selector"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

  // State for bedroom customization
  const [isBedroomCustomizing, setIsBedroomCustomizing] = useState(false)
  const [bedroomTier, setBedroomTier] = useState<string>("")
  const [bedroomAddOns, setBedroomAddOns] = useState<string[]>([])
  const [bedroomReductions, setBedroomReductions] = useState<string[]>([])

  // Core rooms and additional spaces categorization
  const coreRooms = ["bedroom", "bathroom", "kitchen", "livingRoom", "diningRoom", "homeOffice"]
  const additionalSpaces = ["laundryRoom", "entryway", "hallway", "stairs"]

  // Initialize bedroom configuration when count changes from 0 to 1
  useEffect(() => {
    if (roomCounts.bedroom === 1) {
      const bedroomConfig = roomConfigurations.find((config) => config.roomName === "bedroom")
      if (bedroomConfig) {
        setBedroomTier(bedroomConfig.selectedTier)
        setBedroomAddOns(bedroomConfig.selectedAddOns)
        setBedroomReductions(bedroomConfig.selectedReductions)
      } else {
        const tiers = getRoomTiers("bedroom")
        setBedroomTier(tiers[0].name)
        setBedroomAddOns([])
        setBedroomReductions([])
      }
    }
  }, [roomCounts.bedroom, roomConfigurations])

  // Handle room count changes
  const handleRoomCountChange = (roomType: string, increment: boolean) => {
    setRoomCounts((prev) => {
      const newCount = increment ? (prev[roomType] || 0) + 1 : Math.max(0, (prev[roomType] || 0) - 1)
      return { ...prev, [roomType]: newCount }
    })

    // If incrementing and this is a new room, add default configuration
    if (increment && (roomCounts[roomType] || 0) === 0) {
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
    if (!increment && (roomCounts[roomType] || 0) === 1) {
      setRoomConfigurations((prev) => prev.filter((config) => config.roomName !== roomType))

      // If this was the selected room for the service map, select another one
      if (selectedRoomForMap === roomType) {
        const activeRooms = Object.entries(roomCounts)
          .filter(([key, count]) => key !== roomType && count > 0)
          .map(([key]) => key)

        setSelectedRoomForMap(activeRooms.length > 0 ? activeRooms[0] : null)
      }

      // Reset customization state if bedroom is removed
      if (roomType === "bedroom") {
        setIsBedroomCustomizing(false)
      }
    }
  }

  // Handle room configuration changes
  const handleRoomConfigChange = (config: RoomConfig) => {
    setRoomConfigurations((prev) => {
      const index = prev.findIndex((c) => c.roomName === config.roomName)
      if (index >= 0) {
        const newConfigs = [...prev]
        newConfigs[index] = config
        return newConfigs
      }
      return [...prev, config]
    })
  }

  // Handle bedroom configuration save
  const handleBedroomConfigSave = () => {
    // Calculate the total price for bedroom
    const tierPrice = getRoomTiers("bedroom").find((tier) => tier.name === bedroomTier)?.price || 0

    // Add all selected add-ons
    const addOnsTotal = bedroomAddOns.reduce((total, addOnId) => {
      const addOn = getRoomAddOns("bedroom").find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    // Subtract all selected reductions
    const reductionsTotal = bedroomReductions.reduce((total, reductionId) => {
      const reduction = getRoomReductions("bedroom").find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)

    const totalPrice = tierPrice + addOnsTotal - reductionsTotal

    handleRoomConfigChange({
      roomName: "bedroom",
      selectedTier: bedroomTier,
      selectedAddOns: bedroomAddOns,
      selectedReductions: bedroomReductions,
      totalPrice,
    })

    setIsBedroomCustomizing(false)
  }

  // Handle bedroom tier change
  const handleBedroomTierChange = (tier: string) => {
    setBedroomTier(tier)
  }

  // Handle bedroom add-on change
  const handleBedroomAddOnChange = (addOnId: string, checked: boolean) => {
    if (checked) {
      setBedroomAddOns((prev) => [...prev, addOnId])
    } else {
      setBedroomAddOns((prev) => prev.filter((id) => id !== addOnId))
    }
  }

  // Handle bedroom reduction change
  const handleBedroomReductionChange = (reductionId: string, checked: boolean) => {
    if (checked) {
      setBedroomReductions((prev) => [...prev, reductionId])
    } else {
      setBedroomReductions((prev) => prev.filter((id) => id !== reductionId))
    }
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
    return roomConfigurations.reduce((total, config) => {
      const tiers = getRoomTiers(config.roomName)
      return total + tiers[0].price
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

  // Calculate bedroom total price
  const calculateBedroomTotalPrice = () => {
    // Get base price from selected tier
    const tierPrice = getRoomTiers("bedroom").find((tier) => tier.name === bedroomTier)?.price || 0

    // Add all selected add-ons
    const addOnsTotal = bedroomAddOns.reduce((total, addOnId) => {
      const addOn = getRoomAddOns("bedroom").find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    // Subtract all selected reductions
    const reductionsTotal = bedroomReductions.reduce((total, reductionId) => {
      const reduction = getRoomReductions("bedroom").find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)

    return tierPrice + addOnsTotal - reductionsTotal
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
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-2">Pricing Calculator</h1>
      <p className="text-center text-gray-500 mb-10">Customize your cleaning service to fit your needs and budget</p>

      <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="standard">Residential Services</TabsTrigger>
          <TabsTrigger value="detailing">Commercial Services</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-8">
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="text-blue-600">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                CORE ROOMS
              </CardTitle>
              <CardDescription>Select the rooms you want cleaned in your home</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Bedroom Card with Inline Configuration */}
                <div className="col-span-1 md:col-span-3 lg:col-span-6">
                  <Card className={`border ${roomCounts.bedroom > 0 ? "border-blue-500" : "border-gray-200"}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{roomIcons.bedroom}</div>
                          <div>
                            <h3 className="font-medium">{roomDisplayNames.bedroom}</h3>
                            {roomCounts.bedroom > 0 &&
                              roomConfigurations.find((c) => c.roomName === "bedroom")?.selectedTier && (
                                <p className="text-sm text-gray-500">
                                  {roomConfigurations.find((c) => c.roomName === "bedroom")?.selectedTier}
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRoomCountChange("bedroom", false)}
                            disabled={roomCounts.bedroom <= 0}
                            className="h-8 w-8"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="font-medium text-lg">{roomCounts.bedroom || 0}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRoomCountChange("bedroom", true)}
                            className="h-8 w-8"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Customize button */}
                      {roomCounts.bedroom > 0 && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs bg-blue-50 hover:bg-blue-100 border-blue-200"
                            onClick={() => setIsBedroomCustomizing(!isBedroomCustomizing)}
                          >
                            {isBedroomCustomizing ? (
                              <>
                                <ChevronUp className="h-3 w-3 mr-1" />
                                Hide Customization
                              </>
                            ) : (
                              <>
                                <Settings className="h-3 w-3 mr-1" />
                                Customize
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>

                    {/* Inline Bedroom Configuration */}
                    {isBedroomCustomizing && roomCounts.bedroom > 0 && (
                      <div className="border-t">
                        <div className="p-4 bg-gray-50">
                          <div className="mb-4">
                            <h3 className="text-lg font-medium mb-3">Select Cleaning Level</h3>
                            <RadioGroup
                              value={bedroomTier}
                              onValueChange={handleBedroomTierChange}
                              className="space-y-3"
                            >
                              {getRoomTiers("bedroom").map((tier) => (
                                <div
                                  key={tier.name}
                                  className={cn(
                                    "border rounded-lg p-3 transition-all",
                                    bedroomTier === tier.name
                                      ? "border-blue-500 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                                      : "border-gray-200 dark:border-gray-800",
                                  )}
                                >
                                  <div className="flex items-start space-x-3">
                                    <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                                    <div className="flex-1">
                                      <Label
                                        htmlFor={`tier-${tier.name}`}
                                        className="flex items-center justify-between cursor-pointer"
                                      >
                                        <span className="font-medium">{tier.name}</span>
                                        <Badge variant="outline" className="ml-2">
                                          ${tier.price.toFixed(2)}
                                        </Badge>
                                      </Label>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {tier.description}
                                      </p>
                                      <ul className="mt-2 space-y-1">
                                        {tier.features.map((feature, index) => (
                                          <li
                                            key={index}
                                            className="text-xs text-gray-600 dark:text-gray-300 flex items-start"
                                          >
                                            <span className="mr-1 text-green-500">✓</span> {feature}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          <Separator className="my-4" />

                          {/* Add-ons */}
                          {getRoomAddOns("bedroom").length > 0 && (
                            <div className="mb-4">
                              <h3 className="text-lg font-medium mb-3">Add-on Services</h3>
                              <div className="space-y-3">
                                {getRoomAddOns("bedroom").map((addOn) => (
                                  <div
                                    key={addOn.id}
                                    className={cn(
                                      "border rounded-lg p-3 transition-all",
                                      bedroomAddOns.includes(addOn.id)
                                        ? "border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                                        : "border-gray-200 dark:border-gray-800",
                                    )}
                                  >
                                    <div className="flex items-start space-x-3">
                                      <Checkbox
                                        id={`addon-${addOn.id}`}
                                        checked={bedroomAddOns.includes(addOn.id)}
                                        onCheckedChange={(checked) =>
                                          handleBedroomAddOnChange(addOn.id, checked === true)
                                        }
                                        className="mt-1"
                                      />
                                      <div className="flex-1">
                                        <Label
                                          htmlFor={`addon-${addOn.id}`}
                                          className="flex items-center justify-between cursor-pointer"
                                        >
                                          <span className="font-medium">{addOn.name}</span>
                                          <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-green-900/20">
                                            +${addOn.price.toFixed(2)}
                                          </Badge>
                                        </Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                          {addOn.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <Separator className="my-4" />

                          {/* Reductions */}
                          {getRoomReductions("bedroom").length > 0 && (
                            <div className="mb-4">
                              <h3 className="text-lg font-medium mb-3">Skip Services (Save Money)</h3>
                              <div className="space-y-3">
                                {getRoomReductions("bedroom").map((reduction) => (
                                  <div
                                    key={reduction.id}
                                    className={cn(
                                      "border rounded-lg p-3 transition-all",
                                      bedroomReductions.includes(reduction.id)
                                        ? "border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                                        : "border-gray-200 dark:border-gray-800",
                                    )}
                                  >
                                    <div className="flex items-start space-x-3">
                                      <Checkbox
                                        id={`reduction-${reduction.id}`}
                                        checked={bedroomReductions.includes(reduction.id)}
                                        onCheckedChange={(checked) =>
                                          handleBedroomReductionChange(reduction.id, checked === true)
                                        }
                                        className="mt-1"
                                      />
                                      <div className="flex-1">
                                        <Label
                                          htmlFor={`reduction-${reduction.id}`}
                                          className="flex items-center justify-between cursor-pointer"
                                        >
                                          <span className="font-medium">No {reduction.name}</span>
                                          <Badge variant="outline" className="ml-2 bg-red-50 dark:bg-red-900/20">
                                            -${reduction.discount.toFixed(2)}
                                          </Badge>
                                        </Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                          {reduction.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-6">
                            <div>
                              <p className="text-sm text-gray-500">Bedroom Total</p>
                              <p className="text-xl font-bold">${calculateBedroomTotalPrice().toFixed(2)}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => setIsBedroomCustomizing(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleBedroomConfigSave}>Save Changes</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Other Core Rooms */}
                {coreRooms
                  .filter((room) => room !== "bedroom")
                  .map((roomType) => (
                    <Card
                      key={roomType}
                      className={`border ${roomCounts[roomType] > 0 ? "border-blue-500" : "border-gray-200"}`}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="text-3xl mb-2">{roomIcons[roomType]}</div>
                        <h3 className="font-medium mb-2">{roomDisplayNames[roomType]}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRoomCountChange(roomType, false)}
                            disabled={roomCounts[roomType] <= 0}
                            className="h-8 w-8"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="font-medium text-lg">{roomCounts[roomType] || 0}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleRoomCountChange(roomType, true)}
                            className="h-8 w-8"
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="text-gray-600">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                ADDITIONAL SPACES
              </CardTitle>
              <CardDescription>Select any additional areas that need cleaning</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {additionalSpaces.map((roomType) => (
                  <Card
                    key={roomType}
                    className={`border ${roomCounts[roomType] > 0 ? "border-blue-500" : "border-gray-200"}`}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="text-3xl mb-2">{roomIcons[roomType]}</div>
                      <h3 className="font-medium mb-2">{roomDisplayNames[roomType]}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRoomCountChange(roomType, false)}
                          disabled={roomCounts[roomType] <= 0}
                          className="h-8 w-8"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-lg">{roomCounts[roomType] || 0}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRoomCountChange(roomType, true)}
                          className="h-8 w-8"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border border-dashed border-gray-300">
                  <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
                    <div className="text-3xl mb-2">{roomIcons.other}</div>
                    <h3 className="font-medium mb-2">Other Space</h3>
                    <Button variant="outline" className="mt-2 flex items-center gap-1">
                      <Contact className="h-4 w-4" />
                      Request Custom
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {getActiveRoomConfigs().length > 0 && (
            <>
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">ROOM CONFIGURATOR</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowComparisonTable(!showComparisonTable)}>
                      {showComparisonTable ? "Hide" : "Show"} Service Comparison
                    </Button>
                    <Button variant="outline" onClick={() => setShowRoomVisualization(!showRoomVisualization)}>
                      {showRoomVisualization ? "Hide" : "Show"} Room Visualization
                    </Button>
                    <Button variant="outline" onClick={() => setShowCleaningChecklist(!showCleaningChecklist)}>
                      {showCleaningChecklist ? "Hide" : "Show"} Cleaning Checklist
                    </Button>
                  </div>
                </div>

                {showComparisonTable && selectedRoomForMap && (
                  <div className="mb-6">
                    <ServiceComparisonTable
                      roomType={roomDisplayNames[selectedRoomForMap]}
                      features={getServiceFeatures(selectedRoomForMap)}
                    />
                  </div>
                )}

                {showRoomVisualization && selectedRoomForMap && (
                  <div className="mb-6">
                    <RoomVisualization
                      roomType={roomDisplayNames[selectedRoomForMap]}
                      selectedTier={
                        roomConfigurations.find((c) => c.roomName === selectedRoomForMap)?.selectedTier ||
                        "ESSENTIAL CLEAN"
                      }
                      selectedAddOns={roomConfigurations.find((c) => c.roomName === selectedRoomForMap)?.selectedAddOns}
                    />
                  </div>
                )}

                {showCleaningChecklist && selectedRoomForMap && (
                  <div className="mb-6">
                    <CleaningChecklist
                      roomType={roomDisplayNames[selectedRoomForMap]}
                      selectedTier={
                        roomConfigurations.find((c) => c.roomName === selectedRoomForMap)?.selectedTier ||
                        "ESSENTIAL CLEAN"
                      }
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {getActiveRoomConfigs()
                      .filter((roomType) => roomType !== "bedroom")
                      .map((roomType) => (
                        <div key={roomType}>
                          <RoomConfigurator
                            roomName={roomDisplayNames[roomType]}
                            roomIcon={roomIcons[roomType]}
                            baseTier={getRoomTiers(roomType)[0]}
                            tiers={getRoomTiers(roomType)}
                            addOns={getRoomAddOns(roomType)}
                            reductions={getRoomReductions(roomType)}
                            onConfigChange={(config) => handleRoomConfigChange({ ...config, roomName: roomType })}
                            initialConfig={roomConfigurations.find((c) => c.roomName === roomType)}
                          />

                          {/* Add Customization Matrix for each room */}
                          <CustomizationMatrix
                            roomName={roomDisplayNames[roomType]}
                            selectedTier={
                              roomConfigurations.find((c) => c.roomName === roomType)?.selectedTier || "ESSENTIAL CLEAN"
                            }
                            addServices={getMatrixServices(roomType).add}
                            removeServices={getMatrixServices(roomType).remove}
                            onSelectionChange={(selection) => handleMatrixSelectionChange(roomType, selection)}
                            initialSelection={matrixSelections[roomType]}
                          />
                        </div>
                      ))}
                  </div>

                  <div className="space-y-6">
                    <FrequencySelector
                      onFrequencyChange={handleFrequencyChange}
                      selectedFrequency={selectedFrequency}
                    />

                    <PriceBreakdown
                      basePrice={calculateBasePrice()}
                      tierUpgrades={calculateTierUpgrades()}
                      addOns={calculateAddOns()}
                      reductions={calculateReductions()}
                      serviceFee={serviceFee}
                      frequencyDiscount={frequencyDiscount}
                      totalPrice={calculateTotalPrice()}
                    />

                    <CleaningTimeEstimator
                      roomCounts={roomCounts}
                      selectedTiers={getSelectedTiers()}
                      totalAddOns={calculateAddOns().length}
                    />

                    <Card>
                      <CardHeader className="bg-blue-50">
                        <CardTitle className="flex items-center justify-between">
                          <span>Service Summary</span>
                          <Button onClick={() => setShowCheckoutPreview(true)}>Book Now</Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Total Rooms:</span>
                            <span>{Object.values(roomCounts).reduce((sum, count) => sum + count, 0)}</span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Estimated Duration:</span>
                            <span>
                              {Math.max(
                                2,
                                Math.ceil(Object.values(roomCounts).reduce((sum, count) => sum + count, 0) * 0.75),
                              )}{" "}
                              hours
                            </span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Next Available:</span>
                            <span>Tomorrow, 9:00 AM</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">VISUAL SERVICE MAP</h2>

                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {getActiveRoomConfigs().map((roomType) => (
                        <Button
                          key={roomType}
                          variant={selectedRoomForMap === roomType ? "default" : "outline"}
                          onClick={() => setSelectedRoomForMap(roomType)}
                          className="flex items-center gap-1"
                        >
                          <span>{roomIcons[roomType]}</span>
                          <span>{roomDisplayNames[roomType]}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedRoomForMap && (
                  <ServiceMap
                    roomName={roomDisplayNames[selectedRoomForMap]}
                    categories={getServiceMap(selectedRoomForMap)}
                  />
                )}
              </div>

              {showCheckoutPreview && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">BOOKING DETAILS</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <BookingTimeline
                      onDateSelected={setSelectedDate}
                      onTimeSelected={setSelectedTime}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                    />

                    <CheckoutPreview
                      totalPrice={calculateTotalPrice()}
                      serviceSummary={getServiceSummary()}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                    />
                  </div>

                  <CleaningTeamSelector onTeamSelect={setSelectedTeam} selectedTeam={selectedTeam} />
                </div>
              )}
            </>
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">SPECIALTY SERVICES</h2>
            <SpecialtyServicesPortal />
          </div>

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
