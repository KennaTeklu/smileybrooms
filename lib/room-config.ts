import { roomIcons, roomDisplayNames, roomImages } from "@/lib/room-tiers"

export interface RoomType {
  id: string
  name: string
  icon: string
  basePrice: number
  image: string
}

// Define the original base prices from the previous summary's roomConfig.ts
// This map includes all rooms that were explicitly in the `roomPrices` object or `roomTypes` array.
const originalBasePricesMap: Record<string, number> = {
  master_bedroom: 54.28,
  bedroom: 35.42,
  bathroom: 43.63,
  kitchen: 54.8,
  living_room: 31.37,
  dining_room: 25.63,
  office: 19.53, // Corresponds to home_office in new structure
  playroom: 25.64,
  mudroom: 21.73,
  laundry_room: 13.46,
  sunroom: 22.25,
  guest_room: 35.42,
  garage: 83.99,
  // For rooms that were not explicitly in the old roomConfig.ts,
  // we'll use their 'Essential Clean' price from room-tiers.ts as their "original" base
  // to ensure they also get proportionally scaled.
  entryway: 15.0, // From room-tiers.ts essential
  hallway: 15.0, // From room-tiers.ts essential
  stairs: 20.0, // From room-tiers.ts essential
  other: 25.0, // From room-tiers.ts default essential
}

// Calculate the multiplier based on the bedroom price change
const originalBedroomPrice = originalBasePricesMap.bedroom
const newBedroomPriceTarget = 125.0 // The desired new price for bedroom
const priceMultiplier = newBedroomPriceTarget / originalBedroomPrice

// Function to calculate new price proportionally, rounded to 2 decimal places
const calculateProportionalPrice = (originalPrice: number) => {
  return Number.parseFloat((originalPrice * priceMultiplier).toFixed(2))
}

// Construct the updated roomTypes array
const updatedRoomTypes: RoomType[] = Object.keys(roomDisplayNames).map((roomId) => {
  let originalPrice = originalBasePricesMap[roomId]
  // Handle mapping for 'office' to 'home_office'
  if (roomId === "home_office" && !originalPrice) {
    originalPrice = originalBasePricesMap.office
  }
  // Fallback for any room not explicitly in originalBasePricesMap,
  // using a generic default if no specific original price is found.
  // This ensures all rooms are scaled.
  if (!originalPrice) {
    console.warn(`Original price not found for ${roomId}. Using a default base for scaling.`)
    originalPrice = 25.0 // A generic default if no specific original price is found
  }

  const newPrice = calculateProportionalPrice(originalPrice)

  return {
    id: roomId,
    name: roomDisplayNames[roomId],
    icon: roomIcons[roomId],
    basePrice: newPrice,
    image: roomImages[roomId],
  }
})

export const roomConfig = {
  serviceFee: 50,
  frequencyMultipliers: {
    one_time: 2.17,
    weekly: 1.0,
    biweekly: 1.2,
    monthly: 1.54,
    semi_annual: 1.92,
    annually: 2.56,
    vip_daily: 7.5,
  },
  roomTypes: updatedRoomTypes,
  // initialRoomConfigs can be derived from roomTypes if needed, or removed if not used elsewhere
  // For now, let's keep it consistent with the previous structure, but derived.
  initialRoomConfigs: Object.fromEntries(
    updatedRoomTypes.map((roomType) => [
      roomType.id,
      {
        roomName: roomType.name,
        roomIcon: roomType.icon,
        roomImage: roomType.image,
        selectedTier: "", // This might need to be set based on a default tier from room-tiers.ts
        selectedAddOns: [],
        selectedReductions: [],
        totalPrice: roomType.basePrice,
        estimatedDuration: "N/A", // Placeholder
        detailedTasks: [], // Placeholder
        notIncludedTasks: [], // Placeholder
        upsellMessage: "", // Placeholder
      },
    ]),
  ),
}
