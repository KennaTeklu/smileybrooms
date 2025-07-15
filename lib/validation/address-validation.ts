/**
 * Address validation utilities for various countries
 */

import { US_STATES } from "../location-data"

// Regex patterns for postal codes
const US_ZIP_REGEX = /^\d{5}(-\d{4})?$/
const CA_POSTAL_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
const UK_POSTAL_REGEX = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i
const AU_POSTAL_REGEX = /^\d{4}$/

/**
 * Validates a US ZIP code
 * @param zipCode - The ZIP code to validate
 * @returns True if the ZIP code is valid, false otherwise
 */
export function isValidUSZip(zipCode: string): boolean {
  if (!zipCode || typeof zipCode !== "string") return false
  return US_ZIP_REGEX.test(zipCode.trim())
}

/**
 * Validates a Canadian postal code
 * @param postalCode - The postal code to validate
 * @returns True if the postal code is valid, false otherwise
 */
export function isValidCAPostal(postalCode: string): boolean {
  if (!postalCode || typeof postalCode !== "string") return false
  return CA_POSTAL_REGEX.test(postalCode.trim())
}

/**
 * Validates a UK postal code
 * @param postalCode - The postal code to validate
 * @returns True if the postal code is valid, false otherwise
 */
export function isValidUKPostal(postalCode: string): boolean {
  if (!postalCode || typeof postalCode !== "string") return false
  return UK_POSTAL_REGEX.test(postalCode.trim())
}

/**
 * Validates an Australian postal code
 * @param postalCode - The postal code to validate
 * @returns True if the postal code is valid, false otherwise
 */
export function isValidAUPostal(postalCode: string): boolean {
  if (!postalCode || typeof postalCode !== "string") return false
  return AU_POSTAL_REGEX.test(postalCode.trim())
}

/**
 * Validates a postal code based on country code
 * @param postalCode - The postal code to validate
 * @param countryCode - The country code (ISO 2-letter code)
 * @returns True if the postal code is valid for the specified country
 */
export function isValidPostalCode(postalCode: string, countryCode: string): boolean {
  if (!postalCode || !countryCode) return false

  switch (countryCode.toUpperCase()) {
    case "US":
      return isValidUSZip(postalCode)
    case "CA":
      return isValidCAPostal(postalCode)
    case "UK":
    case "GB":
      return isValidUKPostal(postalCode)
    case "AU":
      return isValidAUPostal(postalCode)
    default:
      // For other countries, perform basic validation
      // This should be enhanced with country-specific validation
      return postalCode.trim().length > 0
  }
}

/**
 * Validates a US state code
 * @param state - The state code to validate
 * @returns True if the state code is valid, false otherwise
 */
export function isValidUSState(state: string): boolean {
  if (!state || typeof state !== "string") return false
  return US_STATES.some((s) => s.value.toLowerCase() === state.trim().toLowerCase())
}

/**
 * Formats a US ZIP code (adds hyphen if needed)
 * @param zipCode - The ZIP code to format
 * @returns Formatted ZIP code
 */
export function formatUSZip(zipCode: string): string {
  // Remove all non-numeric characters
  const cleaned = zipCode.replace(/\D/g, "")

  // Format as XXXXX-XXXX if it's a 9-digit ZIP
  if (cleaned.length === 9) {
    return `${cleaned.substring(0, 5)}-${cleaned.substring(5, 9)}`
  }

  // Return original for 5-digit or invalid ZIPs
  return zipCode
}

/**
 * Formats a Canadian postal code (adds space if needed)
 * @param postalCode - The postal code to format
 * @returns Formatted postal code
 */
export function formatCAPostal(postalCode: string): string {
  // Remove all spaces and convert to uppercase
  const cleaned = postalCode.replace(/\s+/g, "").toUpperCase()

  // Format as XXX XXX
  if (cleaned.length === 6) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)}`
  }

  // Return original if invalid
  return postalCode
}

/**
 * Validates a street address (basic validation)
 * @param address - The street address to validate
 * @returns True if the address appears valid, false otherwise
 */
export function isValidStreetAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false

  // Basic validation - ensure it's not empty and has minimum length
  const trimmed = address.trim()
  if (trimmed.length < 3) return false

  // Check for at least one number (most addresses have numbers)
  if (!/\d/.test(trimmed)) return false

  return true
}

/**
 * Validates a city name (basic validation)
 * @param city - The city name to validate
 * @returns True if the city appears valid, false otherwise
 */
export function isValidCity(city: string): boolean {
  if (!city || typeof city !== "string") return false

  // Basic validation - ensure it's not empty and has minimum length
  const trimmed = city.trim()
  if (trimmed.length < 2) return false

  // City names should not contain numbers or special characters
  if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(trimmed)) return false

  return true
}

/**
 * Validates a complete address
 * @param address - The address object to validate
 * @returns True if the address is valid, false otherwise
 */
export function isValidAddress(address: {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}): boolean {
  // Validate each component
  return (
    isValidStreetAddress(address.street) &&
    isValidCity(address.city) &&
    (address.country.toUpperCase() === "US" ? isValidUSState(address.state) : address.state.trim().length > 0) &&
    isValidPostalCode(address.postalCode, address.country)
  )
}

/**
 * Formats an address for display
 * @param address - The address object to format
 * @returns Formatted address string
 */
export function formatAddress(address: {
  street: string
  street2?: string
  city: string
  state: string
  postalCode: string
  country: string
}): string {
  const { street, street2, city, state, postalCode, country } = address

  // Format based on country
  switch (country.toUpperCase()) {
    case "US":
      return `${street}${street2 ? `, ${street2}` : ""}, ${city}, ${state.toUpperCase()} ${formatUSZip(postalCode)}`
    case "CA":
      return `${street}${street2 ? `, ${street2}` : ""}, ${city}, ${state.toUpperCase()} ${formatCAPostal(postalCode)}`
    default:
      return `${street}${street2 ? `, ${street2}` : ""}, ${city}, ${state}, ${postalCode}, ${country}`
  }
}
