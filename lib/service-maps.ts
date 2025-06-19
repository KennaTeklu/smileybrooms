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
// Define service maps for different room types

import type { ServiceCategory } from "@/components/service-map"

// Bedroom service map
export const bedroomServiceMap: ServiceCategory[] = [
  {
    name: "SURFACES",
    services: [
      { name: "Dust furniture surfaces", quickClean: true, deepClean: true, premium: true },
      { name: "Dust window sills", quickClean: false, deepClean: true, premium: true },
      { name: "Dust ceiling fan", quickClean: false, deepClean: false, premium: true },
      { name: "Dust light fixtures", quickClean: false, deepClean: false, premium: true },
      { name: "Dust baseboards", quickClean: false, deepClean: true, premium: true },
      { name: "Dust blinds/curtains", quickClean: false, deepClean: false, premium: true },
    ],
  },
  {
    name: "FLOORS",
    services: [
      { name: "Vacuum main floor areas", quickClean: true, deepClean: true, premium: true },
      { name: "Vacuum under bed", quickClean: false, deepClean: true, premium: true },
      { name: "Vacuum under furniture", quickClean: false, deepClean: false, premium: true },
      { name: "Spot clean carpet stains", quickClean: false, deepClean: false, premium: true },
      { name: "Edge vacuuming", quickClean: false, deepClean: true, premium: true },
    ],
  },
  {
    name: "DETAILS",
    services: [
      { name: "Make bed", quickClean: true, deepClean: true, premium: true },
      { name: "Clean mirrors", quickClean: true, deepClean: true, premium: true },
      { name: "Organize visible items", quickClean: false, deepClean: true, premium: true },
      { name: "Mattress vacuuming", quickClean: false, deepClean: false, premium: true },
      { name: "Closet organization (visible)", quickClean: false, deepClean: true, premium: true },
      { name: "Aroma treatment", quickClean: false, deepClean: false, premium: true },
    ],
  },
]

// Bathroom service map
export const bathroomServiceMap: ServiceCategory[] = [
  {
    name: "SURFACES",
    services: [
      { name: "Clean countertops", quickClean: true, deepClean: true, premium: true },
      { name: "Clean sink", quickClean: true, deepClean: true, premium: true },
      { name: "Clean toilet exterior", quickClean: true, deepClean: true, premium: true },
      { name: "Clean toilet interior", quickClean: false, deepClean: true, premium: true },
      { name: "Clean shower/tub surface", quickClean: false, deepClean: true, premium: true },
      { name: "Clean shower door/curtain", quickClean: false, deepClean: true, premium: true },
      { name: "Clean cabinet fronts", quickClean: false, deepClean: true, premium: true },
    ],
  },
  {
    name: "FLOORS",
    services: [
      { name: "Sweep floor", quickClean: true, deepClean: true, premium: true },
      { name: "Mop floor", quickClean: false, deepClean: true, premium: true },
      { name: "Clean floor corners", quickClean: false, deepClean: true, premium: true },
      { name: "Clean baseboards", quickClean: false, deepClean: false, premium: true },
      { name: "Grout cleaning", quickClean: false, deepClean: false, premium: true },
    ],
  },
  {
    name: "DETAILS",
    services: [
      { name: "Clean mirrors", quickClean: true, deepClean: true, premium: true },
      { name: "Polish fixtures", quickClean: false, deepClean: true, premium: true },
      { name: "Sanitize high-touch areas", quickClean: false, deepClean: true, premium: true },
      { name: "Clean exhaust fan cover", quickClean: false, deepClean: false, premium: true },
      { name: "Descale shower head", quickClean: false, deepClean: false, premium: true },
      { name: "Organize toiletries", quickClean: false, deepClean: false, premium: true },
    ],
  },
]

