import { formatCurrency } from "@/lib/utils"

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
export const roomTiers = {
  "ESSENTIAL CLEAN": {
    basePrice: 50, // This base price is not directly used for specific rooms below, but kept for reference
    detailedTasks: ["Dusting all surfaces", "Vacuuming/mopping floors", "Wiping down counters", "Emptying trash"],
    notIncludedTasks: ["Deep stain removal", "Inside oven/fridge cleaning", "Window cleaning", "Wall washing"],
    upsellMessage: "Upgrade to Premium Clean for a more thorough service!",
  },
  "PREMIUM CLEAN": {
    basePrice: 80, // This base price is not directly used for specific rooms below, but kept for reference
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
    basePrice: 120, // This base price is not directly used for specific rooms below, but kept for reference
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

// IMPORTANT: Do not change these prices unless directly asked to do so.
// These prices have been specifically set by the user.
export const defaultTiers = {
  default: [
    {
      id: "default-standard",
      name: "STANDARD CLEAN",
      price: 0, // Price is 0, will show "Email for Pricing"
      description: "Basic cleaning for everyday tidiness.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Premium Clean for a more thorough service!",
      isPriceTBD: true,
      paymentType: "in_person",
    },
    {
      id: "default-deep",
      name: "DEEP CLEAN",
      price: 0, // Price is 0, will show "Email for Pricing"
      description: "A more thorough clean, perfect for regular maintenance.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "Consider Luxury Clean for a truly spotless home!",
      isPriceTBD: true,
      paymentType: "in_person",
    },
    {
      id: "default-premium",
      name: "PREMIUM CLEAN",
      price: 0, // Price is 0, will show "Email for Pricing"
      description: "Our most comprehensive clean, leaving your home spotless.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
      isPriceTBD: true,
      paymentType: "in_person",
    },
  ],
  bedroom: [
    {
      id: "bedroom-standard",
      name: "STANDARD CLEAN",
      price: 50,
      description: "Standard bedroom tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "bedroom-deep",
      name: "DEEP CLEAN",
      price: 75,
      description: "Deep bedroom cleaning.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "Consider Premium Clean for a truly spotless home!",
    },
    {
      id: "bedroom-premium",
      name: "PREMIUM CLEAN",
      price: 100,
      description: "Premium bedroom cleaning with extra attention.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  bathroom: [
    {
      id: "bathroom-standard",
      name: "STANDARD CLEAN",
      price: 40,
      description: "Standard bathroom refresh.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "bathroom-deep",
      name: "DEEP CLEAN",
      price: 68,
      description: "Deep bathroom cleaning and sanitization.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  kitchen: [
    {
      id: "kitchen-standard",
      name: "STANDARD CLEAN",
      price: 60,
      description: "Standard kitchen wipe-down.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "kitchen-deep",
      name: "DEEP CLEAN",
      price: 96,
      description: "Deep kitchen cleaning including inside appliances.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  livingRoom: [
    {
      id: "livingroom-standard",
      name: "STANDARD CLEAN",
      price: 45,
      description: "Standard living room tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "livingroom-deep",
      name: "DEEP CLEAN",
      price: 63,
      description: "Deep living room cleaning with furniture vacuuming.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  diningRoom: [
    {
      id: "diningroom-standard",
      name: "STANDARD CLEAN",
      price: 35,
      description: "Standard dining room tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "diningroom-deep",
      name: "DEEP CLEAN",
      price: 45.5,
      description: "Deep dining room cleaning with table polishing.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  homeOffice: [
    {
      id: "homeoffice-standard",
      name: "STANDARD CLEAN",
      price: 30,
      description: "Standard home office tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "homeoffice-deep",
      name: "DEEP CLEAN",
      price: 36,
      description: "Deep home office cleaning with desk sanitization.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  laundryRoom: [
    {
      id: "laundryroom-standard",
      name: "STANDARD CLEAN",
      price: 25,
      description: "Standard laundry room tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "laundryroom-deep",
      name: "DEEP CLEAN",
      price: 32.5,
      description: "Deep laundry room cleaning with appliance exterior wipe-down.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  entryway: [
    {
      id: "entryway-standard",
      name: "STANDARD CLEAN",
      price: 20,
      description: "Standard entryway tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "entryway-deep",
      name: "DEEP CLEAN",
      price: 24,
      description: "Deep entryway cleaning with floor waxing.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  hallway: [
    {
      id: "hallway-standard",
      name: "STANDARD CLEAN",
      price: 15,
      description: "Standard hallway tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "hallway-deep",
      name: "DEEP CLEAN",
      price: 19.5,
      description: "Deep hallway cleaning with baseboard wipe-down.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  stairs: [
    {
      id: "stairs-standard",
      name: "STANDARD CLEAN",
      price: 20,
      description: "Standard stairs tidy-up.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Upgrade to Deep Clean for a more thorough service!",
    },
    {
      id: "stairs-deep",
      name: "DEEP CLEAN",
      price: 26,
      description: "Deep stairs cleaning with railing polish.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "For specialized needs, explore our add-on services!",
    },
  ],
  other: [
    {
      id: "other-essential",
      name: "ESSENTIAL CLEAN",
      price: 0, // Price is 0, will show "Email for Pricing"
      description: "Basic cleaning for custom spaces - pricing via email.",
      detailedTasks: roomTiers["ESSENTIAL CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["ESSENTIAL CLEAN"].notIncludedTasks,
      upsellMessage: "Contact us for detailed pricing on your custom space.",
      isPriceTBD: true,
      paymentType: "in_person",
    },
    {
      id: "other-premium",
      name: "PREMIUM CLEAN",
      price: 0, // Price is 0, will show "Email for Pricing"
      description: "Thorough cleaning for custom spaces - pricing via email.",
      detailedTasks: roomTiers["PREMIUM CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["PREMIUM CLEAN"].notIncludedTasks,
      upsellMessage: "Contact us for detailed pricing on your custom space.",
      isPriceTBD: true,
      paymentType: "in_person",
    },
    {
      id: "other-luxury",
      name: "LUXURY CLEAN",
      price: 0, // Price is 0, will show "Email for Pricing"
      description: "Deep cleaning for custom spaces - pricing via email.",
      detailedTasks: roomTiers["LUXURY CLEAN"].detailedTasks,
      notIncludedTasks: roomTiers["LUXURY CLEAN"].notIncludedTasks,
      upsellMessage: "Contact us for detailed pricing on your custom space.",
      isPriceTBD: true,
      paymentType: "in_person",
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
    { id: "bed-laundry", name: "Laundry service", price: 20, description: "Laundry service" },
    { id: "bed-window_cleaning", name: "Interior window cleaning", price: 15, description: "Interior window cleaning" },
  ],
  bathroom: [
    {
      id: "bath-1",
      name: "Shower door track deep clean",
      price: 15.0,
      description: "Detailed cleaning of shower door tracks",
    },
    { id: "bath-2", name: "Grout detailed scrubbing", price: 25.0, description: "Deep cleaning of tile grout" },
    {
      id: "bath-3",
      name: "Cabinet interior organization",
      price: 20.0,
      description: "Organization of bathroom cabinet contents",
    },
    { id: "bath-4", name: "Exhaust fan cleaning", price: 12.0, description: "Cleaning of bathroom exhaust fan" },
    { id: "bath-5", name: "Mold/mildew treatment", price: 30.0, description: "Treatment of mold and mildew spots" },
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
    { id: "kit-oven_cleaning", name: "Inside oven cleaning", price: 35, description: "Inside oven cleaning" },
    { id: "kit-fridge_cleaning", name: "Inside fridge cleaning", price: 30, description: "Inside fridge cleaning" },
    { id: "kit-pantry_organization", name: "Pantry organization", price: 20, description: "Pantry organization" },
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
    { id: "liv-carpet_shampoo", name: "Carpet shampooing", price: 40, description: "Carpet shampooing" },
    { id: "liv-upholstery_cleaning", name: "Upholstery cleaning", price: 30, description: "Upholstery cleaning" },
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
    { id: "off-device_sanitization", name: "Device sanitization", price: 15, description: "Device sanitization" },
    { id: "off-bookcase_dusting", name: "Bookcase dusting", price: 10, description: "Bookcase dusting" },
  ],
  laundryRoom: [
    { id: "lau-1", name: "Washer deep cleaning", price: 25.0, description: "Deep cleaning of washing machine" },
    { id: "lau-2", name: "Dryer vent cleaning", price: 20.0, description: "Cleaning of dryer vent and lint trap" },
    { id: "lau-3", name: "Supply organization", price: 15.0, description: "Organization of laundry supplies" },
    { id: "lau-4", name: "Under appliance cleaning", price: 18.0, description: "Cleaning under washer and dryer" },
    { id: "lau-5", name: "Utility sink deep clean", price: 15.0, description: "Deep cleaning of laundry sink" },
    {
      id: "lau-appliance_exterior_polish",
      name: "Appliance exterior polishing",
      price: 10,
      description: "Appliance exterior polishing",
    },
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
    {
      id: "ent-shoe_rack_organization",
      name: "Shoe rack organization",
      price: 10,
      description: "Shoe rack organization",
    },
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
    { id: "hal-wall_spot_cleaning", name: "Wall spot cleaning", price: 10, description: "Wall spot cleaning" },
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
    { id: "sta-stair_runner_vacuum", name: "Stair runner vacuuming", price: 15, description: "Stair runner vacuuming" },
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
    { id: "bed-light_mess", name: "Light mess discount", discount: -10, description: "Light mess discount" },
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
    { id: "hal-5", name: "Wall sconce cleaning", discount: 12.0, description: "Cleaning of wall sconces" },
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

export function getRoomTiers(roomType: string): RoomTier[] {
  // Return specific tiers for the room type if they exist, otherwise return default tiers
  return (defaultTiers as any)[roomType] || defaultTiers.default
}

// --- helpers --------------------------------------------------------------

/**
 * Return the list of add-ons available for a given room type.
 * Falls back to the generic `default` add-ons if none are defined.
 */
export function getRoomAddOns(roomType: string): RoomAddOn[] {
  return (defaultAddOns as any)[roomType] || defaultAddOns.default
}

/**
 * Return the list of reductions available for a given room type.
 * Falls back to the generic `default` reductions if none are defined.
 * (Pre-emptively added to avoid a similar “missing export” error.)
 */
export function getRoomReductions(roomType: string): RoomReduction[] {
  return (defaultReductions as any)[roomType] || defaultReductions.default
}

// Re-export roomTiers to make it accessible
export type RoomTierName = keyof typeof roomTiers

/**
 * Check if a room type requires email pricing (custom spaces)
 */
export function requiresEmailPricing(roomType: string): boolean {
  return roomType === "other" || roomType.startsWith("other-custom-")
}

/**
 * Get display price for a room configuration
 */
export function getDisplayPrice(roomType: string, config: any): string {
  if (requiresEmailPricing(roomType) || config?.paymentType === "in_person" || config?.isPriceTBD) {
    return "Email for Pricing"
  }
  return formatCurrency(config?.totalPrice || 0)
}

export const CUSTOM_SPACE_LEGAL_DISCLAIMER =
  "Custom spaces require personalized assessment. Pricing will be provided via email consultation, with payment collected in-person through Zelle upon service completion. All custom service bookings are subject to our standard Terms of Service."

export const ROOM_TIERS = {
  bedroom: {
    basePrice: 50,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.5, description: "Deep cleaning" },
      premium: { multiplier: 2, description: "Premium cleaning with extra attention" },
    },
    addOns: {
      laundry: { price: 20, description: "Laundry service" },
      window_cleaning: { price: 15, description: "Interior window cleaning" },
    },
    reductions: {
      light_mess: { price: -10, description: "Light mess discount" },
    },
  },
  bathroom: {
    basePrice: 40,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.7, description: "Deep cleaning and sanitization" },
    },
    addOns: {
      grout_scrubbing: { price: 25, description: "Grout scrubbing" },
      mold_mildew_treatment: { price: 30, description: "Mold and mildew treatment" },
    },
    reductions: {},
  },
  kitchen: {
    basePrice: 60,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.6, description: "Deep cleaning including inside appliances" },
    },
    addOns: {
      oven_cleaning: { price: 35, description: "Inside oven cleaning" },
      fridge_cleaning: { price: 30, description: "Inside fridge cleaning" },
      pantry_organization: { price: 20, description: "Pantry organization" },
    },
    reductions: {},
  },
  living_room: {
    basePrice: 45,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.4, description: "Deep cleaning with furniture vacuuming" },
    },
    addOns: {
      carpet_shampoo: { price: 40, description: "Carpet shampooing" },
      upholstery_cleaning: { price: 30, description: "Upholstery cleaning" },
    },
    reductions: {},
  },
  dining_room: {
    basePrice: 35,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.3, description: "Deep cleaning with table polishing" },
    },
    addOns: {
      china_cabinet_cleaning: { price: 20, description: "China cabinet cleaning" },
    },
    reductions: {},
  },
  home_office: {
    basePrice: 30,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.2, description: "Deep cleaning with desk sanitization" },
    },
    addOns: {
      device_sanitization: { price: 15, description: "Device sanitization" },
      bookcase_dusting: { price: 10, description: "Bookcase dusting" },
    },
    reductions: {},
  },
  laundry_room: {
    basePrice: 25,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.3, description: "Deep cleaning with appliance exterior wipe-down" },
    },
    addOns: {
      appliance_exterior_polish: { price: 10, description: "Appliance exterior polishing" },
    },
    reductions: {},
  },
  entryway: {
    basePrice: 20,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.2, description: "Deep cleaning with floor waxing" },
    },
    addOns: {
      shoe_rack_organization: { price: 10, description: "Shoe rack organization" },
    },
    reductions: {},
  },
  hallway: {
    basePrice: 15,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.1, description: "Deep cleaning with baseboard wipe-down" },
    },
    addOns: {
      wall_spot_cleaning: { price: 10, description: "Wall spot cleaning" },
    },
    reductions: {},
  },
  stairs: {
    basePrice: 20,
    tiers: {
      standard: { multiplier: 1, description: "Standard cleaning" },
      deep: { multiplier: 1.3, description: "Deep cleaning with railing polish" },
    },
    addOns: {
      stair_runner_vacuum: { price: 15, description: "Stair runner vacuuming" },
    },
    reductions: {},
  },
  custom_space: {
    basePrice: 0, // Custom spaces require manual pricing
    tiers: {
      consultation: { multiplier: 0, description: "Consultation for custom cleaning" },
    },
    addOns: {},
    reductions: {},
  },
} as const // Use 'as const' for type inference

export type RoomType = keyof typeof ROOM_TIERS
export type TierType<R extends RoomType> = keyof (typeof ROOM_TIERS)[R]["tiers"]
export type AddOnType<R extends RoomType> = keyof (typeof ROOM_TIERS)[R]["addOns"]
export type ReductionType<R extends RoomType> = keyof (typeof ROOM_TIERS)[R]["reductions"]
