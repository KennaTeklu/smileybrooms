import type { RoomConfig } from "./room-context"

// Define the structure for a room tier
export type RoomTier = {
  id: string
  name: string
  basePrice: number
  timeEstimate: string
  description: string
  image: string
  category:
    | "bedroom"
    | "bathroom"
    | "kitchen"
    | "living_room"
    | "dining_room"
    | "hallway"
    | "entryway"
    | "home_office"
    | "laundry_room"
    | "stairs"
    | "custom_space"
  features: string[] // List of features included in this tier
  paymentType: "online" | "in_person" // "online" for standard, "in_person" for custom
}

// Define room categories for navigation and filtering
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
]

// Define the room tiers with their details
export const roomTiers: RoomTier[] = [
  // Bedrooms
  {
    id: "bedroom-essential",
    name: "Essential Bedroom Clean",
    basePrice: 45.0,
    timeEstimate: "1 hour",
    description: "Basic cleaning for a tidy bedroom.",
    image: "/images/bedroom-professional.png",
    category: "bedroom",
    features: ["Dusting surfaces", "Vacuum/mop floors", "Empty trash", "Mirror cleaning"],
    paymentType: "online",
  },
  {
    id: "bedroom-standard",
    name: "Standard Bedroom Clean",
    basePrice: 65.0,
    timeEstimate: "1-1.5 hours",
    description: "More thorough cleaning, including light organization.",
    image: "/images/bedroom-professional.png",
    category: "bedroom",
    features: ["All essential features", "Light organization", "Wipe down baseboards", "Clean light fixtures"],
    paymentType: "online",
  },
  {
    id: "bedroom-premium",
    name: "Premium Bedroom Clean",
    basePrice: 90.0,
    timeEstimate: "1.5-2 hours",
    description: "Deep cleaning with attention to detail and sanitization.",
    image: "/images/bedroom-professional.png",
    category: "bedroom",
    features: ["All standard features", "Sanitize high-touch areas", "Vacuum upholstery", "Clean window interiors"],
    paymentType: "online",
  },
  // Bathrooms
  {
    id: "bathroom-essential",
    name: "Essential Bathroom Clean",
    basePrice: 55.0,
    timeEstimate: "1 hour",
    description: "Quick clean for a frequently used bathroom.",
    image: "/images/bathroom-professional.png",
    category: "bathroom",
    features: ["Toilet & sink clean", "Mirror shine", "Floor vacuum/mop", "Empty trash"],
    paymentType: "online",
  },
  {
    id: "bathroom-standard",
    name: "Standard Bathroom Clean",
    basePrice: 80.0,
    timeEstimate: "1.5 hours",
    description: "Thorough cleaning, including shower/tub scrub.",
    image: "/images/bathroom-professional.png",
    category: "bathroom",
    features: ["All essential features", "Shower/tub scrub", "Countertop sanitization", "Fixture polishing"],
    paymentType: "online",
  },
  {
    id: "bathroom-premium",
    name: "Premium Bathroom Clean",
    basePrice: 110.0,
    timeEstimate: "2 hours",
    description: "Deep sanitization and detailed cleaning for a sparkling bathroom.",
    image: "/images/bathroom-professional.png",
    category: "bathroom",
    features: ["All standard features", "Grout cleaning", "Cabinet exterior wipe", "Ventilation cover dusting"],
    paymentType: "online",
  },
  // Kitchens
  {
    id: "kitchen-essential",
    name: "Essential Kitchen Clean",
    basePrice: 70.0,
    timeEstimate: "1.5 hours",
    description: "Basic wipe-down for a functional kitchen.",
    image: "/images/kitchen-professional.png",
    category: "kitchen",
    features: ["Countertop wipe", "Sink scrub", "Stovetop wipe", "Floor vacuum/mop", "Empty trash"],
    paymentType: "online",
  },
  {
    id: "kitchen-standard",
    name: "Standard Kitchen Clean",
    basePrice: 100.0,
    timeEstimate: "2 hours",
    description: "More detailed cleaning, including appliance exteriors.",
    image: "/images/kitchen-professional.png",
    category: "kitchen",
    features: ["All essential features", "Appliance exteriors wipe", "Microwave interior clean", "Cabinet spot clean"],
    paymentType: "online",
  },
  {
    id: "kitchen-premium",
    name: "Premium Kitchen Clean",
    basePrice: 140.0,
    timeEstimate: "2.5-3 hours",
    description: "Comprehensive deep clean for a spotless and sanitized kitchen.",
    image: "/images/kitchen-professional.png",
    category: "kitchen",
    features: ["All standard features", "Inside range hood clean", "Backsplash degrease", "Small appliance wipe"],
    paymentType: "online",
  },
  // Living Rooms
  {
    id: "living_room-essential",
    name: "Essential Living Room Clean",
    basePrice: 50.0,
    timeEstimate: "1 hour",
    description: "Quick tidy-up for your main living space.",
    image: "/images/living-room-professional.png",
    category: "living_room",
    features: ["Dusting surfaces", "Vacuum/mop floors", "Empty trash", "Cushion fluffing"],
    paymentType: "online",
  },
  {
    id: "living_room-standard",
    name: "Standard Living Room Clean",
    basePrice: 75.0,
    timeEstimate: "1.5 hours",
    description: "More detailed cleaning, including light organization and decor dusting.",
    image: "/images/living-room-professional.png",
    category: "living_room",
    features: ["All essential features", "Light organization", "Dusting decor items", "Wipe down accessible shelves"],
    paymentType: "online",
  },
  {
    id: "living_room-premium",
    name: "Premium Living Room Clean",
    basePrice: 100.0,
    timeEstimate: "2 hours",
    description: "Deep cleaning with attention to upholstery and hard-to-reach areas.",
    image: "/images/living-room-professional.png",
    category: "living_room",
    features: ["All standard features", "Vacuum upholstery", "Clean glass surfaces", "Dusting blinds/curtains"],
    paymentType: "online",
  },
  // Dining Rooms
  {
    id: "dining_room-essential",
    name: "Essential Dining Room Clean",
    basePrice: 40.0,
    timeEstimate: "0.75 hours",
    description: "Basic clean for your dining area.",
    image: "/images/dining-room-professional.png",
    category: "dining_room",
    features: ["Table wipe down", "Chair wipe down", "Floor vacuum/mop", "Dusting surfaces"],
    paymentType: "online",
  },
  {
    id: "dining_room-standard",
    name: "Standard Dining Room Clean",
    basePrice: 60.0,
    timeEstimate: "1 hour",
    description: "Thorough cleaning, including light fixture dusting.",
    image: "/images/dining-room-professional.png",
    category: "dining_room",
    features: ["All essential features", "Dusting light fixtures", "Wipe down baseboards"],
    paymentType: "online",
  },
  // Hallways
  {
    id: "hallway-standard",
    name: "Standard Hallway Clean",
    basePrice: 30.0,
    timeEstimate: "0.5 hours",
    description: "Cleaning for common passage areas.",
    image: "/images/hallway-professional.png",
    category: "hallway",
    features: ["Floor vacuum/mop", "Dusting surfaces", "Wipe down light switches"],
    paymentType: "online",
  },
  // Entryways
  {
    id: "entryway-standard",
    name: "Standard Entryway Clean",
    basePrice: 35.0,
    timeEstimate: "0.5 hours",
    description: "Welcoming clean for your home's entrance.",
    image: "/images/entryway-professional.png",
    category: "entryway",
    features: ["Floor vacuum/mop", "Dusting surfaces", "Wipe down door handles"],
    paymentType: "online",
  },
  // Home Offices
  {
    id: "home_office-standard",
    name: "Standard Home Office Clean",
    basePrice: 60.0,
    timeEstimate: "1 hour",
    description: "Tidy and clean your workspace.",
    image: "/images/home-office-professional.png",
    category: "home_office",
    features: ["Dusting desk & surfaces", "Vacuum/mop floors", "Empty trash", "Monitor wipe (exterior)"],
    paymentType: "online",
  },
  // Laundry Rooms
  {
    id: "laundry_room-standard",
    name: "Standard Laundry Room Clean",
    basePrice: 40.0,
    timeEstimate: "0.75 hours",
    description: "Clean and refresh your laundry area.",
    image: "/images/laundry-room-professional.png",
    category: "laundry_room",
    features: ["Wipe down machines (exterior)", "Sink clean", "Floor sweep/mop", "Countertop wipe"],
    paymentType: "online",
  },
  // Stairs
  {
    id: "stairs-standard",
    name: "Standard Stairs Clean",
    basePrice: 25.0,
    timeEstimate: "0.5 hours",
    description: "Cleaning for a standard set of stairs.",
    image: "/images/stairs-professional.png",
    category: "stairs",
    features: ["Vacuum/mop stairs", "Wipe down railings"],
    paymentType: "online",
  },
  // Custom Space (placeholder for "Email for Pricing")
  {
    id: "custom-space-request",
    name: "Custom Space Request",
    basePrice: 0, // Price is TBD
    timeEstimate: "Varies",
    description: "For unique areas not listed, we provide a custom quote.",
    image: "/placeholder.svg?height=100&width=100",
    category: "custom_space",
    features: ["Personalized service", "Tailored cleaning plan", "On-site estimate"],
    isPriceTBD: true,
    paymentType: "in_person",
  },
]

