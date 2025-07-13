import type { ServiceFeature } from "@/components/service-comparison-table"

// Define service features for different room types

// Bedroom service features
export const bedroomFeatures: ServiceFeature[] = [
  {
    name: "Surface dusting",
    description: "Dusting of visible surfaces and furniture",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip: "Quick Clean includes dusting of 3 key pieces only. Deep Clean and Premium include all visible surfaces.",
  },
  {
    name: "Floor vacuum",
    description: "Vacuuming of floor surfaces",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip:
      "Quick Clean includes main pathways only. Deep Clean and Premium include entire floor surface including edges and corners.",
  },
  {
    name: "Mirror/glass cleaning",
    description: "Cleaning of mirrors and glass surfaces",
    quickClean: true,
    deepClean: true,
    premium: true,
  },
  {
    name: "Under-bed cleaning",
    description: "Cleaning and vacuuming under the bed",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Closet organization",
    description: "Organization of closet items",
    quickClean: false,
    deepClean: "partial",
    premium: true,
    tooltip: "Deep Clean includes visible items only. Premium includes deep organization of all closet contents.",
  },
  {
    name: "Baseboard cleaning",
    description: "Cleaning of baseboards and trim",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Window sill cleaning",
    description: "Cleaning of window sills and tracks",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Light fixture dusting",
    description: "Dusting of light fixtures",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Mattress care",
    description: "Vacuuming and care of mattress",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Wall spot cleaning",
    description: "Cleaning of marks and spots on walls",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Furniture polishing",
    description: "Polishing of wood furniture",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Ceiling fan detailed cleaning",
    description: "Detailed cleaning of ceiling fan blades and housing",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
]

// Bathroom service features
export const bathroomFeatures: ServiceFeature[] = [
  {
    name: "Sink and counter cleaning",
    description: "Cleaning of sink basin and countertops",
    quickClean: true,
    deepClean: true,
    premium: true,
  },
  {
    name: "Toilet cleaning",
    description: "Cleaning of toilet",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip: "Quick Clean includes exterior only. Deep Clean and Premium include full interior and exterior cleaning.",
  },
  {
    name: "Mirror cleaning",
    description: "Cleaning of mirrors and glass surfaces",
    quickClean: true,
    deepClean: true,
    premium: true,
  },
  {
    name: "Shower/tub cleaning",
    description: "Cleaning of shower and/or bathtub",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Floor cleaning",
    description: "Cleaning of bathroom floor",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip: "Quick Clean includes basic sweeping. Deep Clean and Premium include detailed mopping and edge cleaning.",
  },
  {
    name: "Cabinet cleaning",
    description: "Cleaning of cabinet exteriors",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Towel replacement",
    description: "Replacing towels with fresh ones (if provided)",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Grout cleaning",
    description: "Detailed cleaning of tile grout",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Cabinet interior organization",
    description: "Organization of cabinet contents",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Fixture polishing",
    description: "Polishing of faucets and fixtures",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Shower door track cleaning",
    description: "Detailed cleaning of shower door tracks",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Exhaust fan cleaning",
    description: "Cleaning of bathroom exhaust fan",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
]

// Kitchen service features
export const kitchenFeatures: ServiceFeature[] = [
  {
    name: "Countertop cleaning",
    description: "Cleaning of kitchen countertops",
    quickClean: true,
    deepClean: true,
    premium: true,
  },
  {
    name: "Sink cleaning",
    description: "Cleaning of kitchen sink",
    quickClean: true,
    deepClean: true,
    premium: true,
  },
  {
    name: "Stovetop cleaning",
    description: "Cleaning of stovetop surface",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip:
      "Quick Clean includes basic wipe-down. Deep Clean and Premium include detailed cleaning of burners and knobs.",
  },
  {
    name: "Appliance exterior cleaning",
    description: "Cleaning of large appliance exteriors",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Cabinet front cleaning",
    description: "Cleaning of cabinet doors and handles",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Floor cleaning",
    description: "Cleaning of kitchen floor",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip: "Quick Clean includes basic sweeping. Deep Clean and Premium include detailed mopping and edge cleaning.",
  },
  {
    name: "Microwave interior cleaning",
    description: "Cleaning inside the microwave",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Trash emptying",
    description: "Emptying and relining trash bins",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Refrigerator interior cleaning",
    description: "Cleaning inside the refrigerator",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Oven deep cleaning",
    description: "Detailed cleaning of oven interior",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Range hood degreasing",
    description: "Degreasing of range hood and filter",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Small appliance cleaning",
    description: "Cleaning of toaster, coffee maker, etc.",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
]

// Living room service features
export const livingRoomFeatures: ServiceFeature[] = [
  {
    name: "Surface dusting",
    description: "Dusting of visible surfaces",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip:
      "Quick Clean includes main surfaces only. Deep Clean and Premium include all visible surfaces including shelves and decor.",
  },
  {
    name: "Floor vacuum",
    description: "Vacuuming of floor surfaces",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip:
      "Quick Clean includes main areas only. Deep Clean and Premium include entire floor surface including edges and corners.",
  },
  {
    name: "Coffee table cleaning",
    description: "Cleaning of coffee table and side tables",
    quickClean: true,
    deepClean: true,
    premium: true,
  },
  {
    name: "Furniture vacuuming",
    description: "Vacuuming of upholstered furniture",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Under furniture cleaning",
    description: "Cleaning under furniture pieces",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Baseboard dusting",
    description: "Dusting of baseboards and trim",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Electronics dusting",
    description: "Dusting of TV and electronics",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Throw pillow fluffing",
    description: "Fluffing and arranging of throw pillows",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Upholstery spot treatment",
    description: "Treatment of spots on upholstery",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Ceiling fan cleaning",
    description: "Detailed cleaning of ceiling fan",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Window treatment dusting",
    description: "Dusting of blinds and window treatments",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Decor item cleaning",
    description: "Individual cleaning of decorative items",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
]

// Default service features for other rooms
export const defaultFeatures: ServiceFeature[] = [
  {
    name: "Surface dusting",
    description: "Dusting of visible surfaces",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip: "Quick Clean includes main surfaces only. Deep Clean and Premium include all visible surfaces.",
  },
  {
    name: "Floor cleaning",
    description: "Vacuuming or sweeping of floor",
    quickClean: "partial",
    deepClean: true,
    premium: true,
    tooltip:
      "Quick Clean includes main areas only. Deep Clean and Premium include entire floor surface including edges and corners.",
  },
  {
    name: "General tidying",
    description: "Basic organization and tidying",
    quickClean: true,
    deepClean: true,
    premium: true,
  },
  {
    name: "Detailed dusting",
    description: "Comprehensive dusting of all surfaces",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Baseboard cleaning",
    description: "Cleaning of baseboards and trim",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Surface sanitizing",
    description: "Sanitizing of high-touch surfaces",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Trash removal",
    description: "Emptying of trash bins",
    quickClean: false,
    deepClean: true,
    premium: true,
  },
  {
    name: "Specialty surface treatment",
    description: "Treatment of specialty surfaces",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Fixture detailing",
    description: "Detailed cleaning of fixtures",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Hard-to-reach areas",
    description: "Cleaning of difficult-to-access areas",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Wall spot cleaning",
    description: "Cleaning of marks on walls",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
  {
    name: "Ceiling corner cleaning",
    description: "Removal of cobwebs and dust from ceiling corners",
    quickClean: false,
    deepClean: false,
    premium: true,
  },
]

// Helper function to get service features for a specific room type
export function getServiceFeatures(roomType: string): ServiceFeature[] {
  switch (roomType) {
    case "bedroom":
      return bedroomFeatures
    case "bathroom":
      return bathroomFeatures
    case "kitchen":
      return kitchenFeatures
    case "livingRoom":
      return livingRoomFeatures
    default:
      return defaultFeatures
  }
}
