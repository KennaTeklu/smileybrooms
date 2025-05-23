"use client"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoomConfigurator, type RoomConfiguration } from "@/components/room-configurator"
import { CustomizationMatrix } from "@/components/customization-matrix"
import { ServiceComparisonTable } from "@/components/service-comparison-table"
import { RoomVisualization } from "@/components/room-visualization"
import { CleaningChecklist } from "@/components/cleaning-checklist"
import { ServiceMap } from "@/components/service-map"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomIcons, roomDisplayNames } from "@/lib/room-tiers"
import { getMatrixServices } from "@/lib/matrix-services"
import { getServiceFeatures } from "@/lib/service-features"
import { getServiceMap } from "@/lib/service-maps"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Info, CheckCircle, AlertCircle, Clock, Settings, Map, List, Grid3X3 } from "lucide-react"

interface RoomCustomizationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomType: string | null
  initialConfig?: RoomConfiguration
  onConfigChange: (config: RoomConfiguration) => void
  matrixSelection?: { addServices: string[]; removeServices: string[] }
  onMatrixSelectionChange?: (selection: { addServices: string[]; removeServices: string[] }) => void
}

export function RoomCustomizationPanel({
  open,
  onOpenChange,
  roomType,
  initialConfig,
  onConfigChange,
  matrixSelection,
  onMatrixSelectionChange,
}: RoomCustomizationPanelProps) {
  const [localConfig, setLocalConfig] = useState<RoomConfiguration | undefined>(initialConfig)
  const [activeTab, setActiveTab] = useState("tiers")

  if (!roomType) return null

  const handleConfigChange = (config: RoomConfiguration) => {
    setLocalConfig(config)
    onConfigChange(config)
  }

  const handleMatrixSelectionChange = (selection: { addServices: string[]; removeServices: string[] }) => {
    if (onMatrixSelectionChange) {
      onMatrixSelectionChange(selection)
    }
  }

  // Get the selected tier name for display
  const selectedTierName = localConfig?.selectedTier || initialConfig?.selectedTier || "ESSENTIAL CLEAN"

  // Calculate the number of add-ons and reductions
  const addOnsCount = (localConfig?.selectedAddOns || initialConfig?.selectedAddOns || []).length
  const reductionsCount = (localConfig?.selectedReductions || initialConfig?.selectedReductions || []).length
  const matrixAddOnsCount = matrixSelection?.addServices.length || 0
  const matrixReductionsCount = matrixSelection?.removeServices.length || 0

  // Total customizations
  const totalCustomizations = addOnsCount + reductionsCount + matrixAddOnsCount + matrixReductionsCount

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-y-auto">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2 text-2xl">
              <span>{roomIcons[roomType]}</span>
              <span>{roomDisplayNames[roomType]}</span>
            </DrawerTitle>
            <Badge
              variant={
                selectedTierName === "ESSENTIAL CLEAN"
                  ? "default"
                  : selectedTierName === "ADVANCED CLEAN"
                    ? "secondary"
                    : "destructive"
              }
            >
              {selectedTierName}
            </Badge>
          </div>
          <DrawerDescription className="flex items-center justify-between mt-2">
            <span>Customize cleaning options for this room</span>
            {totalCustomizations > 0 && (
              <Badge variant="outline" className="bg-blue-50">
                {totalCustomizations} Customization{totalCustomizations !== 1 ? "s" : ""}
              </Badge>
            )}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-0">
          <Tabs defaultValue="tiers" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-4 sticky top-0 bg-white z-10 border-b">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="tiers" className="flex flex-col items-center gap-1 py-2 h-auto">
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">Tiers</span>
                </TabsTrigger>
                <TabsTrigger value="matrix" className="flex flex-col items-center gap-1 py-2 h-auto">
                  <Grid3X3 className="h-4 w-4" />
                  <span className="text-xs">Matrix</span>
                </TabsTrigger>
                <TabsTrigger value="compare" className="flex flex-col items-center gap-1 py-2 h-auto">
                  <List className="h-4 w-4" />
                  <span className="text-xs">Compare</span>
                </TabsTrigger>
                <TabsTrigger value="visual" className="flex flex-col items-center gap-1 py-2 h-auto">
                  <Map className="h-4 w-4" />
                  <span className="text-xs">Visual</span>
                </TabsTrigger>
                <TabsTrigger value="checklist" className="flex flex-col items-center gap-1 py-2 h-auto">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs">Checklist</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tiers" className="mt-0 p-4">
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-semibold">Select Cleaning Tier</h3>
                <p className="text-sm text-gray-500">Choose the level of cleaning service for this room</p>
              </div>
              <RoomConfigurator
                roomName={roomDisplayNames[roomType]}
                roomIcon={roomIcons[roomType]}
                baseTier={getRoomTiers(roomType)[0]}
                tiers={getRoomTiers(roomType)}
                addOns={getRoomAddOns(roomType)}
                reductions={getRoomReductions(roomType)}
                onConfigChange={handleConfigChange}
                initialConfig={initialConfig}
              />
            </TabsContent>

            <TabsContent value="matrix" className="mt-0 p-4">
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-semibold">Fine-Tune Services</h3>
                <p className="text-sm text-gray-500">Add or remove specific cleaning tasks for this room</p>
              </div>
              <CustomizationMatrix
                roomName={roomDisplayNames[roomType]}
                selectedTier={selectedTierName}
                addServices={getMatrixServices(roomType).add}
                removeServices={getMatrixServices(roomType).remove}
                onSelectionChange={handleMatrixSelectionChange}
                initialSelection={matrixSelection}
              />
            </TabsContent>

            <TabsContent value="compare" className="mt-0 p-4">
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-semibold">Compare Service Tiers</h3>
                <p className="text-sm text-gray-500">See what's included in each cleaning tier</p>
              </div>
              <ServiceComparisonTable roomType={roomDisplayNames[roomType]} features={getServiceFeatures(roomType)} />
            </TabsContent>

            <TabsContent value="visual" className="mt-0 p-4">
              <div className="space-y-4">
                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-semibold">Room Visualization</h3>
                  <p className="text-sm text-gray-500">See how your room will look after cleaning</p>
                </div>
                <RoomVisualization
                  roomType={roomDisplayNames[roomType]}
                  selectedTier={selectedTierName}
                  selectedAddOns={localConfig?.selectedAddOns || initialConfig?.selectedAddOns}
                />

                <Separator className="my-6" />

                <div className="space-y-2 mb-4">
                  <h3 className="text-lg font-semibold">Service Map</h3>
                  <p className="text-sm text-gray-500">Visual breakdown of cleaning services by area</p>
                </div>
                <ServiceMap roomName={roomDisplayNames[roomType]} categories={getServiceMap(roomType)} />
              </div>
            </TabsContent>

            <TabsContent value="checklist" className="mt-0 p-4">
              <div className="space-y-2 mb-4">
                <h3 className="text-lg font-semibold">Cleaning Checklist</h3>
                <p className="text-sm text-gray-500">Detailed list of tasks included in your selected tier</p>
              </div>
              <CleaningChecklist roomType={roomDisplayNames[roomType]} selectedTier={selectedTierName} />

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 mt-1">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">Cleaning Time Estimate</h4>
                    <p className="text-sm text-blue-600 mt-1">
                      This room will take approximately{" "}
                      <span className="font-semibold">
                        {selectedTierName === "ESSENTIAL CLEAN"
                          ? "15-20"
                          : selectedTierName === "ADVANCED CLEAN"
                            ? "30-40"
                            : "45-60"}{" "}
                        minutes
                      </span>{" "}
                      to clean with your current selections.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div className="h-2 bg-blue-200 rounded-full w-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{
                            width:
                              selectedTierName === "ESSENTIAL CLEAN"
                                ? "30%"
                                : selectedTierName === "ADVANCED CLEAN"
                                  ? "60%"
                                  : "90%",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter className="border-t pt-4">
          <div className="flex justify-between items-center w-full mb-4">
            <div>
              <p className="text-sm text-gray-500">Room Total</p>
              <p className="text-xl font-bold">
                ${localConfig?.totalPrice.toFixed(2) || initialConfig?.totalPrice.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActiveTab("tiers")}>
                Edit Tier
              </Button>
              <DrawerClose asChild>
                <Button>Done</Button>
              </DrawerClose>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            <span>Changes are automatically saved as you customize</span>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