// Kitchen service map
export const kitchenServiceMap: ServiceCategory[] = [
  {
    name: "SURFACES",
    services: [
      { name: "Clean countertops", quickClean: true, deepClean: true, premium: true },
      { name: "Clean stovetop", quickClean: true, deepClean: true, premium: true },
      { name: "Clean sink", quickClean: true, deepClean: true, premium: true },
      { name: "Clean microwave exterior", quickClean: true, deepClean: true, premium: true },
      { name: "Clean microwave interior", quickClean: false, deepClean: true, premium: true },
      { name: "Clean refrigerator exterior", quickClean: false, deepClean: true, premium: true },
      { name: "Clean refrigerator interior", quickClean: false, deepClean: false, premium: true },
      { name: "Clean oven exterior", quickClean: false, deepClean: true, premium: true },
      { name: "Clean oven interior", quickClean: false, deepClean: false, premium: true },
      { name: "Clean cabinet fronts", quickClean: false, deepClean: true, premium: true },
      { name: "Clean backsplash", quickClean: false, deepClean: true, premium: true },
    ],
  },
  {
    name: "FLOORS",
    services: [
      { name: "Sweep floor", quickClean: true, deepClean: true, premium: true },
      { name: "Mop floor", quickClean: false, deepClean: true, premium: true },
      { name: "Clean floor corners", quickClean: false, deepClean: true, premium: true },
      { name: "Clean baseboards", quickClean: false, deepClean: false, premium: true },
      { name: "Clean under appliances", quickClean: false, deepClean: false, premium: true },
    ],
  },
  {
    name: "DETAILS",
    services: [
      { name: "Wipe small appliances", quickClean: false, deepClean: true, premium: true },
      { name: "Clean range hood", quickClean: false, deepClean: false, premium: true },
      { name: "Sanitize cutting boards", quickClean: false, deepClean: true, premium: true },
      { name: "Organize visible items", quickClean: false, deepClean: true, premium: true },
      { name: "Clean inside cabinets", quickClean: false, deepClean: false, premium: true },
      { name: "Clean dishwasher exterior", quickClean: false, deepClean: true, premium: true },
      { name: "Clean dishwasher filter", quickClean: false, deepClean: false, premium: true },
    ],
  },
]

// Living room service map
export const livingRoomServiceMap: ServiceCategory[] = [
  {
    name: "SURFACES",
    services: [
      { name: "Dust furniture surfaces", quickClean: true, deepClean: true, premium: true },
      { name: "Dust entertainment center", quickClean: true, deepClean: true, premium: true },
      { name: "Dust decor items", quickClean: false, deepClean: true, premium: true },
      { name: "Dust window sills", quickClean: false, deepClean: true, premium: true },
      { name: "Dust blinds/curtains", quickClean: false, deepClean: false, premium: true },
      { name: "Dust baseboards", quickClean: false, deepClean: true, premium: true },
      { name: "Dust ceiling fan", quickClean: false, deepClean: false, premium: true },
      { name: "Dust light fixtures", quickClean: false, deepClean: false, premium: true },
    ],
  },
  {
    name: "FLOORS",
    services: [
      { name: "Vacuum main floor areas", quickClean: true, deepClean: true, premium: true },
      { name: "Vacuum under furniture", quickClean: false, deepClean: true, premium: true },
      { name: "Vacuum upholstery", quickClean: false, deepClean: false, premium: true },
      { name: "Spot clean carpet stains", quickClean: false, deepClean: false, premium: true },
      { name: "Edge vacuuming", quickClean: false, deepClean: true, premium: true },
    ],
  },
  {
    name: "DETAILS",
    services: [
      { name: "Straighten cushions/pillows", quickClean: true, deepClean: true, premium: true },
      { name: "Clean coffee/end tables", quickClean: true, deepClean: true, premium: true },
      { name: "Clean glass surfaces", quickClean: true, deepClean: true, premium: true },
      { name: "Organize remote controls", quickClean: false, deepClean: true, premium: true },
      { name: "Clean electronics", quickClean: false, deepClean: false, premium: true },
      { name: "Spot clean upholstery", quickClean: false, deepClean: false, premium: true },
    ],
  },
]

// Default service map for other rooms
export const defaultServiceMap: ServiceCategory[] = [
  {
    name: "SURFACES",
    services: [
      { name: "Dust furniture surfaces", quickClean: true, deepClean: true, premium: true },
      { name: "Dust window sills", quickClean: false, deepClean: true, premium: true },
      { name: "Dust baseboards", quickClean: false, deepClean: true, premium: true },
      { name: "Dust light fixtures", quickClean: false, deepClean: false, premium: true },
    ],
  },
  {
    name: "FLOORS",
    services: [
      { name: "Vacuum/sweep floor", quickClean: true, deepClean: true, premium: true },
      { name: "Mop hard floors", quickClean: false, deepClean: true, premium: true },
      { name: "Edge cleaning", quickClean: false, deepClean: true, premium: true },
      { name: "Spot clean stains", quickClean: false, deepClean: false, premium: true },
    ],
  },
  {
    name: "DETAILS",
    services: [
      { name: "Clean mirrors/glass", quickClean: true, deepClean: true, premium: true },
      { name: "Organize visible items", quickClean: false, deepClean: true, premium: true },
      { name: "Sanitize high-touch areas", quickClean: false, deepClean: true, premium: true },
      { name: "Spot clean walls", quickClean: false, deepClean: false, premium: true },
    ],
  },
]

// Helper function to get service map for a specific room type
export function getServiceMap(roomType: string): ServiceCategory[] {
  switch (roomType) {
    case "bedroom":
      return bedroomServiceMap
    case "bathroom":
      return bathroomServiceMap
    case "kitchen":
      return kitchenServiceMap
    case "livingRoom":
      return livingRoomServiceMap
    default:
      return defaultServiceMap
  }
}
