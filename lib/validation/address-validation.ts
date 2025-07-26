// Regex patterns for postal codes
const US_ZIP_REGEX = /^\d{5}(-\d{4})?$/
const CA_POSTAL_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
const UK_POSTAL_REGEX = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i
const AU_POSTAL_REGEX = /^\d{4}$/

import { z } from "zod"
import { isValidArizonaZip, AZ_CITIES } from "@/lib/location-data"

/**
 * Validates an Arizona ZIP code
 * @param zipCode - The ZIP code to validate
 * @returns True if the ZIP code is valid for Arizona service areas
 */
export function isValidAZZip(zipCode: string): boolean {
  if (!zipCode || typeof zipCode !== "string") return false

  const cleanZip = zipCode.replace(/\D/g, "")

  // Arizona ZIP codes start with 85 or 86
  if (!/^8[5-6]\d{3}$/.test(cleanZip)) return false

  const zipNum = Number.parseInt(cleanZip)

  // Service area ZIP codes
  return (
    (zipNum >= 85001 && zipNum <= 85099) || // Phoenix central
    (zipNum >= 85201 && zipNum <= 85299) || // Phoenix extended
    (zipNum >= 85301 && zipNum <= 85399) || // Glendale
    zipNum === 85345 || // Peoria
    (zipNum >= 85381 && zipNum <= 85387) // Peoria extended
  )
}

/**
 * Validates a postal code based on country code (updated for Arizona only)
 * @param postalCode - The postal code to validate
 * @param countryCode - The country code (ISO 2-letter code)
 * @returns True if the postal code is valid for the specified country
 */
export function isValidPostalCode(postalCode: string, countryCode: string): boolean {
  if (!postalCode || !countryCode) return false

  switch (countryCode.toUpperCase()) {
    case "US":
      return isValidAZZip(postalCode)
    default:
      // For other countries, perform basic validation
      return postalCode.trim().length > 0
  }
}

/**
 * Validates a US ZIP code (updated for Arizona only)
 * @param zipCode - The ZIP code to validate
 * @returns True if the ZIP code is valid, false otherwise
 */
export function isValidUSZip(zipCode: string): boolean {
  return isValidAZZip(zipCode)
}

/**
 * Validates an Arizona city
 * @param city - The city name to validate
 * @returns True if the city is in our service area
 */
export function isValidAZCity(city: string): boolean {
  if (!city || typeof city !== "string") return false

  return AZ_CITIES.some((cityObj) => cityObj.value === city.trim().toLowerCase())
}

/**
 * Validates a city name (updated for Arizona service area)
 * @param city - The city name to validate
 * @returns True if the city appears valid and is in service area
 */
export function isValidCity(city: string): boolean {
  if (!city || typeof city !== "string") return false

  // Basic validation - ensure it's not empty and has minimum length
  const trimmed = city.trim()
  if (trimmed.length < 2) return false

  // City names should not contain numbers or special characters
  if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(trimmed)) return false

  // Check if it's in our service area
  return isValidAZCity(trimmed)
}

/**
 * Validates a US state code (updated for Arizona only)
 * @param state - The state code to validate
 * @returns True if the state code is Arizona
 */
export function isValidUSState(state: string): boolean {
  if (!state || typeof state !== "string") return false
  return state.trim().toLowerCase() === "az"
}

/**
 * Formats an Arizona ZIP code
 * @param zipCode - The ZIP code to format
 * @returns Formatted ZIP code
 */
export function formatAZZip(zipCode: string): string {
  // Remove all non-numeric characters
  const cleaned = zipCode.replace(/\D/g, "")

  // Return as 5-digit ZIP for Arizona
  if (cleaned.length >= 5) {
    return cleaned.substring(0, 5)
  }

  return zipCode
}

/**
 * Formats a US ZIP code (updated for Arizona)
 * @param zipCode - The ZIP code to format
 * @returns Formatted ZIP code
 */
export function formatUSZip(zipCode: string): string {
  return formatAZZip(zipCode)
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

export const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  street: z.string().min(1, "Street address is required"),
  city: z.enum(["Phoenix", "Glendale", "Peoria"], {
    errorMap: () => ({ message: "Please select a valid city" }),
  }),
  state: z.literal("AZ"),
  zipCode: z.string().refine((zip) => isValidArizonaZip(zip), "Please enter a valid ZIP code for our service area"),
})

export type AddressFormData = z.infer<typeof addressSchema>

export function validateArizonaAddress(data: any): { isValid: boolean; errors: string[] } {
  try {
    addressSchema.parse(data)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((err) => err.message),
      }
    }
    return { isValid: false, errors: ["Invalid address data"] }
  }
}

/**
 * Validates a complete address (updated for Arizona service area)
 * @param address - The address object to validate
 * @returns True if the address is valid and in service area
 */
export function isValidAddress(address: {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}): boolean {
  // Validate each component with Arizona-specific rules
  return (
    isValidStreetAddress(address.street) &&
    isValidAZCity(address.city) &&
    isValidUSState(address.state) &&
    isValidAZZip(address.postalCode) &&
    address.country.toUpperCase() === "US"
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
  return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}`
}

/**
 * Get service area validation message
 * @param city - The city that was entered
 * @param zipCode - The ZIP code that was entered
 * @returns Validation message for out-of-area locations
 */
export function getServiceAreaMessage(city?: string, zipCode?: string): string {
  return "We currently serve Phoenix, Glendale, and Peoria areas in Arizona. For services outside of these areas, please call us at (661) 602-3000 to discuss availability."
}
