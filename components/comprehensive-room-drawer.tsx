"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { ServiceMap } from "@/components/service-map"
import { getServiceMap } from "@/lib/service-maps"
import { RoomVisualization } from "@/components/room-visualization"
import { CleaningChecklist } from "@/components/cleaning-checklist"

export interface RoomTier {
  name: string
  description: string
  price: number
  features: string[]
}

export interface RoomAddOn {
  id: string
  name: string
  price: number
  description: string
}

export interface RoomReduction {
  id: string
  name: string
  discount: number
  description: string
}

export interface RoomConfiguration {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  totalPrice: number
}

interface ComprehensiveRoomDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomType: string
  roomName: string
  roomIcon: React.ReactNode
  baseTier: RoomTier
  tiers: RoomTier[]
  addOns: RoomAddOn[]
  reductions: RoomReduction[]
  initialConfig: RoomConfiguration
  onSave: (config: RoomConfiguration) => void
}

export function ComprehensiveRoomDrawer({
  open,
  onOpenChange,
  roomType,
  roomName,
  roomIcon,
  baseTier,
  tiers,
  addOns,
  reductions,
  initialConfig,
  onSave,
}: ComprehensiveRoomDrawerProps) {
  // State for tracking the current configuration
  const [selectedTier, setSelectedTier] = useState(initialConfig.selectedTier || baseTier.name)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialConfig.selectedAddOns || [])
  const [selectedReductions, setSelectedReductions] = useState<string[]>(initialConfig.selectedReductions || [])
  const [totalPrice, setTotalPrice] = useState(initialConfig.totalPrice || baseTier.price)
  const [activeTab, setActiveTab] = useState("cleaning-level")

  // State for expanded service maps
  const [expandedServiceMap, setExpandedServiceMap] = useState<string | null>(null)

  // Check if we're on mobile
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Calculate total price whenever selections change
  useEffect(() => {
    // Get base price from selected tier
    const tierPrice = tiers.find((tier) => tier.name === selectedTier)?.price || baseTier.price

    // Add prices of selected add-ons
    const addOnsPrice = selectedAddOns.reduce((sum, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return sum + (addOn?.price || 0)
    }, 0)

    // Subtract discounts from selected reductions
    const reductionsDiscount = selectedReductions.reduce((sum, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return sum + (reduction?.discount || 0)
    }, 0)

    // Calculate total price
    const calculatedPrice = tierPrice + addOnsPrice - reductionsDiscount

    setTotalPrice(calculatedPrice)
  }, [selectedTier, selectedAddOns, selectedReductions, tiers, addOns, reductions, baseTier.price])

  // Handle tier selection
  const handleTierChange = (value: string) => {
    setSelectedTier(value)
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

  // Toggle service map expansion
  const toggleServiceMap = (tierName: string) => {
    setExpandedServiceMap((prev) => (prev === tierName ? null : tierName))
  }

  // Handle save
  const handleSave = () => {
    onSave({
      roomName: initialConfig.roomName,
      selectedTier,
      selectedAddOns,
      selectedReductions,
      totalPrice,
    })
    onOpenChange(false)
  }

  // Map tier name to service map highlight
  const getTierHighlight = (tierName: string) => {
    if (tierName.toLowerCase().includes("quick")) return "quickClean"
    if (tierName.toLowerCase().includes("deep")) return "deepClean"
    return "premium"
  }

  // Content for both drawer and dialog
  const content = (
    <Tabs defaultValue="cleaning-level" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="cleaning-level">Cleaning Level</TabsTrigger>
        <TabsTrigger value="customize">Customize</TabsTrigger>
        <TabsTrigger value="visualize">Visualize</TabsTrigger>
        <TabsTrigger value="checklist">Checklist</TabsTrigger>
      </TabsList>

      {/* Cleaning Level Tab */}
      <TabsContent value="cleaning-level" className="space-y-4">
        <div className="text-sm text-gray-500 mb-2">Select your preferred cleaning level for {roomName}</div>

        <RadioGroup value={selectedTier} onValueChange={handleTierChange} className="space-y-4">
          {tiers.map((tier) => (
            <div key={tier.name} className="relative">
              <div
                className={cn(
                  "border rounded-lg p-4 transition-all",
                  selectedTier === tier.name
                    ? "border-blue-500 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-800",
                )}
              >
                <div className="flex items-start">
                  <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`tier-${tier.name}`} className="font-medium text-base">
                        {tier.name}
                      </Label>
                      <Badge
                        variant={
                          tier.name.toLowerCase().includes("premium")
                            ? "destructive"
                            : tier.name.toLowerCase().includes("deep")
                              ? "secondary"
                              : "default"
                        }
                      >
                        ${tier.price.toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{tier.description}</p>

                    {/* Service Map Toggle Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs mt-2 px-0 hover:bg-transparent hover:underline"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleServiceMap(tier.name)
                      }}
                    >
                      {expandedServiceMap === tier.name ? (
                        <ChevronUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ChevronDown className="h-3 w-3 mr-1" />
                      )}
                      {expandedServiceMap === tier.name ? "Hide details" : "Show what's included"}
                    </Button>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mt-2 pl-8">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {tier.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="text-xs flex items-start">
                        <Check className="text-green-500 h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Expandable Service Map */}
              {expandedServiceMap === tier.name && (
                <div className="mt-2 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                  <h4 className="text-sm font-medium mb-2">Services Included in {tier.name}</h4>
                  <ServiceMap
                    roomName={roomName}
                    categories={getServiceMap(roomType)}
                    highlightTier={getTierHighlight(tier.name)}
                  />
                </div>
              )}
            </div>
          ))}
        </RadioGroup>
      </TabsContent>

      {/* Customize Tab */}
      <TabsContent value="customize" className="space-y-6">
        {/* Add-ons Section */}
        {addOns.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Add-on Services</h3>
            <div className="space-y-3">
              {addOns.map((addOn) => (
                <div
                  key={addOn.id}
                  className={cn(
                    "border rounded-lg p-3 transition-all",
                    selectedAddOns.includes(addOn.id)
                      ? "border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-800",
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={`addon-${addOn.id}`}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked === true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`addon-${addOn.id}`} className="flex items-center justify-between cursor-pointer">
                        <span className="font-medium">{addOn.name}</span>
                        <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-green-900/20">
                          +${addOn.price.toFixed(2)}
                        </Badge>
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{addOn.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Reductions Section */}
        {reductions.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Skip Services (Save Money)</h3>
            <div className="space-y-3">
              {reductions.map((reduction) => (
                <div
                  key={reduction.id}
                  className={cn(
                    "border rounded-lg p-3 transition-all",
                    selectedReductions.includes(reduction.id)
                      ? "border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                      : "border-gray-200 dark:border-gray-800",
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={`reduction-${reduction.id}`}
                      checked={selectedReductions.includes(reduction.id)}
                      onCheckedChange={(checked) => handleReductionChange(reduction.id, checked === true)}
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
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{reduction.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Special Requirements */}
        <div>
          <h3 className="text-lg font-medium mb-3">Special Requirements</h3>
          <textarea
            className="w-full p-3 border rounded-md h-24 text-sm"
            placeholder={`E.g., Pay special attention to the ceiling fan in the ${roomName.toLowerCase()}, don't move the desk, etc.`}
          />
        </div>
      </TabsContent>

      {/* Visualize Tab */}
      <TabsContent value="visualize">
        <div className="space-y-4">
          <div className="text-sm text-gray-500 mb-2">
            See how your {roomName.toLowerCase()} will look with your selected cleaning level
          </div>
          <RoomVisualization roomType={roomType} selectedTier={selectedTier} selectedAddOns={selectedAddOns} />
        </div>
      </TabsContent>

      {/* Checklist Tab */}
      <TabsContent value="checklist">
        <div className="space-y-4">
          <div className="text-sm text-gray-500 mb-2">
            Detailed checklist of tasks included in your {roomName.toLowerCase()} cleaning
          </div>
          <CleaningChecklist roomType={roomName} selectedTier={selectedTier} />
        </div>
      </TabsContent>
    </Tabs>
  )

  // Price summary for footer
  const priceSummary = (
    <div className="space-y-2 w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price-breakdown" className="border-b-0">
          <AccordionTrigger className="py-2">
            <span className="text-sm font-medium">Price Breakdown</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Base ({baseTier.name}):</span>
                <span>${baseTier.price.toFixed(2)}</span>
              </div>

              {selectedTier !== baseTier.name && (
                <div className="flex justify-between text-blue-600">
                  <span>Upgrade to {selectedTier}:</span>
                  <span>
                    +$
                    {((tiers.find((t) => t.name === selectedTier)?.price || 0) - baseTier.price).toFixed(2)}
                  </span>
                </div>
              )}

              {selectedAddOns.length > 0 && (
                <>
                  <div className="font-medium mt-1">Add-ons:</div>
                  {selectedAddOns.map((addOnId) => {
                    const addOn = addOns.find((a) => a.id === addOnId)
                    return (
                      <div key={addOnId} className="flex justify-between text-green-600 pl-2">
                        <span>{addOn?.name}:</span>
                        <span>+${addOn?.price.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </>
              )}

              {selectedReductions.length > 0 && (
                <>
                  <div className="font-medium mt-1">Reductions:</div>
                  {selectedReductions.map((reductionId) => {
                    const reduction = reductions.find((r) => r.id === reductionId)
                    return (
                      <div key={reductionId} className="flex justify-between text-red-600 pl-2">
                        <span>No {reduction?.name}:</span>
                        <span>-${reduction?.discount.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </>
              )}

              <Separator className="my-1" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-between items-center font-medium">
        <span>{roomName} Total:</span>
        <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  )

  // Render either a drawer or dialog based on screen size
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{roomIcon}</span>
              <DialogTitle className="text-xl">Customize {roomName}</DialogTitle>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 px-1 py-4 max-h-[calc(90vh-12rem)]">{content}</ScrollArea>

          <DialogFooter className="flex justify-between items-center border-t pt-4 mt-4">
            {priceSummary}
            <div className="flex gap-2 ml-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerHeader className="border-b">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{roomIcon}</span>
            <DrawerTitle className="text-xl">Customize {roomName}</DrawerTitle>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4 py-4 max-h-[calc(90vh-12rem)]">{content}</ScrollArea>

        <DrawerFooter className="border-t pt-4">
          {priceSummary}
          <div className="flex gap-2 w-full mt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
