// Define the room tiers, add-ons, and reductions for the room configurator

export interface RoomTier {
  id: string
  name: string
  description: string
  price: number
  features: string[]
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

export const defaultTiers: Record<string, RoomTier[]> = {
  bedroom: [
    {
      id: "bedroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for lightly used rooms",
      price: 120.0,
      features: ["Floor vacuuming", "Bed making", "Surface organization", "Basic dusting"],
    },
    {
      id: "bedroom-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for regular maintenance",
      price: 220.0,
      features: [
        "Deep floor care",
        "Mattress steaming",
        "Complete bed service",
        "Full surface dusting",
        "Closet organization",
      ],
    },
    {
      id: "bedroom-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for maximum freshness",
      price: 380.0,
      features: [
        "Comprehensive floor restoration",
        "Under-bed detailing",
        "Bed frame deep clean",
        "Walk-in closet organization",
        "Laundry service",
        "Electronics cleaning",
      ],
    },
  ],
  bathroom: [
    {
      id: "bathroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for guest bathrooms",
      price: 140.0,
      features: ["Toilet cleaning", "Shower/tub basic clean", "Mirror & sink", "Basic organizing"],
    },
    {
      id: "bathroom-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for regular bathrooms",
      price: 250.0,
      features: ["Toilet deep clean", "Shower/tub restoration", "Vanity detailing", "Floor scrubbing", "Towel service"],
    },
    {
      id: "bathroom-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for master bathrooms",
      price: 420.0,
      features: [
        "Complete toilet restoration",
        "Shower/tub deep restoration",
        "Vanity organization",
        "Floor restoration",
        "Ventilation cleaning",
        "Luxury amenities",
      ],
    },
  ],
  kitchen: [
    {
      id: "kitchen-essential",
      name: "ESSENTIAL CLEAN",
      description: "Surface cleaning for lightly used kitchens",
      price: 160.0,
      features: ["Countertop cleaning", "Sink & faucet", "Stovetop cleaning", "Basic organizing"],
    },
    {
      id: "kitchen-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for regular kitchens",
      price: 280.0,
      features: [
        "Countertop detailing",
        "Sink restoration",
        "Stovetop & oven",
        "Cabinet fronts",
        "Appliance exteriors",
      ],
    },
    {
      id: "kitchen-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for gourmet kitchens",
      price: 480.0,
      features: [
        "Complete countertop restoration",
        "Sink & faucet restoration",
        "Oven deep clean",
        "Cabinet organization",
        "Refrigerator deep clean",
        "All appliances",
      ],
    },
  ],
  livingRoom: [
    {
      id: "livingroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for living spaces",
      price: 110.0,
      features: ["Carpet vacuuming", "Surface dusting", "Couch arrangement", "Basic organizing"],
    },
    {
      id: "livingroom-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for family rooms",
      price: 200.0,
      features: ["Deep vacuuming", "Furniture dusting", "Couch cleaning", "Electronics cleaning", "Fireplace cleaning"],
    },
    {
      id: "livingroom-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for entertainment areas",
      price: 340.0,
      features: [
        "Carpet restoration",
        "Furniture restoration",
        "Upholstery detailing",
        "Entertainment center",
        "Complete fireplace restoration",
      ],
    },
  ],
  diningRoom: [
    {
      id: "diningroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for dining areas",
      price: 80.0,
      features: ["Table cleaning", "Floor vacuuming", "Basic organizing"],
    },
    {
      id: "diningroom-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for dining rooms",
      price: 140.0,
      features: ["Table & chairs detailing", "Floor deep clean", "China cabinet exterior"],
    },
    {
      id: "diningroom-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for formal dining rooms",
      price: 240.0,
      features: ["Furniture restoration", "Floor restoration", "China cabinet organization", "Lighting fixtures"],
    },
  ],
  homeOffice: [
    {
      id: "office-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for work spaces",
      price: 130.0,
      features: ["Desk cleaning", "Floor vacuuming", "Basic organizing", "Electronics dusting"],
    },
    {
      id: "office-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for home offices",
      price: 240.0,
      features: ["Desk organization", "Electronics cleaning", "Floor detailing", "Bookshelf organizing"],
    },
    {
      id: "office-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for professional offices",
      price: 420.0,
      features: ["Complete workstation setup", "Equipment maintenance", "Floor restoration", "Storage optimization"],
    },
  ],
  laundryRoom: [
    {
      id: "laundry-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for laundry areas",
      price: 100.0,
      features: ["Appliance exteriors", "Floor cleaning", "Basic organizing", "Utility sink"],
    },
    {
      id: "laundry-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for laundry rooms",
      price: 190.0,
      features: ["Appliance deep clean", "Floor & walls", "Storage organization", "Utility sink detail"],
    },
    {
      id: "laundry-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for laundry centers",
      price: 320.0,
      features: ["Appliance restoration", "Deep sanitization", "Complete organization", "Utility optimization"],
    },
  ],
  entryway: [
    {
      id: "entryway-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for entryways",
      price: 60.0,
      features: ["Floor cleaning", "Surface dusting", "Basic organizing"],
    },
    {
      id: "entryway-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for foyers",
      price: 100.0,
      features: ["Floor detailing", "Furniture cleaning", "Closet organization"],
    },
    {
      id: "entryway-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for grand entrances",
      price: 160.0,
      features: ["Floor restoration", "Complete organization", "Lighting & fixtures"],
    },
  ],
  hallway: [
    {
      id: "hallway-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for hallways",
      price: 50.0,
      features: ["Floor cleaning", "Wall spot cleaning", "Basic organizing"],
    },
    {
      id: "hallway-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for corridors",
      price: 90.0,
      features: ["Floor detailing", "Wall cleaning", "Lighting fixtures"],
    },
    {
      id: "hallway-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for gallery hallways",
      price: 140.0,
      features: ["Floor restoration", "Wall restoration", "Lighting optimization"],
    },
  ],
  stairs: [
    {
      id: "stairs-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for staircases",
      price: 70.0,
      features: ["Step vacuuming", "Safety check", "Basic organizing"],
    },
    {
      id: "stairs-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for stairways",
      price: 120.0,
      features: ["Deep vacuuming", "Handrail polishing", "Wall cleaning"],
    },
    {
      id: "stairs-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for grand staircases",
      price: 180.0,
      features: ["Carpet restoration", "Railing restoration", "Wall restoration"],
    },
  ],
  default: [
    {
      id: "default-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for all spaces",
      price: 25.0,
      features: ["Surface dusting", "Floor vacuum/sweep", "General tidying"],
    },
    {
      id: "default-premium",
      name: "PREMIUM CLEAN",
      description: "Thorough cleaning for all spaces",
      price: 75.0,
      features: [
        "Detailed dusting",
        "Floor detailed cleaning",
        "Baseboard attention",
        "Surface sanitizing",
        "Trash removal",
      ],
    },
    {
      id: "default-luxury",
      name: "LUXURY CLEAN",
      description: "Comprehensive cleaning for all spaces",
      price: 225.0,
      features: [
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
      name: "Basic floor cleaning only",
      discount: 8.0,
      description: "Only basic floor cleaning will be performed",
    },
    { id: "hal-r2", name: "Skip wall cleaning", discount: 6.0, description: "Walls will not be cleaned" },
    { id: "hal-r3", name: "No picture frame dusting", discount: 5.0, description: "Picture frames will not be dusted" },
    { id: "hal-r4", name: "Skip baseboard cleaning", discount: 7.0, description: "Baseboards will not be cleaned" },
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

// Helper function to get the price for a specific tier ID
export function getPriceForTier(tierId: string): number {
  for (const roomType in defaultTiers) {
    const tier = defaultTiers[roomType].find((t) => t.id === tierId)
    if (tier) return tier.price
  }
  return 0 // Fallback if tier not found
}

// Room type to professional image mapping
export const roomImages: Record<string, string> = {
  bedroom: "/images/bedroom-professional.png",
  bathroom: "/images/bathroom-professional.png",
  kitchen: "/images/kitchen-professional.png",
  livingRoom: "/images/living-room-professional.png", // Corrected path
  diningRoom: "/images/dining-room-professional.png", // Corrected path
  homeOffice: "/images/home-office-professional.png", // Corrected path
  laundryRoom: "/images/laundry-room-professional.png", // Corrected path
  entryway: "/images/entryway-professional.png",
  hallway: "/images/hallway-professional.png",
  stairs: "/images/stairs-professional.png",
  other: "/images/bedroom-professional.png", // fallback for custom rooms
}

// Room type to icon mapping (keeping as fallback)
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

// New room tiers, add-ons, and reductions
export const roomTiers = {
  "ESSENTIAL CLEAN": {
    basePrice: 120, // Price for Essential Clean Bedroom
    detailedTasks: ["Floor vacuuming", "Bed making", "Surface organization", "Basic dusting"],
    notIncludedTasks: [
      "Deep floor care",
      "Mattress steaming",
      "Complete bed service",
      "Full surface dusting",
      "Closet organization",
      "Comprehensive floor restoration",
      "Under-bed detailing",
      "Bed frame deep clean",
      "Walk-in closet organization",
      "Laundry service",
      "Electronics cleaning",
    ],
    upsellMessage: "For a more thorough clean, consider our 'Premium Clean' tier!",
  },
  "PREMIUM CLEAN": {
    basePrice: 220, // Price for Premium Clean Bedroom
    detailedTasks: [
      "Deep floor care",
      "Mattress steaming",
      "Complete bed service",
      "Full surface dusting",
      "Closet organization",
    ],
    notIncludedTasks: [
      "Comprehensive floor restoration",
      "Under-bed detailing",
      "Bed frame deep clean",
      "Walk-in closet organization",
      "Laundry service",
      "Electronics cleaning",
    ],
    upsellMessage: "Achieve ultimate freshness with our 'Luxury Clean' tier!",
  },
  "LUXURY CLEAN": {
    basePrice: 380, // Price for Luxury Clean Bedroom
    detailedTasks: [
      "Comprehensive floor restoration",
      "Under-bed detailing",
      "Bed frame deep clean",
      "Walk-in closet organization",
      "Laundry service",
      "Electronics cleaning",
    ],
    notIncludedTasks: [
      // All tasks are included in Luxury Clean, so this can be empty or list things explicitly not offered by the service
    ],
    upsellMessage: "Experience the pinnacle of cleanliness!",
  },
  // Bathroom Tiers
  "BATHROOM ESSENTIAL CLEAN": {
    basePrice: 140,
    detailedTasks: ["Toilet cleaning", "Shower/tub basic clean", "Mirror & sink", "Basic organizing"],
    notIncludedTasks: [
      "Toilet deep clean",
      "Shower/tub restoration",
      "Vanity detailing",
      "Floor scrubbing",
      "Towel service",
      "Complete toilet restoration",
      "Shower/tub deep restoration",
      "Vanity organization",
      "Floor restoration",
      "Ventilation cleaning",
      "Luxury amenities",
    ],
    upsellMessage: "For a more thorough bathroom clean, consider our 'Premium Clean' tier!",
  },
  "BATHROOM PREMIUM CLEAN": {
    basePrice: 250,
    detailedTasks: [
      "Toilet deep clean",
      "Shower/tub restoration",
      "Vanity detailing",
      "Floor scrubbing",
      "Towel service",
    ],
    notIncludedTasks: [
      "Complete toilet restoration",
      "Shower/tub deep restoration",
      "Vanity organization",
      "Floor restoration",
      "Ventilation cleaning",
      "Luxury amenities",
    ],
    upsellMessage: "Achieve ultimate freshness with our 'Luxury Clean' tier for your bathroom!",
  },
  "BATHROOM LUXURY CLEAN": {
    basePrice: 420,
    detailedTasks: [
      "Complete toilet restoration",
      "Shower/tub deep restoration",
      "Vanity organization",
      "Floor restoration",
      "Ventilation cleaning",
      "Luxury amenities",
    ],
    notIncludedTasks: [], // All tasks are included in Luxury Clean
    upsellMessage: "Experience the pinnacle of bathroom cleanliness!",
  },
  // Kitchen Tiers
  "KITCHEN ESSENTIAL CLEAN": {
    basePrice: 160,
    detailedTasks: ["Countertop cleaning", "Sink & faucet", "Stovetop cleaning", "Basic organizing"],
    notIncludedTasks: [
      "Countertop detailing",
      "Sink restoration",
      "Stovetop & oven",
      "Cabinet fronts",
      "Appliance exteriors",
      "Complete countertop restoration",
      "Sink & faucet restoration",
      "Oven deep clean",
      "Cabinet organization",
      "Refrigerator deep clean",
      "All appliances",
    ],
    upsellMessage: "For a more thorough kitchen clean, consider our 'Premium Clean' tier!",
  },
  "KITCHEN PREMIUM CLEAN": {
    basePrice: 280,
    detailedTasks: [
      "Countertop detailing",
      "Sink restoration",
      "Stovetop & oven",
      "Cabinet fronts",
      "Appliance exteriors",
    ],
    notIncludedTasks: [
      "Complete countertop restoration",
      "Sink & faucet restoration",
      "Oven deep clean",
      "Cabinet organization",
      "Refrigerator deep clean",
      "All appliances",
    ],
    upsellMessage: "Achieve ultimate freshness with our 'Luxury Clean' tier for your kitchen!",
  },
  "KITCHEN LUXURY CLEAN": {
    basePrice: 480,
    detailedTasks: [
      "Complete countertop restoration",
      "Sink & faucet restoration",
      "Oven deep clean",
      "Cabinet organization",
      "Refrigerator deep clean",
      "All appliances",
    ],
    notIncludedTasks: [], // All tasks are included in Luxury Clean
    upsellMessage: "Experience the pinnacle of kitchen cleanliness!",
  },
  // Living Room Tiers
  "LIVING ROOM ESSENTIAL CLEAN": {
    basePrice: 110,
    detailedTasks: ["Carpet vacuuming", "Surface dusting", "Couch arrangement", "Basic organizing"],
    notIncludedTasks: [
      "Deep vacuuming",
      "Furniture dusting",
      "Couch cleaning",
      "Electronics cleaning",
      "Fireplace cleaning",
      "Carpet restoration",
      "Furniture restoration",
      "Upholstery detailing",
      "Entertainment center",
      "Complete fireplace restoration",
    ],
    upsellMessage: "For a more thorough living room clean, consider our 'Premium Clean' tier!",
  },
  "LIVING ROOM PREMIUM CLEAN": {
    basePrice: 200,
    detailedTasks: [
      "Deep vacuuming",
      "Furniture dusting",
      "Couch cleaning",
      "Electronics cleaning",
      "Fireplace cleaning",
    ],
    notIncludedTasks: [
      "Carpet restoration",
      "Furniture restoration",
      "Upholstery detailing",
      "Entertainment center",
      "Complete fireplace restoration",
    ],
    upsellMessage: "Achieve ultimate freshness with our 'Luxury Clean' tier for your living room!",
  },
  "LIVING ROOM LUXURY CLEAN": {
    basePrice: 340,
    detailedTasks: [
      "Carpet restoration",
      "Furniture restoration",
      "Upholstery detailing",
      "Entertainment center",
      "Complete fireplace restoration",
    ],
    notIncludedTasks: [], // All tasks are included in Luxury Clean
    upsellMessage: "Experience the pinnacle of living room cleanliness!",
  },
  // Dining Room Tiers
  "DINING ROOM ESSENTIAL CLEAN": {
    basePrice: 80,
    detailedTasks: ["Table cleaning", "Floor vacuuming", "Basic organizing"],
    notIncludedTasks: [
      "Table & chairs detailing",
      "Floor deep clean",
      "China cabinet exterior",
      "Furniture restoration",
      "Floor restoration",
      "China cabinet organization",
      "Lighting fixtures",
    ],
    upsellMessage: "For a more thorough dining room clean, consider our 'Premium Clean' tier!",
  },
  "DINING ROOM PREMIUM CLEAN": {
    basePrice: 140,
    detailedTasks: ["Table & chairs detailing", "Floor deep clean", "China cabinet exterior"],
    notIncludedTasks: ["Furniture restoration", "Floor restoration", "China cabinet organization", "Lighting fixtures"],
    upsellMessage: "Achieve ultimate freshness with our 'Luxury Clean' tier for your dining room!",
  },
  "DINING ROOM LUXURY CLEAN": {
    basePrice: 240,
    detailedTasks: ["Furniture restoration", "Floor restoration", "China cabinet organization", "Lighting fixtures"],
    notIncludedTasks: [], // All tasks are included in Luxury Clean
    upsellMessage: "Experience the pinnacle of dining room cleanliness!",
  },
}

export const roomAddOns = {
  ovenDeepClean: {
    name: "Oven Deep Clean",
    price: 30,
    description: "Thorough cleaning of the inside of your oven.",
  },
  fridgeDeepClean: {
    name: "Refrigerator Deep Clean",
    price: 25,
    description: "Detailed cleaning of the inside of your refrigerator.",
  },
  interiorWindows: {
    name: "Interior Window Cleaning",
    price: 20,
    description: "Cleaning of all reachable interior windows.",
  },
  laundryService: {
    name: "Laundry Service",
    price: 15,
    description: "One load of laundry washed and dried.",
  },
  dishWashing: {
    name: "Dish Washing",
    price: 10,
    description: "Washing and loading dishes into the dishwasher.",
  },
  baseboardWipeDown: {
    name: "Baseboard Wipe Down",
    price: 10,
    description: "Wiping down all accessible baseboards.",
  },
  wallSpotCleaning: {
    name: "Wall Spot Cleaning",
    price: 15,
    description: "Spot cleaning of marks and scuffs on walls.",
  },
  cabinetInteriorCleaning: {
    name: "Cabinet Interior Cleaning",
    price: 35,
    description: "Cleaning the inside of kitchen and bathroom cabinets (empty cabinets only).",
  },
  patioBalconyCleaning: {
    name: "Patio/Balcony Cleaning",
    price: 40,
    description: "Sweeping and light tidying of outdoor patio or balcony.",
  },
  garageCleaning: {
    name: "Garage Cleaning",
    price: 50,
    description: "Sweeping and organizing of garage space (light items only).",
  },
}

export const roomReductions = {
  noBaseboards: {
    name: "No Baseboards",
    discount: -5,
    description: "Skip baseboard wiping.",
  },
  noInteriorWindows: {
    name: "No Interior Windows",
    discount: -10,
    description: "Skip interior window cleaning.",
  },
  noOvenClean: {
    name: "No Oven Clean",
    discount: -15,
    description: "Skip oven cleaning.",
  },
  noFridgeClean: {
    name: "No Fridge Clean",
    discount: -10,
    description: "Skip refrigerator cleaning.",
  },
}
