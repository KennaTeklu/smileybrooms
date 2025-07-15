export function isValidUSZip(zip: string): boolean {
  return /^\d{5}$/.test(zip)
}

export function isValidStreetAddress(address: string): boolean {
  // Simple validation: not empty and contains at least one digit or letter
  return address.trim().length > 0 && /[a-zA-Z0-9]/.test(address)
}

export function isValidCity(city: string): boolean {
  // Simple validation: not empty and contains only letters, spaces, hyphens
  return city.trim().length > 0 && /^[a-zA-Z\s-]+$/.test(city)
}

export function isValidUSState(state: string): boolean {
  // Basic check for 2-letter uppercase state code
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

export function formatUSZip(zip: string): string {
  // Remove non-digits and limit to 5 characters
  return zip.replace(/\D/g, "").slice(0, 5)
}

interface Address {
  street: string
  city: string
  state: string
  zip: string
  unit?: string
}

export function formatAddress(address: Address): string {
  const parts = [address.street]
  if (address.unit) {
    parts.push(address.unit)
  }
  parts.push(`${address.city}, ${address.state} ${address.zip}`)
  return parts.join(", ")
}
