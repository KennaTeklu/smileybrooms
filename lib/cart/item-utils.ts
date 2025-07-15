import type { RoomConfig } from "@/lib/room-context"

/**
 * Generates a unique ID for a cart item based on its room configuration.
 * This ensures that the same room configuration always results in the same ID,
 * allowing for consistent identification and quantity updates in the cart.
 *
 * @param roomConfig The room configuration object.
 * @returns A unique string ID for the cart item.
 */
export function generateCartItemId(roomConfig: RoomConfig): string {
  const { roomType, selectedTier, selectedAddOns, selectedReductions } = roomConfig

  // Sort add-ons and reductions to ensure consistent ID regardless of order
  const sortedAddOns = [...selectedAddOns].sort()
  const sortedReductions = [...selectedReductions].sort()

  // Create a unique string based on all relevant properties
  const uniqueString = `${roomType}-${selectedTier}-${sortedAddOns.join(",")}-${sortedReductions.join(",")}`

  // Use a simple hash or just the string itself for the ID
  // For simplicity, we'll use the string directly. For very long strings or
  // cryptographic needs, a hashing function would be appropriate.
  return uniqueString
}