// Helper to get tiers for a specific room type
export const getRoomTiers = (category: RoomConfig["category"]) => {
  return roomTiers.filter((tier) => tier.category === category)
}

// Helper to determine if a room category requires email pricing
export const requiresEmailPricing = (category: RoomConfig["category"] | undefined): boolean => {
  if (!category) return false
  return category === "custom_space"
}

// Legal disclaimer for custom spaces
export const CUSTOM_SPACE_LEGAL_DISCLAIMER =
  "For custom spaces, the price will be determined after an on-site estimate. You will not be charged online for these services."

// Mapping for display names (if needed, though `name` in RoomTier is often sufficient)
export const roomDisplayNames: Record<RoomConfig["category"], string> = {
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

// Placeholder for defaultTiers (can be generated from roomTiers if needed for a specific use case)
// This is a simplified version. If you need a more complex structure for default tiers
// (e.g., mapping each category to a specific default tier ID), you'd build it here.
export const defaultTiers: { [key: string]: RoomTier[] } = roomCategories.reduce(
  (acc, category) => {
    acc[category.key] = roomTiers.filter((tier) => tier.category === category.key)
    return acc
  },
  {} as { [key: string]: RoomTier[] },
)

// Placeholder for roomImages (can be generated from roomTiers if needed for a specific use case)
export const roomImages: Record<string, string> = roomTiers.reduce(
  (acc, tier) => {
    acc[tier.id] = tier.image
    return acc
  },
  {} as Record<string, string>,
)

// Placeholder for getRoomAddOns and getRoomReductions if they were used elsewhere
// For now, they are not explicitly defined as they are not used in the provided context.
export const getRoomAddOns = (roomType: string) => {
  return [] // Return empty array for now, implement if needed
}

export const getRoomReductions = (roomType: string) => {
  return [] // Return empty array for now, implement if needed
}
