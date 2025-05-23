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
import { RoomConfigurator, type RoomConfiguration } from "@/components/room-configurator"
import { CustomizationMatrix } from "@/components/customization-matrix"
import { getRoomTiers, getRoomAddOns, getRoomReductions, roomIcons, roomDisplayNames } from "@/lib/room-tiers"
import { getMatrixServices } from "@/lib/matrix-services"

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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 text-2xl">
            <span>{roomIcons[roomType]}</span>
            <span>Customize {roomDisplayNames[roomType]}</span>
          </DrawerTitle>
          <DrawerDescription>Select cleaning options and add-ons for this room</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2">
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

          <CustomizationMatrix
            roomName={roomDisplayNames[roomType]}
            selectedTier={localConfig?.selectedTier || initialConfig?.selectedTier || "ESSENTIAL CLEAN"}
            addServices={getMatrixServices(roomType).add}
            removeServices={getMatrixServices(roomType).remove}
            onSelectionChange={handleMatrixSelectionChange}
            initialSelection={matrixSelection}
          />
        </div>

        <DrawerFooter className="border-t pt-4">
          <div className="flex justify-between items-center w-full">
            <div>
              <p className="text-sm text-gray-500">Room Total</p>
              <p className="text-xl font-bold">
                ${localConfig?.totalPrice.toFixed(2) || initialConfig?.totalPrice.toFixed(2) || "0.00"}
              </p>
            </div>
            <DrawerClose asChild>
              <Button>Done</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
