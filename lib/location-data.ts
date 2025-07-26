export interface ContactInfo {
  website: string
  phone: string
  displayPhone: string
}

export const CONTACT_INFO: ContactInfo = {
  website: "smileybrooms.com",
  phone: "6616023000",
  displayPhone: "(661) 602-3000",
}

export const US_STATES = [{ value: "AZ", label: "Arizona" }]

export const AZ_CITIES = [
  { value: "Phoenix", label: "Phoenix" },
  { value: "Glendale", label: "Glendale" },
  { value: "Peoria", label: "Peoria" },
]

export const SERVICE_AREA_MESSAGE = `We currently serve Phoenix, Glendale, and Peoria, Arizona. For services outside this area, please call us at ${CONTACT_INFO.displayPhone}.`

// Arizona ZIP code ranges
const PHOENIX_ZIP_RANGES = [
  { start: 85001, end: 85099 },
  { start: 85201, end: 85299 },
]

const GLENDALE_ZIP_RANGES = [{ start: 85301, end: 85399 }]

const PEORIA_ZIP_RANGES = [
  { start: 85345, end: 85345 },
  { start: 85381, end: 85387 },
]

function isZipInRanges(zip: number, ranges: { start: number; end: number }[]): boolean {
  return ranges.some((range) => zip >= range.start && zip <= range.end)
}

export function isValidArizonaZip(zipCode: string, city?: string): boolean {
  const zip = Number.parseInt(zipCode, 10)

  if (isNaN(zip) || zipCode.length !== 5) {
    return false
  }

  // Check if ZIP starts with 85 or 86 (Arizona prefixes)
  if (!zipCode.startsWith("85") && !zipCode.startsWith("86")) {
    return false
  }

  if (city) {
    switch (city.toLowerCase()) {
      case "phoenix":
        return isZipInRanges(zip, PHOENIX_ZIP_RANGES)
      case "glendale":
        return isZipInRanges(zip, GLENDALE_ZIP_RANGES)
      case "peoria":
        return isZipInRanges(zip, PEORIA_ZIP_RANGES)
      default:
        return false
    }
  }

  // If no city specified, check all ranges
  return (
    isZipInRanges(zip, PHOENIX_ZIP_RANGES) ||
    isZipInRanges(zip, GLENDALE_ZIP_RANGES) ||
    isZipInRanges(zip, PEORIA_ZIP_RANGES)
  )
}
