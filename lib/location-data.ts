// Arizona cities data for dropdown selection
export const AZ_CITIES = [
  { value: "phoenix", label: "Phoenix" },
  { value: "glendale", label: "Glendale" },
  { value: "peoria", label: "Peoria" },
]

// US States data - Arizona only
export const US_STATES = [{ value: "AZ", label: "Arizona" }]

// Get city label from value
export const getCityLabel = (cityValue: string): string => {
  const city = AZ_CITIES.find((city) => city.value === cityValue)
  return city ? city.label : cityValue
}

// Get city value from label
export const getCityValue = (cityLabel: string): string => {
  const city = AZ_CITIES.find((city) => city.label.toLowerCase() === cityLabel.toLowerCase())
  return city ? city.value : cityLabel
}

// Check if city is in service area
export const isServiceAreaCity = (cityName: string): boolean => {
  return AZ_CITIES.some(
    (city) =>
      city.label.toLowerCase() === cityName.toLowerCase() || city.value.toLowerCase() === cityName.toLowerCase(),
  )
}

// Arizona ZIP code validation
export const isValidArizonaZip = (zipCode: string): boolean => {
  if (!zipCode || typeof zipCode !== "string") return false

  // Arizona ZIP codes typically start with 85, 86
  const cleanZip = zipCode.replace(/\D/g, "")

  // Basic 5-digit ZIP validation for Arizona
  if (!/^8[5-6]\d{3}$/.test(cleanZip)) return false

  // Phoenix area: 85001-85099, 85201-85299
  // Glendale area: 85301-85399
  // Peoria area: 85345, 85381-85387
  const zipNum = Number.parseInt(cleanZip)

  return (
    (zipNum >= 85001 && zipNum <= 85099) || // Phoenix central
    (zipNum >= 85201 && zipNum <= 85299) || // Phoenix extended
    (zipNum >= 85301 && zipNum <= 85399) || // Glendale
    zipNum === 85345 || // Peoria
    (zipNum >= 85381 && zipNum <= 85387) // Peoria extended
  )
}

// Service area message
export const SERVICE_AREA_MESSAGE =
  "We currently serve Phoenix, Glendale, and Peoria areas in Arizona. For services outside of these areas, please call us at (661) 602-3000 to discuss availability."

// Get state label from value (keeping for compatibility)
export const getStateLabel = (stateValue: string): string => {
  const state = US_STATES.find((state) => state.value === stateValue)
  return state ? state.label : stateValue
}

// Get state value from label (keeping for compatibility)
export const getStateValue = (stateLabel: string): string => {
  const state = US_STATES.find((state) => state.label.toLowerCase() === stateLabel.toLowerCase())
  return state ? state.value : stateLabel
}
