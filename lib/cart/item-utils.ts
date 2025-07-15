import type { RoomConfig } from "@/lib/room-context"

/**
 * Generates a unique and deterministic ID for a cart item based on its room configuration.
 * This ensures that the same room configuration (room type, tier, add-ons, reductions)
 * always results in the same cart item ID, allowing for proper consolidation or distinction.
 * @param config The RoomConfig object.
 * @returns A unique string ID.
 */
export function generateRoomCartItemId(config: RoomConfig): string {
  const sortedAddOns = [...(config.selectedAddOns || [])].sort().join("-")
  const sortedReductions = [...(config.selectedReductions || [])].sort().join("-")

  // Create a signature based on the core properties that define a unique service instance
  const signature = [config.roomName, config.selectedTier, sortedAddOns, sortedReductions].join("_")

  // Use a simple hash or UUID based on the signature for a stable ID
  // For simplicity, we'll use a basic string concatenation. In a real app,
  // you might use a hashing library (e.g., `sha256`) for more robust IDs.
  return `room-${signature.replace(/[^a-zA-Z0-9-_]/g, "")}`
}

/**
 * Generates a display name for a cart item based on its room configuration.
 * @param config The RoomConfig object.
 * @returns A user-friendly string name.
 */
export function getRoomCartItemDisplayName(config: RoomConfig): string {
  const roomName = config.roomName.replace(/([A-Z])/g, " $1").trim() // Convert camelCase to "Camel Case"
  const tierName = config.selectedTier.replace(/-/g, " ").toUpperCase()

  let displayName = `${roomName} - ${tierName}`

  if (config.selectedAddOns && config.selectedAddOns.length > 0) {
    displayName += ` (+${config.selectedAddOns.length} Add-ons)`
  }
  if (config.selectedReductions && config.selectedReductions.length > 0) {
    displayName += ` (-${config.selectedReductions.length} Reductions)`
  }

  return displayName
}
