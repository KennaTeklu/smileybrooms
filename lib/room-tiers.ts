import type { RoomCategory, RoomConfig } from "./room-context"

export interface RoomTier {
  id: string
  name: string
  price: number
  description: string
  detailedTasks: string[]
  notIncludedTasks: string[]
  upsellMessage: string
  isPriceTBD?: boolean
  paymentType?: "online" | "in_person"
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

// Define a base structure for room tiers, keyed by their display name
export const roomCategories: { name: string; key: RoomCategory["category"] }[] = [
  { name: "Bedrooms", key: "bedroom" },
  { name: "Bathrooms", key: "bathroom" },
  { name: "Kitchens", key: "kitchen" },
  { name: "Living Rooms", key: "living_room" },
  { name: "Dining Rooms", key: "dining_room" },
  { name: "Hallways", key: "hallway" },
  { name: "Entryways", key: "entryway" },
  { name: "Home Offices", key: "home_office" },
  { name: "Laundry Rooms", key: "laundry_room" },
  { name: "Stairs", key: "stairs" },
  { name: "Custom Spaces", key: "custom_space" },
]

export const roomTiers: RoomConfig[] = [
  {
    id: "standard-bedroom",
    name: "Standard Bedroom",
    basePrice: 50.0,
    timeEstimate: "1-1.5 hours",
    description: "Thorough cleaning of all surfaces, vacuuming/mopping, and bed making.",
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
    basePrice: 75.0,
    timeEstimate: "1.5-2 hours",
    description: "Includes all standard bedroom services plus organization and linen change.",
    image: "/images/bedroom-professional.png",
    category: "bedroom",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "standard-bathroom",
    name: "Standard Bathroom",
    basePrice: 60.0,
    timeEstimate: "1-1.5 hours",
    description: "Deep cleaning of toilet, shower, sink, and floor.",
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
    basePrice: 90.0,
    timeEstimate: "1.5-2 hours",
    description: "Comprehensive cleaning including grout scrubbing and mirror polishing.",
    image: "/images/bathroom-professional.png",
    category: "bathroom",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "standard-kitchen",
    name: "Standard Kitchen",
    basePrice: 80.0,
    timeEstimate: "1.5-2 hours",
    description: "Countertops, sink, stovetop, and exterior of appliances cleaned.",
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
    basePrice: 120.0,
    timeEstimate: "2-3 hours",
    description: "Includes standard kitchen plus interior microwave, oven exterior, and cabinet fronts.",
    image: "/images/kitchen-professional.png",
    category: "kitchen",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "standard-living-room",
    name: "Standard Living Room",
    basePrice: 70.0,
    timeEstimate: "1-1.5 hours",
    description: "Dusting, vacuuming, and general tidying of living areas.",
    image: "/images/living-room-professional.png",
    category: "living_room",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "large-living-room",
    name: "Large Living Room",
    basePrice: 100.0,
    timeEstimate: "1.5-2 hours",
    description: "Extended cleaning for larger living spaces, including furniture vacuuming.",
    image: "/images/living-room-professional.png",
    category: "living_room",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "standard-dining-room",
    name: "Standard Dining Room",
    basePrice: 45.0,
    timeEstimate: "0.5-1 hour",
    description: "Table and chairs cleaned, floor vacuumed/mopped, and surfaces dusted.",
    image: "/images/dining-room-professional.png",
    category: "dining_room",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "hallway-cleaning",
    name: "Hallway Cleaning",
    basePrice: 30.0,
    timeEstimate: "0.5-1 hour",
    description: "Vacuuming/mopping, baseboard cleaning, and dusting of fixtures.",
    image: "/images/hallway-professional.png",
    category: "hallway",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "entryway-cleaning",
    name: "Entryway Cleaning",
    basePrice: 25.0,
    timeEstimate: "0.5 hours",
    description: "Tidying, floor cleaning, and dusting of entry area.",
    image: "/images/entryway-professional.png",
    category: "entryway",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "home-office-cleaning",
    name: "Home Office Cleaning",
    basePrice: 55.0,
    timeEstimate: "1-1.5 hours",
    description: "Desk and surface cleaning, vacuuming, and waste removal.",
    image: "/images/home-office-professional.png",
    category: "home_office",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "laundry-room-cleaning",
    name: "Laundry Room Cleaning",
    basePrice: 40.0,
    timeEstimate: "0.5-1 hour",
    description: "Wipe down machines, clean sink, and tidy surfaces.",
    image: "/images/laundry-room-professional.png",
    category: "laundry_room",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  {
    id: "stairs-cleaning",
    name: "Stairs Cleaning",
    basePrice: 35.0,
    timeEstimate: "0.5-1 hour",
    description: "Vacuuming/mopping stairs and dusting railings.",
    image: "/images/stairs-professional.png",
    category: "stairs",
    addons: [],
    reductions: [],
    isPriceTBD: false,
    paymentType: "online",
  },
  // Custom space is handled dynamically in pricing-content.tsx, but its category is defined here
  // {
  //   id: "custom-space",
  //   name: "Custom Space",
  //   basePrice: 0, // Price is TBD
  //   timeEstimate: "Varies",
  //   description: "For unique areas or specific cleaning requests.",
  //   image: "/placeholder.svg?height=100&width=100",
  //   category: "custom_space",
  //   addons: [],
  //   reductions: [],
  //   isPriceTBD: true,
  //   paymentType: "in_person",
  // },
]

export const requiresEmailPricing = (roomType: string | undefined): boolean => {
  return roomType === "custom_space"
}

export const CUSTOM_SPACE_LEGAL_DISCLAIMER =
  "For custom spaces, the price will be determined after a brief consultation. This ensures we provide the most accurate and fair quote for your unique cleaning needs."

/**
 * Human-friendly names for each room/category key.
 * These are consumed by various UI components (e.g. pricing & cart pages).
 */
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
