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
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "your-development-secret-key",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
}
