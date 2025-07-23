"use client"

/**
 * CSRF Protection Utilities
 *
 * This module provides utilities for protecting forms against Cross-Site Request Forgery (CSRF) attacks.
 * It includes functions for generating and validating CSRF tokens, as well as hooks for easy integration.
 */

import { useState, useEffect } from "react"
import { createHash, randomBytes } from "crypto"

// Interface for CSRF token
export interface CSRFToken {
  token: string
  timestamp: number
}

/**
 * Generate a secure random token
 * @returns A secure random string
 */
export function generateRandomToken(): string {
  // Use browser crypto API if available, otherwise fallback
  if (typeof window !== "undefined" && window.crypto) {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  } else {
    // Server-side or fallback
    return randomBytes(32).toString("hex")
  }
}

/**
 * Create a CSRF token with timestamp
 * @returns A CSRF token object with token and timestamp
 */
export function createCSRFToken(): CSRFToken {
  return {
    token: generateRandomToken(),
    timestamp: Date.now(),
  }
}

/**
 * Store a CSRF token in sessionStorage
 * @param formId - Unique identifier for the form
 * @param token - The CSRF token to store
 */
export function storeCSRFToken(formId: string, token: CSRFToken): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(`csrf_${formId}`, JSON.stringify(token))
  }
}

/**
 * Retrieve a CSRF token from sessionStorage
 * @param formId - Unique identifier for the form
 * @returns The stored CSRF token or null if not found
 */
export function retrieveCSRFToken(formId: string): CSRFToken | null {
  if (typeof window !== "undefined") {
    const storedToken = sessionStorage.getItem(`csrf_${formId}`)
    if (storedToken) {
      return JSON.parse(storedToken)
    }
  }
  return null
}

/**
 * Validate a CSRF token
 * @param formId - Unique identifier for the form
 * @param submittedToken - The token submitted with the form
 * @param maxAge - Maximum age of the token in milliseconds (default: 1 hour)
 * @returns Whether the token is valid
 */
export function validateCSRFToken(formId: string, submittedToken: string, maxAge = 3600000): boolean {
  const storedToken = retrieveCSRFToken(formId)

  if (!storedToken) return false

  // Check if token matches
  const isTokenValid = storedToken.token === submittedToken

  // Check if token is not expired
  const isNotExpired = Date.now() - storedToken.timestamp < maxAge

  return isTokenValid && isNotExpired
}

/**
 * React hook for CSRF protection
 * @param formId - Unique identifier for the form
 * @param maxAge - Maximum age of the token in milliseconds (default: 1 hour)
 * @returns Object containing CSRF token and validation function
 */
export function useCSRFProtection(formId: string, maxAge = 3600000) {
  const [csrfToken, setCSRFToken] = useState<string>("")

  useEffect(() => {
    // Generate a new token on component mount
    const newToken = createCSRFToken()
    storeCSRFToken(formId, newToken)
    setCSRFToken(newToken.token)

    // Clean up on unmount
    return () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`csrf_${formId}`)
      }
    }
  }, [formId])

  // Function to validate submitted token
  const validateToken = (submittedToken: string): boolean => {
    return validateCSRFToken(formId, submittedToken, maxAge)
  }

  return {
    csrfToken,
    validateToken,
    csrfField: <input type="hidden" name="csrf_token" value={csrfToken} />,
  }
}

/**
 * Generate a hash of the user's browser fingerprint
 * This adds an additional layer of security to CSRF protection
 * @returns A hash representing the browser fingerprint
 */
export function generateBrowserFingerprint(): string {
  if (typeof window === "undefined") return ""

  // Collect browser information
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    !!window.indexedDB,
  ].join("|")

  // Create a hash of the fingerprint
  const hash = createHash("sha256")
  hash.update(fingerprint)
  return hash.digest("hex")
}

/**
 * Enhanced CSRF token that includes browser fingerprint
 * @returns An enhanced CSRF token
 */
export function createEnhancedCSRFToken(): CSRFToken & { fingerprint: string } {
  const basicToken = createCSRFToken()
  return {
    ...basicToken,
    fingerprint: generateBrowserFingerprint(),
  }
}

/**
 * Validate an enhanced CSRF token
 * @param formId - Unique identifier for the form
 * @param submittedToken - The token submitted with the form
 * @param submittedFingerprint - The fingerprint submitted with the form
 * @param maxAge - Maximum age of the token in milliseconds
 * @returns Whether the token is valid
 */
export function validateEnhancedCSRFToken(
  formId: string,
  submittedToken: string,
  submittedFingerprint: string,
  maxAge = 3600000,
): boolean {
  const isTokenValid = validateCSRFToken(formId, submittedToken, maxAge)
  const currentFingerprint = generateBrowserFingerprint()

  return isTokenValid && submittedFingerprint === currentFingerprint
}
