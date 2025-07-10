import { roomDisplayNames, getRoomTiers } from "./room-tiers"

export interface RoomConfig {
  id: string
  name: string
  basePrice: number
  description: string
  image: string
  icon: string
  tiers: { id: string; name: string; price: number }[]
}

export const roomConfigs: RoomConfig[] = Object.keys(roomDisplayNames).map((key) => {
  const tiers = getRoomTiers(key)
  const essentialTier = tiers.find((tier) => tier.id.includes("essential"))
  const basePrice = essentialTier ? essentialTier.price : 0

  return {
    id: key,
    name: roomDisplayNames[key],
    basePrice: basePrice,
    description: `Configure your ${roomDisplayNames[key]} cleaning.`,
    image: `/images/${key}-professional.png`, // Assuming images follow this pattern
    icon: "", // Icons are not directly used here, but can be added if needed
    tiers: tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: tier.price,
    })),
  }
})
