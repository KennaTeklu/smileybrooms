import { roomIcons, roomDisplayNames, getRoomTiers, roomImages } from "@/lib/room-tiers"

export interface RoomType {
  id: string
  name: string
  icon: string
  basePrice: number // This will now reflect the 'Essential Clean' tier price
  image: string
}

export interface RoomConfig {
  roomName: string
  roomIcon: string
  roomImage: string
  selectedTier: string
  selectedAddOns: string[]
  selectedReductions: string[]
  totalPrice: number
  estimatedDuration: string
  detailedTasks: string[]
  notIncludedTasks: string[]
  upsellMessage?: string
}

// Define the room types and their base prices, now aligned with Essential Clean tier
export const roomConfig = {
  roomTypes: [
    {
      id: "bedroom",
      name: roomDisplayNames.bedroom,
      icon: roomIcons.bedroom,
      basePrice: getRoomTiers("bedroom").find((tier) => tier.id === "bedroom-essential")?.price || 125.0,
      image: roomImages.bedroom,
    },
    {
      id: "bathroom",
      name: roomDisplayNames.bathroom,
      icon: roomIcons.bathroom,
      basePrice: getRoomTiers("bathroom").find((tier) => tier.id === "bathroom-essential")?.price || 135.0,
      image: roomImages.bathroom,
    },
    {
      id: "kitchen",
      name: roomDisplayNames.kitchen,
      icon: roomIcons.kitchen,
      basePrice: getRoomTiers("kitchen").find((tier) => tier.id === "kitchen-essential")?.price || 155.0,
      image: roomImages.kitchen,
    },
    {
      id: "living_room",
      name: roomDisplayNames.livingRoom,
      icon: roomIcons.livingRoom,
      basePrice: getRoomTiers("livingRoom").find((tier) => tier.id === "livingroom-essential")?.price || 30.0,
      image: roomImages.livingRoom,
    },
    {
      id: "dining_room",
      name: roomDisplayNames.diningRoom,
      icon: roomIcons.diningRoom,
      basePrice: getRoomTiers("diningRoom").find((tier) => tier.id === "diningroom-essential")?.price || 25.0,
      image: roomImages.diningRoom,
    },
    {
      id: "home_office",
      name: roomDisplayNames.homeOffice,
      icon: roomIcons.homeOffice,
      basePrice: getRoomTiers("homeOffice").find((tier) => tier.id === "office-essential")?.price || 25.0,
      image: roomImages.homeOffice,
    },
    {
      id: "laundry_room",
      name: roomDisplayNames.laundryRoom,
      icon: roomIcons.laundryRoom,
      basePrice: getRoomTiers("laundryRoom").find((tier) => tier.id === "laundry-essential")?.price || 20.0,
      image: roomImages.laundryRoom,
    },
    {
      id: "entryway",
      name: roomDisplayNames.entryway,
      icon: roomIcons.entryway,
      basePrice: getRoomTiers("entryway").find((tier) => tier.id === "entryway-essential")?.price || 15.0,
      image: roomImages.entryway,
    },
    {
      id: "hallway",
      name: roomDisplayNames.hallway,
      icon: roomIcons.hallway,
      basePrice: getRoomTiers("hallway").find((tier) => tier.id === "hallway-essential")?.price || 15.0,
      image: roomImages.hallway,
    },
    {
      id: "stairs",
      name: roomDisplayNames.stairs,
      icon: roomIcons.stairs,
      basePrice: getRoomTiers("stairs").find((tier) => tier.id === "stairs-essential")?.price || 20.0,
      image: roomImages.stairs,
    },
    {
      id: "other",
      name: roomDisplayNames.other,
      icon: roomIcons.other,
      basePrice: getRoomTiers("default").find((tier) => tier.id === "default-essential")?.price || 25.0,
      image: roomImages.other,
    },
  ],
  // Initial configuration for each room type
  initialRoomConfigs: Object.fromEntries(
    Object.keys(roomDisplayNames).map((roomType) => {
      const defaultTier = getRoomTiers(roomType)[0] // Get the first (essential) tier
      return [
        roomType,
        {
          roomName: roomDisplayNames[roomType],
          roomIcon: roomIcons[roomType],
          roomImage: roomImages[roomType],
          selectedTier: defaultTier.id,
          selectedAddOns: [],
          selectedReductions: [],
          totalPrice: defaultTier.price,
          estimatedDuration: defaultTier.timeEstimate,
          detailedTasks: defaultTier.detailedTasks,
          notIncludedTasks: defaultTier.notIncludedTasks,
          upsellMessage: defaultTier.upsellMessage,
        },
      ]
    }),
  ),
}
