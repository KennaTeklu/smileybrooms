import { roomDisplayNames } from "@/lib/room-tiers"
import {
  Home,
  Bed,
  Bath,
  ChefHat,
  Sofa,
  Car,
  Briefcase,
  StepBackIcon as Stairs,
  DoorOpen,
  Building,
} from "lucide-react"

// Global state for active wizard
let _activeWizard: string | null = null
let _addingRoomId: string | null = null
const _initialRenderComplete = true

export const activeWizard = _activeWizard
export const addingRoomId = _addingRoomId
export const initialRenderComplete = _initialRenderComplete

export const setActiveWizard = (roomType: string | null) => {
  _activeWizard = roomType
}

export const setAddingRoomId = (roomId: string | null) => {
  _addingRoomId = roomId
}

export const roomIcons = {
  bedroom: Bed,
  bathroom: Bath,
  kitchen: ChefHat,
  living_room: Sofa,
  dining_room: ChefHat,
  home_office: Briefcase,
  laundry_room: Building,
  garage: Car,
  stairs: Stairs,
  hallway: DoorOpen,
  entryway: DoorOpen,
  other: Home,
}

export const safeGetRoomConfig = (roomType: string) => {
  // This is a stub - in a real implementation, this would get room config from context
  return {
    roomName: roomDisplayNames[roomType] || roomType,
    selectedTier: "premium",
    totalPrice: 50,
    selectedAddOns: [],
    selectedReductions: [],
    detailedTasks: [],
    notIncludedTasks: [],
    upsellMessage: "",
    paymentType: "online" as const,
  }
}

export const handleRoomConfigChange = (roomType: string, config: any) => {
  // This is a stub - in a real implementation, this would update room config
  console.log(`Room config changed for ${roomType}:`, config)
}

export const getBgColor = () => "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"

export const getIconBgColor = () => "bg-blue-100 dark:bg-blue-800"

export const getIconTextColor = () => "text-blue-600 dark:text-blue-300"

export const getActiveBorderColor = () => "border-blue-300 dark:border-blue-600"
