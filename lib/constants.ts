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
export const ROOM_CONFIG = {
  roomPrices: {
    master_bedroom: 54.28,
    bedroom: 35.42,
    bathroom: 43.63,
    kitchen: 54.8,
    living_room: 31.37,
    dining_room: 25.63,
    office: 19.53,
    playroom: 25.64,
    mudroom: 21.73,
    laundry_room: 13.46,
    sunroom: 22.25,
    guest_room: 35.42,
    garage: 83.99,
  },
  frequencyMultipliers: {
    one_time: 2.17,
    weekly: 1.0,
    biweekly: 1.2,
    monthly: 1.54,
    semi_annual: 1.92,
    annually: 2.56,
    vip_daily: 7.5,
  },
  serviceFee: 50,
}
