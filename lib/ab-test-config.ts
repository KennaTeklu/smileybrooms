export interface ABTestVariation {
  name: string
  weight: number // Percentage, e.g., 50 for 50%
  content: { [key: string]: string } // Dynamic content for this variation
}

export interface ABTestConfig {
  [testName: string]: {
    variations: ABTestVariation[]
    defaultVariation: string // Name of the default variation
  }
}

export interface FeatureFlagConfig {
  [flagName: string]: {
    defaultValue: boolean // Default state of the feature flag
    description?: string // Optional description for the flag
  }
}

// Define your A/B test configurations here
export const AB_TEST_CONFIG: ABTestConfig = {
  heroHeadlineTest: {
    variations: [
      {
        name: "control",
        weight: 50,
        content: {
          headline: "You rest, we take care of the rest!",
          description:
            "Experience the joy of coming home to a perfectly clean space. Our professional cleaning services are tailored to your needs, schedule, and budget.",
          buttonText: "Book New Services",
        },
      },
      {
        name: "variantA",
        weight: 50,
        content: {
          headline: "Your Home, Sparkling Clean. Guaranteed.",
          description:
            "Discover effortless home cleaning with our trusted professionals. We offer flexible scheduling and eco-friendly solutions for a healthier home.",
          buttonText: "Get a Free Quote",
        },
      },
    ],
    defaultVariation: "control",
  },
  // Add more A/B tests here as needed
}

// Define your feature flag configurations here
export const FEATURE_FLAG_CONFIG: FeatureFlagConfig = {
  newCartExperience: {
    defaultValue: true, // Set to true to enable the new cart experience by default
    description: "Enables a new, experimental cart user interface.",
  },
  // Add more feature flags here as needed
  betaContactForm: {
    defaultValue: false,
    description: "Enables a beta version of the contact form with new fields.",
  },
}
