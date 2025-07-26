export interface City {
  value: string
  label: string
  zipRanges: string[]
}

export interface State {
  value: string
  label: string
}

export interface ContactInfo {
  website: string
  phone: string
  displayPhone: string
  email: string
}

export const CONTACT_INFO: ContactInfo = {
  website: "smileybrooms.com",
  phone: "6616023000",
  displayPhone: "(661) 602-3000",
  email: "info@smileybrooms.com",
}

export const US_STATES: State[] = [
  {
    value: "AZ",
    label: "Arizona",
  },
]

export const AZ_CITIES: City[] = [
  {
    value: "phoenix",
    label: "Phoenix",
    zipRanges: ["85001-85099", "85201-85299"],
  },
  {
    value: "glendale",
    label: "Glendale",
    zipRanges: ["85301-85399"],
  },
  {
    value: "peoria",
    label: "Peoria",
    zipRanges: ["85345", "85381-85387"],
  },
]

export const SERVICE_AREA_MESSAGE = `We currently service Phoenix, Glendale, and Peoria areas in Arizona. For services outside this area, please call us at ${CONTACT_INFO.displayPhone}.`

export function isValidArizonaZip(zipCode: string): boolean {
  if (!zipCode || zipCode.length !== 5) return false

  const zip = Number.parseInt(zipCode, 10)
  if (isNaN(zip)) return false

  // Phoenix: 85001-85099, 85201-85299
  if ((zip >= 85001 && zip <= 85099) || (zip >= 85201 && zip <= 85299)) {
    return true
  }

  // Glendale: 85301-85399
  if (zip >= 85301 && zip <= 85399) {
    return true
  }

  // Peoria: 85345, 85381-85387
  if (zip === 85345 || (zip >= 85381 && zip <= 85387)) {
    return true
  }

  return false
}

export function getCityByZipCode(zipCode: string): string | null {
  if (!isValidArizonaZip(zipCode)) return null

  const zip = Number.parseInt(zipCode, 10)

  // Phoenix ranges
  if ((zip >= 85001 && zip <= 85099) || (zip >= 85201 && zip <= 85299)) {
    return "phoenix"
  }

  // Glendale range
  if (zip >= 85301 && zip <= 85399) {
    return "glendale"
  }

  // Peoria ranges
  if (zip === 85345 || (zip >= 85381 && zip <= 85387)) {
    return "peoria"
  }

  return null
}

export function getZipCodesByCity(cityValue: string): string[] {
  const city = AZ_CITIES.find((c) => c.value === cityValue)
  return city ? city.zipRanges : []
}

export function getServiceAreas(): string[] {
  return AZ_CITIES.map((city) => city.label)
}
