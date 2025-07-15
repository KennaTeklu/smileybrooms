export const roomImages: Record<string, string> = {
  bedroom: "/images/bedroom-professional.png",
  bathroom: "/images/bathroom-professional.png",
  kitchen: "/images/kitchen-professional.png",
  living_room: "/images/living-room-professional.png",
  dining_room: "/images/dining-room-professional.png",
  home_office: "/images/home-office-professional.png",
  laundry_room: "/images/laundry-room-professional.png",
  entryway: "/images/entryway-professional.png",
  hallway: "/images/hallway-professional.png",
  stairs: "/images/stairs-professional.png",
  other: "/placeholder.svg?height=100&width=100", // Generic image for custom rooms
}

export const roomDisplayNames: Record<string, string> = {
  bedroom: "Bedroom",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  living_room: "Living Room",
  dining_room: "Dining Room",
  home_office: "Home Office",
  laundry_room: "Laundry Room",
  entryway: "Entryway",
  hallway: "Hallway",
  stairs: "Stairs",
  // Custom rooms will have their names set dynamically
}

export interface RoomTier {
  id: string
  name: string
  basePrice: number
  detailedTasks: string[]
  notIncludedTasks: string[]
  upsellMessage: string
}

export interface RoomAddOn {
  id: string
  name: string
  price: number
  description?: string
}

export interface RoomReduction {
  id: string
  name: string
  discount: number
  description?: string
}

export const roomTiers: Record<string, RoomTier> = {
  "ESSENTIAL CLEAN": {
    id: "essential-clean",
    name: "ESSENTIAL CLEAN",
    basePrice: 50,
    detailedTasks: [
      "Dusting all surfaces",
      "Vacuuming/mopping floors",
      "Wiping down countertops",
      "Emptying trash bins",
    ],
    notIncludedTasks: ["Deep stain removal", "Window cleaning", "Appliance interior cleaning"],
    upsellMessage: "For a more thorough clean, consider our Premium Clean.",
  },
  "PREMIUM CLEAN": {
    id: "premium-clean",
    name: "PREMIUM CLEAN",
    basePrice: 75,
    detailedTasks: [
      "All Essential Clean tasks",
      "Baseboard wiping",
      "Light fixture dusting",
      "Door frame wiping",
      "Exterior appliance wiping",
    ],
    notIncludedTasks: ["Carpet shampooing", "Grout cleaning", "Wall washing"],
    upsellMessage: "Experience ultimate freshness with our Luxury Clean.",
  },
  "LUXURY CLEAN": {
    id: "luxury-clean",
    name: "LUXURY CLEAN",
    basePrice: 100,
    detailedTasks: [
      "All Premium Clean tasks",
      "Interior window cleaning (reachable)",
      "Cabinet exterior wiping",
      "Sanitizing high-touch areas",
      "Vent dusting",
    ],
    notIncludedTasks: ["Exterior window cleaning", "Upholstery cleaning"],
    upsellMessage: "Our Luxury Clean provides the most comprehensive service.",
  },
}

