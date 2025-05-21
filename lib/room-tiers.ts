// Define the room tiers, add-ons, and reductions for the room configurator

export interface RoomTier {
  name: string
  description: string
  price: number
  features: string[]
}

export interface RoomAddOn {
  id: string
  name: string
  price: number
}

export interface RoomReduction {
  id: string
  name: string
  discount: number
}

// Update the pricing structure for tiers to use multipliers instead of fixed prices

// For the defaultTiers object, update each room type's tier pricing to use multipliers
// For example, in the bedroom section:

export const defaultTiers: Record<string, RoomTier[]> = {
  bedroom: [
    {
      name: "QUICK CLEAN",
      description: "Basic cleaning for lightly used rooms",
      price: 25.0,
      features: ["Surface dusting (3 key pieces)", "Floor vacuum (main pathways)", "Mirror/glass touch-up"],
    },
    {
      name: "DEEP CLEAN",
      description: "Thorough cleaning for regular maintenance",
      price: 25.0 * 3, // 3x the Quick Clean price
      features: [
        "Includes Quick Clean",
        "Under-bed extended reach",
        "Closet organization (visible items)",
        "Baseboard spotlight",
        "Window sill cleaning",
        "Light fixture dusting",
      ],
    },
    {
      name: "PREMIUM",
      description: "Comprehensive cleaning for maximum freshness",
      price: 25.0 * 9, // 9x the Quick Clean price
      features: [
        "Includes Deep Clean",
        "Mattress deep vacuum & flip",
        "Light fixture interior cleaning",
        "Aroma mist treatment",
        "Wall spot cleaning",
        "Furniture polishing",
        "Ceiling fan detailed cleaning",
        "Closet deep organization",
        "Under furniture detailed cleaning",
        "Air vent cleaning",
        "Door and doorframe cleaning",
        "Picture frame dusting",
      ],
    },
  ],
  bathroom: [
    {
      name: "QUICK CLEAN",
      description: "Basic cleaning for guest bathrooms",
      price: 30.0,
      features: ["Sink and counter wipe-down", "Toilet exterior cleaning", "Mirror cleaning"],
    },
    {
      name: "DEEP CLEAN",
      description: "Thorough cleaning for regular bathrooms",
      price: 30.0 * 3, // 3x the Quick Clean price
      features: [
        "Includes Quick Clean",
        "Shower/tub scrubbing",
        "Toilet deep clean (interior/exterior)",
        "Floor detailed mopping",
        "Cabinet fronts cleaning",
        "Towel replacement",
      ],
    },
    {
      name: "PREMIUM",
      description: "Comprehensive cleaning for master bathrooms",
      price: 30.0 * 9, // 9x the Quick Clean price
      features: [
        "Includes Deep Clean",
        "Grout detailed cleaning",
        "Cabinet interior organization",
        "Fixture polishing",
        "Aromatherapy treatment",
        "Shower door track cleaning",
        "Exhaust fan cleaning",
        "Mold/mildew treatment",
        "Tile wall cleaning",
        "Shower head descaling",
        "Drain cleaning",
        "Toilet tank cleaning",
      ],
    },
  ],
  kitchen: [
    {
      name: "QUICK CLEAN",
      description: "Surface cleaning for lightly used kitchens",
      price: 35.0,
      features: ["Countertop cleaning", "Sink washing", "Stovetop wipe-down"],
    },
    {
      name: "DEEP CLEAN",
      description: "Thorough cleaning for regular kitchens",
      price: 35.0 * 3, // 3x the Quick Clean price
      features: [
        "Includes Quick Clean",
        "Appliance exterior cleaning",
        "Cabinet fronts wiping",
        "Floor detailed mopping",
        "Microwave interior cleaning",
        "Trash emptying",
      ],
    },
    {
      name: "PREMIUM",
      description: "Comprehensive cleaning for gourmet kitchens",
      price: 35.0 * 9, // 9x the Quick Clean price
      features: [
        "Includes Deep Clean",
        "Refrigerator interior organization",
        "Oven deep cleaning",
        "Cabinet interior organization (1-2 cabinets)",
        "Dishwasher sanitizing cycle",
        "Range hood degreasing",
        "Under sink cleaning",
        "Backsplash detailed cleaning",
        "Small appliance cleaning",
        "Pantry organization",
        "Drawer cleaning and organization",
        "Cutting board sanitization",
      ],
    },
  ],
  livingRoom: [
    {
      name: "QUICK CLEAN",
      description: "Basic cleaning for living spaces",
      price: 30.0,
      features: ["Surface dusting", "Floor vacuum", "Coffee table cleaning"],
    },
    {
      name: "DEEP CLEAN",
      description: "Thorough cleaning for family rooms",
      price: 30.0 * 3, // 3x the Quick Clean price
      features: [
        "Includes Quick Clean",
        "Furniture vacuuming",
        "Under furniture cleaning",
        "Baseboard dusting",
        "Electronics dusting",
        "Throw pillow fluffing",
      ],
    },
    {
      name: "PREMIUM",
      description: "Comprehensive cleaning for entertainment areas",
      price: 30.0 * 9, // 9x the Quick Clean price
      features: [
        "Includes Deep Clean",
        "Upholstery spot treatment",
        "Ceiling fan detailed cleaning",
        "Window sill detailing",
        "Decor item individual cleaning",
        "Entertainment center organization",
        "Bookshelf dusting",
        "Light fixture cleaning",
        "Carpet spot treatment",
        "Wall spot cleaning",
        "Air vent cleaning",
        "Furniture polishing",
      ],
    },
  ],
  default: [
    {
      name: "QUICK CLEAN",
      description: "Basic cleaning for all spaces",
      price: 25.0,
      features: ["Surface dusting", "Floor vacuum/sweep", "General tidying"],
    },
    {
      name: "DEEP CLEAN",
      description: "Thorough cleaning for all spaces",
      price: 25.0 * 3, // 3x the Quick Clean price
      features: [
        "Includes Quick Clean",
        "Detailed dusting",
        "Floor detailed cleaning",
        "Baseboard attention",
        "Surface sanitizing",
        "Trash removal",
      ],
    },
    {
      name: "PREMIUM",
      description: "Comprehensive cleaning for all spaces",
      price: 25.0 * 9, // 9x the Quick Clean price
      features: [
        "Includes Deep Clean",
        "Specialty surface treatment",
        "Detail work on fixtures",
        "Hard-to-reach areas",
        "Aromatherapy finishing",
        "Wall spot cleaning",
        "Ceiling corner cleaning",
        "Door and doorframe cleaning",
        "Light fixture detailed cleaning",
        "Air vent cleaning",
        "Furniture polishing",
        "Decor item individual cleaning",
      ],
    },
  ],
}

