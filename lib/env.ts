// Environment variable validation and access
// This ensures we have proper error messages if required env vars are missing

// Stripe configuration
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

// Database configuration
export const NEON_DATABASE_URL = process.env.POSTGRES_URL || process.env.NEON_POSTGRES_URL

// Feature flags
export const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true"

// Validate required environment variables in server contexts
export function validateEnv() {
  const requiredServerEnvs = [
    { key: "STRIPE_SECRET_KEY", value: STRIPE_SECRET_KEY },
    { key: "STRIPE_WEBHOOK_SECRET", value: STRIPE_WEBHOOK_SECRET },
    { key: "DATABASE_URL", value: DATABASE_URL },
  ]

  const missingEnvs = requiredServerEnvs.filter(({ value }) => !value)

  if (missingEnvs.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvs.map(({ key }) => key).join(", ")}`)
  }
}
