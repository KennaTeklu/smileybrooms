import { Redis } from "@upstash/redis"

// Singleton pattern for Redis client
let redis: Redis | undefined

export function getRedisClient() {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL
    const redisToken = process.env.KV_REST_API_TOKEN // Upstash uses KV_REST_API_TOKEN for REST API

    if (!redisUrl || !redisToken) {
      throw new Error("Missing REDIS_URL or KV_REST_API_TOKEN environment variables for Redis.")
    }
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })
  }
  return redis
}
