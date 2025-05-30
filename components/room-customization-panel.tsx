"use client"
import type { RoomTier, RoomAddOn, RoomReduction } from "@/components/room-configurator"

interface MatrixService {
  id: string
  name: string
  price: number
  description: string
}

interface RoomCustomizationPanelProps {
  isOpen: boolean
  onClose: () => void
  roomName: string
  roomIcon: string
  roomCount: number
  baseTier: RoomTier
  tiers: RoomTier[]
  addOns: RoomAddOn[]
  reductions: RoomReduction[]
  selected: any
