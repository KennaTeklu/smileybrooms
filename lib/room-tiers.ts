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
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for lightly used rooms",
      price: 120.0,
      timeEstimate: "20 minutes",
      features: ["Surface dusting (3 key pieces)", "Floor vacuum (main pathways)", "Mirror/glass touch-up"],
      detailedTasks: [
        "Floor vacuuming (main area) - Central carpet/hardwood",
        "Floor vacuuming (corners & edges) - Baseboards, tight spaces",
        "Under-bed floor cleaning - Vacuum/sweep underneath, move items",
        "Bed making (mattress prep) - Strip, inspect, basic sanitize",
        "Bed making (fresh linens) - Fitted sheet, flat sheet, pillowcase",
        "Bed making (decorative setup) - Pillows, throw arrangement",
        "Wall cleaning (door wall) - Spot clean, fingerprints",
        "Wall cleaning (window wall) - Dust, window sill",
        "Wall cleaning (headboard wall) - Behind bed, outlet cleaning",
        "Wall cleaning (closet wall) - Scuff marks, switch plates",
        "Basic nightstand organizing - Clear, wipe, arrange",
        "Basic dresser organizing - Top surface, remove items",
        "Light fixture dusting - Ceiling fan or overhead light",
      ],
      notIncludedTasks: [],
      upsellMessage: "For a more thorough clean including under-bed areas and baseboards, consider our PREMIUM CLEAN.",
    },
    {
      id: "bedroom-premium", // Renamed from bedroom-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for regular maintenance",
      price: 220.0,
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Under-bed extended reach",
        "Closet organization (visible items)",
        "Baseboard spotlight",
        "Window sill cleaning",
        "Light fixture dusting",
      ],
      detailedTasks: [
        "Floor deep vacuuming (main area) - Multiple passes, spot treatment",
        "Floor deep vacuuming (corners & edges) - Baseboard detailing, crevices",
        "Under-bed deep cleaning - Complete under-bed organization, dust removal",
        "Mattress steaming (top surface) - Allergen removal, sanitization",
        "Mattress steaming (sides & bottom) - Flip, complete sanitization",
        "Pillow steaming & fluffing - Each pillow individually treated",
        "Bed frame cleaning - Headboard, footboard, frame wiping",
        "Fresh linen service (premium) - High-thread count, ironed",
        "Wall deep cleaning (per wall x4) - Complete wall washing",
        "Closet front organization - Hanging area, shoe rack, floor",
        "Electronics cleaning - TV, sound system, remotes, cables",
        "Window treatment cleaning - Blinds, curtains, hardware",
        "Detailed furniture dusting - Nightstands, dresser, decorative items",
        "Light fixture deep clean - Disassemble, clean, reassemble",
        "Air vent cleaning - Remove, wash, reinstall",
      ],
      notIncludedTasks: [],
      upsellMessage:
        "Achieve maximum freshness with our LUXURY CLEAN, covering every detail from mattress to ceiling fan.",
    },
    {
      id: "bedroom-luxury", // Renamed from bedroom-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for maximum freshness",
      price: 380.0,
      timeEstimate: "180 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
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
      detailedTasks: [
        "Floor restoration (hardwood) - Deep clean, polish, protect",
        "Floor restoration (carpet) - Steam clean, stain removal",
        "Under-bed complete organization - Storage boxes, seasonal items, labeling",
        "Mattress professional treatment - UV sanitization, deep steam",
        "Pillow restoration service - Wash, fluff, allergen treatment",
        "Bed frame restoration - Wood conditioning, hardware tightening",
        "Luxury linen service - Egyptian cotton, pressed, hotel-style",
        "Wall restoration (per wall x4) - Wash, touch-up",
        "Walk-in closet organization - Complete system, seasonal rotation",
        "Wardrobe steaming service - Hang clothes, steam wrinkles",
        "Electronics deep service - Internal cleaning, cable management",
        "Window complete service - Interior/exterior, tracks, screens",
        "Furniture restoration - Wood conditioning, leather treatment",
        "Lighting optimization - Fixture cleaning, bulb replacement, dimmer check",
        "Air quality service - Filter replacement, vent deep clean",
        "Laundry folding service - Professional fold, organize",
      ],
      notIncludedTasks: [],
    },
  ],
  bathroom: [
    {
      id: "bathroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for guest bathrooms",
      price: 140.0,
      timeEstimate: "25 minutes",
      features: [
        "Toilet bowl & exterior cleaning",
        "Shower/tub surface clean",
        "Sink & vanity wipe-down",
        "Mirror cleaning",
        "Basic floor clean",
      ],
      detailedTasks: [
        "Toilet bowl cleaning - Scrub, sanitize, brush work",
        "Toilet exterior cleaning - Base, tank, seat, handles",
        "Toilet area floor cleaning - Behind toilet, baseboards",
        "Shower wall cleaning (per wall x3) - Soap scum, tiles",
        "Shower floor cleaning - Grout, drain, non-slip treatment",
        "Shower door/curtain cleaning - Glass, hardware, tracks",
        "Sink cleaning - Bowl, faucet, drain",
        "Vanity cleaning - Counter, organize toiletries",
        "Mirror cleaning - Streak-free, frame",
        "Floor cleaning (main area) - Sweep, mop, basic clean",
      ],
      notIncludedTasks: [
        "✗ Toilet deep sanitization",
        "✗ Shower wall restoration",
        "✗ Grout detailed cleaning",
        "✗ Cabinet interior organization",
        "✗ Fixture polishing",
        "✗ Aromatherapy treatment",
        "✗ Exhaust fan cleaning",
        "✗ Mold/mildew treatment",
      ],
      upsellMessage: "For a deeper clean of your shower/tub and toilet, upgrade to our PREMIUM CLEAN.",
    },
    {
      id: "bathroom-premium", // Renamed from bathroom-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for regular bathrooms",
      price: 250.0,
      timeEstimate: "75 minutes",
      features: [
        "Includes Essential Clean",
        "Toilet deep sanitization",
        "Shower wall restoration",
        "Shower door restoration",
        "Sink & vanity restoration",
        "Floor restoration",
        "Towel & linen service",
        "Ventilation cleaning",
        "Medicine cabinet organization",
      ],
      detailedTasks: [
        "Toilet deep sanitization - Complete disinfection, mineral removal",
        "Toilet area restoration - Behind toilet, bolt cleaning, caulk",
        "Shower wall restoration (per wall x3) - Grout cleaning, sealing",
        "Shower floor restoration - Deep grout clean, anti-slip coating",
        "Shower door restoration - Glass polish, hardware, seal replacement",
        "Shower fixture cleaning - Showerhead, handles, steam clean",
        "Sink restoration - Mineral removal, faucet polish",
        "Vanity deep organization - Drawers, cabinets, product arrangement",
        "Mirror & lighting service - Mirror, light fixtures, electrical",
        "Floor restoration - Deep scrub, grout seal, polish",
        "Towel & linen service - Fresh towels, arrangement, heated rack",
        "Ventilation cleaning - Fan, vents, moisture control",
        "Medicine cabinet organization - Safety check, expiration dates",
      ],
      notIncludedTasks: [
        "✗ Toilet complete restoration",
        "✗ Shower system optimization",
        "✗ Spa amenity setup",
        "✗ Water quality optimization",
      ],
      upsellMessage:
        "Experience the ultimate bathroom refresh with our LUXURY CLEAN, covering every detail from grout to cabinet interiors.",
    },
    {
      id: "bathroom-luxury", // Renamed from bathroom-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for master bathrooms",
      price: 420.0,
      timeEstimate: "225 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
        "Toilet complete restoration",
        "Shower system optimization",
        "Spa amenity setup",
        "Water quality optimization",
        "Luxury linen service",
        "Complete vanity organization",
      ],
      detailedTasks: [
        "Toilet complete restoration - Professional-grade sanitization, mineral treatment",
        "Toilet area complete service - Caulk replacement, behind-toilet deep clean",
        "Shower wall professional service (per wall x3) - Grout whitening, tile sealing",
        "Shower floor professional restoration - Complete grout renewal, drainage optimization",
        "Shower door professional service - Glass coating, hardware replacement",
        "Shower system optimization - Pressure check, filter replacement",
        "Sink professional restoration - Complete mineral removal, faucet service",
        "Vanity complete organization - Custom organizers, product inventory",
        "Mirror & lighting upgrade - Professional cleaning, bulb upgrade",
        "Floor professional restoration - Deep treatment, protective coating",
        "Luxury linen service - Premium towels, spa arrangement",
        "Ventilation system service - Deep cleaning, moisture sensors",
        "Spa amenity setup - Aromatherapy, luxury products",
        "Water quality optimization - Filter service, pressure adjustment",
      ],
      notIncludedTasks: [],
    },
  ],
  kitchen: [
    {
      id: "kitchen-essential",
      name: "ESSENTIAL CLEAN",
      description: "Surface cleaning for lightly used kitchens",
      price: 160.0,
      timeEstimate: "30 minutes",
      features: [
        "Countertop cleaning",
        "Sink washing",
        "Stovetop wipe-down",
        "Microwave cleaning",
        "Dishwasher exterior",
        "Cabinet fronts",
        "Basic floor clean",
      ],
      detailedTasks: [
        "Countertop cleaning (per linear foot) - Clear, sanitize, organize",
        "Sink cleaning - Scrub, sanitize, faucet polish",
        "Stovetop cleaning - Burners, drip pans, surface",
        "Microwave cleaning - Interior steam clean, exterior",
        "Dishwasher exterior cleaning - Door, handles, control panel",
        "Cabinet front cleaning (per door) - Wipe, polish, handles",
        "Floor cleaning (basic) - Sweep, spot mop",
      ],
      notIncludedTasks: [
        "✗ Countertop restoration",
        "✗ Sink restoration",
        "✗ Oven interior cleaning",
        "✗ Refrigerator interior cleaning",
        "✗ Cabinet interior organization",
        "✗ Dishwasher deep cleaning",
        "✗ Range hood degreasing",
        "✗ Small appliance cleaning",
        "✗ Pantry organization",
      ],
      upsellMessage:
        "For a more comprehensive kitchen clean, including appliance exteriors and microwave interior, choose our PREMIUM CLEAN.",
    },
    {
      id: "kitchen-premium", // Renamed from kitchen-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for regular kitchens",
      price: 280.0,
      timeEstimate: "90 minutes",
      features: [
        "Includes Essential Clean",
        "Countertop restoration",
        "Sink restoration",
        "Stovetop & oven cleaning",
        "Microwave restoration",
        "Dishwasher deep cleaning",
        "Refrigerator exterior service",
        "Cabinet deep cleaning",
        "Floor restoration",
        "Small appliance cleaning",
        "Pantry organization",
      ],
      detailedTasks: [
        "Countertop restoration (per linear foot) - Deep clean, polish, backsplash",
        "Sink restoration - Deep scrub, mineral removal, disposal clean",
        "Stovetop & oven cleaning - Interior oven, hood, backsplash",
        "Microwave restoration - Complete interior steam, exterior polish",
        "Dishwasher deep cleaning - Interior, filter, seal cleaning",
        "Refrigerator exterior service - Doors, handles, coils",
        "Cabinet deep cleaning (per door) - Interior wipe, hardware polish",
        "Floor restoration - Deep mop, baseboards, under appliances",
        "Small appliance cleaning - Coffee maker, toaster, blender",
        "Pantry organization - Shelves, expiration check",
      ],
      notIncludedTasks: [
        "✗ Countertop professional service",
        "✗ Oven professional service",
        "✗ Refrigerator complete service",
        "✗ Cabinet restoration",
        "✗ All appliances professional service",
        "✗ Wine/bar area service",
        "✗ Lighting & electrical service",
      ],
      upsellMessage:
        "For a truly spotless kitchen, our LUXURY CLEAN offers deep cleaning of your oven, refrigerator interior, and more!",
    },
    {
      id: "kitchen-luxury", // Renamed from kitchen-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for gourmet kitchens",
      price: 480.0,
      timeEstimate: "270 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
        "Countertop professional service",
        "Sink professional restoration",
        "Oven professional service",
        "Microwave professional service",
        "Dishwasher professional service",
        "Refrigerator complete service",
        "Cabinet restoration",
        "Floor professional restoration",
        "All appliances professional service",
        "Pantry complete organization",
        "Wine/bar area service",
        "Lighting & electrical service",
      ],
      detailedTasks: [
        "Countertop professional service (per linear foot) - Seal, protect, deep condition",
        "Sink professional restoration - Complete service, plumbing check",
        "Oven professional service - Self-clean management, rack restoration",
        "Microwave professional service - Interior restoration, ventilation",
        "Dishwasher professional service - Filter replacement, seal maintenance",
        "Refrigerator complete service - Interior shelves, coils, water filter, ice maker",
        "Cabinet restoration (per door) - Interior organization, liner replacement",
        "Floor professional restoration - Deep scrub, grout seal, polish",
        "All appliances professional service - Complete maintenance, optimization",
        "Pantry complete organization - Inventory system, labeling, rotation",
        "Wine/bar area service - Cleaning, organization, glass care",
        "Lighting & electrical service - Under-cabinet lights, outlets, switches",
      ],
      notIncludedTasks: [],
    },
  ],
  livingRoom: [
    {
      id: "livingroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for living spaces",
      price: 110.0,
      timeEstimate: "25 minutes",
      features: ["Surface dusting", "Floor vacuum", "Coffee table cleaning"],
      detailedTasks: [
        "Vacuum main walkways - Central carpet/hardwood",
        "Dust coffee table + end tables - Clear, wipe, arrange",
        "TV screen + electronics wipe - Screen, remotes, cables",
        "Throw pillows fluff + arrange - Each pillow individually fluffed",
        "Quick floor spot vacuum - High traffic areas, visible debris",
        "Trash empty + tidy - Empty bins, replace liners, general tidying",
      ],
      notIncludedTasks: [
        "✗ Furniture vacuuming",
        "✗ Under furniture cleaning",
        "✗ Baseboard dusting",
        "✗ Electronics dusting",
        "✗ Upholstery spot treatment",
        "✗ Ceiling fan detailed cleaning",
        "✗ Window sill detailing",
        "✗ Decor item individual cleaning",
        "✗ Entertainment center organization",
        "✗ Bookshelf dusting",
        "✗ Light fixture cleaning",
        "✗ Carpet spot treatment",
        "✗ Wall spot cleaning",
        "✗ Air vent cleaning",
        "✗ Furniture polishing",
      ],
      upsellMessage:
        "For a more thorough clean including furniture vacuuming and under-furniture areas, consider our PREMIUM CLEAN.",
    },
    {
      id: "livingroom-premium", // Renamed from livingroom-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for family rooms",
      price: 200.0,
      timeEstimate: "75 minutes",
      features: [
        "Includes Essential Clean",
        "Furniture vacuuming",
        "Under furniture cleaning",
        "Baseboard dusting",
        "Electronics dusting",
        "Throw pillow fluffing",
      ],
      detailedTasks: [
        "ALL Essential tasks",
        "Furniture vacuum + crevices - Sofas, chairs, cushions, and hard-to-reach spots",
        "Under furniture vacuum + organize - Move light furniture, clean underneath, organize items",
        "Baseboards full detail - Wipe down all baseboards and trim",
        "Electronics dust + cord organize - Dust all electronics, organize visible cords",
        "Decorative items dust + arrange - Dust and arrange all decorative items on shelves and tables",
      ],
      notIncludedTasks: [
        "✗ Upholstery spot treatment",
        "✗ Ceiling fan detailed cleaning",
        "✗ Window sill detailing",
        "✗ Decor item individual cleaning",
        "✗ Entertainment center organization",
        "✗ Bookshelf dusting",
        "✗ Light fixture cleaning",
        "✗ Carpet spot treatment",
        "✗ Wall spot cleaning",
        "✗ Air vent cleaning",
        "✗ Furniture polishing",
      ],
      upsellMessage:
        "For the ultimate living room transformation, our LUXURY CLEAN offers upholstery spot treatment, detailed ceiling fan cleaning, and more!",
    },
    {
      id: "livingroom-luxury", // Renamed from livingroom-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for entertainment areas",
      price: 340.0,
      timeEstimate: "225 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
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
      detailedTasks: [
        "ALL Advanced tasks",
        "Upholstery spot treatment + protection - Treat visible spots, apply fabric protector",
        "Ceiling fan disassemble + balance - Remove blades, clean, reassemble, balance",
        "Window treatments vacuum + spot clean - Vacuum curtains/blinds, spot clean as needed",
        "Entertainment center complete organize - Organize media, cables, dust all surfaces",
        "Bookshelf organize + dust individual items - Dust books, organize shelves, clean individual items",
        "Light fixtures disassemble + crystal clean - Remove covers, clean fixtures, polish crystals",
        "Carpet spot treatment + deodorize - Treat carpet spots, apply deodorizer",
        "Wall spot cleaning - Spot clean any visible marks or smudges on walls",
        "Air vent cleaning - Remove vent covers, clean inside and out",
        "Furniture polishing - Polish wood furniture, condition leather",
      ],
      notIncludedTasks: [],
    },
  ],
  diningRoom: [
    {
      id: "diningroom-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for dining areas",
      price: 80.0,
      timeEstimate: "20 minutes",
      features: ["Table and chair dusting", "Floor vacuum/sweep", "Light fixture dusting"],
      detailedTasks: [
        "Table surface dust + wipe - Clear table, dust and wipe down surface",
        "Chair seats + backs dust - Dust all chair surfaces, including legs and backs",
        "Floor vacuum main area - Vacuum or sweep main dining area",
        "Light fixture dust - Dust overhead light fixtures and sconces",
        "Quick surface organize - Tidy up any visible clutter on sideboards or buffets",
      ],
      notIncludedTasks: [
        "✗ Table polishing",
        "✗ Chair detailed cleaning",
        "✗ Baseboards dusting",
        "✗ China cabinet exterior cleaning",
        "✗ Floor detailed mopping",
        "✗ China/glassware cleaning",
        "✗ Cabinet interior organization",
        "✗ Chandelier detailed cleaning",
        "✗ Wall spot cleaning",
        "✗ Upholstery spot treatment",
        "✗ Decor item individual cleaning",
      ],
      upsellMessage:
        "For a more polished dining experience, our PREMIUM CLEAN includes table polishing and detailed chair cleaning.",
    },
    {
      id: "diningroom-premium", // Renamed from diningroom-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for regular dining rooms",
      price: 140.0,
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Table polishing",
        "Chair detailed cleaning",
        "Baseboards dusting",
        "China cabinet exterior cleaning",
        "Floor detailed cleaning",
      ],
      detailedTasks: [
        "ALL Essential tasks",
        "Table polish + protection - Apply wood polish and protective coating to table",
        "Chair detail + upholstery spot clean - Detailed cleaning of chair frames, spot clean upholstery",
        "Baseboards + corners detail - Wipe down all baseboards and clean corners",
        "China cabinet exterior + glass - Clean exterior of china cabinet, polish glass doors",
        "Floor detail + under table - Deep clean floor, including under the dining table and chairs",
      ],
      notIncludedTasks: [
        "✗ China/glassware cleaning",
        "✗ Cabinet interior organization",
        "✗ Chandelier detailed cleaning",
        "✗ Wall spot cleaning",
        "✗ Upholstery spot treatment",
        "✗ Decor item individual cleaning",
      ],
      upsellMessage:
        "Transform your dining room into a sparkling haven with our LUXURY CLEAN, featuring chandelier cleaning and fine china care!",
    },
    {
      id: "diningroom-luxury", // Renamed from diningroom-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for formal dining rooms",
      price: 240.0,
      timeEstimate: "180 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
        "China/glassware cleaning",
        "Cabinet interior organization",
        "Chandelier detailed cleaning",
        "Wall spot cleaning",
        "Upholstery spot treatment",
        "Decor item individual cleaning",
      ],
      detailedTasks: [
        "ALL Advanced tasks",
        "China cabinet interior organize + display - Empty, clean, and organize interior of china cabinet",
        "Chandelier disassemble + crystal wash - Carefully disassemble, hand wash crystals, reassemble",
        "Fine china hand wash + organize - Hand wash and carefully organize fine china and serving ware",
        "Table leaf clean + proper storage - Clean and properly store any table leaves",
        "Silverware polish + anti-tarnish treatment - Polish silverware, apply anti-tarnish treatment",
        "Wall spot cleaning - Spot clean any visible marks or smudges on walls",
        "Upholstery spot treatment - Treat visible spots on upholstered dining chairs",
        "Decor item individual cleaning - Individually clean and polish decorative items",
      ],
      notIncludedTasks: [],
    },
  ],
  homeOffice: [
    {
      id: "office-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for work spaces",
      price: 130.0,
      timeEstimate: "20 minutes",
      features: ["Desk surface dusting", "Floor vacuum", "Trash emptying"],
      detailedTasks: [
        "Desk surface clear + dust - Clear and dust the main desk surface",
        "Floor vacuum main paths - Vacuum or sweep main walkways in the office",
        "Trash empty + organize - Empty trash, replace liner, tidy up recycling",
        "Chair quick wipe - Quick wipe down of office chair surfaces",
        "Papers stack neatly - Neatly stack any loose papers on the desk",
      ],
      notIncludedTasks: [
        "✗ Electronics dusting",
        "✗ Bookshelf organization",
        "✗ Chair cleaning",
        "✗ Window sill cleaning",
        "✗ Baseboard dusting",
        "✗ Filing cabinet organization",
        "✗ Keyboard and peripheral cleaning",
        "✗ Monitor detailed cleaning",
        "✗ Cable management",
        "✗ Drawer organization",
        "✗ Wall spot cleaning",
      ],
      upsellMessage:
        "Boost your productivity with our PREMIUM CLEAN, including detailed electronics dusting and bookshelf organization.",
    },
    {
      id: "office-premium", // Renamed from office-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for home offices",
      price: 240.0,
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Clean",
        "Electronics dusting",
        "Bookshelf organization",
        "Chair cleaning",
        "Window sill cleaning",
        "Baseboard dusting",
      ],
      detailedTasks: [
        "ALL Essential tasks",
        "Computer + peripherals detail clean - Dust computer, monitor, printer, and other peripherals",
        "Bookshelf dust + basic organize - Dust shelves, tidy up books and items",
        "Office chair detail + wheels - Detailed cleaning of chair, including arms, base, and wheels",
        "Window sill + blinds dust - Dust window sills and blinds",
        "Baseboards + corners - Wipe down all baseboards and clean corners",
      ],
      notIncludedTasks: [
        "✗ Filing cabinet organization",
        "✗ Keyboard and peripheral cleaning",
        "✗ Monitor detailed cleaning",
        "✗ Cable management",
        "✗ Drawer organization",
        "✗ Wall spot cleaning",
      ],
      upsellMessage:
        "For a truly professional and organized workspace, our LUXURY CLEAN offers comprehensive filing system and keyboard cleaning!",
    },
    {
      id: "office-luxury", // Renamed from office-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for professional offices",
      price: 420.0,
      timeEstimate: "180 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
        "Filing cabinet organization",
        "Keyboard and peripheral cleaning",
        "Monitor detailed cleaning",
        "Cable management",
        "Drawer organization",
        "Wall spot cleaning",
      ],
      detailedTasks: [
        "ALL Advanced tasks",
        "Filing system complete reorganization - Organize files, label folders, shred old documents (if requested)",
        "Keyboard disassemble + sanitize - Disassemble keyboard, deep clean keys, sanitize",
        "Monitor calibration clean + screen protect - Clean monitor screen, apply screen protector",
        "Cable management + cord organization - Organize and secure all visible cables",
        "Desk drawer complete organization - Empty, clean, and organize all desk drawers",
        "Wall spot cleaning - Spot clean any visible marks or smudges on walls",
      ],
      notIncludedTasks: [],
    },
  ],
  laundryRoom: [
    {
      id: "laundry-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for laundry areas",
      price: 100.0,
      timeEstimate: "15 minutes",
      features: ["Surface dusting", "Floor sweep/vacuum", "Sink cleaning"],
      detailedTasks: [
        "Counter/surface dust - Dust and wipe down all visible countertops and surfaces",
        "Floor sweep main area - Sweep or vacuum main laundry room floor",
        "Sink quick rinse - Quick rinse and wipe of laundry sink",
        "Trash empty - Empty trash bin and replace liner",
      ],
      notIncludedTasks: [
        "✗ Washer/dryer exterior cleaning",
        "✗ Countertop detailed cleaning",
        "✗ Floor detailed mopping",
        "✗ Cabinet fronts wiping",
        "✗ Lint trap cleaning",
        "✗ Washer drum cleaning",
        "✗ Dryer vent cleaning",
        "✗ Cabinet interior organization",
        "✗ Utility sink deep cleaning",
        "✗ Detergent area organization",
        "✗ Wall spot cleaning",
      ],
      upsellMessage:
        "For a more hygienic laundry space, our PREMIUM CLEAN includes washer/dryer exterior cleaning and lint trap cleaning.",
    },
    {
      id: "laundry-premium", // Renamed from laundry-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for laundry rooms",
      price: 190.0,
      timeEstimate: "45 minutes",
      features: [
        "Includes Essential Clean",
        "Washer/dryer exterior cleaning",
        "Countertop detailed cleaning",
        "Floor detailed mopping",
        "Cabinet fronts wiping",
        "Lint trap cleaning",
      ],
      detailedTasks: [
        "ALL Essential tasks",
        "Washer/dryer exterior detail - Wipe down and polish exterior of washer and dryer",
        "Countertop detail + organize - Detailed cleaning of countertops, organize laundry supplies",
        "Floor detail mop + corners - Deep mop floor, including corners and behind appliances",
        "Cabinet fronts + handles - Wipe down and polish cabinet fronts and handles",
        "Lint trap + surrounding clean - Clean lint trap and surrounding area of dryer",
      ],
      notIncludedTasks: [
        "✗ Washer drum cleaning",
        "✗ Dryer vent cleaning",
        "✗ Cabinet interior organization",
        "✗ Utility sink deep cleaning",
        "✗ Detergent area organization",
        "✗ Wall spot cleaning",
      ],
      upsellMessage:
        "For a truly deep clean, our LUXURY CLEAN offers washer drum and dryer vent cleaning, plus cabinet interior organization!",
    },
    {
      id: "laundry-luxury", // Renamed from laundry-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for laundry centers",
      price: 320.0,
      timeEstimate: "135 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
        "Washer drum cleaning",
        "Dryer vent cleaning",
        "Cabinet interior organization",
        "Utility sink deep cleaning",
        "Detergent area organization",
        "Wall spot cleaning",
      ],
      detailedTasks: [
        "ALL Advanced tasks",
        "Washer drum deep clean + sanitize - Deep clean and sanitize washer drum",
        "Dryer vent disassemble + lint removal - Disassemble dryer vent, remove lint buildup",
        "Cabinet interior organize + supplies - Empty, clean, and organize cabinet interiors, arrange supplies",
        "Utility sink deep scrub + pipe check - Deep scrub utility sink, check pipes for leaks",
        "Detergent area organize + spill cleanup - Organize detergent area, clean up any spills",
        "Wall spot cleaning - Spot clean any visible marks or smudges on walls",
      ],
      notIncludedTasks: [],
    },
  ],
  entryway: [
    {
      id: "entryway-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for entryways",
      price: 60.0,
      timeEstimate: "10 minutes",
      features: ["Floor sweep/vacuum", "Surface dusting", "Door cleaning"],
      detailedTasks: [
        "Floor sweep + spot mop - Sweep or vacuum main entryway floor, spot mop as needed",
        "Surface dust + wipe - Dust and wipe down any visible surfaces like console tables or benches",
        "Door + handle clean - Wipe down entry door and clean handles",
      ],
      notIncludedTasks: [
        "✗ Floor detailed mopping",
        "✗ Baseboard dusting",
        "✗ Light fixture dusting",
        "✗ Mirror cleaning",
        "✗ Console table organization",
        "✗ Chandelier detailed cleaning",
        "✗ Wall spot cleaning",
        "✗ Decor item individual cleaning",
        "✗ Shoe organization",
        "✗ Coat closet organization",
        "✗ Door hardware polishing",
      ],
      upsellMessage:
        "Make a grander entrance with our PREMIUM CLEAN, including detailed floor mopping and baseboard dusting.",
    },
    {
      id: "entryway-premium", // Renamed from entryway-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for foyers",
      price: 100.0,
      timeEstimate: "30 minutes",
      features: [
        "Includes Essential Clean",
        "Floor detailed mopping",
        "Baseboard dusting",
        "Light fixture dusting",
        "Mirror cleaning",
        "Console table organization",
      ],
      detailedTasks: [
        "ALL Essential tasks",
        "Floor detail mop + corners - Deep mop floor, including corners and edges",
        "Baseboards + trim detail - Wipe down all baseboards and trim",
        "Light fixture dust + clean - Dust and wipe down overhead light fixtures and sconces",
        "Mirror streak-free clean - Clean mirrors for a streak-free shine",
        "Console table organize + dust - Organize items on console table, dust and wipe down surface",
      ],
      notIncludedTasks: [
        "✗ Chandelier detailed cleaning",
        "✗ Wall spot cleaning",
        "✗ Decor item individual cleaning",
        "✗ Shoe organization",
        "✗ Coat closet organization",
        "✗ Door hardware polishing",
      ],
      upsellMessage:
        "For an immaculate entryway, our LUXURY CLEAN offers chandelier cleaning, shoe organization, and more!",
    },
    {
      id: "entryway-luxury", // Renamed from entryway-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for grand entrances",
      price: 160.0,
      timeEstimate: "90 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
        "Chandelier detailed cleaning",
        "Wall spot cleaning",
        "Decor item individual cleaning",
        "Shoe organization",
        "Coat closet organization",
        "Door hardware polishing",
      ],
      detailedTasks: [
        "ALL Advanced tasks",
        "Chandelier/fixture disassemble + clean - Carefully disassemble, clean, and reassemble chandeliers/fixtures",
        "Wall art + frames individual clean - Individually clean and dust wall art and picture frames",
        "Shoe organization + storage optimize - Organize shoes, optimize shoe storage solutions",
        "Coat closet complete organization - Empty, clean, and organize coat closet contents",
        "Door hardware polish + protect - Polish door handles, knobs, and other hardware, apply protective coating",
      ],
      notIncludedTasks: [],
    },
  ],
  hallway: [
    {
      id: "hallway-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for hallways",
      price: 50.0,
      timeEstimate: "10 minutes",
      features: ["Floor vacuum/sweep", "Surface dusting", "Light fixture dusting"],
      detailedTasks: [
        "Floor vacuum main path - Vacuum or sweep main hallway path",
        "Surface dust visible areas - Dust any visible surfaces like console tables or shelves",
        "Light fixture quick dust - Quick dust of overhead light fixtures and sconces",
      ],
      notIncludedTasks: [
        "✗ Floor detailed mopping",
        "✗ Baseboard dusting",
        "✗ Wall spot cleaning",
        "✗ Picture frame dusting",
        "✗ Door cleaning",
        "✗ Runner/carpet detailed cleaning",
        "✗ Light fixture detailed cleaning",
        "✗ Artwork/decor individual cleaning",
        "✗ Door hardware polishing",
        "✗ Ceiling corner cobweb removal",
        "✗ Air vent cleaning",
      ],
      upsellMessage:
        "For a more pristine hallway, our PREMIUM CLEAN includes detailed floor mopping and baseboard dusting.",
    },
    {
      id: "hallway-premium", // Renamed from hallway-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for corridors",
      price: 90.0,
      timeEstimate: "30 minutes",
      features: [
        "Includes Essential Clean",
        "Floor detailed mopping",
        "Baseboard dusting",
        "Wall spot cleaning",
        "Picture frame dusting",
        "Door cleaning",
      ],
      detailedTasks: [
        "ALL Essential tasks",
        "Floor detail + edges - Deep clean floor, including edges and corners",
        "Baseboards full wipe - Wipe down all baseboards and trim",
        "Wall spot cleaning - Spot clean any visible marks or smudges on walls",
        "Picture frames dust + arrange - Dust all picture frames on walls or shelves",
        "Doors + frames wipe - Wipe down all doors and door frames",
      ],
      notIncludedTasks: [
        "✗ Runner/carpet detailed cleaning",
        "✗ Light fixture detailed cleaning",
        "✗ Artwork/decor individual cleaning",
        "✗ Door hardware polishing",
        "✗ Ceiling corner cobweb removal",
        "✗ Air vent cleaning",
      ],
      upsellMessage:
        "For a truly spotless corridor, our LUXURY CLEAN offers deep cleaning of runners/carpets and detailed light fixture cleaning!",
    },
    {
      id: "hallway-luxury", // Renamed from hallway-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for gallery hallways",
      price: 140.0,
      timeEstimate: "90 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
        "Runner/carpet detailed cleaning",
        "Light fixture detailed cleaning",
        "Artwork/decor individual cleaning",
        "Door hardware polishing",
        "Ceiling corner cobweb removal",
        "Air vent cleaning",
      ],
      detailedTasks: [
        "ALL Advanced tasks",
        "Runner/carpet deep clean + treat - Deep clean hallway runners or carpets, apply stain treatment",
        "Light fixtures disassemble + detail - Disassemble, clean, and reassemble light fixtures",
        "Artwork individual clean + level - Individually clean and level all artwork on walls",
        "Door hardware polish + hinges - Polish door handles, knobs, and hinges",
        "Ceiling corner cobweb + dust removal - Remove cobwebs and dust from all ceiling corners",
        "Air vent cleaning - Remove vent covers, clean inside and out",
      ],
      notIncludedTasks: [],
    },
  ],
  stairs: [
    {
      id: "stairs-essential",
      name: "ESSENTIAL CLEAN",
      description: "Basic cleaning for staircases",
      price: 70.0,
      timeEstimate: "15 minutes",
      features: ["Step vacuum/sweep", "Handrail dusting", "Visible surface dusting"],
      detailedTasks: [
        "Steps vacuum main areas - Vacuum or sweep main areas of steps",
        "Handrail dust + wipe - Dust and wipe down handrails",
        "Visible surfaces dust - Dust any visible surfaces on the staircase",
        "Quick safety check - Perform a quick safety check for loose railings or steps",
      ],
      notIncludedTasks: [
        "✗ Step detailed cleaning",
        "✗ Handrail detailed cleaning",
        "✗ Baseboard dusting",
        "✗ Spindle dusting",
        "✗ Wall spot cleaning",
        "✗ Carpet deep cleaning",
        "✗ Spindle detailed cleaning",
        "✗ Stair runner detailed cleaning",
        "✗ Under-stair visible areas",
        "✗ Light fixture detailed cleaning",
        "✗ Decorative element cleaning",
      ],
      upsellMessage:
        "For a more thorough staircase clean, our PREMIUM CLEAN includes detailed step and handrail cleaning.",
    },
    {
      id: "stairs-premium", // Renamed from stairs-advanced
      name: "PREMIUM CLEAN", // Renamed from ADVANCED CLEAN
      description: "Thorough cleaning for stairways",
      price: 120.0,
      timeEstimate: "45 minutes",
      features: [
        "Includes Essential Clean",
        "Step detailed cleaning",
        "Handrail detailed cleaning",
        "Baseboard dusting",
        "Spindle dusting",
        "Wall spot cleaning",
      ],
      detailedTasks: [
        "ALL Essential tasks",
        "Steps detail + edges - Detailed cleaning of steps, including edges and corners",
        "Handrail detail + polish - Detailed cleaning and polishing of handrails",
        "Baseboards + risers - Wipe down all baseboards and stair risers",
        "Spindles dust + wipe - Dust and wipe down all spindles",
        "Wall spots + marks - Spot clean any visible marks or smudges on walls along the staircase",
      ],
      notIncludedTasks: [
        "✗ Carpet deep cleaning",
        "✗ Spindle detailed cleaning",
        "✗ Stair runner detailed cleaning",
        "✗ Under-stair visible areas",
        "✗ Light fixture detailed cleaning",
        "✗ Decorative element cleaning",
      ],
      upsellMessage:
        "For a truly grand staircase, our LUXURY CLEAN offers deep carpet cleaning and detailed spindle cleaning!",
    },
    {
      id: "stairs-luxury", // Renamed from stairs-premium
      name: "LUXURY CLEAN", // Renamed from PREMIUM CLEAN
      description: "Comprehensive cleaning for grand staircases",
      price: 180.0,
      timeEstimate: "135 minutes",
      features: [
        "Includes Premium Clean", // Updated from Advanced Clean
        "Carpet deep cleaning",
        "Spindle detailed cleaning",
        "Stair runner detailed cleaning",
        "Under-stair visible areas",
        "Light fixture detailed cleaning",
        "Decorative element cleaning",
      ],
      detailedTasks: [
        "ALL Advanced tasks",
        "Carpet deep clean + stain treatment - Deep clean stair carpet, apply stain treatment",
        "Spindles individual clean + polish - Individually clean and polish all spindles",
        "Stair runner professional clean - Professional cleaning of stair runner",
        "Under-stair accessible area organize - Clean and organize any accessible areas under the stairs",
        "Light fixtures disassemble + clean - Disassemble, clean, and reassemble light fixtures on staircase",
        "Decorative element cleaning - Individually clean and polish decorative elements on staircase",
      ],
      notIncludedTasks: [],
    },
  ],
  default: [
    {
      id: "default-essential",
      name: "ESSENTIAL REFRESH",
      description: "Perfect for maintaining a tidy home with a quick, visible clean.",
      price: 25.0,
      timeEstimate: "20 minutes",
      features: [
        "Surface dusting",
        "Floor vacuum/sweep",
        "General tidying",
        "Trash emptied",
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
        "Ready for a deeper clean? Our PREMIUM HOME CLEAN offers thorough attention to high-traffic areas and surfaces.",
    },
    {
      id: "default-premium", // Renamed from default-advanced
      name: "PREMIUM HOME CLEAN", // Renamed from ADVANCED HOME CLEAN
      description: "Our most popular choice for a truly thorough and hygienic home.",
      price: 75.0,
      timeEstimate: "60 minutes",
      features: [
        "Includes Essential Refresh",
        "Detailed dusting of all surfaces",
        "Deep floor cleaning",
        "Baseboard & trim wipe",
        "Full surface sanitization",
        "Appliance exteriors",
        "Bathroom & Kitchen deep clean",
      ],
      detailedTasks: [
        "ALL Essential Refresh tasks",
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
      id: "default-luxury", // Renamed from default-premium
      name: "LUXURY HOME SPA", // Renamed from LUXURY HOME SPA
      description:
        "Experience unparalleled cleanliness and a truly revitalized home, meticulously cared for from top to bottom.",
      price: 225.0,
      timeEstimate: "180 minutes",
      features: [
        "Includes Premium Home Clean", // Updated from Advanced Home Clean
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
        "ALL Advanced Home Clean tasks",
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
  other: "Other Space",
}
