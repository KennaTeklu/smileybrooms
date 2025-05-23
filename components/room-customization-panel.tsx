"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Drawer } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ChevronRight, Check, Info, ArrowUp, ArrowDown } from "lucide-react"

interface RoomCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  roomName: string
  roomIcon: React.ReactNode
  roomCount: number
  baseTier: {
    name: string
    price: number
    description: string
  }
  tiers: {
    name: string
    price: number
    description: string
    features: string[]
  }[]
  addOns: {
    id: string
    name: string
    price: number
    description: string
  }[]
  reductions: {
    id: string
    name: string
    discount: number
    description: string
  }[]
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  matrixAddServices: {
    id: string
    name: string
    price: number
    description: string
  }[]
  matrixRemoveServices: {
    id: string
    name: string
    price: number
    description: string
  }[]
  selectedMatrixAddServices: string[]
  selectedMatrixRemoveServices: string[]
  frequencyOptions: {
    id: string
    name: string
    discount: number
  }[]
  selectedFrequency: string
  onConfigChange: (config: {
    selectedTier: string
    selectedAddOns: string[]
    selectedReductions: string[]
    totalPrice: number
  }) => void
  onMatrixSelectionChange: (selection: { addServices: string[]; removeServices: string[] }) => void
  onFrequencyChange: (frequency: string, discount: number) => void
}

