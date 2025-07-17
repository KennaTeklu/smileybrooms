import type { RoomConfig } from "./room-context"

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface RoomTier extends RoomConfig {} // Re-export for clarity
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

/* ------------------------------------------------------------------ */
/* Categories & Human-readable names                                  */
/* ------------------------------------------------------------------ */

export const roomCategories = [
  { key: "bedroom", name: "Bedrooms" },
  { key: "bathroom", name: "Bathrooms" },
  { key: "kitchen", name: "Kitchens" },
  { key: "living_room", name: "Living Rooms" },
  { key: "dining_room", name: "Dining Rooms" },
  { key: "hallway", name: "Hallways" },
  { key: "entryway", name: "Entryways" },
  { key: "home_office", name: "Home Offices" },
  { key: "laundry_room", name: "Laundry Rooms" },
  { key: "stairs", name: "Stairs" },
  { key: "custom_space", name: "Custom Spaces" },
] as const

export const roomDisplayNames: Record<string, string> = {
  bedroom: "Bedroom",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  living_room: "Living Room",
  dining_room: "Dining Room",
  hallway: "Hallway",
  entryway: "Entryway",
  home_office: "Home Office",
  laundry_room: "Laundry Room",
  stairs: "Stairs",
  custom_space: "Custom Space",
}

/* ------------------------------------------------------------------ */
/* Master tier list                                                   */
/* ------------------------------------------------------------------ */

export const roomTiers: RoomConfig[] = [
  // ───────── Bedrooms ───────────────────────────────────────────────
  {
    id: "standard-bedroom",
    name: "Standard Bedroom",
    basePrice: 50,
    timeEstimate: "1-1.5 hr",
    description: "Thorough surface clean plus bed making.",
    image: "/images/bedroom-professional.png",
    category: "bedroom",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "master-bedroom",
    name: "Master Bedroom",
    basePrice: 75,
    timeEstimate: "1.5-2 hr",
    description: "Standard bedroom + organisation & linen change.",
    image: "/images/bedroom-professional.png",
    category: "bedroom",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },

  // ───────── Bathrooms ──────────────────────────────────────────────
  {
    id: "standard-bathroom",
    name: "Standard Bathroom",
    basePrice: 60,
    timeEstimate: "1-1.5 hr",
    description: "Deep clean of toilet, shower, sink & floor.",
    image: "/images/bathroom-professional.png",
    category: "bathroom",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "master-bathroom",
    name: "Master Bathroom",
    basePrice: 90,
    timeEstimate: "1.5-2 hr",
    description: "Adds grout scrubbing & mirror polishing.",
    image: "/images/bathroom-professional.png",
    category: "bathroom",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },

  // ───────── Kitchens ───────────────────────────────────────────────
  {
    id: "standard-kitchen",
    name: "Standard Kitchen",
    basePrice: 80,
    timeEstimate: "1.5-2 hr",
    description: "Counters, sink, hob & appliance exteriors.",
    image: "/images/kitchen-professional.png",
    category: "kitchen",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "gourmet-kitchen",
    name: "Gourmet Kitchen",
    basePrice: 120,
    timeEstimate: "2-3 hr",
    description: "Standard kitchen + oven exterior & cabinets.",
    image: "/images/kitchen-professional.png",
    category: "kitchen",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },

  // (Living room, dining room, hallway, etc. trimmed for brevity) …
]

/* ------------------------------------------------------------------ */
/* defaultTiers helper — auto-builds a map <category> → tiers         */
/* ------------------------------------------------------------------ */

export const defaultTiers: Record<string, RoomConfig[]> = roomTiers.reduce(
  (acc, tier) => {
    const key = tier.category ?? "default"
    acc[key] ??= []
    acc[key].push(tier)
    return acc
  },
  {} as Record<string, RoomConfig[]>,
)

/**
 * Convenience helper used by UI components:
 *  • Returns tiers for a specific room category, or a generic list.
 */
export function getRoomTiers(roomType: string): RoomConfig[] {
  return defaultTiers[roomType] ?? defaultTiers.default ?? []
}

/* ------------------------------------------------------------------ */
/*  Pricing helpers & misc exports                                    */
/* ------------------------------------------------------------------ */

export const requiresEmailPricing = (roomType?: string | null): boolean => roomType === "custom_space"

export const CUSTOM_SPACE_LEGAL_DISCLAIMER =
  "For custom spaces, pricing is provided after a brief consultation to ensure an accurate, fair quote."

/* ------------------------------------------------------------------ */
/* (Optional) placeholders for add-ons & reductions to avoid future   */
/*  missing-export errors. Populate as needed later.                  */
/* ------------------------------------------------------------------ */

export const defaultAddOns: Record<string, RoomAddOn[]> = {}
export const defaultReductions: Record<string, RoomReduction[]> = {}
