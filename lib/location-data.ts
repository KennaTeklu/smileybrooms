export interface StateOption {
  value: string
  label: string
}

export interface CityOption {
  value: string
  label: string
  zipRanges: string[]
}

// Only Arizona for our service area
export const US_STATES: StateOption[] = [
  { label: "Arizona", value: "AZ" },
  // Add other states if needed, but for now, only Arizona is relevant
]

// Only Phoenix, Glendale, and Peoria
export const AZ_CITIES: CityOption[] = [
  { label: "Phoenix", value: "Phoenix", zipRanges: ["85001-85099", "85201-85299"] },
  { label: "Glendale", value: "Glendale", zipRanges: ["85301-85318"] },
  { label: "Peoria", value: "Peoria", zipRanges: ["85345", "85381-85387"] },
]

export const CONTACT_INFO = {
  companyName: "SmileyBrooms.com",
  phoneNumber: "6616023000",
  email: "support@smileybrooms.com",
}

// Service area message with contact info
export const SERVICE_AREA_MESSAGE = `We currently service Phoenix, Glendale, and Peoria. For services outside these areas, please call us at (${CONTACT_INFO.phoneNumber.substring(
  0,
  3,
)}) ${CONTACT_INFO.phoneNumber.substring(3, 6)}-${CONTACT_INFO.phoneNumber.substring(6)}.`

// Arizona ZIP code validation
export function isValidArizonaZip(zipCode: string): boolean {
  // Basic check for 5 digits
  if (!/^\d{5}$/.test(zipCode)) {
    return false
  }

  const zipNum = Number.parseInt(zipCode, 10)

  // Phoenix ZIP codes (common ranges, not exhaustive)
  const phoenixZips = [
    [85001, 85099], // General Phoenix area
    [85201, 85299], // East Valley (Mesa, Chandler, Gilbert, Tempe - often considered part of greater Phoenix metro)
  ]

  // Glendale ZIP codes (common ranges, not exhaustive)
  const glendaleZips = [
    [85301, 85318], // General Glendale area
  ]

  // Peoria ZIP codes (common ranges, not exhaustive)
  const peoriaZips = [
    [85345, 85345], // Specific Peoria zip
    [85381, 85387], // General Peoria area
  ]

  const isPhoenix = phoenixZips.some(([min, max]) => zipNum >= min && zipNum <= max)
  const isGlendale = glendaleZips.some(([min, max]) => zipNum >= min && zipNum <= max)
  const isPeoria = peoriaZips.some(([min, max]) => zipNum >= min && zipNum <= max)

  return isPhoenix || isGlendale || isPeoria
}

// Get city by ZIP code
export function getCityByZipCode(zipCode: string): string | null {
  const zip = Number.parseInt(zipCode)

  // Phoenix ZIP codes
  if ((zip >= 85001 && zip <= 85099) || (zip >= 85201 && zip <= 85299)) {
    return "Phoenix"
  }

  // Glendale ZIP codes
  if (zip >= 85301 && zip <= 85318) {
    return "Glendale"
  }

  // Peoria ZIP codes
  if (zip === 85345 || (zip >= 85381 && zip <= 85387)) {
    return "Peoria"
  }

  return null
}

// Validate if address is in service area
export function isInServiceArea(city: string, state: string, zipCode: string): boolean {
  if (state !== "AZ") return false

  const validCities = AZ_CITIES.map((c) => c.value.toLowerCase())
  if (!validCities.includes(city.toLowerCase())) return false

  return isValidArizonaZip(zipCode)
}

// Get contact information for out-of-area customers
export function getContactInfo() {
  return {
    phone: CONTACT_INFO.phoneNumber,
    phoneFormatted: `(${CONTACT_INFO.phoneNumber.substring(0, 3)}) ${CONTACT_INFO.phoneNumber.substring(
      3,
      6,
    )}-${CONTACT_INFO.phoneNumber.substring(6)}`,
    website: CONTACT_INFO.companyName,
  }
}
