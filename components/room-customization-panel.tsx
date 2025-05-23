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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { Settings, Eye, BarChart3, CheckSquare, Map, Sparkles } from "lucide-react"

interface RoomCustomizationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomType: string | null
  roomCount: number
  initialConfig?: RoomConfiguration
  onConfigChange: (config: RoomConfiguration) => void
  matrixSelection?: { addServices: string[]; removeServices: string[] }
  onMatrixSelectionChange?: (selection: { addServices: string[]; removeServices: string[] }) => void
}

export function RoomCustomizationPanel({
  open,
  onOpenChange,
  roomType,
  roomCount,
  initialConfig,
  onConfigChange,
  matrixSelection,
  onMatrixSelectionChange,
}: RoomCustomizationPanelProps) {
  const [localConfig, setLocalConfig] = useState<RoomConfiguration | undefined>(initialConfig)
  const [activeTab, setActiveTab] = useState("configure")

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

  const currentTier = localConfig?.selectedTier || initialConfig?.selectedTier || "ESSENTIAL CLEAN"
  const currentAddOns = localConfig?.selectedAddOns || initialConfig?.selectedAddOns || []

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh] overflow-hidden">
        <DrawerHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{roomIcons[roomType]}</div>
              <div>
                <DrawerTitle className="text-2xl">{roomDisplayNames[roomType]} Customization</DrawerTitle>
                <DrawerDescription className="flex items-center gap-2">
                  <Badge variant="outline">
                    {roomCount} room{roomCount !== 1 ? "s" : ""}
                  </Badge>
                  <Badge variant="secondary">{currentTier}</Badge>
                </DrawerDescription>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Room Total</p>
              <p className="text-2xl font-bold text-blue-600">
                ${(localConfig?.totalPrice || initialConfig?.totalPrice || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b bg-white px-4">
              <TabsList className="grid w-full grid-cols-6 h-12">
                <TabsTrigger value="configure" className="flex items-center gap-1 text-xs">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Configure</span>
                </TabsTrigger>
                <TabsTrigger value="matrix" className="flex items-center gap-1 text-xs">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Matrix</span>
                </TabsTrigger>
                <TabsTrigger value="compare" className="flex items-center gap-1 text-xs">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Compare</span>
                </TabsTrigger>
                <TabsTrigger value="visualize" className="flex items-center gap-1 text-xs">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Visualize</span>
                </TabsTrigger>
                <TabsTrigger value="checklist" className="flex items-center gap-1 text-xs">
                  <CheckSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Checklist</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-1 text-xs">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Map</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="configure" className="p-4 space-y-6 m-0">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    Room Configuration
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select your cleaning tier and customize with add-ons or reductions
                  </p>
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
                </div>
              </TabsContent>

              <TabsContent value="matrix" className="p-4 space-y-6 m-0">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Advanced Customization Matrix
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Fine-tune your service with detailed add-ons and removals
                  </p>
                  <CustomizationMatrix
                    roomName={roomDisplayNames[roomType]}
                    selectedTier={currentTier}
                    addServices={getMatrixServices(roomType).add}
                    removeServices={getMatrixServices(roomType).remove}
                    onSelectionChange={handleMatrixSelectionChange}
                    initialSelection={matrixSelection}
                  />
                </div>
              </TabsContent>

              <TabsContent value="compare" className="p-4 space-y-6 m-0">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Service Comparison
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Compare what's included in each cleaning tier</p>
                  <ServiceComparisonTable
                    roomType={roomDisplayNames[roomType]}
                    features={getServiceFeatures(roomType)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="visualize" className="p-4 space-y-6 m-0">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-orange-600" />
                    Room Visualization
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">See how your room will look after cleaning</p>
                  <RoomVisualization
                    roomType={roomDisplayNames[roomType]}
                    selectedTier={currentTier}
                    selectedAddOns={currentAddOns}
                  />
                </div>
              </TabsContent>

              <TabsContent value="checklist" className="p-4 space-y-6 m-0">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-red-600" />
                    Cleaning Checklist
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Detailed list of tasks included in your selected tier</p>
                  <CleaningChecklist roomType={roomDisplayNames[roomType]} selectedTier={currentTier} />
                </div>
              </TabsContent>

              <TabsContent value="map" className="p-4 space-y-6 m-0">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Map className="h-5 w-5 text-indigo-600" />
                    Service Map
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Visual breakdown of services by cleaning tier</p>
                  <ServiceMap roomName={roomDisplayNames[roomType]} categories={getServiceMap(roomType)} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DrawerFooter className="border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
            <div className="flex items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500">
                  Total for {roomCount} {roomDisplayNames[roomType]}
                  {roomCount !== 1 ? "s" : ""}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ${((localConfig?.totalPrice || initialConfig?.totalPrice || 0) * roomCount).toFixed(2)}
                </p>
              </div>
              <Separator orientation="vertical" className="h-12 hidden sm:block" />
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-400">Per Room</p>
                <p className="text-lg font-semibold">
                  ${(localConfig?.totalPrice || initialConfig?.totalPrice || 0).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setActiveTab("configure")}>
                Back to Config
              </Button>
              <DrawerClose asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">Save & Close</Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
