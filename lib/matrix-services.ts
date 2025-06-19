/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
import type { MatrixService } from "@/components/customization-matrix"

// Define matrix services for different room types

// Bedroom matrix services
export const bedroomMatrixServices: {
  add: MatrixService[]
  remove: MatrixService[]
} = {
  add: [
    {
      id: "bed-add-1",
      name: "Closet full reorganization",
      price: 25.0,
      description: "Complete reorganization of closet contents, including hanging items, folded clothes, and shoes.",
      category: "add",
    },
    {
      id: "bed-add-2",
      name: "Blind track deep clean",
      price: 15.0,
      description: "Detailed cleaning of blind tracks, removing dust and debris from hard-to-reach areas.",
      category: "add",
    },
    {
      id: "bed-add-3",
      name: "Curtain/shade vacuuming",
      price: 12.0,
      description: "Thorough vacuuming of curtains, drapes, and fabric shades to remove dust and allergens.",
      category: "add",
    },
    {
      id: "bed-add-4",
      name: "Wall mark removal",
      price: 10.0,
      description: "Spot cleaning of marks, scuffs, and smudges on walls (up to 5 spots).",
      compatibility: {
        conflicts: ["bed-remove-4"],
      },
      category: "add",
    },
    {
      id: "bed-add-5",
      name: "Nightstand drawer organization",
      price: 8.0,
      description: "Organizing and cleaning the contents of nightstand drawers.",
      category: "add",
    },
    {
      id: "bed-add-6",
      name: "Mattress deep cleaning",
      price: 35.0,
      description: "Deep vacuuming, spot cleaning, and sanitizing of mattress surfaces.",
      compatibility: {
        recommendedWith: ["bed-add-7"],
      },
      category: "add",
    },
    {
      id: "bed-add-7",
      name: "Mattress flipping/rotation",
      price: 15.0,
      description: "Flipping or rotating mattress for even wear and extending lifespan.",
      compatibility: {
        recommendedWith: ["bed-add-6"],
      },
      category: "add",
    },
    {
      id: "bed-add-8",
      name: "Under-bed storage organization",
      price: 20.0,
      description: "Organizing and cleaning items stored under the bed.",
      compatibility: {
        conflicts: ["bed-remove-3"],
      },
      category: "add",
    },
  ],
  remove: [
    {
      id: "bed-remove-1",
      name: "Skip mirror cleaning",
      price: 5.0,
      description: "Exclude cleaning of mirrors and glass surfaces in the bedroom.",
      category: "remove",
    },
    {
      id: "bed-remove-2",
      name: "Limit to 2 furniture pieces",
      price: 8.0,
      description: "Limit dusting and cleaning to only two main furniture pieces in the room.",
      category: "remove",
    },
    {
      id: "bed-remove-3",
      name: "No under-bed cleaning",
      price: 10.0,
      description: "Skip cleaning and vacuuming under the bed.",
      compatibility: {
        conflicts: ["bed-add-8"],
      },
      category: "remove",
    },
    {
      id: "bed-remove-4",
      name: "Basic surface dusting only",
      price: 7.0,
      description: "Perform only basic dusting of visible surfaces, no detailed cleaning.",
      compatibility: {
        conflicts: ["bed-add-4"],
      },
      category: "remove",
    },
  ],
}

