export const VALID_COUPONS = [
  { code: "SAVE10", discount: 0.1 }, // 10% off
  { code: "WELCOME20", discount: 0.2 }, // 20% off
  { code: "FRESHSTART", discount: 0.15 }, // 15% off
]

export const LS_PRICE_CALCULATOR_STATE = "priceCalculatorState"

export const defaultTiers = {
  default: [
    {
      id: "essential-tier",
      name: "Essential Clean",
      description: "Basic cleaning for everyday maintenance.",
      price: 0, // Base price, adjusted by room type
      timeEstimate: "0 minutes",
    },
    {
      id: "premium-tier",
      name: "Premium Clean",
      description: "More detailed cleaning with extra attention to common areas.",
      price: 0, // Base price, adjusted by room type
      timeEstimate: "0 minutes",
    },
    {
      id: "luxury-tier",
      name: "Luxury Clean",
      description: "Deep cleaning service for a spotless home.",
      price: 0, // Base price, adjusted by room type
      timeEstimate: "0 minutes",
    },
  ],
}
