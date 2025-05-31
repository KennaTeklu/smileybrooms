import { Redis } from "@upstash/redis"

const redisUrl = process.env.REDIS_URL
const redisToken = process.env.KV_REST_API_TOKEN // Using KV_REST_API_TOKEN as it's typically used with Upstash KV

if (!redisUrl || !redisToken) {
  console.warn("Missing REDIS_URL or KV_REST_API_TOKEN environment variables. Redis caching will be disabled.")
}

export const redis = new Redis({
  url: redisUrl || "http://localhost:8079", // Fallback for development if env vars are missing
  token: redisToken || "dummy_token",
})
