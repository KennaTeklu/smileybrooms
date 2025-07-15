export const FEATURE_KEY = process.env.NEXT_PUBLIC_FEATURE_KEY!

if (!FEATURE_KEY) {
  throw new Error("FEATURE_KEY env var is missing")
}
