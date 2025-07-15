import type { CartItem } from "./types"
import type { RoomConfig } from "@/lib/room-context"
import { RoomTier } from "@/lib/room-tiers"

/**
 * Generates a unique ID for a cart item based on its room configuration.
 * This ensures that the same room configuration always results in the same ID,
 * allowing for proper quantity management in the cart.
 * @param roomConfig The room configuration object.
 * @returns A unique string ID for the cart item.
 */
export function generateCartItemId(roomConfig: RoomConfig): string {
  const { roomType, selectedTier, selectedAddOns, selectedReductions } = roomConfig

  // Sort add-ons and reductions to ensure consistent ID regardless of order
  const sortedAddOns = [...selectedAddOns].sort().join(",")
  const sortedReductions = [...selectedReductions].sort().join(",")

  return `${roomType}-${selectedTier}-${sortedAddOns}-${sortedReductions}`
}

/**
 * Creates a CartItem object from a RoomConfig.
 * @param roomConfig The room configuration.
 * @param price The calculated price for the room.
 * @param quantity The quantity of this item.
 * @returns A CartItem object.
 */
export function createCartItemFromRoomConfig(roomConfig: RoomConfig, price: number, quantity = 1): CartItem {
  const { roomType, selectedTier, selectedAddOns, selectedReductions } = roomConfig
  const id = generateCartItemId(roomConfig)

  // Determine the display name for the cart item
  let name = `${roomType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
  if (selectedTier !== RoomTier.Standard) {
    name += ` (${selectedTier.replace(/\b\w/g, (l) => l.toUpperCase())})`
  }

  const descriptionParts: string[] = []
  if (selectedAddOns.length > 0) {
    descriptionParts.push(`Add-ons: ${selectedAddOns.map((a) => a.replace(/-/g, " ")).join(", ")}`)
  }
  if (selectedReductions.length > 0) {
    descriptionParts.push(`Reductions: ${selectedReductions.map((r) => r.replace(/-/g, " ")).join(", ")}`)
  }
  const description = descriptionParts.join("; ")

  return {
    id,
    name,
    price,
    quantity,
    image: `/images/${roomType}-professional.png`, // Example image path
    roomType,
    selectedTier,
    selectedAddOns,
    selectedReductions,
    description: description || "Standard cleaning service",
  }
}