// Default add-ons for all rooms
export const defaultAddOns: Record<string, RoomAddOn[]> = {
  bedroom: [
    { id: "bed-1", name: "Closet full reorganization", price: 25.0 },
    { id: "bed-2", name: "Blind track deep clean", price: 15.0 },
    { id: "bed-3", name: "Curtain/shade vacuuming", price: 12.0 },
    { id: "bed-4", name: "Wall mark removal (up to 5 spots)", price: 10.0 },
    { id: "bed-5", name: "Nightstand drawer organization", price: 8.0 },
  ],
  bathroom: [
    { id: "bath-1", name: "Shower door track deep clean", price: 15.0 },
    { id: "bath-2", name: "Grout detailed scrubbing", price: 30.0 },
    { id: "bath-3", name: "Cabinet interior organization", price: 20.0 },
    { id: "bath-4", name: "Exhaust fan cleaning", price: 12.0 },
    { id: "bath-5", name: "Mold/mildew treatment", price: 25.0 },
  ],
  kitchen: [
    { id: "kit-1", name: "Inside refrigerator cleaning", price: 30.0 },
    { id: "kit-2", name: "Inside oven cleaning", price: 35.0 },
    { id: "kit-3", name: "Cabinet interior organization (per cabinet)", price: 15.0 },
    { id: "kit-4", name: "Dishwasher deep clean", price: 20.0 },
    { id: "kit-5", name: "Small appliance detailed cleaning", price: 10.0 },
  ],
  livingRoom: [
    { id: "liv-1", name: "Upholstery vacuuming", price: 20.0 },
    { id: "liv-2", name: "Entertainment center organization", price: 25.0 },
    { id: "liv-3", name: "Ceiling fan detailed cleaning", price: 15.0 },
    { id: "liv-4", name: "Window treatment dusting", price: 18.0 },
    { id: "liv-5", name: "Decor item individual cleaning", price: 12.0 },
  ],
  default: [
    { id: "def-1", name: "Detailed dusting of all surfaces", price: 15.0 },
    { id: "def-2", name: "Wall spot cleaning", price: 12.0 },
    { id: "def-3", name: "Ceiling corner cobweb removal", price: 8.0 },
    { id: "def-4", name: "Light fixture cleaning", price: 10.0 },
    { id: "def-5", name: "Door/doorframe cleaning", price: 10.0 },
  ],
}

