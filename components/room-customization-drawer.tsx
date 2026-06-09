"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState, useMemo, useEffect } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomDisplayNames, roomImages } from "@/lib/room-tiers"
import type { RoomConfig } from "@/lib/room-context"
import Image from "next/image"

interface RoomCustomizationDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  roomType: string
  roomConfig: RoomConfig
  onSave: (roomType: string, config: RoomConfig) => void
}

type WizardStep = "basic" | "addons" | "reductions" | "review"

const wizardSteps: { id: WizardStep; title: string; description: string }[] = [
  { id: "basic", title: "Choose Cleaning Tier", description: "Select the level of clean for your room." },
  { id: "addons", title: "Select Add-ons", description: "Enhance your clean with additional services." },
  { id: "reductions", title: "Choose Reductions", description: "Reduce cost by skipping certain tasks." },
  { id: "review", title: "Review & Confirm", description: "Review your selections and total price." },
]

export function RoomCustomizationDrawer({
  isOpen,
  onOpenChange,
  roomType,
  roomConfig,
  onSave,
}: RoomCustomizationDrawerProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("basic")
  const [tempConfig, setTempConfig] = useState<RoomConfig>(roomConfig)

  useEffect(() => {
    if (isOpen) {
      setTempConfig(roomConfig)
      setCurrentStep("basic") // Reset to first step when opening
    }
  }, [isOpen, roomConfig])

  const roomTiers = useMemo(() => getRoomTiers(roomType), [roomType])
  const roomAddOns = useMemo(() => getRoomAddOns(roomType), [roomType])
  const roomReductions = useMemo(() => getRoomReductions(roomType), [roomType])

  const currentTier = roomTiers.find((tier) => tier.name === tempConfig.selectedTier)

  const calculateTotalPrice = useMemo(() => {
    let total = currentTier ? currentTier.price : 0

    const addOnsPrice = tempConfig.selectedAddOns.reduce((sum, addOnId) => {
      const addOn = roomAddOns.find((a) => a.id === addOnId)
      return sum + (addOn ? addOn.price : 0)
    }, 0)

    const reductionsPrice = tempConfig.selectedReductions.reduce((sum, reductionId) => {
      const reduction = roomReductions.find((r) => r.id === reductionId)
      return sum + (reduction ? reduction.discount : 0)
    }, 0)

    total += addOnsPrice
    total -= reductionsPrice

    return Math.max(0, total)
  }, [
    tempConfig.selectedTier,
    tempConfig.selectedAddOns,
    tempConfig.selectedReductions,
    roomTiers,
    roomAddOns,
    roomReductions,
    currentTier,
  ])

  const handleTierChange = (tierName: string) => {
    setTempConfig((prev) => ({
      ...prev,
      selectedTier: tierName,
      basePrice: roomTiers.find((t) => t.name === tierName)?.price || 0,
    }))
  }

  const handleAddOnToggle = (addOnId: string, checked: boolean) => {
    setTempConfig((prev) => {
      const newAddOns = checked ? [...prev.selectedAddOns, addOnId] : prev.selectedAddOns.filter((id) => id !== addOnId)
      return { ...prev, selectedAddOns: newAddOns }
    })
  }

  const handleReductionToggle = (reductionId: string, checked: boolean) => {
    setTempConfig((prev) => {
      const newReductions = checked
        ? [...prev.selectedReductions, reductionId]
        : prev.selectedReductions.filter((id) => id !== reductionId)
      return { ...prev, selectedReductions: newReductions }
    })
  }

  const goToNextStep = () => {
    const currentIndex = wizardSteps.findIndex((step) => step.id === currentStep)
    if (currentIndex < wizardSteps.length - 1) {
      setCurrentStep(wizardSteps[currentIndex + 1].id)
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = wizardSteps.findIndex((step) => step.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(wizardSteps[currentIndex - 1].id)
    }
  }

  const handleApplyChanges = () => {
    onSave(roomType, {
      ...tempConfig,
      totalPrice: calculateTotalPrice,
      addOnsPrice: roomAddOns.reduce(
        (sum, addOn) => (tempConfig.selectedAddOns.includes(addOn.id) ? sum + addOn.price : sum),
        0,
      ),
      reductionsPrice: roomReductions.reduce(
        (sum, reduction) => (tempConfig.selectedReductions.includes(reduction.id) ? sum + reduction.discount : sum),
        0,
      ),
    })
    onOpenChange(false)
  }

  const currentStepIndex = wizardSteps.findIndex((step) => step.id === currentStep)
  const progressValue = ((currentStepIndex + 1) / wizardSteps.length) * 100

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} dismissible={false}>
      <DrawerContent className="h-[90vh] flex flex-col">
        <DrawerHeader className="px-4 pt-4 pb-2 border-b">
          <DrawerTitle className="text-2xl font-bold">Customize {roomDisplayNames[roomType] || "Room"}</DrawerTitle>
          <DrawerDescription>{wizardSteps[currentStepIndex].description}</DrawerDescription>
          <Progress value={progressValue} className="w-full mt-4 h-2" />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            {wizardSteps.map((step, index) => (
              <span
                key={step.id}
                className={cn(
                  "transition-colors duration-200",
                  index <= currentStepIndex ? "text-blue-600 dark:text-blue-400 font-medium" : "",
                )}
              >
                {step.title}
              </span>
            ))}
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          {currentStep === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
                {roomImages[roomType] && (
                  <Image
                    src={roomImages[roomType] || "/placeholder.svg"}
                    alt={roomDisplayNames[roomType]}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Select Cleaning Tier</h3>
                <RadioGroup value={tempConfig.selectedTier} onValueChange={handleTierChange} className="space-y-4">
                  {roomTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={cn(
                        "flex flex-col p-4 border rounded-lg cursor-pointer transition-all duration-200",
                        tempConfig.selectedTier === tier.name
                          ? "border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
                      )}
                      onClick={() => handleTierChange(tier.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor={tier.id} className="flex items-center space-x-2 cursor-pointer">
                          <RadioGroupItem value={tier.name} id={tier.id} className="sr-only" />
                          <span className="text-lg font-medium">{tier.name}</span>
                        </Label>
                        <span className="text-lg font-bold">${tier.price.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tier.description}</p>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <h4 className="font-semibold mb-1">Includes:</h4>
                        <ul className="list-disc list-inside space-y-0.5">
                          {tier.detailedTasks.map((task, index) => (
                            <li key={index}>{task}</li>
                          ))}
                        </ul>
                        {tier.notIncludedTasks && tier.notIncludedTasks.length > 0 && (
                          <>
                            <h4 className="font-semibold mt-2 mb-1">Not Included:</h4>
                            <ul className="list-disc list-inside space-y-0.5 text-red-500 dark:text-red-400">
                              {tier.notIncludedTasks.map((task, index) => (
                                <li key={index}>{task}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                      {tier.upsellMessage && (
                        <p className="mt-3 text-sm text-blue-600 dark:text-blue-400 italic">{tier.upsellMessage}</p>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {currentStep === "addons" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Add-ons</h3>
              <div className="space-y-4">
                {roomAddOns.length > 0 ? (
                  roomAddOns.map((addOn) => (
                    <div key={addOn.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={addOn.id}
                          checked={tempConfig.selectedAddOns.includes(addOn.id)}
                          onCheckedChange={(checked) => handleAddOnToggle(addOn.id, !!checked)}
                        />
                        <Label htmlFor={addOn.id} className="text-base font-medium cursor-pointer">
                          {addOn.name}
                          {addOn.description && (
                            <span className="block text-sm text-gray-500 dark:text-gray-400">{addOn.description}</span>
                          )}
                        </Label>
                      </div>
                      <span className="text-base font-semibold">${addOn.price.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No specific add-ons for this room type.</p>
                )}
              </div>
            </div>
          )}

          {currentStep === "reductions" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Select Reductions</h3>
              <div className="space-y-4">
                {roomReductions.length > 0 ? (
                  roomReductions.map((reduction) => (
                    <div key={reduction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={reduction.id}
                          checked={tempConfig.selectedReductions.includes(reduction.id)}
                          onCheckedChange={(checked) => handleReductionToggle(reduction.id, !!checked)}
                        />
                        <Label htmlFor={reduction.id} className="text-base font-medium cursor-pointer">
                          {reduction.name}
                          {reduction.description && (
                            <span className="block text-sm text-gray-500 dark:text-gray-400">
                              {reduction.description}
                            </span>
                          )}
                        </Label>
                      </div>
                      <span className="text-base font-semibold text-green-600 dark:text-green-400">
                        -${reduction.discount.toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No specific reductions for this room type.</p>
                )}
              </div>
            </div>
          )}

          {currentStep === "review" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Summary for {roomDisplayNames[roomType]}</h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cleaning Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentTier ? (
                      <div>
                        <p className="font-medium">{currentTier.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{currentTier.description}</p>
                        <p className="text-lg font-bold mt-2">${currentTier.price.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p>No tier selected.</p>
                    )}
                  </CardContent>
                </Card>

                {tempConfig.selectedAddOns.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Add-ons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tempConfig.selectedAddOns.map((addOnId) => {
                          const addOn = roomAddOns.find((a) => a.id === addOnId)
                          return (
                            addOn && (
                              <li key={addOn.id} className="flex justify-between items-center">
                                <span>{addOn.name}</span>
                                <span className="font-medium">${addOn.price.toFixed(2)}</span>
                              </li>
                            )
                          )
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {tempConfig.selectedReductions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Reductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tempConfig.selectedReductions.map((reductionId) => {
                          const reduction = roomReductions.find((r) => r.id === reductionId)
                          return (
                            reduction && (
                              <li key={reduction.id} className="flex justify-between items-center">
                                <span>{reduction.name}</span>
                                <span className="font-medium text-green-600 dark:text-green-400">
                                  -${reduction.discount.toFixed(2)}
                                </span>
                              </li>
                            )
                          )
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card className="border-2 border-blue-500 dark:border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-blue-600 dark:text-blue-400">Estimated Room Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${calculateTotalPrice.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </ScrollArea>

        <DrawerFooter className="px-4 py-3 border-t flex justify-between items-center">
          <Button variant="outline" onClick={goToPreviousStep} disabled={currentStepIndex === 0}>
            Back
          </Button>
          {currentStep === "review" ? (
            <Button onClick={handleApplyChanges}>Apply Changes</Button>
          ) : (
            <Button onClick={goToNextStep}>Next</Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
