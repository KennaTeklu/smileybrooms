import type { CartItem } from "@/lib/cart-context" // Corrected import path
import type { RoomConfig } from "@/lib/room-context"
import { ROOM_TIERS } from "@/lib/room-tiers" // Import ROOM_TIERS for label lookup

/**
 * Generates a unique and deterministic ID for a CartItem based on its room configuration.
 * This ensures that the same room configuration always results in the same ID,
 * allowing for consistent identification and consolidation in the cart.
 *
 * @param roomConfig The room configuration object.
 * @returns A unique string ID for the cart item.
 */
export function generateCartItemId(roomConfig: RoomConfig): string {
  const { roomType, selectedTier, selectedAddOns, selectedReductions } = roomConfig

  // Sort arrays to ensure deterministic stringification regardless of order
  const sortedAddOns = [...selectedAddOns].sort().join("-")
  const sortedReductions = [...selectedReductions].sort().join("-")

  return `${roomType}-${selectedTier}-${sortedAddOns}-${sortedReductions}`
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
  const id = generateCartItemId(roomConfig)
  const tierLabel = ROOM_TIERS.find((tier) => tier.value === roomConfig.selectedTier)?.label || roomConfig.selectedTier
  const name = `${roomConfig.roomType.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} Cleaning - ${tierLabel}`

  const descriptionParts: string[] = []
  if (roomConfig.selectedAddOns.length > 0) {
    descriptionParts.push(`Add-ons: ${roomConfig.selectedAddOns.map((a) => a.replace(/-/g, " ")).join(", ")}`)
  }
  if (roomConfig.selectedReductions.length > 0) {
    descriptionParts.push(`Reductions: ${roomConfig.selectedReductions.map((r) => r.replace(/-/g, " ")).join(", ")}`)
  }
  const description = descriptionParts.join("; ") || "Standard cleaning service"

  return {
    id,
    name,
    price,
    quantity,
    image: `/images/${roomConfig.roomType}-professional.png`, // Example image path
    metadata: {
      roomType: roomConfig.roomType,
      selectedTier: roomConfig.selectedTier,
      selectedAddOns: roomConfig.selectedAddOns,
      selectedReductions: roomConfig.selectedReductions,
      frequency: "one_time", // Assuming one-time for now
      description: description,
    },
    paymentType: roomConfig.roomType === "other" ? "in_person" : "online", // Assuming 'other' room type implies in-person payment
  }
}
