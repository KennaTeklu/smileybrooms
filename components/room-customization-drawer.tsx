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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Check, X, AlertCircle } from "lucide-react"

import { formatCurrency } from "@/lib/utils"
import { getRoomTiers, getRoomAddOns } from "@/lib/room-tiers"
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

  const [activeTab, setActiveTab] = useState<"basic" | "advanced" | "schedule">("basic")
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

  /* The *base* tier (first item).  If data missing, fall back to sensible defaults. */
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
    setActiveTab("basic")
    setSelectedTier(roomConfig.selectedTier ?? "ESSENTIAL CLEAN")
    setSelectedAddOns([...roomConfig.selectedAddOns])
    setMatrixAddServices([])
    setMatrixRemoveServices([])
    setError(null)
  }, [isOpen, roomConfig])

  /* ----------------------------- Handlers/UI ------------------------------ */

  const applyAndClose = () => {
    onSave(roomType, localConfig)
    onOpenChange(false)
  }

  /* ----------------------------------------------------------------------- */

  const roomName = roomDisplayNames[roomType] ?? roomType
  const roomIcon = roomIcons[roomType] ?? "🧹"

  /* ----------------------------------------------------------------------- */
  /*                                 Render                                  */
  /* ----------------------------------------------------------------------- */

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] p-0">
        {/* --------------------------- Header --------------------------- */}
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl" aria-hidden="true">
              {roomIcon}
            </span>
            {roomName} Configuration
          </DrawerTitle>
          <DrawerDescription>Customize your {roomName.toLowerCase()} cleaning options</DrawerDescription>
        </DrawerHeader>

        {/* ----------------------- Error message ------------------------ */}
        {error && (
          <div className="mx-4 mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* ----------------------------- Tabs --------------------------- */}
        <div className="px-4">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            {/* ---------------------- BASIC TAB ---------------------- */}
            <TabsContent value="basic" className="overflow-y-auto">
              <div className="space-y-6 py-4 pr-4">
                {/* Tier selection */}
                <section>
                  <h3 className="mb-4 text-lg font-medium">Select Cleaning Tier</h3>
                  <RadioGroup
                    value={selectedTier}
                    onValueChange={setSelectedTier}
                    aria-label="Cleaning tier options"
                    className="space-y-4"
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
            </TabsContent>

            {/* -------------------- ADVANCED TAB ---------------------- */}
            <TabsContent value="advanced" className="overflow-y-auto">
              <div className="space-y-6 py-4 pr-4">
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
                  <p className="text-center text-gray-500">No advanced options available.</p>
                )}
              </div>
            </TabsContent>

            {/* -------------------- SCHEDULE TAB ---------------------- */}
            <TabsContent value="schedule" className="overflow-y-auto">
              <div className="space-y-6 py-4 pr-4">
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
            </TabsContent>
          </Tabs>
        </div>

        {/* --------------------- Cost summary footer -------------------- */}
        <Separator className="my-4" />
        <div className="px-4 pb-2">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Room Count:</span>
            <span>{roomCount}</span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Base Price:</span>
            <span>{formatCurrency(localConfig.basePrice)}</span>
          </div>
          {localConfig.tierUpgradePrice > 0 && (
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">Tier Upgrade:</span>
              <span>+{formatCurrency(localConfig.tierUpgradePrice)}</span>
            </div>
          )}
          {localConfig.addOnsPrice > 0 && (
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium">Add-ons:</span>
              <span>+{formatCurrency(localConfig.addOnsPrice)}</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex items-center justify-between font-bold">
            <span>Total Per Room:</span>
            <span>{formatCurrency(localConfig.totalPrice)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between font-bold">
            <span>Total ({roomCount} rooms):</span>
            <span>{formatCurrency(localConfig.totalPrice * roomCount)}</span>
          </div>
        </div>

        {/* -------------------------- Footer buttons ------------------------- */}
        <DrawerFooter>
          <Button className="w-full" onClick={applyAndClose}>
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
