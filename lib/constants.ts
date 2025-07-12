export const VALID_COUPONS = [
  { code: "SMILEY10", type: "percentage", value: 10, description: "10% off your entire order" }, // 10%
  { code: "WELCOME25", type: "fixed", value: 25, description: "$25 off your order" }, // $25
  { code: "FRESHSTART", type: "percentage", value: 15, description: "15% off for new customers" }, // 15%
]

export const LS_PRICE_CALCULATOR_STATE = "priceCalculatorState"

export const defaultTiers = {
  default: [
    {
      id: "essential-tier",
      name: "Essential Clean",
      description: "Basic cleaning for everyday maintenance.",
      price: 25.0, // Base price, adjusted by room type
      timeEstimate: "20 minutes",
    },
    {
      id: "premium-tier",
      name: "Premium Clean",
      description: "More detailed cleaning with extra attention to common areas.",
      price: 75.0, // Base price, adjusted by room type
      timeEstimate: "60 minutes",
    },
    {
      id: "luxury-tier",
      name: "Luxury Clean",
      description: "Deep cleaning service for a spotless home.",
      price: 225.0, // Base price, adjusted by room type
      timeEstimate: "180 minutes",
    },
  ],
}
