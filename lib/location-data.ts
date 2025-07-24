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
export const US_STATES: StateOption[] = [{ value: "AZ", label: "Arizona" }]

// Only Phoenix, Glendale, and Peoria
export const AZ_CITIES: CityOption[] = [
  {
    value: "Phoenix",
    label: "Phoenix",
    zipRanges: ["85001-85099", "85201-85299"],
  },
  {
    value: "Glendale",
    label: "Glendale",
    zipRanges: ["85301-85399"],
  },
  {
    value: "Peoria",
    label: "Peoria",
    zipRanges: ["85345", "85381-85387"],
  },
]

// Service area message with contact info
export const SERVICE_AREA_MESSAGE =
  "We currently service Phoenix, Glendale, and Peoria areas. For services outside this area, please call us at (661) 602-3000."

// Arizona ZIP code validation
export function isValidArizonaZip(zipCode: string): boolean {
  const zip = Number.parseInt(zipCode)

  // Phoenix ZIP codes
  if ((zip >= 85001 && zip <= 85099) || (zip >= 85201 && zip <= 85299)) {
    return true
  }

  // Glendale ZIP codes
  if (zip >= 85301 && zip <= 85399) {
    return true
  }

  // Peoria ZIP codes
  if (zip === 85345 || (zip >= 85381 && zip <= 85387)) {
    return true
  }

  return false
}

// Get city by ZIP code
export function getCityByZipCode(zipCode: string): string | null {
  const zip = Number.parseInt(zipCode)

  // Phoenix ZIP codes
  if ((zip >= 85001 && zip <= 85099) || (zip >= 85201 && zip <= 85299)) {
    return "Phoenix"
  }

  // Glendale ZIP codes
  if (zip >= 85301 && zip <= 85399) {
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
    phone: "6616023000",
    phoneFormatted: "(661) 602-3000",
    website: "smileybrooms.com",
  }
}
