export interface RoomTier {
  id: string
  name: string
  price: number
  description: string
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

// Define a base structure for room tiers, keyed by their display name
export const roomTiers = {
  "ESSENTIAL CLEAN": {
    basePrice: 50,
    detailedTasks: ["Dusting all surfaces", "Vacuuming/mopping floors", "Wiping down counters", "Emptying trash"],
    notIncludedTasks: ["Deep stain removal", "Inside oven/fridge cleaning", "Window cleaning", "Wall washing"],
    upsellMessage: "Upgrade to Premium Clean for a more thorough service!",
  },
  "PREMIUM CLEAN": {
    basePrice: 80,
    detailedTasks: [
      "All Essential Clean tasks",
      "Baseboard wiping",
      "Light fixture dusting",
      "Cabinet exterior wiping",
      "Mirror cleaning",
    ],
    notIncludedTasks: ["Inside oven/fridge cleaning", "Window cleaning", "Wall washing"],
    upsellMessage: "Consider Luxury Clean for a truly spotless home!",
  },
  "LUXURY CLEAN": {
    basePrice: 120,
    detailedTasks: [
      "All Premium Clean tasks",
      "Inside window cleaning (reachable)",
      "Inside oven/fridge cleaning",
      "Individual decor dusting",
      "Vent dusting",
    ],
    notIncludedTasks: ["Exterior window cleaning", "Carpet shampooing", "Heavy duty wall washing"],
    upsellMessage: "For specialized needs, explore our add-on services!",
  },
  // Add more tiers as needed
} as const // Use 'as const' for type safety

// Define specific tiers for each room type, referencing the base prices and details from roomTiers
export const defaultTiers = {
  default: [
    {
      id: "default-essential",
      name: "ESSENTIAL CLEAN",
      price: roomTiers["ESSENTIAL CLEAN"].basePrice,
      description: "Basic cleaning for everyday tidiness.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "default-premium",
      name: "PREMIUM CLEAN",
      price: roomTiers["PREMIUM CLEAN"].basePrice,
      description: "A more thorough clean, perfect for regular maintenance.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "default-luxury",
      name: "LUXURY CLEAN",
      price: roomTiers["LUXURY CLEAN"].basePrice,
      description: "Our most comprehensive clean, leaving your home spotless.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  bedroom: [
    {
      id: "bedroom-essential",
      name: "ESSENTIAL CLEAN",
      price: 50,
      description: "Basic bedroom tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "bedroom-premium",
      name: "PREMIUM CLEAN",
      price: 80,
      description: "Thorough bedroom cleaning.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "bedroom-luxury",
      name: "LUXURY CLEAN",
      price: 120,
      description: "Deep and detailed bedroom cleaning.",
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
      description: "Basic bathroom refresh.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "bathroom-premium",
      name: "PREMIUM CLEAN",
      price: 95,
      description: "Thorough bathroom sanitization.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "bathroom-luxury",
      name: "LUXURY CLEAN",
      price: 140,
      description: "Deep and detailed bathroom cleaning.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  kitchen: [
    {
      id: "kitchen-essential",
      name: "ESSENTIAL CLEAN",
      price: 70,
      description: "Basic kitchen wipe-down.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "kitchen-premium",
      name: "PREMIUM CLEAN",
      price: 110,
      description: "Thorough kitchen degreasing and sanitization.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "kitchen-luxury",
      name: "LUXURY CLEAN",
      price: 160,
      description: "Deep and detailed kitchen cleaning.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  livingRoom: [
    {
      id: "livingroom-essential",
      name: "ESSENTIAL CLEAN",
      price: 55,
      description: "Basic living room tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "livingroom-premium",
      name: "PREMIUM CLEAN",
      price: 85,
      description: "Thorough living room cleaning.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "livingroom-luxury",
      name: "LUXURY CLEAN",
      price: 125,
      description: "Deep and detailed living room cleaning.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  diningRoom: [
    {
      id: "diningroom-essential",
      name: "ESSENTIAL CLEAN",
      price: 45,
      description: "Basic dining room tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "diningroom-premium",
      name: "PREMIUM CLEAN",
      price: 70,
      description: "Thorough dining room cleaning.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "diningroom-luxury",
      name: "LUXURY CLEAN",
      price: 100,
      description: "Deep and detailed dining room cleaning.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  homeOffice: [
    {
      id: "homeoffice-essential",
      name: "ESSENTIAL CLEAN",
      price: 40,
      description: "Basic home office tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "homeoffice-premium",
      name: "PREMIUM CLEAN",
      price: 65,
      description: "Thorough home office cleaning.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "homeoffice-luxury",
      name: "LUXURY CLEAN",
      price: 90,
      description: "Deep and detailed home office cleaning.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  laundryRoom: [
    {
      id: "laundryroom-essential",
      name: "ESSENTIAL CLEAN",
      price: 30,
      description: "Basic laundry room tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "laundryroom-premium",
      name: "PREMIUM CLEAN",
      price: 50,
      description: "Thorough laundry room cleaning.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "laundryroom-luxury",
      name: "LUXURY CLEAN",
      price: 70,
      description: "Deep and detailed laundry room cleaning.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  entryway: [
    {
      id: "entryway-essential",
      name: "ESSENTIAL CLEAN",
      price: 25,
      description: "Basic entryway tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "entryway-premium",
      name: "PREMIUM CLEAN",
      price: 40,
      description: "Thorough entryway cleaning.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "entryway-luxury",
      name: "LUXURY CLEAN",
      price: 55,
      description: "Deep and detailed entryway cleaning.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  hallway: [
    {
      id: "hallway-essential",
      name: "ESSENTIAL CLEAN",
      price: 30,
      description: "Basic hallway tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "hallway-premium",
      name: "PREMIUM CLEAN",
      price: 50,
      description: "Thorough hallway cleaning.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "hallway-luxury",
      name: "LUXURY CLEAN",
      price: 70,
      description: "Deep and detailed hallway cleaning.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
  stairs: [
    {
      id: "stairs-essential",
      name: "ESSENTIAL CLEAN",
      price: 35,
      description: "Basic stairs tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["ESSENTIAL CLEAN"].upsellMessage,
    },
    {
      id: "stairs-premium",
      name: "PREMIUM CLEAN",
      price: 60,
      description: "Thorough stairs cleaning.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["PREMIUM CLEAN"].upsellMessage,
    },
    {
      id: "stairs-luxury",
      name: "LUXURY CLEAN",
      price: 85,
      description: "Deep and detailed stairs cleaning.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: roomTiers["LUXURY CLEAN"].upsellMessage,
    },
  ],
}

export const roomImages: { [key: string]: string } = {
  bedroom: "/images/bedroom-professional.png",
  bathroom: "/images/bathroom-professional.png",
  kitchen: "/images/kitchen-professional.png",
  livingRoom: "/images/living-room-professional.png",
  diningRoom: "/images/dining-room-professional.png",
  homeOffice: "/images/home-office-professional.png",
  laundryRoom: "/images/laundry-room-professional.png",
  entryway: "/images/entryway-professional.png",
  hallway: "/images/hallway-professional.png",
  stairs: "/images/stairs-professional.png",
  other: "/public/room-icon.png", // Generic icon for custom rooms
}

export const roomDisplayNames: { [key: string]: string } = {
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

export const roomIcons: { [key: string]: string } = {
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
  other: "🏠",
}

export const defaultAddOns: Record<string, RoomAddOn[]> = {
  bedroom: [
    {
      id: "bed-1",
      name: "Closet full reorganization",
      price: 25.0,
      description: "Complete organization of closet contents",
    },
    {
      id: "bed-2",
      name: "Blind track deep clean",
      price: 15.0,
      description: "Detailed cleaning of window blind tracks",
    },
    { id: "bed-3", name: "Curtain/shade vacuuming", price: 12.0, description: "Dust removal from window treatments" },
    {
      id: "bed-4",
      name: "Wall mark removal (up to 5 spots)",
      price: 10.0,
      description: "Cleaning of wall marks and scuffs",
    },
    {
      id: "bed-5",
      name: "Nightstand drawer organization",
      price: 8.0,
      description: "Organization of nightstand contents",
    },
  ],
  bathroom: [
    {
      id: "bath-1",
      name: "Shower door track deep clean",
      price: 15.0,
      description: "Detailed cleaning of shower door tracks",
    },
    { id: "bath-2", name: "Grout detailed scrubbing", price: 30.0, description: "Deep cleaning of tile grout" },
    {
      id: "bath-3",
      name: "Cabinet interior organization",
      price: 20.0,
      description: "Organization of bathroom cabinet contents",
    },
    { id: "bath-4", name: "Exhaust fan cleaning", price: 12.0, description: "Cleaning of bathroom exhaust fan" },
    { id: "bath-5", name: "Mold/mildew treatment", price: 25.0, description: "Treatment of mold and mildew spots" },
  ],
  kitchen: [
    {
      id: "kit-1",
      name: "Inside refrigerator cleaning",
      price: 30.0,
      description: "Cleaning of refrigerator interior",
    },
    { id: "kit-2", name: "Inside oven cleaning", price: 35.0, description: "Deep cleaning of oven interior" },
    {
      id: "kit-3",
      name: "Cabinet interior organization (per cabinet)",
      price: 15.0,
      description: "Organization of cabinet contents",
    },
    { id: "kit-4", name: "Dishwasher deep clean", price: 20.0, description: "Detailed cleaning of dishwasher" },
    {
      id: "kit-5",
      name: "Small appliance detailed cleaning",
      price: 10.0,
      description: "Cleaning of countertop appliances",
    },
  ],
  livingRoom: [
    {
      id: "liv-1",
      name: "Upholstery vacuuming",
      price: 20.0,
      description: "Detailed vacuuming of furniture upholstery",
    },
    {
      id: "liv-2",
      name: "Entertainment center organization",
      price: 25.0,
      description: "Organization of entertainment center",
    },
    {
      id: "liv-3",
      name: "Ceiling fan detailed cleaning",
      price: 15.0,
      description: "Detailed cleaning of ceiling fan",
    },
    { id: "liv-4", name: "Window treatment dusting", price: 18.0, description: "Dusting of curtains and blinds" },
    { id: "liv-5", name: "Decor item individual cleaning", price: 12.0, description: "Cleaning of decorative items" },
  ],
  diningRoom: [
    { id: "din-1", name: "China cabinet interior cleaning", price: 25.0, description: "Cleaning inside china cabinet" },
    { id: "din-2", name: "Chair upholstery cleaning", price: 20.0, description: "Cleaning of dining chair upholstery" },
    {
      id: "din-3",
      name: "Table leaf cleaning & storage",
      price: 15.0,
      description: "Cleaning and proper storage of table leaves",
    },
    {
      id: "din-4",
      name: "Chandelier detailed cleaning",
      price: 30.0,
      description: "Detailed cleaning of dining room chandelier",
    },
    {
      id: "din-5",
      name: "Silverware polishing",
      price: 25.0,
      description: "Polishing of silverware and serving pieces",
    },
  ],
  homeOffice: [
    {
      id: "off-1",
      name: "Computer peripheral cleaning",
      price: 15.0,
      description: "Cleaning of keyboard, mouse, etc.",
    },
    {
      id: "off-2",
      name: "File organization (per drawer)",
      price: 20.0,
      description: "Organization of file drawer contents",
    },
    { id: "off-3", name: "Bookshelf organization", price: 25.0, description: "Organization of books and materials" },
    { id: "off-4", name: "Cable management", price: 15.0, description: "Organization and securing of cables" },
    { id: "off-5", name: "Desk drawer organization", price: 18.0, description: "Organization of desk drawer contents" },
  ],
  laundryRoom: [
    { id: "lau-1", name: "Washer deep cleaning", price: 25.0, description: "Deep cleaning of washing machine" },
    { id: "lau-2", name: "Dryer vent cleaning", price: 20.0, description: "Cleaning of dryer vent and lint trap" },
    { id: "lau-3", name: "Supply organization", price: 15.0, description: "Organization of laundry supplies" },
    { id: "lau-4", name: "Under appliance cleaning", price: 18.0, description: "Cleaning under washer and dryer" },
    { id: "lau-5", name: "Utility sink deep clean", price: 15.0, description: "Deep cleaning of laundry sink" },
  ],
  entryway: [
    { id: "ent-1", name: "Shoe organization", price: 15.0, description: "Organization of shoes and boots" },
    { id: "ent-2", name: "Coat closet organization", price: 20.0, description: "Organization of coat closet contents" },
    { id: "ent-3", name: "Entry mat deep cleaning", price: 12.0, description: "Deep cleaning of entry mats" },
    {
      id: "ent-4",
      name: "Door hardware polishing",
      price: 10.0,
      description: "Polishing of door handles and hardware",
    },
    { id: "ent-5", name: "Mail/key area organization", price: 15.0, description: "Organization of mail and key area" },
  ],
  hallway: [
    {
      id: "hal-1",
      name: "Runner/carpet deep cleaning",
      price: 20.0,
      description: "Deep cleaning of hallway carpet or runner",
    },
    {
      id: "hal-2",
      name: "Picture frame detailed cleaning",
      price: 15.0,
      description: "Detailed cleaning of picture frames",
    },
    {
      id: "hal-3",
      name: "Linen closet organization",
      price: 25.0,
      description: "Organization of linen closet contents",
    },
    {
      id: "hal-4",
      name: "Light fixture detailed cleaning",
      price: 18.0,
      description: "Detailed cleaning of hallway light fixtures",
    },
    { id: "hal-5", name: "Wall sconce cleaning", price: 12.0, description: "Cleaning of wall sconces" },
  ],
  stairs: [
    { id: "sta-1", name: "Carpet deep cleaning", price: 25.0, description: "Deep cleaning of stair carpet" },
    {
      id: "sta-2",
      name: "Banister detailed cleaning",
      price: 20.0,
      description: "Detailed cleaning of banister and railings",
    },
    { id: "sta-3", name: "Stair riser cleaning", price: 15.0, description: "Cleaning of stair risers" },
    {
      id: "sta-4",
      name: "Under-stair cleaning (if accessible)",
      price: 30.0,
      description: "Cleaning of accessible under-stair areas",
    },
    {
      id: "sta-5",
      name: "Stair runner detailed cleaning",
      price: 22.0,
      description: "Detailed cleaning of stair runner",
    },
  ],
  default: [
    {
      id: "def-1",
      name: "Detailed dusting of all surfaces",
      price: 15.0,
      description: "Comprehensive dusting of all surfaces",
    },
    { id: "def-2", name: "Wall spot cleaning", price: 12.0, description: "Cleaning of wall spots and marks" },
    {
      id: "def-3",
      name: "Ceiling corner cobweb removal",
      price: 8.0,
      description: "Removal of cobwebs from ceiling corners",
    },
    { id: "def-4", name: "Light fixture cleaning", price: 10.0, description: "Cleaning of light fixtures" },
    { id: "def-5", name: "Door/doorframe cleaning", price: 10.0, description: "Cleaning of doors and doorframes" },
  ],
}

export const defaultReductions: Record<string, RoomReduction[]> = {
  bedroom: [
    { id: "bed-r1", name: "Skip mirror cleaning", discount: 5.0, description: "Mirrors will not be cleaned" },
    {
      id: "bed-r2",
      name: "Limit to 2 furniture pieces",
      discount: 8.0,
      description: "Only 2 furniture pieces will be cleaned",
    },
    {
      id: "bed-r3",
      name: "No under-bed cleaning",
      discount: 10.0,
      description: "Area under the bed will not be cleaned",
    },
    {
      id: "bed-r4",
      name: "Basic surface dusting only",
      discount: 7.0,
      description: "Only basic dusting will be performed",
    },
  ],
  bathroom: [
    { id: "bath-r1", name: "Skip shower/tub cleaning", discount: 15.0, description: "Shower/tub will not be cleaned" },
    {
      id: "bath-r2",
      name: "Basic toilet cleaning only",
      discount: 8.0,
      description: "Only basic toilet cleaning will be performed",
    },
    { id: "bath-r3", name: "Skip floor mopping", discount: 10.0, description: "Floor will not be mopped" },
    { id: "bath-r4", name: "No cabinet cleaning", discount: 5.0, description: "Cabinets will not be cleaned" },
  ],
  kitchen: [
    {
      id: "kit-r1",
      name: "Skip appliance exteriors",
      discount: 12.0,
      description: "Appliance exteriors will not be cleaned",
    },
    {
      id: "kit-r2",
      name: "Basic countertop cleaning only",
      discount: 10.0,
      description: "Only basic countertop cleaning will be performed",
    },
    { id: "kit-r3", name: "No floor mopping", discount: 15.0, description: "Floor will not be mopped" },
    {
      id: "kit-r4",
      name: "Skip sink deep cleaning",
      discount: 8.0,
      description: "Sink will receive only basic cleaning",
    },
  ],
  livingRoom: [
    {
      id: "liv-r1",
      name: "Skip under furniture",
      discount: 12.0,
      description: "Areas under furniture will not be cleaned",
    },
    {
      id: "liv-r2",
      name: "Basic vacuum only (no edges)",
      discount: 10.0,
      description: "Only basic vacuuming will be performed",
    },
    { id: "liv-r3", name: "No electronics dusting", discount: 8.0, description: "Electronics will not be dusted" },
    {
      id: "liv-r4",
      name: "Skip decor item cleaning",
      discount: 7.0,
      description: "Decorative items will not be cleaned",
    },
  ],
  diningRoom: [
    { id: "din-r1", name: "Skip chair cleaning", discount: 10.0, description: "Chairs will not be cleaned" },
    {
      id: "din-r2",
      name: "Basic table cleaning only",
      discount: 8.0,
      description: "Only basic table cleaning will be performed",
    },
    {
      id: "din-r3",
      name: "No china cabinet cleaning",
      discount: 12.0,
      description: "China cabinet will not be cleaned",
    },
    {
      id: "din-r4",
      name: "Skip light fixture dusting",
      discount: 7.0,
      description: "Light fixtures will not be dusted",
    },
  ],
  homeOffice: [
    { id: "off-r1", name: "Skip electronics dusting", discount: 10.0, description: "Electronics will not be dusted" },
    { id: "off-r2", name: "No bookshelf cleaning", discount: 12.0, description: "Bookshelves will not be cleaned" },
    {
      id: "off-r3",
      name: "Basic desk cleaning only",
      discount: 8.0,
      description: "Only basic desk cleaning will be performed",
    },
    { id: "off-r4", name: "Skip floor edges", discount: 7.0, description: "Floor edges will not be cleaned" },
  ],
  laundryRoom: [
    {
      id: "lau-r1",
      name: "Skip appliance exteriors",
      discount: 10.0,
      description: "Appliance exteriors will not be cleaned",
    },
    { id: "lau-r2", name: "No sink cleaning", discount: 8.0, description: "Sink will not be cleaned" },
    {
      id: "lau-r3",
      name: "Basic floor cleaning only",
      discount: 7.0,
      description: "Only basic floor cleaning will be performed",
    },
    { id: "lau-r4", name: "Skip cabinet fronts", discount: 6.0, description: "Cabinet fronts will not be cleaned" },
  ],
  entryway: [
    {
      id: "ent-r1",
      name: "Basic floor cleaning only",
      discount: 8.0,
      description: "Only basic floor cleaning will be performed",
    },
    { id: "ent-r2", name: "Skip door cleaning", discount: 6.0, description: "Door will not be cleaned" },
    {
      id: "ent-r3",
      name: "No console table cleaning",
      discount: 7.0,
      description: "Console table will not be cleaned",
    },
    {
      id: "ent-r4",
      name: "Skip mirror/artwork cleaning",
      discount: 5.0,
      description: "Mirrors and artwork will not be cleaned",
    },
  ],
  hallway: [
    {
      id: "hal-r1",
      name: "Runner/carpet deep cleaning",
      discount: 20.0,
      description: "Deep cleaning of hallway carpet or runner",
    },
    {
      id: "hal-r2",
      name: "Picture frame detailed cleaning",
      discount: 15.0,
      description: "Detailed cleaning of picture frames",
    },
    {
      id: "hal-r3",
      name: "Linen closet organization",
      discount: 25.0,
      description: "Organization of linen closet contents",
    },
    {
      id: "hal-r4",
      name: "Light fixture detailed cleaning",
      discount: 18.0,
      description: "Detailed cleaning of hallway light fixtures",
    },
    { id: "hal-r5", name: "Wall sconce cleaning", discount: 12.0, description: "Cleaning of wall sconces" },
  ],
  stairs: [
    {
      id: "sta-r1",
      name: "Basic step cleaning only",
      discount: 10.0,
      description: "Only basic step cleaning will be performed",
    },
    { id: "sta-r2", name: "Skip handrail cleaning", discount: 8.0, description: "Handrail will not be cleaned" },
    { id: "sta-r3", name: "No spindle dusting", discount: 7.0, description: "Spindles will not be dusted" },
    { id: "sta-r4", name: "Skip stair edges", discount: 6.0, description: "Stair edges will not be cleaned" },
  ],
  default: [
    {
      id: "def-r1",
      name: "Detailed dusting of all surfaces",
      discount: 15.0,
      description: "Comprehensive dusting of all surfaces",
    },
    { id: "def-r2", name: "Wall spot cleaning", discount: 12.0, description: "Cleaning of wall spots and marks" },
    {
      id: "def-r3",
      name: "Ceiling corner cobweb removal",
      discount: 8.0,
      description: "Removal of cobwebs from ceiling corners",
    },
    { id: "def-r4", name: "Light fixture cleaning", discount: 10.0, description: "Cleaning of light fixtures" },
    { id: "def-r5", name: "Door/doorframe cleaning", discount: 10.0, description: "Cleaning of doors and doorframes" },
  ],
  default: [],
}

export function getRoomTiers(roomType: string): RoomTier[] {
  // Return specific tiers for the room type if they exist, otherwise return default tiers
  return (defaultTiers as any)[roomType] || defaultTiers.default
}

// --- NEW HELPERS (restored) ----------------------------------------------

export function getRoomAddOns(roomType: string): RoomAddOn[] {
  return (defaultAddOns as any)[roomType] || defaultAddOns.default
}

export function getRoomReductions(roomType: string): RoomReduction[] {
  return (defaultReductions as any)[roomType] || defaultReductions.default
}

/**
 * Find a tier price by its ID (searches all room‐specific tier lists).
 * Returns 0 if the ID is not found.
 */
export function getPriceForTier(tierId: string): number {
  for (const [, tiers] of Object.entries(defaultTiers)) {
    const tier = (tiers as RoomTier[]).find((t) => t.id === tierId)
    if (tier) return tier.price
  }
  return 0
}

// Re-export roomTiers to make it accessible
export type RoomTierName = keyof typeof roomTiers
