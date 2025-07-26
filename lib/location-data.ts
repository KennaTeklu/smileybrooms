export interface ContactInfo {
  website: string
  phone: string
  email?: string
}

export const CONTACT_INFO: ContactInfo = {
  website: "smileybrooms.com",
  phone: "(661) 602-3000",
  email: "info@smileybrooms.com",
}

export interface State {
  code: string
  name: string
}

export interface City {
  name: string
  zipRanges: string[]
}

export const US_STATES: State[] = [{ code: "AZ", name: "Arizona" }]

export const AZ_CITIES: City[] = [
  {
    name: "Phoenix",
    zipRanges: ["85001-85099", "85201-85299"],
  },
  {
    name: "Glendale",
    zipRanges: ["85301-85399"],
  },
  {
    name: "Peoria",
    zipRanges: ["85345", "85381-85387"],
  },
]

export const SERVICE_AREA_MESSAGE = `We currently serve Phoenix, Glendale, and Peoria, Arizona. For services outside this area, please call us at ${CONTACT_INFO.phone}.`

export function isValidArizonaZip(zipCode: string): boolean {
  const zip = zipCode.replace(/\D/g, "")

  if (zip.length !== 5) return false

  const zipNum = Number.parseInt(zip)

  // Phoenix ZIP codes
  if ((zipNum >= 85001 && zipNum <= 85099) || (zipNum >= 85201 && zipNum <= 85299)) {
    return true
  }

  // Glendale ZIP codes
  if (zipNum >= 85301 && zipNum <= 85399) {
    return true
  }

  // Peoria ZIP codes
  if (zipNum === 85345 || (zipNum >= 85381 && zipNum <= 85387)) {
    return true
  }

  return false
}

export function getCityFromZip(zipCode: string): string | null {
  const zip = zipCode.replace(/\D/g, "")
  const zipNum = Number.parseInt(zip)

  if ((zipNum >= 85001 && zipNum <= 85099) || (zipNum >= 85201 && zipNum <= 85299)) {
    return "Phoenix"
  }

  if (zipNum >= 85301 && zipNum <= 85399) {
    return "Glendale"
  }

  if (zipNum === 85345 || (zipNum >= 85381 && zipNum <= 85387)) {
    return "Peoria"
  }

  return null
}
