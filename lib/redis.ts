import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})
