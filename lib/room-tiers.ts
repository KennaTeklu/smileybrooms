// Define the room tiers, add-ons, and reductions for the room configurator

export interface RoomTier {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  timeEstimate: string
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

// Update the pricing structure for tiers to use multipliers instead of fixed prices

// For the defaultTiers object, update each room type's tier pricing to use multipliers
// For example, in the bedroom section:

export const defaultTiers: Record<string, RoomTier[]> = {
  bedroom: [
    {
      id: "bedroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for lightly used rooms",
      price: 25.0,
      timeEstimate: "20 minutes",
      features: ["Surface dusting (3 key pieces)", "Floor vacuum (main pathways)", "Mirror/glass touch-up"],
    },
    {
      id: "bedroom-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for regular maintenance",
      price: 75.0, // 3x the Essential Clean price
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Under-bed extended reach",
        "Closet organization (visible items)",
        "Baseboard spotlight",
        "Window sill cleaning",
        "Light fixture dusting",
      ],
    },
    {
      id: "bedroom-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for maximum freshness",
      price: 225.0, // 9x the Essential Clean price
      timeEstimate: "180 minutes",
      features: [
        "Includes Advanced Clean",
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
      id: "bathroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for guest bathrooms",
      price: 30.0,
      timeEstimate: "25 minutes",
      features: ["Sink and counter wipe-down", "Toilet exterior cleaning", "Mirror cleaning"],
    },
    {
      id: "bathroom-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for regular bathrooms",
      price: 90.0, // 3x the Essential Clean price
      timeEstimate: "75 minutes",
      features: [
        "Includes Essential Clean",
        "Shower/tub scrubbing",
        "Toilet deep clean (interior/exterior)",
        "Floor detailed mopping",
        "Cabinet fronts cleaning",
        "Towel replacement",
      ],
    },
    {
      id: "bathroom-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for master bathrooms",
      price: 270.0, // 9x the Essential Clean price
      timeEstimate: "225 minutes",
      features: [
        "Includes Advanced Clean",
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
      id: "kitchen-essential",
      name: "ESSENTIAL CLEAN",
      description: "Surface cleaning for lightly used kitchens",
      price: 35.0,
      timeEstimate: "30 minutes",
      features: ["Countertop cleaning", "Sink washing", "Stovetop wipe-down"],
    },
    {
      id: "kitchen-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for regular kitchens",
      price: 105.0, // 3x the Essential Clean price
      timeEstimate: "90 minutes",
      features: [
        "Includes Essential Clean",
        "Appliance exterior cleaning",
        "Cabinet fronts wiping",
        "Floor detailed mopping",
        "Microwave interior cleaning",
        "Trash emptying",
      ],
    },
    {
      id: "kitchen-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for gourmet kitchens",
      price: 315.0, // 9x the Essential Clean price
      timeEstimate: "270 minutes",
      features: [
        "Includes Advanced Clean",
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
      id: "livingroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for living spaces",
      price: 30.0,
      timeEstimate: "25 minutes",
      features: ["Surface dusting", "Floor vacuum", "Coffee table cleaning"],
    },
    {
      id: "livingroom-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for family rooms",
      price: 90.0, // 3x the Essential Clean price
      timeEstimate: "75 minutes",
      features: [
        "Includes Essential Clean",
        "Furniture vacuuming",
        "Under furniture cleaning",
        "Baseboard dusting",
        "Electronics dusting",
        "Throw pillow fluffing",
      ],
    },
    {
      id: "livingroom-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for entertainment areas",
      price: 270.0, // 9x the Essential Clean price
      timeEstimate: "225 minutes",
      features: [
        "Includes Advanced Clean",
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
  diningRoom: [
    {
      id: "diningroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for dining areas",
      price: 25.0,
      timeEstimate: "20 minutes",
      features: ["Table and chair dusting", "Floor vacuum/sweep", "Light fixture dusting"],
    },
    {
      id: "diningroom-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for dining rooms",
      price: 75.0,
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Table polishing",
        "Chair detailed cleaning",
        "Baseboards dusting",
        "China cabinet exterior cleaning",
        "Floor detailed cleaning",
      ],
    },
    {
      id: "diningroom-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for formal dining rooms",
      price: 225.0,
      timeEstimate: "180 minutes",
      features: [
        "Includes Advanced Clean",
        "China/glassware cleaning",
        "Cabinet interior organization",
        "Chandelier detailed cleaning",
        "Wall spot cleaning",
        "Upholstery spot treatment",
        "Decor item individual cleaning",
      ],
    },
  ],
  homeOffice: [
    {
      id: "office-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for work spaces",
      price: 25.0,
      timeEstimate: "20 minutes",
      features: ["Desk surface dusting", "Floor vacuum", "Trash emptying"],
    },
    {
      id: "office-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for home offices",
      price: 75.0,
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Electronics dusting",
        "Bookshelf organization",
        "Chair cleaning",
        "Window sill cleaning",
        "Baseboard dusting",
      ],
    },
    {
      id: "office-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for professional offices",
      price: 225.0,
      timeEstimate: "180 minutes",
      features: [
        "Includes Advanced Clean",
        "Filing cabinet organization",
        "Keyboard and peripheral cleaning",
        "Monitor detailed cleaning",
        "Cable management",
        "Drawer organization",
        "Wall spot cleaning",
      ],
    },
  ],
  laundryRoom: [
    {
      id: "laundry-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for laundry areas",
      price: 20.0,
      timeEstimate: "15 minutes",
      features: ["Surface dusting", "Floor sweep/vacuum", "Sink cleaning"],
    },
    {
      id: "laundry-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for laundry rooms",
      price: 60.0,
      timeEstimate: "45 minutes",
      features: [
        "Includes Essential Clean",
        "Washer/dryer exterior cleaning",
        "Countertop detailed cleaning",
        "Floor detailed mopping",
        "Cabinet fronts wiping",
        "Lint trap cleaning",
      ],
    },
    {
      id: "laundry-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for laundry centers",
      price: 180.0,
      timeEstimate: "135 minutes",
      features: [
        "Includes Advanced Clean",
        "Washer drum cleaning",
        "Dryer vent cleaning",
        "Cabinet interior organization",
        "Utility sink deep cleaning",
        "Detergent area organization",
        "Wall spot cleaning",
      ],
    },
  ],
  entryway: [
    {
      id: "entryway-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for entryways",
      price: 15.0,
      timeEstimate: "10 minutes",
      features: ["Floor sweep/vacuum", "Surface dusting", "Door cleaning"],
    },
    {
      id: "entryway-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for foyers",
      price: 45.0,
      timeEstimate: "30 minutes",
      features: [
        "Includes Essential Clean",
        "Floor detailed mopping",
        "Baseboard dusting",
        "Light fixture dusting",
        "Mirror cleaning",
        "Console table organization",
      ],
    },
    {
      id: "entryway-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for grand entrances",
      price: 135.0,
      timeEstimate: "90 minutes",
      features: [
        "Includes Advanced Clean",
        "Chandelier detailed cleaning",
        "Wall spot cleaning",
        "Decor item individual cleaning",
        "Shoe organization",
        "Coat closet organization",
        "Door hardware polishing",
      ],
    },
  ],
  hallway: [
    {
      id: "hallway-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for hallways",
      price: 15.0,
      timeEstimate: "10 minutes",
      features: ["Floor vacuum/sweep", "Surface dusting", "Light fixture dusting"],
    },
    {
      id: "hallway-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for corridors",
      price: 45.0,
      timeEstimate: "30 minutes",
      features: [
        "Includes Essential Clean",
        "Floor detailed mopping",
        "Baseboard dusting",
        "Wall spot cleaning",
        "Picture frame dusting",
        "Door cleaning",
      ],
    },
    {
      id: "hallway-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for gallery hallways",
      price: 135.0,
      timeEstimate: "90 minutes",
      features: [
        "Includes Advanced Clean",
        "Runner/carpet detailed cleaning",
        "Light fixture detailed cleaning",
        "Artwork/decor individual cleaning",
        "Door hardware polishing",
        "Ceiling corner cobweb removal",
        "Air vent cleaning",
      ],
    },
  ],
  stairs: [
    {
      id: "stairs-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for staircases",
      price: 20.0,
      timeEstimate: "15 minutes",
      features: ["Step vacuum/sweep", "Handrail dusting", "Visible surface dusting"],
    },
    {
      id: "stairs-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for stairways",
      price: 60.0,
      timeEstimate: "45 minutes",
      features: [
        "Includes Essential Clean",
        "Step detailed cleaning",
        "Handrail detailed cleaning",
        "Baseboard dusting",
        "Spindle dusting",
        "Wall spot cleaning",
      ],
    },
    {
      id: "stairs-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for grand staircases",
      price: 180.0,
      timeEstimate: "135 minutes",
      features: [
        "Includes Advanced Clean",
        "Carpet deep cleaning",
        "Spindle detailed cleaning",
        "Stair runner detailed cleaning",
        "Under-stair visible areas",
        "Light fixture detailed cleaning",
        "Decorative element cleaning",
      ],
    },
  ],
  default: [
    {
      id: "default-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for all spaces",
      price: 25.0,
      timeEstimate: "20 minutes",
      features: ["Surface dusting", "Floor vacuum/sweep", "General tidying"],
    },
    {
      id: "default-advanced",
      name: "ADVANCED CLEAN",
      description: "Thorough cleaning for all spaces",
      price: 75.0, // 3x the Essential Clean price
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Detailed dusting",
        "Floor detailed cleaning",
        "Baseboard attention",
        "Surface sanitizing",
        "Trash removal",
      ],
    },
    {
      id: "default-premium",
      name: "PREMIUM CLEAN",
      description: "Comprehensive cleaning for all spaces",
      price: 225.0, // 9x the Essential Clean price
      timeEstimate: "180 minutes",
      features: [
        "Includes Advanced Clean",
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

// Default reductions for all rooms
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
      name: "Skip detailed dusting",
      discount: 10.0,
      description: "Detailed dusting will not be performed",
    },
    {
      id: "def-r2",
      name: "Basic floor cleaning only",
      discount: 12.0,
      description: "Only basic floor cleaning will be performed",
    },
    { id: "def-r3", name: "No baseboard cleaning", discount: 8.0, description: "Baseboards will not be cleaned" },
    {
      id: "def-r4",
      name: "Skip hard-to-reach areas",
      discount: 10.0,
      description: "Hard-to-reach areas will not be cleaned",
    },
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

// Room type to professional image mapping
export const roomImages: Record<string, string> = {
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
  other: "/images/bedroom-professional.png", // fallback
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
