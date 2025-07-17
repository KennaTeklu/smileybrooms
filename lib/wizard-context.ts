/**
 * Temporary, lightweight implementation so the project
 * compiles and deploys without missing-module errors.
 *
 * You can replace this with a richer React Context or state
 * store later if you need cross-component reactivity.
 */

import { roomIcons } from "@/lib/room-tiers"

/* ------------------------------------------------------------------
 * Basic in-memory “store”
 * -----------------------------------------------------------------*/
export let activeWizard: string | null = null
export let addingRoomId: string | null = null
export let initialRenderComplete = false

export const setActiveWizard = (value: string | null) => {
  activeWizard = value
}

export const setAddingRoomId = (value: string | null) => {
  addingRoomId = value
}

export const setInitialRenderComplete = (value: boolean) => {
  initialRenderComplete = value
}

/* ------------------------------------------------------------------
 * Utility helpers duplicated from RoomCategory so that any component
 * importing them continues to work.  Feel free to DRY these up later.
 * -----------------------------------------------------------------*/
export const getBgColor = (variant: "primary" | "secondary" = "primary") =>
  variant === "primary"
    ? "bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30"
    : "bg-gray-50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-700/30"

export const getIconBgColor = (variant: "primary" | "secondary" = "primary") =>
  variant === "primary" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-200 dark:bg-gray-700/30"

export const getIconTextColor = (variant: "primary" | "secondary" = "primary") =>
  variant === "primary" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"

/* ------------------------------------------------------------------
 * Safe default RoomConfig generator
 * -----------------------------------------------------------------*/
interface RoomConfig {
  roomName: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions?: string[]
  basePrice: number
  tierUpgradePrice: number
  addOnsPrice: number
  reductionsPrice?: number
  totalPrice: number
  quantity: number
  detailedTasks: string[]
  notIncludedTasks: string[]
  upsellMessage: string
  isPriceTBD?: boolean
  paymentType?: "online" | "in_person"
}

export const safeGetRoomConfig = (roomType: string): RoomConfig => ({
  roomName: roomType,
  selectedTier: "PREMIUM CLEAN",
  selectedAddOns: [],
  selectedReductions: [],
  basePrice: 50,
  tierUpgradePrice: 0,
  addOnsPrice: 0,
  reductionsPrice: 0,
  totalPrice: 50,
  quantity: 1,
  detailedTasks: [],
  notIncludedTasks: [],
  upsellMessage: "",
})

/* ------------------------------------------------------------------
 * No-op handler so imports resolve; replace with real logic as needed
 * -----------------------------------------------------------------*/
export const handleRoomConfigChange = (_config: RoomConfig) => {
  /* intentionally empty */
}

/* ------------------------------------------------------------------
 * Re-export roomIcons so existing imports keep working
 * -----------------------------------------------------------------*/
export { roomIcons }
