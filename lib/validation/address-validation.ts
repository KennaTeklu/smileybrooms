// Regex patterns for postal codes
const US_ZIP_REGEX = /^\d{5}$/
const CA_POSTAL_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
const UK_POSTAL_REGEX = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i
const AU_POSTAL_REGEX = /^\d{4}$/

/**
 * Validates a US ZIP code (5 digits).
 * @param zipCode The ZIP code string to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidUSZip(zipCode: string): boolean {
  return US_ZIP_REGEX.test(zipCode)
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
 * Validates if a string is a valid US state abbreviation.
 * @param state The state abbreviation string to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidUSState(state: string): boolean {
  const usStates = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ]
  return usStates.includes(state.toUpperCase())
}

/**
 * Validates if a string is a non-empty street address.
 * @param address The street address string to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidStreetAddress(address: string): boolean {
  return address.trim().length > 0
}

/**
 * Validates if a string is a non-empty city name.
 * @param city The city name string to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidCity(city: string): boolean {
  return city.trim().length > 0
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
