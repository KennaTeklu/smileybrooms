"use client"

import type React from "react"
import { RoomCustomizationModal } from "./room-customization-modal" // Updated import

interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  totalPrice: number
}

interface EnhancedRoomCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  roomType: string
  roomName: string
  roomIcon: React.ReactNode
  roomCount: number
  config: any
  onConfigChange: (config: any) => void
  allowVideoRecording?: boolean
}

export function EnhancedRoomCustomizationPanel({
  isOpen,
  onClose,
  roomType,
  roomName,
  roomIcon,
  roomCount,
  config,
  onConfigChange,
  allowVideoRecording = false,
}: EnhancedRoomCustomizationPanelProps) {
  return (
    <RoomCustomizationModal
      isOpen={isOpen}
      onClose={onClose}
      roomType={roomType}
      roomName={roomName}
      roomIcon={roomIcon}
      roomCount={roomCount}
      config={config}
      onConfigChange={onConfigChange}
      allowVideoRecording={allowVideoRecording}
    />
  )
}
