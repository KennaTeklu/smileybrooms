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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { RoomConfiguration } from "@/components/room-configurator"
import { CustomizationMatrix } from "@/components/customization-matrix"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomIcons, roomDisplayNames } from "@/lib/room-tiers"
import { getMatrixServices } from "@/lib/matrix-services"
import { X, Sparkles, Settings, Zap, DollarSign, Clock, CheckCircle2 } from "lucide-react"

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

  const roomTiers = getRoomTiers(roomType)
  const selectedTier = localConfig?.selectedTier || initialConfig?.selectedTier || "ESSENTIAL CLEAN"
  const currentTier = roomTiers.find((tier) => tier.name === selectedTier)
  const totalPrice = localConfig?.totalPrice || initialConfig?.totalPrice || 0

  // Calculate estimated time based on tier
  const getEstimatedTime = () => {
    const baseTime = 30 // minutes
    const tierMultiplier = selectedTier === "ESSENTIAL CLEAN" ? 1 : selectedTier === "ADVANCED CLEAN" ? 1.5 : 2.5
    return Math.round(baseTime * tierMultiplier)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh] overflow-hidden">
        {/* Enhanced Header */}
        <DrawerHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-2xl">{roomIcons[roomType]}</span>
              </div>
              <div>
                <DrawerTitle className="text-2xl font-bold text-gray-900">{roomDisplayNames[roomType]}</DrawerTitle>
                <DrawerDescription className="text-gray-600">Customize your cleaning experience</DrawerDescription>
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">Price</span>
              </div>
              <p className="text-lg font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{getEstimatedTime()}min</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Tier</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{selectedTier.split(" ")[0]}</p>
            </div>
          </div>
        </DrawerHeader>

        {/* Enhanced Content with Tabs */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="sticky top-0 bg-white border-b z-10">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 m-2 rounded-lg">
                <TabsTrigger value="tiers" className="flex items-center gap-2 data-[state=active]:bg-white">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Service Tiers</span>
                  <span className="sm:hidden">Tiers</span>
                </TabsTrigger>
                <TabsTrigger value="addons" className="flex items-center gap-2 data-[state=active]:bg-white">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Add-ons</span>
                  <span className="sm:hidden">Add-ons</span>
                </TabsTrigger>
                <TabsTrigger value="matrix" className="flex items-center gap-2 data-[state=active]:bg-white">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Fine-tune</span>
                  <span className="sm:hidden">Custom</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 space-y-4">
              <TabsContent value="tiers" className="mt-0">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5 text-blue-600" />
                      Choose Your Service Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {roomTiers.map((tier, index) => (
                      <div
                        key={tier.name}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedTier === tier.name
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                        onClick={() => {
                          const newConfig = {
                            roomName: roomType,
                            selectedTier: tier.name,
                            selectedAddOns: localConfig?.selectedAddOns || [],
                            selectedReductions: localConfig?.selectedReductions || [],
                            totalPrice: tier.price,
                          }
                          handleConfigChange(newConfig)
                        }}
                      >
                        {index === 1 && (
                          <Badge className="absolute -top-2 left-4 bg-orange-500 text-white">Most Popular</Badge>
                        )}

                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${
                                  selectedTier === tier.name ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                }`}
                              >
                                {selectedTier === tier.name && <CheckCircle2 className="w-4 h-4 text-white" />}
                              </div>
                              <h3 className="font-semibold text-gray-900">{tier.name}</h3>
                              <Badge variant={index === 0 ? "secondary" : index === 1 ? "default" : "destructive"}>
                                {index === 0 ? "Basic" : index === 1 ? "3x Basic" : "9x Basic"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
                            <div className="space-y-1">
                              {tier.features.slice(0, 3).map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                                  <span className="text-gray-700">{feature}</span>
                                </div>
                              ))}
                              {tier.features.length > 3 && (
                                <p className="text-xs text-gray-500 mt-1">+{tier.features.length - 3} more features</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-gray-900">${tier.price}</p>
                            <p className="text-xs text-gray-500">per room</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="addons" className="mt-0">
                <div className="space-y-4">
                  {/* Add-ons Section */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                        <Settings className="h-5 w-5" />
                        Add Extra Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {getRoomAddOns(roomType).map((addon) => (
                          <div
                            key={addon.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              localConfig?.selectedAddOns.includes(addon.id)
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded border ${
                                    localConfig?.selectedAddOns.includes(addon.id)
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {localConfig?.selectedAddOns.includes(addon.id) && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <span className="font-medium text-gray-900">{addon.name}</span>
                              </div>
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                +${addon.price}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reductions Section */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg text-red-700">
                        <Settings className="h-5 w-5" />
                        Remove Services (Save Money)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {getRoomReductions(roomType).map((reduction) => (
                          <div
                            key={reduction.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              localConfig?.selectedReductions.includes(reduction.id)
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-4 h-4 rounded border ${
                                    localConfig?.selectedReductions.includes(reduction.id)
                                      ? "bg-red-500 border-red-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {localConfig?.selectedReductions.includes(reduction.id) && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <span className="font-medium text-gray-900">{reduction.name}</span>
                              </div>
                              <Badge variant="outline" className="text-red-600 border-red-200">
                                -${reduction.discount}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="matrix" className="mt-0">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Fine-tune Your Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CustomizationMatrix
                      roomName={roomDisplayNames[roomType]}
                      selectedTier={selectedTier}
                      addServices={getMatrixServices(roomType).add}
                      removeServices={getMatrixServices(roomType).remove}
                      onSelectionChange={handleMatrixSelectionChange}
                      initialSelection={matrixSelection}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Enhanced Footer */}
        <DrawerFooter className="border-t bg-white">
          <div className="space-y-4">
            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Base Service</span>
                <span className="text-sm text-gray-900">${currentTier?.price || 0}</span>
              </div>
              {localConfig?.selectedAddOns && localConfig.selectedAddOns.length > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Add-ons</span>
                  <span className="text-sm text-green-600">
                    +$
                    {getRoomAddOns(roomType)
                      .filter((addon) => localConfig.selectedAddOns.includes(addon.id))
                      .reduce((sum, addon) => sum + addon.price, 0)}
                  </span>
                </div>
              )}
              {localConfig?.selectedReductions && localConfig.selectedReductions.length > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Reductions</span>
                  <span className="text-sm text-red-600">
                    -$
                    {getRoomReductions(roomType)
                      .filter((reduction) => localConfig.selectedReductions.includes(reduction.id))
                      .reduce((sum, reduction) => sum + reduction.discount, 0)}
                  </span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Room Total</span>
                <span className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
