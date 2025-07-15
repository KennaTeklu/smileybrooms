import type { CartItem } from "@/lib/cart-context"
import type { RoomConfig } from "@/lib/room-context"

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
  const sortedAddOns = selectedAddOns ? [...selectedAddOns].sort() : []
  const sortedReductions = selectedReductions ? [...selectedReductions].sort() : []

  // Create a unique signature string
  const signature = JSON.stringify({
    roomType,
    selectedTier,
    addOns: sortedAddOns,
    reductions: sortedReductions,
  })

  // Use a simple hash or base64 encoding for a compact ID.
  // For simplicity, we'll use a basic string concatenation and a hash-like approach.
  // In a real application, consider a more robust hashing algorithm if collision avoidance is critical.
  return btoa(signature).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_") // Base64 URL-safe
}

/**
 * Creates a CartItem object from a RoomConfig and calculated price.
 *
 * @param roomConfig The room configuration.
 * @param price The calculated price for the room.
 * @returns A CartItem object.
 */
export function createCartItemFromRoomConfig(roomConfig: RoomConfig, price: number): CartItem {
  const id = generateCartItemId(roomConfig)
  const name = `${roomConfig.roomType} - ${roomConfig.selectedTier} Cleaning`
  const priceId = `${roomConfig.roomType}-${roomConfig.selectedTier}-price` // Example priceId, adjust as needed

  return {
    id,
    name,
    price,
    priceId,
    quantity: 1, // Always add one instance of this specific configuration
    roomType: roomConfig.roomType,
    selectedTier: roomConfig.selectedTier,
    selectedAddOns: roomConfig.selectedAddOns,
    selectedReductions: roomConfig.selectedReductions,
    sourceSection: "pricing-page", // Example source
  }
}