// Bathroom matrix services
export const bathroomMatrixServices: {
  add: MatrixService[]
  remove: MatrixService[]
} = {
  add: [
    {
      id: "bath-add-1",
      name: "Shower door track deep clean",
      price: 15.0,
      description: "Detailed cleaning of shower door tracks, removing soap scum and mildew.",
      category: "add",
    },
    {
      id: "bath-add-2",
      name: "Grout detailed scrubbing",
      price: 30.0,
      description: "Deep cleaning of tile grout lines to remove stains and discoloration.",
      compatibility: {
        conflicts: ["bath-remove-1"],
      },
      category: "add",
    },
    {
      id: "bath-add-3",
      name: "Cabinet interior organization",
      price: 20.0,
      description: "Organizing and cleaning the contents of bathroom cabinets and drawers.",
      compatibility: {
        conflicts: ["bath-remove-4"],
      },
      category: "add",
    },
    {
      id: "bath-add-4",
      name: "Exhaust fan cleaning",
      price: 12.0,
      description: "Removing dust and debris from bathroom exhaust fan and cover.",
      category: "add",
    },
    {
      id: "bath-add-5",
      name: "Mold/mildew treatment",
      price: 25.0,
      description: "Specialized treatment for mold and mildew in shower, tub, and other wet areas.",
      compatibility: {
        requires: ["bath-add-2"],
      },
      category: "add",
    },
    {
      id: "bath-add-6",
      name: "Toilet tank cleaning",
      price: 18.0,
      description: "Cleaning inside the toilet tank to remove mineral deposits and stains.",
      category: "add",
    },
    {
      id: "bath-add-7",
      name: "Fixture descaling",
      price: 15.0,
      description: "Removing hard water deposits and scale from faucets, shower heads, and fixtures.",
      category: "add",
    },
  ],
  remove: [
    {
      id: "bath-remove-1",
      name: "Skip shower/tub cleaning",
      price: 15.0,
      description: "Exclude cleaning of shower and/or bathtub.",
      compatibility: {
        conflicts: ["bath-add-2", "bath-add-5"],
      },
      category: "remove",
    },
    {
      id: "bath-remove-2",
      name: "Basic toilet cleaning only",
      price: 8.0,
      description: "Clean only the exterior of the toilet, not the bowl interior or base.",
      compatibility: {
        conflicts: ["bath-add-6"],
      },
      category: "remove",
    },
    {
      id: "bath-remove-3",
      name: "Skip floor mopping",
      price: 10.0,
      description: "Exclude mopping of bathroom floor (will still be swept/vacuumed).",
      category: "remove",
    },
    {
      id: "bath-remove-4",
      name: "No cabinet cleaning",
      price: 5.0,
      description: "Skip cleaning of cabinet exteriors and handles.",
      compatibility: {
        conflicts: ["bath-add-3"],
      },
      category: "remove",
    },
  ],
}

// Kitchen matrix services
export const kitchenMatrixServices: {
  add: MatrixService[]
  remove: MatrixService[]
} = {
  add: [
    {
      id: "kit-add-1",
      name: "Inside refrigerator cleaning",
      price: 30.0,
      description: "Cleaning and organizing the interior of the refrigerator, including shelves and drawers.",
      category: "add",
    },
    {
      id: "kit-add-2",
      name: "Inside oven cleaning",
      price: 35.0,
      description: "Deep cleaning of oven interior, removing grease and food residue.",
      category: "add",
    },
    {
      id: "kit-add-3",
      name: "Cabinet interior organization",
      price: 15.0,
      description: "Organizing and cleaning the contents of kitchen cabinets (per cabinet).",
      compatibility: {
        conflicts: ["kit-remove-4"],
      },
      category: "add",
    },
    {
      id: "kit-add-4",
      name: "Dishwasher deep clean",
      price: 20.0,
      description: "Cleaning dishwasher interior, filter, and spray arms to improve performance.",
      category: "add",
    },
    {
      id: "kit-add-5",
      name: "Small appliance detailed cleaning",
      price: 10.0,
      description: "Detailed cleaning of toaster, coffee maker, blender, and other small appliances.",
      category: "add",
    },
    {
      id: "kit-add-6",
      name: "Range hood degreasing",
      price: 25.0,
      description: "Deep cleaning of range hood, fan, and filter to remove grease buildup.",
      compatibility: {
        recommendedWith: ["kit-add-2"],
      },
      category: "add",
    },
    {
      id: "kit-add-7",
      name: "Under sink cleaning",
      price: 15.0,
      description: "Cleaning and organizing the area under the kitchen sink.",
      category: "add",
    },
  ],
  remove: [
    {
      id: "kit-remove-1",
      name: "Skip appliance exteriors",
      price: 12.0,
      description: "Exclude cleaning of large appliance exteriors (refrigerator, oven, dishwasher).",
      category: "remove",
    },
    {
      id: "kit-remove-2",
      name: "Basic countertop cleaning only",
      price: 10.0,
      description: "Simple wipe-down of countertops without detailed cleaning or sanitizing.",
      category: "remove",
    },
    {
      id: "kit-remove-3",
      name: "No floor mopping",
      price: 15.0,
      description: "Exclude mopping of kitchen floor (will still be swept/vacuumed).",
      category: "remove",
    },
    {
      id: "kit-remove-4",
      name: "Skip cabinet fronts",
      price: 8.0,
      description: "Exclude cleaning of cabinet doors and handles.",
      compatibility: {
        conflicts: ["kit-add-3"],
      },
      category: "remove",
    },
  ],
}

