"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getRoomTiers, getRoomAddOns, getRoomReductions } from "@/lib/room-tiers"
import { getMatrixServices } from "@/lib/matrix-services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Check, X } from "lucide-react"

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

interface RoomCustomizationDrawerProps {
  isOpen: boolean
  onClose: () => void
  roomType: string
  roomName: string
  roomIcon: React.ReactNode
  roomCount: number
  config: RoomConfig
  onConfigChange: (config: RoomConfig) => void
}

export function RoomCustomizationDrawer({
  isOpen,
  onClose,
  roomType,
  roomName,
  roomIcon,
  roomCount,
  config,
  onConfigChange,
}: RoomCustomizationDrawerProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedTier, setSelectedTier] = useState(config.selectedTier)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(config.selectedAddOns)
  const [selectedReductions, setSelectedReductions] = useState<string[]>(config.selectedReductions)
  const [matrixAddServices, setMatrixAddServices] = useState<string[]>([])
  const [matrixRemoveServices, setMatrixRemoveServices] = useState<string[]>([])
  const [localConfig, setLocalConfig] = useState<RoomConfig>(config)

  // Get room tiers, add-ons, and reductions
  const tiers = getRoomTiers(roomType)
  const addOns = getRoomAddOns(roomType)
  const reductions = getRoomReductions(roomType)
  const matrixServices = getMatrixServices(roomType)

  // Get base tier (Essential Clean)
  const baseTier = tiers[0]

  // Calculate prices - memoized to prevent recalculation on every render
  const calculatePrices = useCallback(() => {
    // Base price is always the price of the Essential Clean tier
    const basePrice = baseTier.price

    // Calculate tier upgrade price (difference between selected tier and base tier)
    const selectedTierObj = tiers.find((tier) => tier.name === selectedTier)
    const tierUpgradePrice = selectedTierObj ? selectedTierObj.price - basePrice : 0

    // Calculate add-ons price
    const addOnsPrice = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    // Calculate matrix add services price
    const matrixAddPrice = matrixAddServices.reduce((total, serviceId) => {
      const service = matrixServices.add.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)

    // Calculate reductions price
    const reductionsPrice = selectedReductions.reduce((total, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)

    // Calculate matrix remove services price
    const matrixRemovePrice = matrixRemoveServices.reduce((total, serviceId) => {
      const service = matrixServices.remove.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)

    // Calculate total price
    const totalPrice = basePrice + tierUpgradePrice + addOnsPrice + matrixAddPrice - reductionsPrice - matrixRemovePrice

    return {
      basePrice,
      tierUpgradePrice,
      addOnsPrice: addOnsPrice + matrixAddPrice,
      reductionsPrice: reductionsPrice + matrixRemovePrice,
      totalPrice,
    }
  }, [
    baseTier.price,
    tiers,
    selectedTier,
    selectedAddOns,
    matrixAddServices,
    selectedReductions,
    matrixRemoveServices,
    addOns,
    matrixServices.add,
    reductions,
    matrixServices.remove,
  ])

  // Update local config when selections change
  useEffect(() => {
    const prices = calculatePrices()
    setLocalConfig({
      ...config,
      selectedTier,
      selectedAddOns,
      selectedReductions,
      ...prices,
    })
    // We're only updating local state here, not calling the parent's onConfigChange
    // This prevents the infinite loop
  }, [
    selectedTier,
    selectedAddOns,
    selectedReductions,
    matrixAddServices,
    matrixRemoveServices,
    calculatePrices,
    config,
  ])

  // Reset selections when drawer opens with new config
  useEffect(() => {
    if (isOpen) {
      setSelectedTier(config.selectedTier)
      setSelectedAddOns([...config.selectedAddOns])
      setSelectedReductions([...config.selectedReductions])
      setMatrixAddServices([])
      setMatrixRemoveServices([])
      setActiveTab("basic")
      setLocalConfig(config)
    }
  }, [isOpen, config])

  // Handle tier selection
  const handleTierChange = (tier: string) => {
    setSelectedTier(tier)
  }

  // Handle add-on selection
  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddOns((prev) => [...prev, addOnId])
    } else {
      setSelectedAddOns((prev) => prev.filter((id) => id !== addOnId))
    }
  }

  // Handle reduction selection
  const handleReductionChange = (reductionId: string, checked: boolean) => {
    if (checked) {
      setSelectedReductions((prev) => [...prev, reductionId])
    } else {
      setSelectedReductions((prev) => prev.filter((id) => id !== reductionId))
    }
  }

  // Handle matrix add service selection
  const handleMatrixAddServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      setMatrixAddServices((prev) => [...prev, serviceId])
    } else {
      setMatrixAddServices((prev) => prev.filter((id) => id !== serviceId))
    }
  }

  // Handle matrix remove service selection
  const handleMatrixRemoveServiceChange = (serviceId: string, checked: boolean) => {
    if (checked) {
      setMatrixRemoveServices((prev) => [...prev, serviceId])
    } else {
      setMatrixRemoveServices((prev) => prev.filter((id) => id !== serviceId))
    }
  }

  // Handle apply changes - only call parent's onConfigChange when the user explicitly applies changes
  const handleApplyChanges = () => {
    onConfigChange(localConfig)
    onClose()
  }

  // Generate unique IDs for accessibility
  const drawerTitleId = `drawer-title-${roomType}`
  const drawerDescId = `drawer-desc-${roomType}`

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={drawerTitleId}
      aria-describedby={drawerDescId}
    >
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle id={drawerTitleId} className="flex items-center gap-2 text-xl">
            <span className="text-2xl" aria-hidden="true">
              {roomIcon}
            </span>
            {roomName} Configuration
          </DrawerTitle>
          <DrawerDescription id={drawerDescId}>
            Customize your {roomName.toLowerCase()} cleaning options
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" aria-controls="basic-tab-content">
                Basic
              </TabsTrigger>
              <TabsTrigger value="advanced" aria-controls="advanced-tab-content">
                Advanced
              </TabsTrigger>
              <TabsTrigger value="schedule" aria-controls="schedule-tab-content">
                Schedule
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" id="basic-tab-content" role="tabpanel">
              <ScrollArea className="h-[50vh] pr-4" orientation="vertical" forceScrollable={true}>
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Select Cleaning Tier</h3>
                    <RadioGroup
                      value={selectedTier}
                      onValueChange={handleTierChange}
                      className="space-y-4"
                      aria-label="Cleaning tier options"
                    >
                      {tiers.map((tier) => (
                        <div key={tier.id} className="flex items-start space-x-3">
                          <RadioGroupItem value={tier.name} id={`tier-${tier.id}`} className="mt-1" />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={`tier-${tier.id}`}
                              className="text-base font-medium flex items-center justify-between"
                            >
                              <span>{tier.name}</span>
                              <span>{formatCurrency(tier.price)}</span>
                            </Label>
                            <p className="text-sm text-muted-foreground">{tier.description}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {addOns.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Add-on Services</h3>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div key={addOn.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={`addon-${addOn.id}`}
                              checked={selectedAddOns.includes(addOn.id)}
                              onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked as boolean)}
                              className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={`addon-${addOn.id}`}
                                className="text-base font-medium flex items-center justify-between"
                              >
                                <span>{addOn.name}</span>
                                <span>+{formatCurrency(addOn.price)}</span>
                              </Label>
                              <p className="text-sm text-muted-foreground">{addOn.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reductions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Service Reductions</h3>
                      <div className="space-y-3">
                        {reductions.map((reduction) => (
                          <div key={reduction.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={`reduction-${reduction.id}`}
                              checked={selectedReductions.includes(reduction.id)}
                              onCheckedChange={(checked) => handleReductionChange(reduction.id, checked as boolean)}
                              className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={`reduction-${reduction.id}`}
                                className="text-base font-medium flex items-center justify-between"
                              >
                                <span>No {reduction.name}</span>
                                <span>-{formatCurrency(reduction.discount)}</span>
                              </Label>
                              <p className="text-sm text-muted-foreground">{reduction.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="advanced" id="advanced-tab-content" role="tabpanel">
              <ScrollArea className="h-[50vh] pr-4" orientation="vertical" forceScrollable={true}>
                <div className="space-y-6 py-4">
                  {matrixServices.add.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Additional Services</h3>
                      <div className="space-y-3">
                        {matrixServices.add.map((service) => (
                          <div key={service.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={`matrix-add-${service.id}`}
                              checked={matrixAddServices.includes(service.id)}
                              onCheckedChange={(checked) =>
                                handleMatrixAddServiceChange(service.id, checked as boolean)
                              }
                              className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={`matrix-add-${service.id}`}
                                className="text-base font-medium flex items-center justify-between"
                              >
                                <span>{service.name}</span>
                                <span>+{formatCurrency(service.price)}</span>
                              </Label>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {matrixServices.remove.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">Remove Services</h3>
                      <div className="space-y-3">
                        {matrixServices.remove.map((service) => (
                          <div key={service.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={`matrix-remove-${service.id}`}
                              checked={matrixRemoveServices.includes(service.id)}
                              onCheckedChange={(checked) =>
                                handleMatrixRemoveServiceChange(service.id, checked as boolean)
                              }
                              className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label
                                htmlFor={`matrix-remove-${service.id}`}
                                className="text-base font-medium flex items-center justify-between"
                              >
                                <span>Skip {service.name}</span>
                                <span>-{formatCurrency(service.price)}</span>
                              </Label>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="schedule" id="schedule-tab-content" role="tabpanel">
              <ScrollArea className="h-[50vh] pr-4" orientation="vertical" forceScrollable={true}>
                <div className="space-y-6 py-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scheduling Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Scheduling options will be available in the next update.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="my-4" />

        <div className="px-4 pb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Room Count:</span>
            <span>{roomCount}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Base Price:</span>
            <span>{formatCurrency(localConfig.basePrice)}</span>
          </div>
          {localConfig.tierUpgradePrice > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Tier Upgrade:</span>
              <span>+{formatCurrency(localConfig.tierUpgradePrice)}</span>
            </div>
          )}
          {localConfig.addOnsPrice > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Add-ons:</span>
              <span>+{formatCurrency(localConfig.addOnsPrice)}</span>
            </div>
          )}
          {localConfig.reductionsPrice > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Reductions:</span>
              <span>-{formatCurrency(localConfig.reductionsPrice)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between items-center font-bold">
            <span>Total Per Room:</span>
            <span>{formatCurrency(localConfig.totalPrice)}</span>
          </div>
          <div className="flex justify-between items-center font-bold mt-1">
            <span>Total ({roomCount} rooms):</span>
            <span>{formatCurrency(localConfig.totalPrice * roomCount)}</span>
          </div>
        </div>

        <DrawerFooter className="pt-2">
          <Button onClick={handleApplyChanges} className="w-full">
            <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            Apply Changes
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">
              <X className="mr-2 h-4 w-4" aria-hidden="true" />
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
