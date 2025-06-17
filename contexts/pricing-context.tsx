```ts file="lib/workers/price-calculator.worker.ts"
[v0-no-op-code-block-prefix]// lib/workers/price-calculator.worker.ts

import {
  ADDON_PRICING,
  CLEANLINESS_LEVEL_MULTIPLIERS,
  EXCLUSIVE_SERVICE_PRICING,
  FREQUENCY_DISCOUNTS,
  MINIMUM_JOB_VALUES,
  ROOM_PRICES,
  SERVICE_TIERS,
  WAIVER_DISCOUNT,
} from "../constants";
import {
  AddonId,
  CleanlinessLevelId,
  ExclusiveServiceId,
  ServiceTierId,
} from "../types";

export interface ServiceConfig {
  rooms: Record<string, number>;
  serviceTier: ServiceTierId;
  cleanlinessLevel: CleanlinessLevelId;
  frequency: string;
  paymentFrequency: string;
  selectedAddons: string[];
  selectedExclusiveServices: string[];
  waiverSigned: boolean;
  propertySizeSqFt: number; // New
  propertyType: 'studio' | '3br_home' | '5br_mansion' | null; // New
  isRentalProperty: boolean; // New
  hasPets: boolean; // New
  isPostRenovation: boolean; // New
  hasMoldWaterDamage: boolean; // New
}

export interface PriceBreakdownItem {
  item: string;
  value: number;
  type: "room" | "addon" | "exclusiveService" | "discount" | "adjustment";
}

export interface PriceCalculationResult {
  total: number;
  breakdown: PriceBreakdownItem[];
}

function calculatePrice(config: ServiceConfig): PriceCalculationResult {
  let currentTotal = 0;
  const breakdown: PriceBreakdownItem[] = [];

  // --- Room Pricing ---
  for (const roomType in config.rooms) {
    const roomCount = config.rooms[roomType];
    const roomPrice = ROOM_PRICES[roomType] || 0; // Default to 0 if room price is not found
    const roomTotal = roomCount * roomPrice;

    breakdown.push({
      item: \`${roomType} (${roomCount})`,\
value: roomTotal, type
: "room",
    })
currentTotal += roomTotal
}

// --- Service Tier Multiplier ---
const tierMultiplier = SERVICE_TIERS[config.serviceTier].multiplier
currentTotal *= tierMultiplier

// --- Cleanliness Level Multiplier ---
const cleanlinessMultiplier = CLEANLINESS_LEVEL_MULTIPLIERS[config.cleanlinessLevel]
currentTotal *= cleanlinessMultiplier

// --- Frequency Discount ---
const frequencyDiscount = FREQUENCY_DISCOUNTS[config.frequency] || 0 // Default to 0 if frequency is not found
breakdown.push({
  item: `Frequency Discount (${config.frequency})`,
  value: currentTotal * frequencyDiscount * -1,
  type: "discount",
})
currentTotal *= 1 - frequencyDiscount

// --- Addon Pricing ---
for (const addonId of config.selectedAddons) {
  const addonPrice = ADDON_PRICING[addonId as AddonId]
  breakdown.push({
    item: `Addon: ${addonId}`,
    value: addonPrice,
    type: "addon",
  })
  currentTotal += addonPrice
}

// --- Exclusive Service Pricing ---
for (const serviceId of config.selectedExclusiveServices) {
  const servicePrice = EXCLUSIVE_SERVICE_PRICING[serviceId as ExclusiveServiceId]
  breakdown.push({
    item: `Exclusive Service: ${serviceId}`,
    value: servicePrice,
    type: "exclusiveService",
  })
  currentTotal += servicePrice
}

// --- Waiver Discount ---
if (config.waiverSigned) {
  breakdown.push({
    item: "Waiver Discount",
    value: currentTotal * WAIVER_DISCOUNT * -1,
    type: "discount",
  })
  currentTotal *= 1 - WAIVER_DISCOUNT
}

// --- Automatic Tier Upgrades Enforcement (Worker-side validation/override) ---
// This logic should primarily live in the context, but the worker needs to be aware
// of the final serviceTier passed to it. We'll ensure the worker uses the
// `serviceTier` provided in the config, which the context will have already enforced.
// The worker's role here is to apply the correct minimums and multipliers based on the *final* tier.

// --- Minimum Job Value Enforcement ---
if (config.propertyType && MINIMUM_JOB_VALUES[config.propertyType]) {
  const minimumValueForTier = MINIMUM_JOB_VALUES[config.propertyType][config.serviceTier]
  if (minimumValueForTier && currentTotal < minimumValueForTier) {
    breakdown.push({
      item: `Minimum Job Value (${config.propertyType} - ${SERVICE_TIERS[config.serviceTier].name})`,
      value: minimumValueForTier - currentTotal,
      type: "adjustment",
    })
    currentTotal = minimumValueForTier
  }
}

return {
    total: Number.parseFloat(currentTotal.toFixed(2)),
    breakdown,
  };
}

self.addEventListener("message", (event) =>
{
  const config: ServiceConfig = event.data
  const result = calculatePrice(config)
  self.postMessage(result)
}
)