// Default reductions for all rooms
export const defaultReductions: Record<string, RoomReduction[]> = {
  bedroom: [
    { id: "bed-r1", name: "Skip mirror cleaning", discount: 5.0 },
    { id: "bed-r2", name: "Limit to 2 furniture pieces", discount: 8.0 },
    { id: "bed-r3", name: "No under-bed cleaning", discount: 10.0 },
    { id: "bed-r4", name: "Basic surface dusting only", discount: 7.0 },
  ],
  bathroom: [
    { id: "bath-r1", name: "Skip shower/tub cleaning", discount: 15.0 },
    { id: "bath-r2", name: "Basic toilet cleaning only", discount: 8.0 },
    { id: "bath-r3", name: "Skip floor mopping", discount: 10.0 },
    { id: "bath-r4", name: "No cabinet cleaning", discount: 5.0 },
  ],
  kitchen: [
    { id: "kit-r1", name: "Skip appliance exteriors", discount: 12.0 },
    { id: "kit-r2", name: "Basic countertop cleaning only", discount: 10.0 },
    { id: "kit-r3", name: "No floor mopping", discount: 15.0 },
    { id: "kit-r4", name: "Skip sink deep cleaning", discount: 8.0 },
  ],
  livingRoom: [
    { id: "liv-r1", name: "Skip under furniture", discount: 12.0 },
    { id: "liv-r2", name: "Basic vacuum only (no edges)", discount: 10.0 },
    { id: "liv-r3", name: "No electronics dusting", discount: 8.0 },
    { id: "liv-r4", name: "Skip decor item cleaning", discount: 7.0 },
  ],
  default: [
    { id: "def-r1", name: "Skip detailed dusting", discount: 10.0 },
    { id: "def-r2", name: "Basic floor cleaning only", discount: 12.0 },
    { id: "def-r3", name: "No baseboard cleaning", discount: 8.0 },
    { id: "def-r4", name: "Skip hard-to-reach areas", discount: 10.0 },
  ],
}

// Helper function to get tiers for a specific room type
export function getRoomTiers(roomType: string): RoomTier[] {
  return defaultTiers[roomType] || defaultTiers.default
}

// Helper function to get add-ons for a specific room type
export function getRoomAddOns(roomType: string): RoomAddOn[] {
  return defaultAddOns[roomType] || defaultAddOns.default
}

// Helper function to get reductions for a specific room type
export function getRoomReductions(roomType: string): RoomReduction[] {
  return defaultReductions[roomType] || defaultReductions.default
}

// Room type to icon mapping
export const roomIcons: Record<string, string> = {
  bedroom: "🛏️",
  bathroom: "🚿",
  kitchen: "🍳",
  livingRoom: "🛋️",
  diningRoom: "🍽️",
  homeOffice: "💻",
  laundryRoom: "🧺",
  entryway: "🚪",
  hallway: "🚶",
  stairs: "🪜",
  other: "➕",
}

// Room type to display name mapping
export const roomDisplayNames: Record<string, string> = {
  bedroom: "Bedroom",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  livingRoom: "Living Room",
  diningRoom: "Dining Room",
  homeOffice: "Home Office",
  laundryRoom: "Laundry Room",
  entryway: "Entryway",
  hallway: "Hallway",
  stairs: "Stairs",
  other: "Other Space",
}