export const defaultTiers = {
  default: [
    {
      id: "bedroom-essential",
      name: "ESSENTIAL CLEAN",
      price: 50,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "bedroom-premium",
      name: "PREMIUM CLEAN",
      price: 75,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "bedroom-luxury",
      name: "LUXURY CLEAN",
      price: 100,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  bathroom: [
    {
      id: "bathroom-essential",
      name: "ESSENTIAL CLEAN",
      price: 60,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks.concat([
        "Toilet cleaning",
        "Sink & counter sanitizing",
      ]),
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "bathroom-premium",
      name: "PREMIUM CLEAN",
      price: 90,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks.concat([
        "Shower/tub scrub",
        "Mirror cleaning",
        "Chrome polishing",
      ]),
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "bathroom-luxury",
      name: "LUXURY CLEAN",
      price: 120,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks.concat([
        "Grout spot treatment",
        "Cabinet exterior wiping",
        "Vent cleaning",
      ]),
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  kitchen: [
    {
      id: "kitchen-essential",
      name: "ESSENTIAL CLEAN",
      price: 70,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks.concat([
        "Countertop wiping",
        "Sink cleaning",
        "Stovetop wiping",
      ]),
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "kitchen-premium",
      name: "PREMIUM CLEAN",
      price: 105,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks.concat([
        "Appliance exterior wiping",
        "Microwave interior/exterior",
        "Cabinet exterior wiping",
      ]),
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "kitchen-luxury",
      name: "LUXURY CLEAN",
      price: 140,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks.concat([
        "Backsplash cleaning",
        "Small appliance wiping",
        "Trash can sanitizing",
      ]),
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  living_room: [
    {
      id: "living_room-essential",
      name: "ESSENTIAL CLEAN",
      price: 55,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks.concat(["Surface dusting", "Vacuuming carpets"]),
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "living_room-premium",
      name: "PREMIUM CLEAN",
      price: 80,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks.concat([
        "Furniture wiping",
        "Cushion fluffing",
        "Light switch cleaning",
      ]),
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "living_room-luxury",
      name: "LUXURY CLEAN",
      price: 110,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks.concat([
        "Baseboard wiping",
        "Window sill cleaning",
        "Decorative item dusting",
      ]),
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  dining_room: [
    {
      id: "dining_room-essential",
      name: "ESSENTIAL CLEAN",
      price: 45,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks.concat(["Table wiping", "Floor cleaning"]),
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "dining_room-premium",
      name: "PREMIUM CLEAN",
      price: 65,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks.concat([
        "Chair wiping",
        "Buffet/sideboard dusting",
        "Light fixture dusting",
      ]),
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "dining_room-luxury",
      name: "LUXURY CLEAN",
      price: 90,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks.concat([
        "Cabinet exterior wiping",
        "Decorative item dusting",
        "Floor polishing",
      ]),
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  home_office: [
    {
      id: "home_office-essential",
      name: "ESSENTIAL CLEAN",
      price: 40,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks.concat(["Desk wiping", "Floor cleaning"]),
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "home_office-premium",
      name: "PREMIUM CLEAN",
      price: 60,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks.concat([
        "Monitor/keyboard dusting",
        "Shelf wiping",
        "Waste bin emptying",
      ]),
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "home_office-luxury",
      name: "LUXURY CLEAN",
      price: 85,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks.concat([
        "Bookcase dusting",
        "Light fixture wiping",
        "Door frame cleaning",
      ]),
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  laundry_room: [
    {
      id: "laundry_room-essential",
      name: "ESSENTIAL CLEAN",
      price: 35,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks.concat(["Surface wiping", "Floor cleaning"]),
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "laundry_room-premium",
      name: "PREMIUM CLEAN",
      price: 50,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks.concat([
        "Washer/dryer exterior wiping",
        "Sink cleaning",
        "Cabinet exterior wiping",
      ]),
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "laundry_room-luxury",
      name: "LUXURY CLEAN",
      price: 70,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks.concat([
        "Vent cleaning",
        "Wall spot cleaning",
        "Floor sanitizing",
      ]),
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  entryway: [
    {
      id: "entryway-essential",
      name: "ESSENTIAL CLEAN",
      price: 30,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks.concat(["Floor cleaning", "Surface dusting"]),
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "entryway-premium",
      name: "PREMIUM CLEAN",
      price: 45,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks.concat([
        "Door wiping",
        "Light fixture dusting",
        "Mirror cleaning",
      ]),
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "entryway-luxury",
      name: "LUXURY CLEAN",
      price: 60,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks.concat([
        "Baseboard wiping",
        "Coat rack cleaning",
        "Shoe area tidying",
      ]),
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  hallway: [
    {
      id: "hallway-essential",
      name: "ESSENTIAL CLEAN",
      price: 25,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks.concat(["Floor cleaning", "Light dusting"]),
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "hallway-premium",
      name: "PREMIUM CLEAN",
      price: 40,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks.concat([
        "Baseboard wiping",
        "Door frame wiping",
        "Picture frame dusting",
      ]),
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "hallway-luxury",
      name: "LUXURY CLEAN",
      price: 55,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks.concat([
        "Wall spot cleaning",
        "Vent dusting",
        "Floor polishing",
      ]),
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  stairs: [
    {
      id: "stairs-essential",
      name: "ESSENTIAL CLEAN",
      price: 30,
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks.concat(["Vacuuming/mopping steps", "Railing wiping"]),
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "stairs-premium",
      name: "PREMIUM CLEAN",
      price: 45,
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks.concat([
        "Spindle dusting",
        "Under-step cleaning",
        "Wall spot cleaning",
      ]),
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "stairs-luxury",
      name: "LUXURY CLEAN",
      price: 60,
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks.concat([
        "Baseboard wiping along stairs",
        "Light fixture dusting",
        "Deep cleaning of corners",
      ]),
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  Add-ons & Reductions                                              */
/* ------------------------------------------------------------------ */
export const defaultAddOns: Record<string, RoomAddOn[]> = {
  bedroom: [
    { id: "addon-bed-1", name: "Closet organisation", price: 25 },
    { id: "addon-bed-2", name: "Blind track deep-clean", price: 15 },
  ],
  bathroom: [{ id: "addon-bath-1", name: "Grout scrub", price: 30 }],
  default: [{ id: "addon-def-1", name: "Wall spot cleaning", price: 12 }],
}

export const defaultReductions: Record<string, RoomReduction[]> = {
  bedroom: [{ id: "red-bed-1", name: "Skip mirror cleaning", discount: 5 }],
  default: [{ id: "red-def-1", name: "Basic surface dusting only", discount: 7 }],
}

export const getRoomTiers = (roomType: string): RoomTier[] => {
  // Return specific tiers if available, otherwise return default tiers
  return (defaultTiers as any)[roomType] || defaultTiers.default
}

export const getRoomAddOns = (roomType: string): RoomAddOn[] => {
  return (defaultAddOns as any)[roomType] || defaultAddOns.default
}

export const getRoomReductions = (roomType: string): RoomReduction[] => {
  return (defaultReductions as any)[roomType] || defaultReductions.default
}

export const requiresEmailPricing = (roomType: string): boolean => {
  // Example: if a room type is 'other-custom-room', it requires email pricing
  return roomType.startsWith("other-custom-")
}

export const CUSTOM_SPACE_LEGAL_DISCLAIMER =
  "For custom spaces, pricing will be determined after a brief consultation. Please use the 'Add Space & Request Pricing' button to send us an email with your request."
