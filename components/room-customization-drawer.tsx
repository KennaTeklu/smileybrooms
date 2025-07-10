"use client"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Check, X, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { getRoomTiers, getRoomAddOns, roomImages } from "@/lib/room-tiers" // Import roomImages
import { getMatrixServices } from "@/lib/matrix-services"
import { roomDisplayNames, roomIcons } from "@/lib/room-tiers"

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
}

interface RoomCustomizationDrawerProps {
  /* Whether the drawer is open */
  isOpen: boolean
  /* Setter supplied by <RoomCategory> */
  onOpenChange: (open: boolean) => void

  /* Room data */
  roomType: string
  roomConfig: RoomConfig

  /* Called when the user clicks “Apply Changes” */
  onSave: (roomType: string, nextConfig: RoomConfig) => void

  /* Number of this room type selected (for footer totals) */
  roomCount?: number
}

type WizardStep = "basic" | "advanced" | "schedule" | "review"

const STEP_TITLES: Record<WizardStep, string> = {
  basic: "Customize Room",
  advanced: "Advanced Options",
  schedule: "Cleaning Schedule",
  review: "Review & Confirm",
}

const STEP_DESCRIPTIONS: Record<WizardStep, string> = {
  basic: "Select cleaning level and add-ons",
  advanced: "Add or remove specific services",
  schedule: "Choose how often you want cleaning",
  review: "Review your selections and total price",
}

/* -------------------------------------------------------------------------- */
/*                               Helper values                                */
/* -------------------------------------------------------------------------- */

const EMPTY_CONFIG: RoomConfig = {
  roomName: "",
  selectedTier: "ESSENTIAL CLEAN",
  selectedAddOns: [],
  basePrice: 25,
  tierUpgradePrice: 0,
  addOnsPrice: 0,
  totalPrice: 25,
}

/* -------------------------------------------------------------------------- */
/*                             Component definition                           */
/* -------------------------------------------------------------------------- */

