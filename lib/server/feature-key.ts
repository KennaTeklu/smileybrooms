// Server-only helper for the private FEATURE_KEY
// DO NOT import this file from Client Components.

export const FEATURE_KEY = process.env.FEATURE_KEY

if (!FEATURE_KEY) {
  throw new Error("FEATURE_KEY environment variable is missing — add it in your project settings.")
}
