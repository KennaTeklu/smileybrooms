// This file provides type-safe access to environment variables
// and ensures they are properly validated at runtime

// Function to validate required environment variables
const validateEnv = (name: string, value?: string): string => {
  if (!value) {
    // In development, provide fallbacks for easier local development
    if (process.env.NODE_ENV === "development") {
      if (name === "STRIPE_SECRET_KEY") {
        return "sk_test_dummy_key"
      }
      if (name === "STRIPE_WEBHOOK_SECRET") {
        return "whsec_dummy_key"
      }
      if (name === "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY") {
        return "pk_test_dummy_key"
      }
    }

    // In production, log a warning for missing environment variables
    console.warn(`Warning: Environment variable ${name} is not set`)
  }

  return value || ""
}

// Export environment variables with validation
export const env = {
  // Removed NEXTAUTH_URL and NEXTAUTH_SECRET
  STRIPE_SECRET_KEY: validateEnv("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY),
  STRIPE_WEBHOOK_SECRET: validateEnv("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: validateEnv(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  ),
}