export function RoomCustomizationPanel({
  isOpen,
  onClose,
  roomName,
  roomIcon,
  roomCount,
  baseTier,
  tiers,
  addOns,
  reductions,
  selectedTier,
  selectedAddOns,
  selectedReductions,
  matrixAddServices,
  matrixRemoveServices,
  selectedMatrixAddServices,
  selectedMatrixRemoveServices,
  frequencyOptions,
  selectedFrequency,
  onConfigChange,
  onMatrixSelectionChange,
  onFrequencyChange,
}: RoomCustomizationPanelProps) {
  // Local state for tracking changes
  const [localSelectedTier, setLocalSelectedTier] = useState(selectedTier)
  const [localSelectedAddOns, setLocalSelectedAddOns] = useState<string[]>(selectedAddOns)
  const [localSelectedReductions, setLocalSelectedReductions] = useState<string[]>(selectedReductions)
  const [localMatrixAddServices, setLocalMatrixAddServices] = useState<string[]>(selectedMatrixAddServices)
  const [localMatrixRemoveServices, setLocalMatrixRemoveServices] = useState<string[]>(selectedMatrixRemoveServices)
  const [localSelectedFrequency, setLocalSelectedFrequency] = useState(selectedFrequency)
  const [activeTab, setActiveTab] = useState("tiers")

  // Tab scroll positions
  const [tabScrollPositions, setTabScrollPositions] = useState<Record<string, number>>({
    tiers: 0,
    addons: 0,
    reductions: 0,
    matrix: 0,
  })

  // Update local state when props change
  useEffect(() => {
    setLocalSelectedTier(selectedTier)
    setLocalSelectedAddOns(selectedAddOns)
    setLocalSelectedReductions(selectedReductions)
    setLocalMatrixAddServices(selectedMatrixAddServices)
    setLocalMatrixRemoveServices(selectedMatrixRemoveServices)
    setLocalSelectedFrequency(selectedFrequency)
  }, [
    selectedTier,
    selectedAddOns,
    selectedReductions,
    selectedMatrixAddServices,
    selectedMatrixRemoveServices,
    selectedFrequency,
  ])

  // Calculate total price
  const calculateTotalPrice = () => {
    // Get base tier price
    const selectedTierObj = tiers.find((tier) => tier.name === localSelectedTier)
    let total = selectedTierObj?.price || baseTier.price

    // Add add-ons
    localSelectedAddOns.forEach((addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      if (addOn) {
        total += addOn.price
      }
    })

    // Add matrix add services
    localMatrixAddServices.forEach((serviceId) => {
      const service = matrixAddServices.find((s) => s.id === serviceId)
      if (service) {
        total += service.price
      }
    })

    // Subtract reductions
    localSelectedReductions.forEach((reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      if (reduction) {
        total -= reduction.discount
      }
    })

    // Subtract matrix remove services
    localMatrixRemoveServices.forEach((serviceId) => {
      const service = matrixRemoveServices.find((s) => s.id === serviceId)
      if (service) {
        total -= service.price
      }
    })

    return total
  }

  // Handle tier selection
  const handleTierSelect = (tierName: string) => {
    setLocalSelectedTier(tierName)
    onConfigChange({
      selectedTier: tierName,
      selectedAddOns: localSelectedAddOns,
      selectedReductions: localSelectedReductions,
      totalPrice: calculateTotalPrice(),
    })
  }

  // Handle add-on toggle
  const handleAddOnToggle = (addOnId: string) => {
    setLocalSelectedAddOns((prev) => {
      const newAddOns = prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]

      // Update parent component
      onConfigChange({
        selectedTier: localSelectedTier,
        selectedAddOns: newAddOns,
        selectedReductions: localSelectedReductions,
        totalPrice: calculateTotalPrice(),
      })

      return newAddOns
    })
  }

  // Handle reduction toggle
  const handleReductionToggle = (reductionId: string) => {
    setLocalSelectedReductions((prev) => {
      const newReductions = prev.includes(reductionId)
        ? prev.filter((id) => id !== reductionId)
        : [...prev, reductionId]

      // Update parent component
      onConfigChange({
        selectedTier: localSelectedTier,
        selectedAddOns: localSelectedAddOns,
        selectedReductions: newReductions,
        totalPrice: calculateTotalPrice(),
      })

      return newReductions
    })
  }

  // Handle matrix service toggle
  const handleMatrixAddServiceToggle = (serviceId: string) => {
    setLocalMatrixAddServices((prev) => {
      const newServices = prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]

      // Update parent component
      onMatrixSelectionChange({
        addServices: newServices,
        removeServices: localMatrixRemoveServices,
      })

      return newServices
    })
  }

  // Handle matrix service removal toggle
  const handleMatrixRemoveServiceToggle = (serviceId: string) => {
    setLocalMatrixRemoveServices((prev) => {
      const newServices = prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]

      // Update parent component
      onMatrixSelectionChange({
        addServices: localMatrixAddServices,
        removeServices: newServices,
      })

      return newServices
    })
  }

  // Handle frequency change
  const handleFrequencyChange = (frequencyId: string) => {
    setLocalSelectedFrequency(frequencyId)
    const frequencyOption = frequencyOptions.find((option) => option.id === frequencyId)
    if (frequencyOption) {
      onFrequencyChange(frequencyId, frequencyOption.discount)
    }
  }

  // Handle tab change with scroll position memory
  const handleTabChange = (value: string) => {
    // Save current scroll position
    const currentTab = activeTab
    const scrollContainer = document.querySelector(
      `[data-tab-content="${currentTab}"] .scrollable-container`,
    ) as HTMLElement

    if (scrollContainer) {
      setTabScrollPositions((prev) => ({
        ...prev,
        [currentTab]: scrollContainer.scrollTop,
      }))
    }

    // Change tab
    setActiveTab(value)

    // Restore scroll position after tab change
    setTimeout(() => {
      const newScrollContainer = document.querySelector(
        `[data-tab-content="${value}"] .scrollable-container`,
      ) as HTMLElement
      if (newScrollContainer && tabScrollPositions[value]) {
        newScrollContainer.scrollTop = tabScrollPositions[value]
      }
    }, 0)
  }

  // Handle scroll to top
  const handleScrollToTop = () => {
    const scrollContainer = document.querySelector(
      `[data-tab-content="${activeTab}"] .scrollable-container`,
    ) as HTMLElement
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Handle scroll to bottom
  const handleScrollToBottom = () => {
    const scrollContainer = document.querySelector(
      `[data-tab-content="${activeTab}"] .scrollable-container`,
    ) as HTMLElement
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" })
    }
  }

  // Track scroll position for current tab
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    setTabScrollPositions((prev) => ({
      ...prev,
      [activeTab]: target.scrollTop,
    }))
  }

  return (
    <Drawer open={isOpen} onClose={onClose} side="right" size="lg" hideCloseButton={true} className="overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-950 border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <ChevronRight className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{roomIcon}</span>
            <div>
              <h2 className="text-lg font-semibold">{roomName}</h2>
              <p className="text-sm text-gray-500">Customize your cleaning options</p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="px-2 py-1">
          {roomCount} {roomCount === 1 ? "Room" : "Rooms"}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="sticky top-[73px] z-10 bg-white dark:bg-gray-950 border-b">
        <TabsList className="w-full justify-start p-0 h-auto bg-transparent">
          <TabsTrigger
            value="tiers"
            onClick={() => handleTabChange("tiers")}
            className={`px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary ${
              activeTab === "tiers" ? "border-b-2 border-primary" : ""
            }`}
          >
            Tiers
          </TabsTrigger>
          <TabsTrigger
            value="addons"
            onClick={() => handleTabChange("addons")}
            className={`px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary ${
              activeTab === "addons" ? "border-b-2 border-primary" : ""
            }`}
          >
            Add-ons
          </TabsTrigger>
          <TabsTrigger
            value="reductions"
            onClick={() => handleTabChange("reductions")}
            className={`px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary ${
              activeTab === "reductions" ? "border-b-2 border-primary" : ""
            }`}
          >
            Reductions
          </TabsTrigger>
          <TabsTrigger
            value="matrix"
            onClick={() => handleTabChange("matrix")}
            className={`px-4 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary ${
              activeTab === "matrix" ? "border-b-2 border-primary" : ""
            }`}
          >
            Matrix
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Tab Content */}
      <div className="flex-1 relative">
        {/* Tiers Tab */}
        {activeTab === "tiers" && (
          <div data-tab-content="tiers" className="h-full">
            <ScrollArea className="h-[calc(100vh-200px)]" onScroll={handleScroll} isolate={true}>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Select Cleaning Tier</h3>
                  <p className="text-sm text-gray-500">Choose the level of cleaning service you need for this room</p>
                </div>

                <div className="space-y-4">
                  {tiers.map((tier) => (
                    <div
                      key={tier.name}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        localSelectedTier === tier.name ? "border-primary bg-primary/5" : "hover:border-gray-400"
                      }`}
                      onClick={() => handleTierSelect(tier.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{tier.name}</h4>
                          {tier.name === "PREMIUM" && (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">RECOMMENDED</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${tier.price.toFixed(2)}</span>
                          {localSelectedTier === tier.name && <Check className="h-5 w-5 text-primary" />}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tier.description}</p>
                      <div className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Frequency Options</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {frequencyOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          localSelectedFrequency === option.id ? "border-primary bg-primary/5" : "hover:border-gray-400"
                        }`}
                        onClick={() => handleFrequencyChange(option.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{option.name}</span>
                          {option.discount > 0 && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {option.discount}% OFF
                            </Badge>
                          )}
                        </div>
                        {option.id === "weekly" && (
                          <p className="text-xs text-gray-500">Best value for regular cleaning</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Add-ons Tab */}
        {activeTab === "addons" && (
          <div data-tab-content="addons" className="h-full">
            <ScrollArea className="h-[calc(100vh-200px)]" onScroll={handleScroll} isolate={true}>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Services</h3>
                  <p className="text-sm text-gray-500">
                    Enhance your cleaning experience with these additional services
                  </p>
                </div>

                <div className="space-y-4">
                  {addOns.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <p className="text-gray-500">No add-ons available for this room type</p>
                    </div>
                  ) : (
                    addOns.map((addOn) => (
                      <div
                        key={addOn.id}
                        className={`border rounded-lg p-4 transition-all ${
                          localSelectedAddOns.includes(addOn.id)
                            ? "border-primary bg-primary/5"
                            : "hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{addOn.name}</h4>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">+${addOn.price.toFixed(2)}</span>
                            <Switch
                              checked={localSelectedAddOns.includes(addOn.id)}
                              onCheckedChange={() => handleAddOnToggle(addOn.id)}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{addOn.description}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Popular Combinations</h3>
                  <div className="space-y-3">
                    {roomName === "Bathroom" && (
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => {
                          // Select deep clean tier and specific add-ons
                          setLocalSelectedTier("DEEP CLEAN")
                          const deepCleanAddOns = addOns
                            .filter((a) => ["shower-scrub", "grout-cleaning"].includes(a.id))
                            .map((a) => a.id)
                          setLocalSelectedAddOns(deepCleanAddOns)

                          // Update parent component
                          onConfigChange({
                            selectedTier: "DEEP CLEAN",
                            selectedAddOns: deepCleanAddOns,
                            selectedReductions: localSelectedReductions,
                            totalPrice: calculateTotalPrice(),
                          })
                        }}
                      >
                        <span>Bathroom Deep Clean Bundle</span>
                        <Badge variant="outline" className="ml-2">
                          SAVE 15%
                        </Badge>
                      </Button>
                    )}

                    {roomName === "Kitchen" && (
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => {
                          // Select premium tier and specific add-ons
                          setLocalSelectedTier("PREMIUM")
                          const kitchenAddOns = addOns
                            .filter((a) => ["appliance-cleaning", "cabinet-organization"].includes(a.id))
                            .map((a) => a.id)
                          setLocalSelectedAddOns(kitchenAddOns)

                          // Update parent component
                          onConfigChange({
                            selectedTier: "PREMIUM",
                            selectedAddOns: kitchenAddOns,
                            selectedReductions: localSelectedReductions,
                            totalPrice: calculateTotalPrice(),
                          })
                        }}
                      >
                        <span>Kitchen Premium Bundle</span>
                        <Badge variant="outline" className="ml-2">
                          SAVE 20%
                        </Badge>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Reductions Tab */}
        {activeTab === "reductions" && (
          <div data-tab-content="reductions" className="h-full">
            <ScrollArea className="h-[calc(100vh-200px)]" onScroll={handleScroll} isolate={true}>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Service Reductions</h3>
                  <p className="text-sm text-gray-500">Customize your service by removing tasks you don't need</p>
                  <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-md">
                    <Info className="h-4 w-4 shrink-0" />
                    <p className="text-xs">
                      Removing services will reduce the price, but may affect the overall quality of cleaning
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {reductions.length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <p className="text-gray-500">No reductions available for this room type</p>
                    </div>
                  ) : (
                    reductions.map((reduction) => (
                      <div
                        key={reduction.id}
                        className={`border rounded-lg p-4 transition-all ${
                          localSelectedReductions.includes(reduction.id)
                            ? "border-primary bg-primary/5"
                            : "hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{reduction.name}</h4>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-red-500">-${reduction.discount.toFixed(2)}</span>
                            <Switch
                              checked={localSelectedReductions.includes(reduction.id)}
                              onCheckedChange={() => handleReductionToggle(reduction.id)}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{reduction.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Matrix Tab */}
        {activeTab === "matrix" && (
          <div data-tab-content="matrix" className="h-full">
            <ScrollArea className="h-[calc(100vh-200px)]" onScroll={handleScroll} isolate={true}>
              <div className="p-6 space-y-8">
                {/* Add Services */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Additional Services</h3>
                    <p className="text-sm text-gray-500">Fine-tune your cleaning with these specialized services</p>
                  </div>

                  <div className="space-y-3">
                    {matrixAddServices.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-lg">
                        <p className="text-gray-500">No additional matrix services available</p>
                      </div>
                    ) : (
                      matrixAddServices.map((service) => (
                        <div
                          key={service.id}
                          className={`border rounded-lg p-4 transition-all ${
                            localMatrixAddServices.includes(service.id)
                              ? "border-primary bg-primary/5"
                              : "hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{service.name}</h4>
                            <div className="flex items-center gap-3">
                              <span className="font-bold">+${service.price.toFixed(2)}</span>
                              <Switch
                                checked={localMatrixAddServices.includes(service.id)}
                                onCheckedChange={() => handleMatrixAddServiceToggle(service.id)}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Separator />

                {/* Remove Services */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Remove Services</h3>
                    <p className="text-sm text-gray-500">Exclude specific services to customize your cleaning</p>
                  </div>

                  <div className="space-y-3">
                    {matrixRemoveServices.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-lg">
                        <p className="text-gray-500">No removable matrix services available</p>
                      </div>
                    ) : (
                      matrixRemoveServices.map((service) => (
                        <div
                          key={service.id}
                          className={`border rounded-lg p-4 transition-all ${
                            localMatrixRemoveServices.includes(service.id)
                              ? "border-primary bg-primary/5"
                              : "hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{service.name}</h4>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-red-500">-${service.price.toFixed(2)}</span>
                              <Switch
                                checked={localMatrixRemoveServices.includes(service.id)}
                                onCheckedChange={() => handleMatrixRemoveServiceToggle(service.id)}
                              />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Scroll indicators */}
        <div className="absolute bottom-20 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white dark:bg-gray-800 shadow-md"
            onClick={handleScrollToTop}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white dark:bg-gray-800 shadow-md"
            onClick={handleScrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 z-20 bg-white dark:bg-gray-950 border-t p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total Price</p>
          <p className="text-xl font-bold">${calculateTotalPrice().toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Apply Changes</Button>
        </div>
      </div>
    </Drawer>
  )
}
