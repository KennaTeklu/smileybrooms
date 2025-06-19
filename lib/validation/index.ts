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
 * Unified validation utilities
 */

// Re-export all validation utilities
export * from "./email-validation"
export * from "./phone-validation"
export * from "./address-validation"

// Additional general validation utilities

/**
 * Validates if a string is not empty
 * @param value - The string to check
 * @returns True if the string is not empty, false otherwise
 */
export function isNotEmpty(value: string): boolean {
  return value !== undefined && value !== null && value.trim().length > 0
}

/**
 * Validates if a value is within a specified range
 * @param value - The number to validate
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns True if the value is within range, false otherwise
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validates if a string matches a specific length
 * @param value - The string to validate
 * @param length - The exact length required
 * @returns True if the string matches the exact length, false otherwise
 */
export function hasExactLength(value: string, length: number): boolean {
  return value.length === length
}

/**
 * Validates if a string is within a length range
 * @param value - The string to validate
 * @param min - The minimum length
 * @param max - The maximum length
 * @returns True if the string length is within range, false otherwise
 */
export function isLengthInRange(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max
}

/**
 * Validates if a string contains only alphanumeric characters
 * @param value - The string to validate
 * @returns True if the string is alphanumeric, false otherwise
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value)
}

/**
 * Validates if a string contains only alphabetic characters
 * @param value - The string to validate
 * @returns True if the string is alphabetic, false otherwise
 */
export function isAlphabetic(value: string): boolean {
  return /^[a-zA-Z]+$/.test(value)
}

/**
 * Validates if a string contains only numeric characters
 * @param value - The string to validate
 * @returns True if the string is numeric, false otherwise
 */
export function isNumeric(value: string): boolean {
  return /^[0-9]+$/.test(value)
}

/**
 * Validates if a value is a valid date
 * @param value - The date to validate (string or Date object)
 * @returns True if the value is a valid date, false otherwise
 */
export function isValidDate(value: string | Date): boolean {
  if (value instanceof Date) {
    return !isNaN(value.getTime())
  }

  const date = new Date(value)
  return !isNaN(date.getTime())
}

/**
 * Validates if a date is in the future
 * @param value - The date to validate (string or Date object)
 * @returns True if the date is in the future, false otherwise
 */
export function isFutureDate(value: string | Date): boolean {
  if (!isValidDate(value)) return false

  const date = value instanceof Date ? value : new Date(value)
  const now = new Date()

  return date.getTime() > now.getTime()
}

/**
 * Validates if a date is in the past
 * @param value - The date to validate (string or Date object)
 * @returns True if the date is in the past, false otherwise
 */
export function isPastDate(value: string | Date): boolean {
  if (!isValidDate(value)) return false

  const date = value instanceof Date ? value : new Date(value)
  const now = new Date()

  return date.getTime() < now.getTime()
}

/**
 * Validates if a string matches a specific pattern
 * @param value - The string to validate
 * @param pattern - The regex pattern to match against
 * @returns True if the string matches the pattern, false otherwise
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value)
}

/**
 * Validates if a value is a valid URL
 * @param value - The URL to validate
 * @returns True if the value is a valid URL, false otherwise
 */
export function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Validates if a string is a valid credit card number (using Luhn algorithm)
 * @param value - The credit card number to validate
 * @returns True if the value is a valid credit card number, false otherwise
 */
export function isValidCreditCard(value: string): boolean {
  // Remove all non-digit characters
  const cardNumber = value.replace(/\D/g, "")

  // Check if the card number has a valid length
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return false
  }

  // Luhn algorithm implementation
  let sum = 0
  let shouldDouble = false

  // Loop through the card number from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cardNumber.charAt(i))

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}
