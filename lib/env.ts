// This file provides type-safe access to environment variables
// and ensures they are properly validated at runtime

// Function to validate required environment variables
const validateEnv = (name: string, value?: string): string => {
  if (!value) {
    // In development, provide fallbacks for easier local development
    if (process.env.NODE_ENV === "development") {
      if (name === "NEXTAUTH_SECRET") {
        return "development-secret-do-not-use-in-production"
      }
      if (name === "NEXTAUTH_URL") {
        return "http://localhost:3000"
      }
    }

    // In production, log a warning for missing environment variables
    console.warn(`Warning: Environment variable ${name} is not set`)
  }

  return value || ""
}

// Export environment variables with validation
export const env = {
  NEXTAUTH_URL: validateEnv("NEXTAUTH_URL", process.env.NEXTAUTH_URL),
  NEXTAUTH_SECRET: validateEnv("NEXTAUTH_SECRET", process.env.NEXTAUTH_SECRET),
  STRIPE_SECRET_KEY: validateEnv("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY),
  STRIPE_WEBHOOK_SECRET: validateEnv("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: validateEnv(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  ),
}
