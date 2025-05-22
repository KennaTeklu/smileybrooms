"use client"

import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, Check, X } from "lucide-react"

// Define types for room tiers, add-ons, and reductions
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

interface RoomCustomizationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomName: string
  roomIcon: React.ReactNode
  baseTier: RoomTier
  tiers: RoomTier[]
  addOns: RoomAddOn[]
  reductions: RoomReduction[]
  initialConfig: RoomConfiguration
  onSave: (config: RoomConfiguration) => void
}

export function RoomCustomizationDrawer({
  open,
  onOpenChange,
  roomName,
  roomIcon,
  baseTier,
  tiers,
  addOns,
  reductions,
  initialConfig,
  onSave,
}: RoomCustomizationDrawerProps) {
  const [activeTab, setActiveTab] = useState("tiers")
  const [selectedTier, setSelectedTier] = useState(initialConfig.selectedTier)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialConfig.selectedAddOns)
  const [selectedReductions, setSelectedReductions] = useState<string[]>(initialConfig.selectedReductions)
  const [totalPrice, setTotalPrice] = useState(initialConfig.totalPrice)

  // Check if we're on mobile
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Calculate total price whenever selections change
  useEffect(() => {
    let price = 0

    // Add tier price
    const tier = tiers.find((t) => t.name === selectedTier)
    if (tier) {
      price += tier.price
    }

    // Add add-ons
    selectedAddOns.forEach((addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      if (addOn) {
        price += addOn.price
      }
    })

    // Subtract reductions
    selectedReductions.forEach((reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      if (reduction) {
        price -= reduction.discount
      }
    })

    // Ensure price doesn't go below zero
    price = Math.max(0, price)

    setTotalPrice(price)
  }, [selectedTier, selectedAddOns, selectedReductions, tiers, addOns, reductions])

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

  // Handle save
  const handleSave = () => {
    onSave({
      roomName,
      selectedTier,
      selectedAddOns,
      selectedReductions,
      totalPrice,
    })
    onOpenChange(false)
  }

  // Content for both drawer and dialog
  const content = (
    <>
      <div className="space-y-6 overflow-y-auto px-4 pb-20"></div>
    </>
  )

  // Render either a drawer or dialog based on screen size
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{roomIcon}</span>
              <DialogTitle>Customize {roomName}</DialogTitle>
            </div>
            <DialogDescription>Customize your cleaning options for this room</DialogDescription>
          </DialogHeader>

          {/*{content}*/}

          <DialogFooter className="sticky bottom-0 bg-white dark:bg-gray-950 pt-4 border-t mt-4">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="text-sm text-gray-500">Room Total</p>
                <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Apply Changes</Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/30">{roomIcon}</div>
            <DrawerTitle className="text-xl">{roomName} Customization</DrawerTitle>
          </div>
          <div className="text-sm text-gray-500 mt-1">Customize your cleaning options</div>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Tabs defaultValue="tiers" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="tiers">Cleaning Tiers</TabsTrigger>
              <TabsTrigger value="addons">Add-Ons</TabsTrigger>
              <TabsTrigger value="reductions">Reductions</TabsTrigger>
            </TabsList>

            <TabsContent value="tiers" className="space-y-4">
              <RadioGroup value={selectedTier} onValueChange={handleTierChange} className="space-y-4">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`border rounded-lg p-4 ${
                      selectedTier === tier.name ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <Label htmlFor={`tier-${tier.name}`} className="font-medium">
                            {tier.name}
                          </Label>
                          <Badge variant="outline" className="ml-2">
                            ${tier.price.toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                        <div className="mt-2 space-y-1">
                          {tier.features.map((feature, index) => (
                            <div key={index} className="flex items-start text-sm">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>

            <TabsContent value="addons" className="space-y-4">
              {addOns.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No add-ons available for this room</div>
              ) : (
                addOns.map((addOn) => (
                  <div
                    key={addOn.id}
                    className={`border rounded-lg p-4 ${
                      selectedAddOns.includes(addOn.id) ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <Checkbox
                        id={`addon-${addOn.id}`}
                        checked={selectedAddOns.includes(addOn.id)}
                        onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked === true)}
                        className="mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <Label htmlFor={`addon-${addOn.id}`} className="font-medium">
                            {addOn.name}
                          </Label>
                          <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-green-900/20">
                            +${addOn.price.toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{addOn.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="reductions" className="space-y-4">
              {reductions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No reductions available for this room</div>
              ) : (
                reductions.map((reduction) => (
                  <div
                    key={reduction.id}
                    className={`border rounded-lg p-4 ${
                      selectedReductions.includes(reduction.id) ? "border-red-500 bg-red-50 dark:bg-red-900/20" : ""
                    }`}
                  >
                    <div className="flex items-start">
                      <Checkbox
                        id={`reduction-${reduction.id}`}
                        checked={selectedReductions.includes(reduction.id)}
                        onCheckedChange={(checked) => handleReductionChange(reduction.id, checked === true)}
                        className="mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <Label htmlFor={`reduction-${reduction.id}`} className="font-medium">
                            No {reduction.name}
                          </Label>
                          <Badge variant="outline" className="ml-2 bg-red-50 dark:bg-red-900/20">
                            -${reduction.discount.toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{reduction.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="my-4" />

        <div className="px-4 mb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Info className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-gray-500">Selected options will be applied to all {roomName}s</span>
            </div>
            <div className="font-bold text-lg">${totalPrice.toFixed(2)}</div>
          </div>
        </div>

        <DrawerFooter className="pt-2">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
