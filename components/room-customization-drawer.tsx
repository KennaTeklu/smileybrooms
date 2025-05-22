"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
  description?: string
}

export interface RoomReduction {
  id: string
  name: string
  discount: number
  description?: string
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
  // State for tracking the current configuration
  const [selectedTier, setSelectedTier] = useState<string>(initialConfig.selectedTier || baseTier.name)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(initialConfig.selectedAddOns || [])
  const [selectedReductions, setSelectedReductions] = useState<string[]>(initialConfig.selectedReductions || [])

  // Check if we're on mobile
  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Calculate the total price based on selections
  const calculateTotalPrice = () => {
    // Get base tier price
    const tierPrice = tiers.find((tier) => tier.name === selectedTier)?.price || baseTier.price

    // Add all selected add-ons
    const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find((a) => a.id === addOnId)
      return total + (addOn?.price || 0)
    }, 0)

    // Subtract all selected reductions
    const reductionsTotal = selectedReductions.reduce((total, reductionId) => {
      const reduction = reductions.find((r) => r.id === reductionId)
      return total + (reduction?.discount || 0)
    }, 0)

    return tierPrice + addOnsTotal - reductionsTotal
  }

  // Handle tier selection
  const handleTierChange = (tier: string) => {
    setSelectedTier(tier)
  }

  // Handle add-on selection
  const handleAddOnChange = (addOnId: string, checked: boolean) => {
    setSelectedAddOns((prev) => {
      if (checked) {
        return [...prev, addOnId]
      } else {
        return prev.filter((id) => id !== addOnId)
      }
    })
  }

  // Handle reduction selection
  const handleReductionChange = (reductionId: string, checked: boolean) => {
    setSelectedReductions((prev) => {
      if (checked) {
        return [...prev, reductionId]
      } else {
        return prev.filter((id) => id !== reductionId)
      }
    })
  }

  // Handle save button click
  const handleSave = () => {
    onSave({
      roomName,
      selectedTier,
      selectedAddOns,
      selectedReductions,
      totalPrice: calculateTotalPrice(),
    })
    onOpenChange(false)
  }

  // Content for both drawer and dialog
  const content = (
    <>
      <div className="space-y-6 overflow-y-auto px-4 pb-20">
        <Accordion type="single" collapsible defaultValue="tier" className="w-full">
          <AccordionItem value="tier" className="border rounded-lg overflow-hidden mb-4">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-center">
                <span className="text-lg font-medium">Cleaning Level</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <RadioGroup value={selectedTier} onValueChange={handleTierChange} className="space-y-4">
                {tiers.map((tier, index) => (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-lg border ${
                      selectedTier === tier.name ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start">
                      <RadioGroupItem value={tier.name} id={`tier-${tier.name}`} className="mt-1" />
                      <div className="ml-3 w-full">
                        <div className="flex justify-between items-center">
                          <Label htmlFor={`tier-${tier.name}`} className="font-medium text-base">
                            {tier.name}
                          </Label>
                          <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "destructive"}>
                            ${tier.price.toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                        <ul className="mt-2 space-y-1">
                          {tier.features.map((feature, i) => (
                            <li key={i} className="text-sm flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="addons" className="border rounded-lg overflow-hidden mb-4">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center">
                <span className="text-lg font-medium text-green-700">Add Services</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="space-y-3 border-l-4 border-green-200 pl-4">
                {addOns.map((addOn) => (
                  <div key={addOn.id} className="flex items-start">
                    <Checkbox
                      id={`addon-${addOn.id}`}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={(checked) => handleAddOnChange(addOn.id, checked === true)}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <Label htmlFor={`addon-${addOn.id}`} className="flex items-center">
                        {addOn.name}
                        <Badge variant="outline" className="ml-2">
                          +${addOn.price.toFixed(2)}
                        </Badge>
                      </Label>
                      {addOn.description && <p className="text-sm text-gray-500 mt-1">{addOn.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reductions" className="border rounded-lg overflow-hidden mb-4">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-red-50 dark:bg-red-900/20">
              <div className="flex items-center">
                <span className="text-lg font-medium text-red-700">Remove Services</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="space-y-3 border-l-4 border-red-200 pl-4">
                {reductions.map((reduction) => (
                  <div key={reduction.id} className="flex items-start">
                    <Checkbox
                      id={`reduction-${reduction.id}`}
                      checked={selectedReductions.includes(reduction.id)}
                      onCheckedChange={(checked) => handleReductionChange(reduction.id, checked === true)}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <Label htmlFor={`reduction-${reduction.id}`} className="flex items-center">
                        {reduction.name}
                        <Badge variant="outline" className="ml-2 text-red-500">
                          -${reduction.discount.toFixed(2)}
                        </Badge>
                      </Label>
                      {reduction.description && <p className="text-sm text-gray-500 mt-1">{reduction.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="special" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-purple-50 dark:bg-purple-900/20">
              <div className="flex items-center">
                <span className="text-lg font-medium text-purple-700">Special Requirements</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Have special requirements for this room? Add them here and our team will take them into account.
                </p>
                <textarea
                  className="w-full p-3 border rounded-md h-24"
                  placeholder="E.g., Pay special attention to the ceiling fan, don't move the desk, etc."
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
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

          {content}

          <DialogFooter className="sticky bottom-0 bg-white dark:bg-gray-950 pt-4 border-t mt-4">
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="text-sm text-gray-500">Room Total</p>
                <p className="text-xl font-bold">${calculateTotalPrice().toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
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
      <DrawerContent>
        <DrawerHeader className="border-b">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{roomIcon}</span>
            <DrawerTitle>Customize {roomName}</DrawerTitle>
          </div>
          <DrawerDescription>Customize your cleaning options for this room</DrawerDescription>
        </DrawerHeader>

        {content}

        <DrawerFooter className="sticky bottom-0 bg-white dark:bg-gray-950 pt-4 border-t">
          <div className="flex justify-between items-center w-full mb-4">
            <div>
              <p className="text-sm text-gray-500">Room Total</p>
              <p className="text-xl font-bold">${calculateTotalPrice().toFixed(2)}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Apply Changes
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
