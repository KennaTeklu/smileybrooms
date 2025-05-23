"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Minus, Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { roomConfig } from "@/lib/room-config"
import { RoomConfigurator } from "./room-configurator"
import { CustomizationMatrix } from "./customization-matrix"
import { matrixServices } from "@/lib/matrix-services"

interface CompactRoomSelectionProps {
  selectedRooms: Record<string, number>
  setSelectedRooms: (rooms: Record<string, number>) => void
  serviceType: "standard" | "detailing"
}

export function CompactRoomSelection({ selectedRooms, setSelectedRooms, serviceType }: CompactRoomSelectionProps) {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const [currentRoomConfig, setCurrentRoomConfig] = useState<{
    roomId: string
    selectedTier: string
    addServices: string[]
    removeServices: string[]
  }>({
    roomId: "",
    selectedTier: "ESSENTIAL CLEAN",
    addServices: [],
    removeServices: [],
  })

  // Room configurations state
  const [roomConfigurations, setRoomConfigurations] = useState<
    Record<
      string,
      {
        selectedTier: string
        addServices: string[]
        removeServices: string[]
      }
    >
  >({})

  const roomTypes = roomConfig.roomTypes

  const incrementRoom = (roomId: string) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || 0) + 1,
    }))
  }

  const decrementRoom = (roomId: string) => {
    if (selectedRooms[roomId] > 0) {
      setSelectedRooms((prev) => ({
        ...prev,
        [roomId]: prev[roomId] - 1,
      }))
    }
  }

  const openCustomizeDrawer = (roomId: string) => {
    const room = roomTypes.find((r) => r.id === roomId)
    if (!room) return

    // Get existing configuration or use defaults
    const config = roomConfigurations[roomId] || {
      selectedTier: "ESSENTIAL CLEAN",
      addServices: [],
      removeServices: [],
    }

    setCurrentRoomConfig({
      roomId,
      ...config,
    })

    setOpenDrawer(roomId)
  }

  const handleConfigChange = (config: any) => {
    setCurrentRoomConfig((prev) => ({
      ...prev,
      selectedTier: config.selectedTier,
    }))
  }

  const handleMatrixChange = (selection: { addServices: string[]; removeServices: string[] }) => {
    setCurrentRoomConfig((prev) => ({
      ...prev,
      addServices: selection.addServices,
      removeServices: selection.removeServices,
    }))
  }

  const applyChanges = () => {
    // Save the current configuration
    setRoomConfigurations((prev) => ({
      ...prev,
      [currentRoomConfig.roomId]: {
        selectedTier: currentRoomConfig.selectedTier,
        addServices: currentRoomConfig.addServices,
        removeServices: currentRoomConfig.removeServices,
      },
    }))

    // Close the drawer
    setOpenDrawer(null)
  }

  const cancelChanges = () => {
    setOpenDrawer(null)
  }

  // Group rooms by category
  const coreRooms = roomTypes.filter((room) =>
    ["bedroom", "bathroom", "kitchen", "living_room", "dining_room"].includes(room.id),
  )
  const additionalRooms = roomTypes.filter(
    (room) => !["bedroom", "bathroom", "kitchen", "living_room", "dining_room"].includes(room.id),
  )

  return (
    <div className="space-y-6">
      <div>
        <div className="border-b pb-2 mb-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">CORE ROOMS</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {coreRooms.map((room) => {
            const config = roomConfigurations[room.id]
            const hasCustomization =
              config &&
              (config.selectedTier !== "ESSENTIAL CLEAN" ||
                config.addServices.length > 0 ||
                config.removeServices.length > 0)

            return (
              <Card
                key={room.id}
                className={cn(
                  "transition-all",
                  selectedRooms[room.id] > 0
                    ? "border-blue-200 dark:border-blue-800"
                    : "border-gray-200 dark:border-gray-800",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "p-2 rounded-full mr-2",
                          selectedRooms[room.id] > 0
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "bg-gray-100 dark:bg-gray-800",
                        )}
                      >
                        {room.icon}
                      </div>
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs text-gray-500">
                          ${serviceType === "standard" ? room.basePrice : room.basePrice * 1.8} per room
                          {hasCustomization && <span className="ml-1 text-blue-600">• Customized</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decrementRoom(room.id)}
                        disabled={selectedRooms[room.id] === 0}
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{selectedRooms[room.id] || 0}</span>
                      <Button variant="outline" size="icon" onClick={() => incrementRoom(room.id)} className="h-8 w-8">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openCustomizeDrawer(room.id)}
                      className="text-xs h-8 px-2"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Customize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div>
        <div className="border-b pb-2 mb-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ADDITIONAL SPACES</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {additionalRooms.map((room) => {
            const config = roomConfigurations[room.id]
            const hasCustomization =
              config &&
              (config.selectedTier !== "ESSENTIAL CLEAN" ||
                config.addServices.length > 0 ||
                config.removeServices.length > 0)

            return (
              <Card
                key={room.id}
                className={cn(
                  "transition-all",
                  selectedRooms[room.id] > 0
                    ? "border-blue-200 dark:border-blue-800"
                    : "border-gray-200 dark:border-gray-800",
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "p-2 rounded-full mr-2",
                          selectedRooms[room.id] > 0
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "bg-gray-100 dark:bg-gray-800",
                        )}
                      >
                        {room.icon}
                      </div>
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs text-gray-500">
                          ${serviceType === "standard" ? room.basePrice : room.basePrice * 1.8} per room
                          {hasCustomization && <span className="ml-1 text-blue-600">• Customized</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decrementRoom(room.id)}
                        disabled={selectedRooms[room.id] === 0}
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{selectedRooms[room.id] || 0}</span>
                      <Button variant="outline" size="icon" onClick={() => incrementRoom(room.id)} className="h-8 w-8">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openCustomizeDrawer(room.id)}
                      className="text-xs h-8 px-2"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Customize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Customization Drawer */}
      <Drawer open={openDrawer !== null} onOpenChange={(open) => !open && setOpenDrawer(null)}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b sticky top-0 bg-background z-10">
            <DrawerTitle>
              Customize {roomTypes.find((r) => r.id === currentRoomConfig.roomId)?.name || "Room"}
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 py-6 overflow-y-auto">
            <Accordion type="single" collapsible defaultValue="tier" className="w-full">
              <AccordionItem value="tier" className="border rounded-lg overflow-hidden mb-4">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="font-medium">Cleaning Level</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {currentRoomConfig.roomId && (
                    <RoomConfigurator
                      roomName={roomTypes.find((r) => r.id === currentRoomConfig.roomId)?.name || "Room"}
                      roomIcon="🏠"
                      baseTier={{
                        name: "ESSENTIAL CLEAN",
                        description: "Basic cleaning for regular maintenance",
                        price: roomTypes.find((r) => r.id === currentRoomConfig.roomId)?.basePrice || 0,
                        features: ["Dusting accessible surfaces", "Vacuuming floors", "Emptying trash"],
                      }}
                      tiers={[
                        {
                          name: "ESSENTIAL CLEAN",
                          description: "Basic cleaning for regular maintenance",
                          price: roomTypes.find((r) => r.id === currentRoomConfig.roomId)?.basePrice || 0,
                          features: ["Dusting accessible surfaces", "Vacuuming floors", "Emptying trash"],
                        },
                        {
                          name: "ADVANCED CLEAN",
                          description: "Deeper cleaning for neglected spaces",
                          price: (roomTypes.find((r) => r.id === currentRoomConfig.roomId)?.basePrice || 0) * 1.5,
                          features: [
                            "Everything in Essential Clean",
                            "Cleaning behind furniture",
                            "Detailed baseboards",
                            "Window sills and tracks",
                          ],
                        },
                        {
                          name: "PREMIUM CLEAN",
                          description: "Thorough cleaning for move-ins/outs or deep refreshes",
                          price: (roomTypes.find((r) => r.id === currentRoomConfig.roomId)?.basePrice || 0) * 2,
                          features: [
                            "Everything in Advanced Clean",
                            "Inside cabinets and drawers",
                            "Wall spot cleaning",
                            "Detailed fixture cleaning",
                          ],
                        },
                      ]}
                      addOns={[]}
                      reductions={[]}
                      onConfigChange={handleConfigChange}
                      initialConfig={{
                        roomName: roomTypes.find((r) => r.id === currentRoomConfig.roomId)?.name || "Room",
                        selectedTier: currentRoomConfig.selectedTier,
                        selectedAddOns: [],
                        selectedReductions: [],
                        totalPrice: 0,
                      }}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="add" className="border rounded-lg overflow-hidden mb-4">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="font-medium">Add Services</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {currentRoomConfig.roomId && (
                    <CustomizationMatrix
                      roomName={roomTypes.find((r) => r.id === currentRoomConfig.roomId)?.name || "Room"}
                      selectedTier={currentRoomConfig.selectedTier}
                      addServices={matrixServices.addServices.filter((service) =>
                        service.roomTypes.includes(currentRoomConfig.roomId),
                      )}
                      removeServices={[]}
                      onSelectionChange={handleMatrixChange}
                      initialSelection={{
                        addServices: currentRoomConfig.addServices,
                        removeServices: [],
                      }}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="remove" className="border rounded-lg overflow-hidden mb-4">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="font-medium">Remove Services</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {currentRoomConfig.roomId && (
                    <CustomizationMatrix
                      roomName={roomTypes.find((r) => r.id === currentRoomConfig.roomId)?.name || "Room"}
                      selectedTier={currentRoomConfig.selectedTier}
                      addServices={[]}
                      removeServices={matrixServices.removeServices.filter((service) =>
                        service.roomTypes.includes(currentRoomConfig.roomId),
                      )}
                      onSelectionChange={handleMatrixChange}
                      initialSelection={{
                        addServices: [],
                        removeServices: currentRoomConfig.removeServices,
                      }}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="special" className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="font-medium">Special Requirements</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">Add any special requirements or notes for this room.</p>
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-md"
                      placeholder="E.g., Be careful with antique furniture, use specific cleaning products, etc."
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DrawerFooter className="border-t sticky bottom-0 bg-background z-10">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={cancelChanges}>
                Cancel
              </Button>
              <Button onClick={applyChanges}>Apply Changes</Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
