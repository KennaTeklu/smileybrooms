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

export const getRoomTiers = (roomType: string) => {
  const tiers = {
    bedroom: [
      {
        name: "ESSENTIAL CLEAN",
        description: "Basic cleaning of visible surfaces",
        price: 49.99,
        features: ["Dusting surfaces", "Vacuuming floors", "Making bed", "Emptying trash"],
        multiplier: 1,
      },
      {
        name: "ADVANCED CLEAN",
        description: "Deeper cleaning including hard-to-reach areas",
        price: 149.97, // Exactly 3x the Essential price
        features: [
          "Everything in Essential Clean",
          "Under bed cleaning",
          "Baseboards",
          "Window sills",
          "Light fixtures",
        ],
        multiplier: 3,
      },
      {
        name: "PREMIUM CLEAN",
        description: "Complete top-to-bottom cleaning",
        price: 449.91, // Exactly 9x the Essential price
        features: [
          "Everything in Advanced Clean",
          "Inside closets",
          "Behind furniture",
          "Wall spot cleaning",
          "Ceiling fans",
        ],
        multiplier: 9,
      },
    ],
    bathroom: [
      {
        name: "ESSENTIAL CLEAN",
        description: "Basic cleaning of visible surfaces",
        price: 49.99,
        features: ["Dusting surfaces", "Vacuuming floors", "Making bed", "Emptying trash"],
        multiplier: 1,
      },
      {
        name: "ADVANCED CLEAN",
        description: "Deeper cleaning including hard-to-reach areas",
        price: 149.97, // Exactly 3x the Essential price
        features: [
          "Everything in Essential Clean",
          "Under bed cleaning",
          "Baseboards",
          "Window sills",
          "Light fixtures",
        ],
        multiplier: 3,
      },
      {
        name: "PREMIUM CLEAN",
        description: "Complete top-to-bottom cleaning",
        price: 449.91, // Exactly 9x the Essential price
        features: [
          "Everything in Advanced Clean",
          "Inside closets",
          "Behind furniture",
          "Wall spot cleaning",
          "Ceiling fans",
        ],
        multiplier: 9,
      },
    ],
    kitchen: [
      {
        name: "ESSENTIAL CLEAN",
        description: "Basic cleaning of visible surfaces",
        price: 49.99,
        features: ["Dusting surfaces", "Vacuuming floors", "Making bed", "Emptying trash"],
        multiplier: 1,
      },
      {
        name: "ADVANCED CLEAN",
        description: "Deeper cleaning including hard-to-reach areas",
        price: 149.97, // Exactly 3x the Essential price
        features: [
          "Everything in Essential Clean",
          "Under bed cleaning",
          "Baseboards",
          "Window sills",
          "Light fixtures",
        ],
        multiplier: 3,
      },
      {
        name: "PREMIUM CLEAN",
        description: "Complete top-to-bottom cleaning",
        price: 449.91, // Exactly 9x the Essential price
        features: [
          "Everything in Advanced Clean",
          "Inside closets",
          "Behind furniture",
          "Wall spot cleaning",
          "Ceiling fans",
        ],
        multiplier: 9,
      },
    ],
    livingRoom: [
      {
        name: "ESSENTIAL CLEAN",
        description: "Basic cleaning of visible surfaces",
        price: 49.99,
        features: ["Dusting surfaces", "Vacuuming floors", "Making bed", "Emptying trash"],
        multiplier: 1,
      },
      {
        name: "ADVANCED CLEAN",
        description: "Deeper cleaning including hard-to-reach areas",
        price: 149.97, // Exactly 3x the Essential price
        features: [
          "Everything in Essential Clean",
          "Under bed cleaning",
          "Baseboards",
          "Window sills",
          "Light fixtures",
        ],
        multiplier: 3,
      },
      {
        name: "PREMIUM CLEAN",
        description: "Complete top-to-bottom cleaning",
        price: 449.91, // Exactly 9x the Essential price
        features: [
          "Everything in Advanced Clean",
          "Inside closets",
          "Behind furniture",
          "Wall spot cleaning",
          "Ceiling fans",
        ],
        multiplier: 9,
      },
    ],
    default: [
      {
        name: "ESSENTIAL CLEAN",
        description: "Basic cleaning of visible surfaces",
        price: 49.99,
        features: ["Dusting surfaces", "Vacuuming floors", "Making bed", "Emptying trash"],
        multiplier: 1,
      },
      {
        name: "ADVANCED CLEAN",
        description: "Deeper cleaning including hard-to-reach areas",
        price: 149.97, // Exactly 3x the Essential price
        features: [
          "Everything in Essential Clean",
          "Under bed cleaning",
          "Baseboards",
          "Window sills",
          "Light fixtures",
        ],
        multiplier: 3,
      },
      {
        name: "PREMIUM CLEAN",
        description: "Complete top-to-bottom cleaning",
        price: 449.91, // Exactly 9x the Essential price
        features: [
          "Everything in Advanced Clean",
          "Inside closets",
          "Behind furniture",
          "Wall spot cleaning",
          "Ceiling fans",
        ],
        multiplier: 9,
      },
    ],
    // ... other room types with similar multiplier structure
  }

  // Return the tiers for the requested room type, or default to bedroom
  return tiers[roomType as keyof typeof tiers] || tiers.bedroom
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
