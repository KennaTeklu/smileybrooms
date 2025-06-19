"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import { useState } from "react"

/**
 * Rate Limiting Utilities
 *
 * This module provides utilities for implementing rate limiting on form submissions
 * to prevent abuse, spam, and brute force attacks.
 */

// Interface for rate limit entry
export interface RateLimitEntry {
  count: number
  firstAttempt: number
  lastAttempt: number
}

// Interface for rate limit options
export interface RateLimitOptions {
  maxAttempts: number
  windowMs: number
  blockDurationMs?: number
}

// Default options
const DEFAULT_OPTIONS: RateLimitOptions = {
  maxAttempts: 5,
  windowMs: 60000, // 1 minute
  blockDurationMs: 300000, // 5 minutes
}

/**
 * Store for rate limit data
 * In a real application, this might use Redis or another persistent store
 */
class RateLimitStore {
  private store: Map<string, RateLimitEntry>
  private static instance: RateLimitStore

  private constructor() {
    this.store = new Map()

    // Clean up expired entries periodically
    if (typeof window !== "undefined") {
      setInterval(() => this.cleanupExpiredEntries(), 60000)
    }
  }

  public static getInstance(): RateLimitStore {
    if (!RateLimitStore.instance) {
      RateLimitStore.instance = new RateLimitStore()
    }
    return RateLimitStore.instance
  }

  /**
   * Get rate limit entry for a key
   */
  public get(key: string): RateLimitEntry | undefined {
    return this.store.get(key)
  }

  /**
   * Increment attempt count for a key
   */
  public increment(key: string): RateLimitEntry {
    const now = Date.now()
    const entry = this.store.get(key)

    if (entry) {
      const updated: RateLimitEntry = {
        count: entry.count + 1,
        firstAttempt: entry.firstAttempt,
        lastAttempt: now,
      }
      this.store.set(key, updated)
      return updated
    } else {
      const newEntry: RateLimitEntry = {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      }
      this.store.set(key, newEntry)
      return newEntry
    }
  }

  /**
   * Reset rate limit for a key
   */
  public reset(key: string): void {
    this.store.delete(key)
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now()
    const maxAge = DEFAULT_OPTIONS.windowMs + (DEFAULT_OPTIONS.blockDurationMs || 0)

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.lastAttempt > maxAge) {
        this.store.delete(key)
      }
    }
  }
}

/**
 * Generate a rate limit key from various inputs
 * @param identifier - User identifier (IP, user ID, etc.)
 * @param action - The action being rate limited (e.g., "login", "contact-form")
 * @returns A unique key for rate limiting
 */
export function generateRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`
}

/**
 * Check if an action is rate limited
 * @param key - The rate limit key
 * @param options - Rate limit options
 * @returns Object containing whether the action is limited and remaining attempts
 */
export function checkRateLimit(
  key: string,
  options: Partial<RateLimitOptions> = {},
): { limited: boolean; remaining: number; resetTime: number | null } {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const store = RateLimitStore.getInstance()
  const entry = store.get(key)

  if (!entry) {
    return { limited: false, remaining: opts.maxAttempts, resetTime: null }
  }

  const now = Date.now()
  const windowExpiry = entry.firstAttempt + opts.windowMs

  // If window has expired, reset the counter
  if (now > windowExpiry) {
    store.reset(key)
    return { limited: false, remaining: opts.maxAttempts, resetTime: null }
  }

  // Check if blocked due to too many attempts
  if (entry.count >= opts.maxAttempts) {
    const blockExpiry = entry.lastAttempt + (opts.blockDurationMs || 0)
    if (now < blockExpiry) {
      return {
        limited: true,
        remaining: 0,
        resetTime: blockExpiry,
      }
    } else {
      store.reset(key)
      return { limited: false, remaining: opts.maxAttempts, resetTime: null }
    }
  }

  return {
    limited: false,
    remaining: opts.maxAttempts - entry.count,
    resetTime: windowExpiry,
  }
}

/**
 * Record an attempt for rate limiting
 * @param key - The rate limit key
 * @returns The updated rate limit entry
 */
export function recordAttempt(key: string): RateLimitEntry {
  const store = RateLimitStore.getInstance()
  return store.increment(key)
}

/**
 * Reset rate limit for a key
 * @param key - The rate limit key
 */
export function resetRateLimit(key: string): void {
  const store = RateLimitStore.getInstance()
  store.reset(key)
}

/**
 * React hook for rate limiting
 * @param identifier - User identifier (IP, user ID, etc.)
 * @param action - The action being rate limited
 * @param options - Rate limit options
 * @returns Object with rate limit state and functions
 */
export function useRateLimit(identifier: string, action: string, options: Partial<RateLimitOptions> = {}) {
  const key = generateRateLimitKey(identifier, action)
  const [limitState, setLimitState] = useState(() => checkRateLimit(key, options))

  const checkLimit = () => {
    const state = checkRateLimit(key, options)
    setLimitState(state)
    return state
  }

  const recordAction = () => {
    recordAttempt(key)
    return checkLimit()
  }

  const resetLimit = () => {
    resetRateLimit(key)
    return checkLimit()
  }

  return {
    ...limitState,
    checkLimit,
    recordAction,
    resetLimit,
  }
}