export function RoomCustomizationDrawer(props: RoomCustomizationDrawerProps) {
  const { isOpen, onOpenChange, roomType, roomConfig = EMPTY_CONFIG, onSave, roomCount = 1 } = props

  /* --------------------------------- State -------------------------------- */

  const [currentStep, setCurrentStep] = useState<WizardStep>("basic")
  const [selectedTier, setSelectedTier] = useState(roomConfig.selectedTier)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(roomConfig.selectedAddOns)
  const [error, setError] = useState<string | null>(null)

  /* Matrix-style add/remove services (advanced tab) */
  const [matrixAddServices, setMatrixAddServices] = useState<string[]>([])
  const [matrixRemoveServices, setMatrixRemoveServices] = useState<string[]>([])

  /* Local working copy of the config shown in the drawer */
  const [localConfig, setLocalConfig] = useState<RoomConfig>(roomConfig)

  /* --------------------------------- Data --------------------------------- */

  const tiers = getRoomTiers(roomType) ?? []
  const addOns = getRoomAddOns(roomType) ?? []
  const matrixServices = getMatrixServices(roomType) ?? { add: [], remove: [] }

  /* The *base* tier (first item). If data missing, fall back to sensible defaults. */
  const baseTier = tiers[0] ?? {
    name: "ESSENTIAL CLEAN",
    description: "Basic cleaning",
    price: 25,
    features: [],
  }

  /* ----------------------------- Price helpers ---------------------------- */

  const calculatePrices = useCallback(() => {
    const basePrice = baseTier.price

    /* Tier upgrade */
    const selectedTierObj = tiers.find((t) => t.name === selectedTier)
    const tierUpgradePrice = selectedTierObj ? selectedTierObj.price - basePrice : 0

    /* Add-ons */
    const addOnsPrice = selectedAddOns.reduce((sum, id) => {
      const addOn = addOns.find((a) => a.id === id)
      return sum + (addOn?.price ?? 0)
    }, 0)

    /* Matrix additions/removals */
    const matrixAddPrice = matrixAddServices.reduce((sum, id) => {
      const svc = matrixServices.add.find((s) => s.id === id)
      return sum + (svc?.price ?? 0)
    }, 0)

    const matrixRemovePrice = matrixRemoveServices.reduce((sum, id) => {
      const svc = matrixServices.remove.find((s) => s.id === id)
      return sum + (svc?.price ?? 0)
    }, 0)

    const totalPrice = Math.max(0, basePrice + tierUpgradePrice + addOnsPrice + matrixAddPrice - matrixRemovePrice)

    return {
      basePrice,
      tierUpgradePrice,
      addOnsPrice: addOnsPrice + matrixAddPrice,
      totalPrice,
    }
  }, [
    addOns,
    baseTier.price,
    matrixAddServices,
    matrixRemoveServices,
    matrixServices,
    selectedAddOns,
    selectedTier,
    tiers,
  ])

  /* ------------------------------ Sync effects ---------------------------- */

  /* Re-calculate localConfig whenever any of the mutable selections change */
  useEffect(() => {
    const prices = calculatePrices()
    setLocalConfig({
      roomName: roomType,
      selectedTier,
      selectedAddOns,
      ...prices,
    })
  }, [calculatePrices, roomType, selectedTier, selectedAddOns])

  /* When the drawer (re)opens, reset all UI state to match source config */
  useEffect(() => {
    if (!isOpen) return
    setCurrentStep("basic") // Reset to first step on open
    setSelectedTier(roomConfig.selectedTier ?? "ESSENTIAL CLEAN")
    setSelectedAddOns([...roomConfig.selectedAddOns])
    setMatrixAddServices([])
    setMatrixRemoveServices([])
    setError(null)
  }, [isOpen, roomConfig])

  /* ----------------------------- Handlers/UI ------------------------------ */

  const steps: WizardStep[] = ["basic", "advanced", "schedule", "review"]
  const currentStepIndex = steps.indexOf(currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const goToNextStep = useCallback(() => {
    if (!isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1])
    }
  }, [currentStepIndex, isLastStep, steps])

  const goToPreviousStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1])
    }
  }, [currentStepIndex, isFirstStep, steps])

  const applyAndClose = () => {
    onSave(roomType, localConfig)
    onOpenChange(false)
  }

  /* ----------------------------------------------------------------------- */

  const roomDisplayName = roomDisplayNames[roomType] ?? roomType
  const roomIconDisplay = roomIcons[roomType] ?? "🧹"

  /* ----------------------------------------------------------------------- */
  /*                                 Render                                  */
  /* ----------------------------------------------------------------------- */

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] p-0">
        {/* --------------------------- Header --------------------------- */}
        <DrawerHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">
                {roomIconDisplay}
              </span>
              <div>
                <DrawerTitle className="text-xl font-semibold">{STEP_TITLES[currentStep]}</DrawerTitle>
                <DrawerDescription>{STEP_DESCRIPTIONS[currentStep]}</DrawerDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStepIndex ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Step {currentStepIndex + 1}</span>
            <span>{steps.length} steps</span>
          </div>
        </DrawerHeader>

        {/* ----------------------- Error message ------------------------ */}
        {error && (
          <div className="mx-4 mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* ----------------------------- Content --------------------------- */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {currentStep === "basic" && (
            <div className="space-y-6">
              {/* Tier selection */}
              <section>
                <h3 className="mb-4 text-lg font-medium">Select Cleaning Tier</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2 flex justify-center items-center">
                    <img
                      src={roomImages[roomType] || "/placeholder.svg?height=200&width=200&query=room-placeholder"}
                      alt={`${roomDisplayName} illustration`}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full h-auto max-h-[200px]"
                    />
                  </div>
                  <RadioGroup
                    value={selectedTier}
                    onValueChange={setSelectedTier}
                    aria-label="Cleaning tier options"
                    className="space-y-4 md:w-1/2"
                  >
                    {tiers.map((tier, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <RadioGroupItem value={tier.name} id={`tier-${idx}`} className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`tier-${idx}`}
                            className="flex items-center justify-between text-base font-medium"
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
              </section>

              {/* Add-ons */}
              {addOns.length > 0 && (
                <section>
                  <h3 className="mb-4 text-lg font-medium">Add-on Services</h3>
                  <div className="space-y-3">
                    {addOns.map((addOn, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Checkbox
                          id={`addon-${idx}`}
                          checked={selectedAddOns.includes(addOn.id)}
                          onCheckedChange={(ck) =>
                            setSelectedAddOns((prev) =>
                              ck ? [...prev, addOn.id] : prev.filter((id) => id !== addOn.id),
                            )
                          }
                          className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`addon-${idx}`}
                            className="flex items-center justify-between text-base font-medium"
                          >
                            <span>{addOn.name}</span>
                            <span>+{formatCurrency(addOn.price)}</span>
                          </Label>
                          <p className="text-sm text-muted-foreground">{addOn.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {currentStep === "advanced" && (
            <div className="space-y-6">
              {/* Matrix services (add) */}
              {matrixServices.add.length > 0 && (
                <section>
                  <h3 className="mb-4 text-lg font-medium">Additional Services</h3>
                  <div className="space-y-3">
                    {matrixServices.add.map((svc, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Checkbox
                          id={`matrix-add-${idx}`}
                          checked={matrixAddServices.includes(svc.id)}
                          onCheckedChange={(ck) =>
                            setMatrixAddServices((prev) =>
                              ck ? [...prev, svc.id] : prev.filter((id) => id !== svc.id),
                            )
                          }
                          className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`matrix-add-${idx}`}
                            className="flex items-center justify-between text-base font-medium"
                          >
                            <span>{svc.name}</span>
                            <span>+{formatCurrency(svc.price)}</span>
                          </Label>
                          <p className="text-sm text-muted-foreground">{svc.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Matrix services (remove) */}
              {matrixServices.remove.length > 0 && (
                <section>
                  <h3 className="mb-4 text-lg font-medium">Remove Services</h3>
                  <div className="space-y-3">
                    {matrixServices.remove.map((svc, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Checkbox
                          id={`matrix-remove-${idx}`}
                          checked={matrixRemoveServices.includes(svc.id)}
                          onCheckedChange={(ck) =>
                            setMatrixRemoveServices((prev) =>
                              ck ? [...prev, svc.id] : prev.filter((id) => id !== svc.id),
                            )
                          }
                          className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label
                            htmlFor={`matrix-remove-${idx}`}
                            className="flex items-center justify-between text-base font-medium"
                          >
                            <span>Skip {svc.name}</span>
                            <span>-{formatCurrency(svc.price)}</span>
                          </Label>
                          <p className="text-sm text-muted-foreground">{svc.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {matrixServices.add.length === 0 && matrixServices.remove.length === 0 && (
                <p className="text-center text-gray-500">No advanced options available for this room type.</p>
              )}
            </div>
          )}

          {currentStep === "schedule" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduling Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Scheduling features will arrive in a future update.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === "review" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Order Summary for {roomDisplayName}</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Room Type:</span>
                        <span className="font-medium">{roomDisplayName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleaning Level:</span>
                        <span className="font-medium">{localConfig.selectedTier}</span>
                      </div>
                      {localConfig.selectedAddOns.length > 0 && (
                        <div className="flex justify-between">
                          <span>Add-ons:</span>
                          <span className="font-medium">
                            {localConfig.selectedAddOns
                              .map((id) => addOns.find((a) => a.id === id)?.name || id)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      {matrixAddServices.length > 0 && (
                        <div className="flex justify-between">
                          <span>Additional Services:</span>
                          <span className="font-medium">
                            {matrixAddServices
                              .map((id) => matrixServices.add.find((s) => s.id === id)?.name || id)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      {matrixRemoveServices.length > 0 && (
                        <div className="flex justify-between">
                          <span>Skipped Services:</span>
                          <span className="font-medium">
                            {matrixRemoveServices
                              .map((id) => matrixServices.remove.find((s) => s.id === id)?.name || id)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Per Room:</span>
                        <span>{formatCurrency(localConfig.totalPrice)}</span>
                      </div>
                      <div className="mt-1 flex justify-between font-bold">
                        <span>Total ({roomCount} rooms):</span>
                        <span>{formatCurrency(localConfig.totalPrice * roomCount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* -------------------------- Footer buttons ------------------------- */}
        <DrawerFooter className="flex-shrink-0 border-t bg-white dark:bg-gray-900 p-4">
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button variant="outline" onClick={goToPreviousStep} className="flex-1 bg-transparent">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}

            {isLastStep ? (
              <Button onClick={applyAndClose} className="flex-1">
                <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                Apply Changes
              </Button>
            ) : (
              <Button onClick={goToNextStep} className="flex-1">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
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
