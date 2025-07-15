import type { CartItem } from "@/lib/cart-context"
import type { RoomConfig } from "@/lib/room-context"
import { RoomTierEnum } from "@/lib/room-tiers"

/**
 * Generates a unique and deterministic ID for a CartItem based on its room configuration.
 * This ensures that the same room configuration always results in the same ID,
 * allowing for consistent identification and consolidation in the cart.
 *
 * @param roomConfig The room configuration object.
 * @returns A unique string ID for the cart item.
 */
export function generateCartItemId(roomConfig: RoomConfig): string {
  const { roomType, selectedTier, selectedReductions } = roomConfig

  // Sort arrays to ensure deterministic stringification regardless of order
  const sortedReductions = [...selectedReductions].sort().join("-")

  return `${roomType}-${selectedTier}-${sortedReductions}`
}

/**
 * Creates a CartItem object from a RoomConfig and calculated price.
 *
 * @param roomConfig The room configuration.
 * @param price The calculated price for the room.
 * @param quantity The quantity of this item.
 * @returns A CartItem object.
 */
export function createCartItemFromRoomConfig(roomConfig: RoomConfig, price: number, quantity = 1): CartItem {
  const { roomType, selectedTier, selectedReductions } = roomConfig
  const id = generateCartItemId(roomConfig)

  // Determine the display name for the cart item
  let name = `${roomType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`
  if (selectedTier !== RoomTierEnum.Essential) {
    // Changed from RoomTier.Standard to RoomTierEnum.Essential
    name += ` (${selectedTier.replace(/\b\w/g, (l) => l.toUpperCase())})`
  }

  const descriptionParts: string[] = []
  // Removed add-ons from description
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
    metadata: {
      roomType,
      selectedTier,
      selectedReductions,
      description: description || "Standard cleaning service",
    },
  }
}
