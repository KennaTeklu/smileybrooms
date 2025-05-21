/**
 * Utility functions for form validation
 */

import { US_STATES } from "./location-data"

// Validate email with regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (US format)
export const isValidPhone = (phone: string): boolean => {
  // Remove all non-numeric characters for validation
  const cleaned = phone.replace(/\D/g, "")
  // Check if it's a valid 10-digit US number
  return cleaned.length === 10
}

// Format phone number for display (US format)
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "")

  // Format as (XXX) XXX-XXXX if it's a 10-digit number
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`
  }

  // Return original if not valid format
  return phone
}

// Validate US zip code
export const isValidZipCode = (zipCode: string): boolean => {
  // Basic 5-digit US zip code
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zipCode)
}

// Validate that a string is not empty
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0
}

// Validate state code (US)
export const isValidState = (state: string): boolean => {
  // Check if it's a valid state code from our list
  return US_STATES.some((s) => s.value === state)
}

// Format zip code (add hyphen if needed)
export const formatZipCode = (zipCode: string): string => {
  // Remove all non-numeric characters
  const cleaned = zipCode.replace(/\D/g, "")

  // Format as XXXXX-XXXX if it's a 9-digit zip
  if (cleaned.length === 9) {
    return `${cleaned.substring(0, 5)}-${cleaned.substring(5, 9)}`
  }

  // Return original for 5-digit or invalid zips
  return zipCode
}

// Format state (uppercase)
export const formatState = (state: string): string => {
  return state.toUpperCase()
}
