// lib/room-tiers.tsx

export type RoomTier = {
  id: string
  name: string
  description: string
  price: number
  features: string[]
}

export const defaultTiers: RoomTier[] = [
  {
    id: "basic",
    name: "Basic Room",
    description: "A simple room with basic amenities.",
    price: 50,
    features: ["Single bed", "Private bathroom", "Wi-Fi"],
  },
  {
    id: "standard",
    name: "Standard Room",
    description: "A comfortable room with enhanced features.",
    price: 100,
    features: ["Queen bed", "Private bathroom", "Wi-Fi", "TV"],
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    description: "A luxurious room with premium amenities.",
    price: 150,
    features: ["King bed", "Private bathroom", "Wi-Fi", "TV", "Balcony", "Mini-fridge"],
  },
]

// Back-compat: expose `defaultTiers` under the expected name `roomTiers`
export const roomTiers = defaultTiers