// Living room matrix services
export const livingRoomMatrixServices: {
  add: MatrixService[]
  remove: MatrixService[]
} = {
  add: [
    {
      id: "liv-add-1",
      name: "Upholstery vacuuming",
      price: 20.0,
      description: "Thorough vacuuming of sofas, chairs, and other upholstered furniture.",
      category: "add",
    },
    {
      id: "liv-add-2",
      name: "Entertainment center organization",
      price: 25.0,
      description: "Organizing and cleaning entertainment center, TV area, and media components.",
      category: "add",
    },
    {
      id: "liv-add-3",
      name: "Ceiling fan detailed cleaning",
      price: 15.0,
      description: "Cleaning ceiling fan blades, motor housing, and light fixtures.",
      category: "add",
    },
    {
      id: "liv-add-4",
      name: "Window treatment dusting",
      price: 18.0,
      description: "Detailed dusting of blinds, curtains, and window treatments.",
      category: "add",
    },
    {
      id: "liv-add-5",
      name: "Decor item individual cleaning",
      price: 12.0,
      description: "Careful cleaning of decorative items, picture frames, and knickknacks.",
      compatibility: {
        conflicts: ["liv-remove-4"],
      },
      category: "add",
    },
    {
      id: "liv-add-6",
      name: "Bookshelf organization",
      price: 20.0,
      description: "Organizing and dusting bookshelves and their contents.",
      category: "add",
    },
    {
      id: "liv-add-7",
      name: "Carpet spot treatment",
      price: 15.0,
      description: "Treating visible spots and stains on carpets (up to 3 spots).",
      category: "add",
    },
  ],
  remove: [
    {
      id: "liv-remove-1",
      name: "Skip under furniture",
      price: 12.0,
      description: "Exclude cleaning and vacuuming under furniture pieces.",
      category: "remove",
    },
    {
      id: "liv-remove-2",
      name: "Basic vacuum only",
      price: 10.0,
      description: "Simple vacuuming of main floor areas without edge cleaning or detailed work.",
      category: "remove",
    },
    {
      id: "liv-remove-3",
      name: "No electronics dusting",
      price: 8.0,
      description: "Exclude dusting of TV, speakers, and electronic equipment.",
      compatibility: {
        conflicts: ["liv-add-2"],
      },
      category: "remove",
    },
    {
      id: "liv-remove-4",
      name: "Skip decor item cleaning",
      price: 7.0,
      description: "Exclude cleaning of decorative items and knickknacks.",
      compatibility: {
        conflicts: ["liv-add-5"],
      },
      category: "remove",
    },
  ],
}

// Default matrix services for other rooms
export const defaultMatrixServices: {
  add: MatrixService[]
  remove: MatrixService[]
} = {
  add: [
    {
      id: "def-add-1",
      name: "Detailed dusting of all surfaces",
      price: 15.0,
      description: "Comprehensive dusting of all surfaces, including hard-to-reach areas.",
      category: "add",
    },
    {
      id: "def-add-2",
      name: "Wall spot cleaning",
      price: 12.0,
      description: "Spot cleaning of marks, scuffs, and smudges on walls (up to 5 spots).",
      category: "add",
    },
    {
      id: "def-add-3",
      name: "Ceiling corner cobweb removal",
      price: 8.0,
      description: "Removing cobwebs from ceiling corners and high areas.",
      category: "add",
    },
    {
      id: "def-add-4",
      name: "Light fixture cleaning",
      price: 10.0,
      description: "Cleaning light fixtures, ceiling fans, and other overhead items.",
      category: "add",
    },
    {
      id: "def-add-5",
      name: "Door/doorframe cleaning",
      price: 10.0,
      description: "Detailed cleaning of doors, doorframes, and handles.",
      category: "add",
    },
  ],
  remove: [
    {
      id: "def-remove-1",
      name: "Skip detailed dusting",
      price: 10.0,
      description: "Exclude detailed dusting, only basic surface dusting will be performed.",
      compatibility: {
        conflicts: ["def-add-1"],
      },
      category: "remove",
    },
    {
      id: "def-remove-2",
      name: "Basic floor cleaning only",
      price: 12.0,
      description: "Simple vacuuming/sweeping without detailed edge cleaning or mopping.",
      category: "remove",
    },
    {
      id: "def-remove-3",
      name: "No baseboard cleaning",
      price: 8.0,
      description: "Exclude cleaning of baseboards and floor edges.",
      category: "remove",
    },
    {
      id: "def-remove-4",
      name: "Skip hard-to-reach areas",
      price: 10.0,
      description: "Exclude cleaning of high or difficult-to-access areas.",
      compatibility: {
        conflicts: ["def-add-3", "def-add-4"],
      },
      category: "remove",
    },
  ],
}

// Helper function to get matrix services for a specific room type
export function getMatrixServices(roomType: string): {
  add: MatrixService[]
  remove: MatrixService[]
} {
  switch (roomType) {
    case "bedroom":
      return bedroomMatrixServices
    case "bathroom":
      return bathroomMatrixServices
    case "kitchen":
      return kitchenMatrixServices
    case "livingRoom":
      return livingRoomMatrixServices
    default:
      return defaultMatrixServices
  }
}
