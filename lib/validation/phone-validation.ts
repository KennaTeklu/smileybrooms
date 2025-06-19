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
/**
 * Phone number validation and formatting utilities with international support
 */

// Regex patterns for different phone formats
const US_PHONE_REGEX = /^(\+?1)?[-.\s]?$$?([0-9]{3})$$?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/
const INTERNATIONAL_PHONE_REGEX = /^\+(?:[0-9] ?){6,14}[0-9]$/

// Country codes for reference
export const COUNTRY_CODES: Record<string, string> = {
  US: "+1",
  CA: "+1",
  UK: "+44",
  AU: "+61",
  DE: "+49",
  FR: "+33",
  JP: "+81",
  CN: "+86",
  IN: "+91",
  BR: "+55",
  MX: "+52",
  ES: "+34",
  IT: "+39",
  NL: "+31",
  RU: "+7",
  // Add more as needed
}

/**
 * Validates if a string is a properly formatted US phone number
 * @param phone - The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export function isValidUSPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false
  return US_PHONE_REGEX.test(phone.trim())
}

/**
 * Validates if a string is a properly formatted international phone number
 * @param phone - The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export function isValidInternationalPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false
  return INTERNATIONAL_PHONE_REGEX.test(phone.trim())
}

/**
 * Validates a phone number based on country code
 * @param phone - The phone number to validate
 * @param countryCode - The country code (ISO 2-letter code)
 * @returns True if the phone number is valid for the specified country
 */
export function isValidPhoneForCountry(phone: string, countryCode: string): boolean {
  if (!phone || !countryCode) return false

  // This is a simplified implementation
  // In a production environment, you would use a more comprehensive library
  // like libphonenumber-js for accurate country-specific validation

  switch (countryCode.toUpperCase()) {
    case "US":
    case "CA":
      return isValidUSPhone(phone)
    default:
      return isValidInternationalPhone(phone)
  }
}

/**
 * Formats a US phone number for display
 * @param phone - The phone number to format
 * @returns Formatted phone number or original if invalid
 */
export function formatUSPhone(phone: string): string {
  if (!isValidUSPhone(phone)) return phone

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Handle numbers with or without country code
  const hasCountryCode = cleaned.length > 10
  const digits = hasCountryCode ? cleaned.slice(-10) : cleaned

  // Format as (XXX) XXX-XXXX
  return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`
}

/**
 * Formats an international phone number with proper spacing
 * @param phone - The phone number to format
 * @returns Formatted international phone number or original if invalid
 */
export function formatInternationalPhone(phone: string): string {
  if (!isValidInternationalPhone(phone)) return phone

  // This is a simplified formatter
  // For production, consider using a library like libphonenumber-js

  // Remove all spaces and ensure it starts with +
  let formatted = phone.replace(/\s+/g, "")
  if (!formatted.startsWith("+")) {
    formatted = `+${formatted}`
  }

  // Add spaces for readability (simple implementation)
  // Format: +XX XXX XXX XXXX
  let result = ""
  let i = 0

  for (const char of formatted) {
    if (i === 0 || i === 3 || i === 6 || i === 9) {
      result += " "
    }
    result += char
    i++
  }

  return result.trim()
}

/**
 * Extracts the country code from an international phone number
 * @param phone - The international phone number
 * @returns The country code or null if invalid
 */
export function extractCountryCode(phone: string): string | null {
  if (!phone.startsWith("+")) return null

  // This is a simplified implementation
  // For production, use a library like libphonenumber-js

  // Try to match the beginning of the phone number with known country codes
  for (const [country, code] of Object.entries(COUNTRY_CODES)) {
    if (phone.startsWith(code)) {
      return country
    }
  }

  return null
}

/**
 * Normalizes a phone number by removing all non-digit characters
 * @param phone - The phone number to normalize
 * @returns Normalized phone number (digits only)
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "")
}

/**
 * Adds the country code to a phone number if missing
 * @param phone - The phone number
 * @param countryCode - The country code to add (default: US)
 * @returns Phone number with country code
 */
export function addCountryCode(phone: string, countryCode = "US"): string {
  const normalized = normalizePhone(phone)
  const code = COUNTRY_CODES[countryCode.toUpperCase()] || COUNTRY_CODES.US

  // If already has country code, return as is
  if (phone.startsWith("+")) return phone

  // For US/CA numbers, check if it already has the "1" prefix
  if ((countryCode === "US" || countryCode === "CA") && normalized.length === 11 && normalized.startsWith("1")) {
    return `+${normalized}`
  }

  return `${code}${normalized}`
}
