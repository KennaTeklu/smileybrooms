// Define the room tiers, add-ons, and reductions for the room configurator

export interface RoomTier {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  timeEstimate: string
  detailedTasks: string[] // New field for detailed task breakdown
  notIncludedTasks: string[] // New field for tasks not included
  upsellMessage?: string // New field for upselling
  originalPrice?: number // Added for whole house packages
  savings?: number // Added for whole house packages
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

// Define the tiers for each room type with detailed information
export const defaultTiers: Record<string, RoomTier[]> = {
  bedroom: [
    {
      id: "bedroom-essential",
      name: "Essential Clean",
      description: "Basic maintenance cleaning for your bedroom.",
      price: 115.0,
      timeEstimate: "20 minutes",
      features: [
        "Floor vacuuming (3 zones)",
        "Bed making (mattress + frame)",
        "Surface dusting (5 surfaces)",
        "Basic organizing (3 areas)",
      ],
      detailedTasks: [
        "Floor vacuuming (3 zones): $45",
        "Bed making (mattress + frame): $35",
        "Surface dusting (5 surfaces): $25",
        "Basic organizing (3 areas): $15",
      ],
      notIncludedTasks: [],
      upsellMessage: "For a more thorough clean including under-bed areas and baseboards, consider our ADVANCED CLEAN.",
    },
    {
      id: "bedroom-premium",
      name: "Premium Clean",
      description: "Comprehensive deep cleaning with organization for your bedroom.",
      price: 225.0,
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Floor deep vacuum (4 zones)",
        "Mattress steaming + bed making",
        "Complete surface dusting (8 surfaces)",
        "Closet front organization",
        "Window cleaning (interior)",
        "Electronics cleaning",
      ],
      detailedTasks: [
        "Floor deep vacuum (4 zones): $60",
        "Mattress steaming + bed making: $55",
        "Complete surface dusting (8 surfaces): $40",
        "Closet front organization: $35",
        "Window cleaning (interior): $25",
        "Electronics cleaning: $15",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "Achieve maximum freshness with our LUXURY CLEAN, covering every detail from mattress to ceiling fan.",
    },
    {
      id: "bedroom-luxury",
      name: "Luxury Clean",
      description: "White-glove premium service with restoration for your bedroom.",
      price: 435.0,
      timeEstimate: "180 minutes",
      features: [
        "Includes Premium Clean",
        "Floor restoration (5 zones)",
        "Mattress deep clean + luxury setup",
        "Surface restoration (12 surfaces)",
        "Walk-in closet complete organization",
        "Laundry service + electronics",
        "Under-bed + seasonal storage",
        "Wall cleaning (4 walls)",
        "Window treatments + air system",
      ],
      detailedTasks: [
        "Floor restoration (5 zones): $85",
        "Mattress deep clean + luxury setup: $95",
        "Surface restoration (12 surfaces): $75",
        "Walk-in closet complete org: $85",
        "Laundry service + electronics: $65",
        "Under-bed + seasonal storage: $45",
        "Wall cleaning (4 walls): $40",
        "Window treatments + air system: $35",
      ],
      notIncludedTasks: [],
    },
  ],
  bathroom: [
    {
      id: "bathroom-essential",
      name: "Essential Clean",
      description: "Basic cleaning for your bathroom.",
      price: 95.0,
      timeEstimate: "25 minutes",
      features: [
        "Toilet cleaning (bowl + exterior)",
        "Shower/tub basic (surfaces + glass)",
        "Sink + mirror cleaning",
        "Floor basic clean",
      ],
      detailedTasks: [
        "Toilet cleaning (bowl + exterior): $35",
        "Shower/tub basic (surfaces + glass): $40",
        "Sink + mirror cleaning: $25",
        "Floor basic clean: $15",
      ],
      notIncludedTasks: [],
      upsellMessage: "For a deeper clean of your shower/tub and toilet, upgrade to our ADVANCED CLEAN.",
    },
    {
      id: "bathroom-premium",
      name: "Premium Clean",
      description: "Thorough cleaning for your bathroom.",
      price: 165.0,
      timeEstimate: "75 minutes",
      features: [
        "Includes Essential Clean",
        "Toilet deep clean + behind",
        "Shower/tub deep (grout + fixtures)",
        "Vanity detail + organization",
        "Floor scrubbing + grout",
        "Towel arrangement",
      ],
      detailedTasks: [
        "Toilet deep clean + behind: $45",
        "Shower/tub deep (grout + fixtures): $65",
        "Vanity detail + organization: $35",
        "Floor scrubbing + grout: $25",
        "Towel arrangement: $15",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "Experience the ultimate bathroom refresh with our LUXURY CLEAN, covering every detail from grout to cabinet interiors.",
    },
    {
      id: "bathroom-luxury",
      name: "Luxury Clean",
      description: "Comprehensive cleaning for your master bathroom.",
      price: 295.0,
      timeEstimate: "225 minutes",
      features: [
        "Includes Premium Clean",
        "Toilet restoration + bolt replace",
        "Shower/tub restoration (grout whitening)",
        "Vanity complete organization",
        "Floor restoration + sealing",
        "Ventilation + medicine cabinet",
        "Linen service + specialty features",
      ],
      detailedTasks: [
        "Toilet restoration + bolt replace: $65",
        "Shower/tub restoration (grout whitening): $95",
        "Vanity complete organization: $55",
        "Floor restoration + sealing: $45",
        "Ventilation + medicine cabinet: $35",
        "Linen service + specialty features: $85",
      ],
      notIncludedTasks: [],
    },
  ],
  kitchen: [
    {
      id: "kitchen-essential",
      name: "Essential Clean",
      description: "Surface cleaning for your kitchen.",
      price: 125.0,
      timeEstimate: "30 minutes",
      features: [
        "Countertop cleaning (3 sections)",
        "Sink + faucet basic",
        "Stovetop cleaning (surface + burners)",
        "Basic organizing (counters)",
      ],
      detailedTasks: [
        "Countertop cleaning (3 sections): $35",
        "Sink + faucet basic: $25",
        "Stovetop cleaning (surface + burners): $45",
        "Basic organizing (counters): $25",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "For a more comprehensive kitchen clean, including appliance exteriors and microwave interior, choose our ADVANCED CLEAN.",
    },
    {
      id: "kitchen-premium",
      name: "Premium Clean",
      description: "Thorough cleaning for your kitchen.",
      price: 245.0,
      timeEstimate: "90 minutes",
      features: [
        "Includes Essential Clean",
        "Countertop detailing + backsplash",
        "Sink restoration + disposal",
        "Stovetop + oven interior",
        "Cabinet fronts + fridge exterior",
        "Microwave + dishwasher",
        "Floor cleaning",
      ],
      detailedTasks: [
        "Countertop detailing + backsplash: $45",
        "Sink restoration + disposal: $35",
        "Stovetop + oven interior: $65",
        "Cabinet fronts + fridge exterior: $35",
        "Microwave + dishwasher: $35",
        "Floor cleaning: $15",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "For a truly spotless kitchen, our LUXURY CLEAN offers deep cleaning of your oven, refrigerator interior, and more!",
    },
    {
      id: "kitchen-luxury",
      name: "Luxury Clean",
      description: "Comprehensive cleaning for your gourmet kitchen.",
      price: 465.0,
      timeEstimate: "270 minutes",
      features: [
        "Includes Premium Clean",
        "Countertop restoration + sealing",
        "Sink complete restoration",
        "Oven deep clean + hood system",
        "Cabinet organization + fridge deep",
        "All appliances detailing",
        "Floor restoration + pantry",
        "Wine fridge + specialty areas",
      ],
      detailedTasks: [
        "Countertop restoration + sealing: $65",
        "Sink complete restoration: $55",
        "Oven deep clean + hood system: $95",
        "Cabinet organization + fridge deep: $125",
        "All appliances detailing: $65",
        "Floor restoration + pantry: $85",
        "Wine fridge + specialty areas: $45",
      ],
      notIncludedTasks: [],
    },
  ],
  livingRoom: [
    {
      id: "livingroom-essential",
      name: "Essential Clean",
      description: "Basic cleaning for your living space.",
      price: 85.0,
      timeEstimate: "25 minutes",
      features: [
        "Floor vacuuming (carpet + rugs)",
        "Surface dusting (6 surfaces)",
        "Couch arrangement + cushions",
        "Basic organizing",
      ],
      detailedTasks: [
        "Floor vacuuming (carpet + rugs): $35",
        "Surface dusting (6 surfaces): $25",
        "Couch arrangement + cushions: $25",
        "Basic organizing: $15",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "For a more thorough clean including furniture vacuuming and under-furniture areas, consider our ADVANCED CLEAN.",
    },
    {
      id: "livingroom-premium",
      name: "Premium Clean",
      description: "Thorough cleaning for your family room.",
      price: 155.0,
      timeEstimate: "75 minutes",
      features: [
        "Includes Essential Clean",
        "Deep vacuuming + pet hair",
        "Furniture dusting + electronics",
        "Couch cleaning + fabric refresh",
        "Fireplace + plant care",
        "Electronics cleaning",
      ],
      detailedTasks: [
        "Deep vacuuming + pet hair: $45",
        "Furniture dusting + electronics: $35",
        "Couch cleaning + fabric refresh: $35",
        "Fireplace + plant care: $25",
        "Electronics cleaning: $15",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "For the ultimate living room transformation, our LUXURY CLEAN offers upholstery spot treatment, detailed ceiling fan cleaning, and more!",
    },
    {
      id: "livingroom-luxury",
      name: "Luxury Clean",
      description: "Comprehensive cleaning for your entertainment area.",
      price: 285.0,
      timeEstimate: "225 minutes",
      features: [
        "Includes Premium Clean",
        "Carpet restoration + protection",
        "Furniture restoration + upholstery",
        "Entertainment center + fireplace",
        "Window treatments + lighting",
        "Air system + piano care",
      ],
      detailedTasks: [
        "Carpet restoration + protection: $75",
        "Furniture restoration + upholstery: $85",
        "Entertainment center + fireplace: $65",
        "Window treatments + lighting: $45",
        "Air system + piano care: $35",
      ],
      notIncludedTasks: [],
    },
  ],
  diningRoom: [
    {
      id: "diningroom-essential",
      name: "Essential Clean",
      description: "Basic cleaning for your dining area.",
      price: 55.0,
      timeEstimate: "20 minutes",
      features: ["Table + chairs cleaning", "Floor vacuuming", "Basic organizing"],
      detailedTasks: ["Table + chairs cleaning: $25", "Floor vacuuming: $15", "Basic organizing: $15"],
      notIncludedTasks: [],
      upsellMessage:
        "For a more polished dining experience, our ADVANCED CLEAN includes table polishing and detailed chair cleaning.",
    },
    {
      id: "diningroom-premium",
      name: "Premium Clean",
      description: "Thorough cleaning for your dining room.",
      price: 85.0,
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Table + chairs detailing",
        "Floor deep clean",
        "China cabinet exterior",
        "Centerpiece arrangement",
      ],
      detailedTasks: [
        "Table + chairs detailing: $35",
        "Floor deep clean: $25",
        "China cabinet exterior: $25",
        "Centerpiece arrangement: $15",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "Transform your dining room into a sparkling haven with our LUXURY CLEAN, featuring chandelier cleaning and fine china care!",
    },
    {
      id: "diningroom-luxury",
      name: "Luxury Clean",
      description: "Comprehensive cleaning for your formal dining room.",
      price: 135.0,
      timeEstimate: "180 minutes",
      features: [
        "Includes Premium Clean",
        "Furniture restoration",
        "Floor restoration",
        "China cabinet organization",
        "Lighting + window treatments",
      ],
      detailedTasks: [
        "Furniture restoration: $45",
        "Floor restoration: $35",
        "China cabinet organization: $45",
        "Lighting + window treatments: $25",
      ],
      notIncludedTasks: [],
    },
  ],
  homeOffice: [
    {
      id: "office-essential",
      name: "Essential Clean",
      description: "Basic cleaning for your work space.",
      price: 95.0,
      timeEstimate: "20 minutes",
      features: ["Desk cleaning (surface + electronics)", "Floor vacuuming", "Basic organizing (papers + supplies)"],
      detailedTasks: [
        "Desk cleaning (surface + electronics): $45",
        "Floor vacuuming: $25",
        "Basic organizing (papers + supplies): $25",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "Boost your productivity with our ADVANCED CLEAN, including detailed electronics dusting and bookshelf organization.",
    },
    {
      id: "office-premium",
      name: "Premium Clean",
      description: "Thorough cleaning for your home office.",
      price: 175.0,
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Desk organization + cable management",
        "Electronics deep clean",
        "Floor detailing + bookshelf",
        "Lighting optimization",
      ],
      detailedTasks: [
        "Desk organization + cable mgmt: $55",
        "Electronics deep clean: $45",
        "Floor detailing + bookshelf: $35",
        "Lighting optimization: $25",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "For a truly professional and organized workspace, our LUXURY CLEAN offers comprehensive filing system and keyboard cleaning!",
    },
    {
      id: "office-luxury",
      name: "Luxury Clean",
      description: "Comprehensive cleaning for your professional office.",
      price: 325.0,
      timeEstimate: "180 minutes",
      features: [
        "Includes Premium Clean",
        "Complete workstation setup",
        "Equipment maintenance + optimization",
        "Storage optimization + digital setup",
        "Air quality + security system",
        "Conference setup",
      ],
      detailedTasks: [
        "Complete workstation setup: $85",
        "Equipment maintenance + optimization: $75",
        "Storage optimization + digital setup: $65",
        "Air quality + security system: $55",
        "Conference setup: $45",
      ],
      notIncludedTasks: [],
    },
  ],
  laundryRoom: [
    {
      id: "laundry-essential",
      name: "Essential Clean",
      description: "Basic cleaning for your laundry area.",
      price: 75.0,
      timeEstimate: "15 minutes",
      features: ["Appliance exterior cleaning", "Floor cleaning + lint removal", "Basic organizing (supplies)"],
      detailedTasks: [
        "Appliance exterior cleaning: $35",
        "Floor cleaning + lint removal: $25",
        "Basic organizing (supplies): $15",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "For a more hygienic laundry space, our ADVANCED CLEAN includes washer/dryer exterior cleaning and lint trap cleaning.",
    },
    {
      id: "laundry-premium",
      name: "Premium Clean",
      description: "Thorough cleaning for your laundry room.",
      price: 145.0,
      timeEstimate: "45 minutes",
      features: [
        "Includes Essential Clean",
        "Appliance deep clean (interior)",
        "Floor + walls deep clean",
        "Storage organization",
        "Utility sink detail",
      ],
      detailedTasks: [
        "Appliance deep clean (interior): $55",
        "Floor + walls deep clean: $35",
        "Storage organization: $35",
        "Utility sink detail: $25",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "For a truly deep clean, our LUXURY CLEAN offers washer drum and dryer vent cleaning, plus cabinet interior organization!",
    },
    {
      id: "laundry-luxury",
      name: "Luxury Clean",
      description: "Comprehensive cleaning for your laundry center.",
      price: 285.0,
      timeEstimate: "135 minutes",
      features: [
        "Includes Premium Clean",
        "Appliance restoration + maintenance",
        "Deep sanitization + mold prevention",
        "Complete organization + inventory",
        "Utility optimization + ventilation",
        "Laundry folding + stain station",
      ],
      detailedTasks: [
        "Appliance restoration + maintenance: $85",
        "Deep sanitization + mold prevention: $65",
        "Complete organization + inventory: $75",
        "Utility optimization + ventilation: $45",
        "Laundry folding + stain station: $35",
      ],
      notIncludedTasks: [],
    },
  ],
  entryway: [
    {
      id: "entryway-essential",
      name: "Essential Clean",
      description: "Basic cleaning for your entryway.",
      price: 45.0,
      timeEstimate: "10 minutes",
      features: ["Floor cleaning + mat", "Surface dusting", "Basic organizing"],
      detailedTasks: ["Floor cleaning + mat: $25", "Surface dusting: $15", "Basic organizing: $15"],
      notIncludedTasks: [],
      upsellMessage:
        "Make a grander entrance with our ADVANCED CLEAN, including detailed floor mopping and baseboard dusting.",
    },
    {
      id: "entryway-premium",
      name: "Premium Clean",
      description: "Thorough cleaning for your foyer.",
      price: 75.0,
      timeEstimate: "30 minutes",
      features: [
        "Includes Essential Clean",
        "Floor detailing + scuff removal",
        "Furniture + closet organization",
        "Closet organization",
        "Lighting + door maintenance",
      ],
      detailedTasks: [
        "Floor detailing + scuff removal: $35",
        "Furniture + closet organization: $25",
        "Closet organization: $25",
        "Lighting + door maintenance: $35",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "For an immaculate entryway, our LUXURY CLEAN offers chandelier cleaning, shoe organization, and more!",
    },
    {
      id: "entryway-luxury",
      name: "Luxury Clean",
      description: "Comprehensive cleaning for your grand entrance.",
      price: 125.0,
      timeEstimate: "90 minutes",
      features: [
        "Includes Premium Clean",
        "Floor restoration + protective coating",
        "Complete organization + seasonal rotation",
        "Lighting + door maintenance",
        "Seasonal decoration",
      ],
      detailedTasks: [
        "Floor restoration + protective coating: $45",
        "Complete organization + seasonal rotation: $35",
        "Lighting + door maintenance: $35",
        "Seasonal decoration: $15",
      ],
      notIncludedTasks: [],
    },
  ],
  hallway: [
    {
      id: "hallway-essential",
      name: "Essential Clean",
      description: "Basic cleaning for your hallway.",
      price: 45.0,
      timeEstimate: "10 minutes",
      features: ["Floor cleaning", "Wall spot cleaning", "Basic organizing"],
      detailedTasks: ["Floor cleaning: $25", "Wall spot cleaning: $15", "Basic organizing: $15"],
      notIncludedTasks: [],
      upsellMessage:
        "For a more pristine hallway, our ADVANCED CLEAN includes detailed floor mopping and baseboard dusting.",
    },
    {
      id: "hallway-premium",
      name: "Premium Clean",
      description: "Thorough cleaning for your corridor.",
      price: 75.0,
      timeEstimate: "30 minutes",
      features: [
        "Includes Essential Clean",
        "Floor detailing + baseboards",
        "Wall cleaning + lighting",
        "Lighting fixtures",
      ],
      detailedTasks: ["Floor detailing + baseboards: $35", "Wall cleaning + lighting: $25", "Lighting fixtures: $15"],
      notIncludedTasks: [],
      upsellMessage:
        "For a truly spotless corridor, our LUXURY CLEAN offers deep cleaning of runners/carpets and detailed light fixture cleaning!",
    },
    {
      id: "hallway-luxury",
      name: "Luxury Clean",
      description: "Comprehensive cleaning for your gallery hallway.",
      price: 115.0,
      timeEstimate: "90 minutes",
      features: [
        "Includes Premium Clean",
        "Floor restoration + protection",
        "Wall restoration + minor repairs",
        "Lighting optimization + ventilation",
        "Decorative arrangement",
      ],
      detailedTasks: [
        "Floor restoration + protection: $45",
        "Wall restoration + minor repairs: $35",
        "Lighting optimization + ventilation: $25",
        "Decorative arrangement: $15",
      ],
      notIncludedTasks: [],
    },
  ],
  stairs: [
    {
      id: "stairs-essential",
      name: "Essential Clean",
      description: "Basic cleaning for your staircase.",
      price: 65.0,
      timeEstimate: "15 minutes",
      features: ["Step vacuuming", "Safety check + organizing", "Basic organizing"],
      detailedTasks: ["Step vacuuming: $35", "Safety check + organizing: $25", "Basic organizing: $15"],
      notIncludedTasks: [],
      upsellMessage:
        "For a more thorough staircase clean, our ADVANCED CLEAN includes detailed step and handrail cleaning.",
    },
    {
      id: "stairs-premium",
      name: "Premium Clean",
      description: "Thorough cleaning for your stairway.",
      price: 95.0,
      timeEstimate: "45 minutes",
      features: [
        "Includes Essential Clean",
        "Deep vacuuming + corners",
        "Handrail polishing",
        "Wall cleaning + lighting",
      ],
      detailedTasks: ["Deep vacuuming + corners: $45", "Handrail polishing: $35", "Wall cleaning + lighting: $25"],
      notIncludedTasks: [],
      upsellMessage:
        "For a truly grand staircase, our LUXURY CLEAN offers deep carpet cleaning and detailed spindle cleaning!",
    },
    {
      id: "stairs-luxury",
      name: "Luxury Clean",
      description: "Comprehensive cleaning for your grand staircase.",
      price: 155.0,
      timeEstimate: "135 minutes",
      features: [
        "Includes Premium Clean",
        "Carpet restoration + protection",
        "Railing restoration + wall cleaning",
        "Lighting optimization + safety treatment",
      ],
      detailedTasks: [
        "Carpet restoration + protection: $65",
        "Railing restoration + wall cleaning: $55",
        "Lighting optimization + safety treatment: $35",
      ],
      notIncludedTasks: [],
    },
  ],
  default: [
    {
      id: "default-essential",
      name: "Essential Clean",
      description: "Basic maintenance cleaning for your entire home.",
      price: 1139.0,
      originalPrice: 1265.0,
      savings: 126.0,
      timeEstimate: "10 hours",
      features: [
        "Surface dusting (all accessible surfaces)",
        "Floor vacuum/sweep (main areas)",
        "General tidying & trash emptied",
        "Light switch & doorknob wipe",
        "Mirror spot clean",
      ],
      detailedTasks: [
        "Dusting of all accessible surfaces (tables, shelves, desks)",
        "Vacuuming or sweeping of main floor areas",
        "Straightening up items, light organization of clutter",
        "Emptying all trash bins and replacing liners",
        "Quick wipe-down of light switches and doorknobs",
        "Quick wipe of mirrors to remove obvious smudges",
      ],
      notIncludedTasks: [
        "✗ Detailed dusting of decor items",
        "✗ Deep cleaning of floors (e.g., mopping edges, under furniture)",
        "✗ Baseboard cleaning",
        "✗ Interior window cleaning",
        "✗ Appliance exterior polishing",
        "✗ Bathroom grout scrubbing",
        "✗ Kitchen cabinet interior cleaning",
        "✗ Organizing personal items (e.g., clothes, papers, toys)",
        "✗ Wall spot cleaning (beyond light smudges)",
        "✗ Ceiling fan cleaning",
        "✗ Light fixture detailed cleaning",
        "✗ Inside oven/refrigerator cleaning",
        "✗ Laundry folding",
        "✗ Pet mess cleanup",
        "✗ Exterior cleaning (e.g., patios, garages)",
      ],
      upsellMessage:
        "Ready for a deeper clean? Our ADVANCED HOME CLEAN offers thorough attention to high-traffic areas and surfaces.",
    },
    {
      id: "default-premium",
      name: "Premium Clean",
      description: "Comprehensive deep cleaning with organization for your entire home.",
      price: 2237.0,
      originalPrice: 2485.0,
      savings: 248.0,
      timeEstimate: "12 hours",
      features: [
        "Includes Essential Clean",
        "Detailed dusting of all surfaces",
        "Deep floor cleaning",
        "Baseboard & trim wipe",
        "Full surface sanitization",
        "Appliance exteriors",
        "Bathroom & Kitchen deep clean",
      ],
      detailedTasks: [
        "ALL Essential Clean tasks",
        "Thorough dusting of all surfaces, including decor and electronics",
        "Deep vacuuming or mopping of all floor areas, including edges and under light furniture",
        "Wiping down all baseboards and trim",
        "Sanitizing all high-touch surfaces (doorknobs, light switches, countertops, remotes)",
        "Interior window spot cleaning (visible smudges and fingerprints)",
        "Wiping down exteriors of all kitchen appliances (refrigerator, oven, dishwasher, microwave)",
        "Polishing bathroom faucets and showerheads",
        "Scrubbing and sanitizing kitchen sink and faucet",
        "Making beds with existing linens (up to 2 beds)",
        "Light organization of common areas (living room, dining room, entryway)",
        "Vacuuming upholstered furniture (sofas, chairs)",
      ],
      notIncludedTasks: [
        "✗ Specialty surface treatment (e.g., leather conditioning, marble polishing)",
        "✗ Detail work on intricate fixtures (e.g., chandeliers, complex light fixtures)",
        "✗ Inside oven/refrigerator/dishwasher cleaning",
        "✗ Laundry washing/folding",
        "✗ Extensive organization of personal belongings (e.g., sorting drawers, closets)",
        "✗ Grout deep cleaning (beyond surface scrub)",
        "✗ Carpet shampooing/deep stain removal",
        "✗ Moving heavy furniture or appliances for cleaning underneath",
        "✗ Biohazard cleanup (e.g., excessive mold, pet waste)",
        "✗ Post-construction or renovation cleanup",
        "✗ Exterior cleaning",
      ],
      upsellMessage:
        "For the ultimate spotless experience, our LUXURY HOME SPA leaves no detail untouched, transforming your entire home.",
    },
    {
      id: "default-luxury",
      name: "Luxury Clean",
      description:
        "Experience unparalleled cleanliness and a truly revitalized home, meticulously cared for from top to bottom.",
      price: 4298.0,
      originalPrice: 4775.0,
      savings: 477.0,
      timeEstimate: "15 hours",
      features: [
        "Includes Premium Clean",
        "Specialty surface treatment",
        "Intricate fixture detailing",
        "All hard-to-reach areas",
        "Aromatherapy finish",
        "Full wall spot cleaning",
        "Ceiling & crown molding care",
        "Appliance interior deep clean",
        "Grout & carpet restoration",
        "Personal item organization",
        "Laundry service",
      ],
      detailedTasks: [
        "ALL Premium Clean tasks",
        "Specialty surface treatment and conditioning (leather, marble, stainless steel, wood polishing)",
        "Detailed cleaning of all light fixtures, faucets, and hardware, including disassembling if needed",
        "Cleaning of high shelves, inside all accessible cabinets and drawers (if empty or with light items), behind and under all furniture (moved by cleaners)",
        "Application of essential oil mist for a fresh, inviting scent throughout the home",
        "Thorough spot cleaning of all walls for marks and smudges",
        "Removal of cobwebs and dust from all ceiling corners and crown molding",
        "Detailed cleaning of all doors, doorframes, and hinges",
        "Deep cleaning of all light fixtures and ceiling fans (disassembled and reassembled)",
        "Removing and deep cleaning all air vent covers",
        "Individually cleaning and polishing all decorative items, picture frames, and artwork",
        "Deep cleaning of oven, refrigerator, and dishwasher interiors",
        "Grout deep cleaning and sanitizing all tile grout in bathrooms and kitchen",
        "Carpet spot treatment and deodorizing, including light shampooing if needed",
        "Laundry washing and folding (up to 2 loads)",
        "Basic organization of personal belongings in drawers and closets (e.g., folding clothes, stacking papers)",
        "Vacuuming and wiping down blinds/curtains",
        "Cleaning and polishing all interior glass surfaces (mirrors, glass tabletops, interior windows)",
      ],
      notIncludedTasks: [
        "✗ Extensive organization requiring client input (e.g., decluttering entire rooms, sorting extensive paperwork)",
        "✗ Exterior window cleaning",
        "✗ Biohazard cleanup (e.g., excessive mold remediation, large amounts of pet waste)",
        "✗ Post-construction or renovation cleanup (excessive dust/debris requiring specialized equipment)",
        "✗ Pest control",
        "✗ Exterior cleaning (e.g., patios, garages, driveways, gutters)",
      ],
    },
  ],
}

// Keep all the existing add-ons and reductions data...
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
    {
      id: "sta-1",
      name: "Carpet deep cleaning",
      price: 25.0,
      description: "Deep cleaning of stair carpet",
    },
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
  other: "/placeholder.svg?height=140&width=200", // fallback
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
  default: "Whole House", // Changed to "Whole House" for clarity
  other: "Other Space",
}
