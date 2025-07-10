export const accessibilityPreferenceKeys = [
  "highContrast",
  "largeText",
  "reducedMotion",
  "screenReader",
  "voiceControl",
  "keyboardOnly",
  "prefersDarkTheme",
  "prefersLightTheme",
] as const

export type AccessibilityPreferenceKey = (typeof accessibilityPreferenceKeys)[number]
