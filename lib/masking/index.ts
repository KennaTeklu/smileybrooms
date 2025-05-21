import type React from "react"
/**
 * Field Masking Utilities
 *
 * This module provides utilities for masking input fields like phone numbers,
 * credit cards, dates, and more. These utilities help format user input in
 * real-time to match expected patterns.
 */

/**
 * Applies a mask to a string value based on a pattern
 *
 * @param value - The value to mask
 * @param pattern - The pattern to apply (# for digits, A for letters, * for alphanumeric)
 * @param placeholder - Optional placeholder character
 * @returns The masked value
 */
export function applyMask(value: string, pattern: string, placeholder = "_"): string {
  if (!value) return pattern.replace(/[#A*]/g, placeholder)

  let result = ""
  let valueIndex = 0

  // Process each character in the pattern
  for (let i = 0; i < pattern.length; i++) {
    // If we've used all input characters, fill the rest with placeholders
    if (valueIndex >= value.length) {
      result += pattern[i].match(/[#A*]/) ? placeholder : pattern[i]
      continue
    }

    const patternChar = pattern[i]
    const valueChar = value[valueIndex]

    // Apply pattern rules
    if (patternChar === "#") {
      // Digit expected
      if (/\d/.test(valueChar)) {
        result += valueChar
        valueIndex++
      } else {
        // Skip non-digit character in input
        valueIndex++
        i-- // Retry with next input character
      }
    } else if (patternChar === "A") {
      // Letter expected
      if (/[a-zA-Z]/.test(valueChar)) {
        result += valueChar
        valueIndex++
      } else {
        // Skip non-letter character in input
        valueIndex++
        i-- // Retry with next input character
      }
    } else if (patternChar === "*") {
      // Alphanumeric expected
      if (/[a-zA-Z0-9]/.test(valueChar)) {
        result += valueChar
        valueIndex++
      } else {
        // Skip non-alphanumeric character in input
        valueIndex++
        i-- // Retry with next input character
      }
    } else {
      // Fixed character in pattern
      result += patternChar

      // Skip this character in input if it matches the pattern
      if (valueChar === patternChar) {
        valueIndex++
      }
    }
  }

  return result
}

/**
 * Removes a mask from a value
 *
 * @param value - The masked value
 * @param pattern - The pattern that was applied
 * @returns The unmasked value
 */
export function removeMask(value: string, pattern: string): string {
  let result = ""
  let patternIndex = 0

  for (let i = 0; i < value.length; i++) {
    // Skip if we've reached the end of the pattern
    if (patternIndex >= pattern.length) break

    const patternChar = pattern[patternIndex]
    const valueChar = value[i]

    // Only keep characters that match the pattern placeholders
    if (patternChar === "#" && /\d/.test(valueChar)) {
      result += valueChar
    } else if (patternChar === "A" && /[a-zA-Z]/.test(valueChar)) {
      result += valueChar
    } else if (patternChar === "*" && /[a-zA-Z0-9]/.test(valueChar)) {
      result += valueChar
    }

    patternIndex++
  }

  return result
}

/**
 * Phone number masking
 *
 * @param value - The phone number to mask
 * @param format - The format to use (default: US)
 * @returns The masked phone number
 */
export function maskPhone(value: string, format: "US" | "INTL" = "US"): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "")

  if (format === "US") {
    // US format: (###) ###-####
    return applyMask(digits, "(###) ###-####".replace(/#/g, "#"))
  } else {
    // International format: +# (###) ###-####
    return applyMask(digits, "+# (###) ###-####".replace(/#/g, "#"))
  }
}

/**
 * Credit card masking
 *
 * @param value - The credit card number to mask
 * @param format - The format to use (default: standard grouping)
 * @returns The masked credit card number
 */
export function maskCreditCard(value: string, format: "standard" | "amex" = "standard"): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "")

  if (format === "amex") {
    // American Express format: #### ###### #####
    return applyMask(digits, "#### ###### #####".replace(/#/g, "#"))
  } else {
    // Standard format: #### #### #### ####
    return applyMask(digits, "#### #### #### ####".replace(/#/g, "#"))
  }
}

/**
 * Date masking
 *
 * @param value - The date to mask
 * @param format - The format to use (default: MM/DD/YYYY)
 * @returns The masked date
 */
export function maskDate(value: string, format: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" = "MM/DD/YYYY"): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "")

  if (format === "MM/DD/YYYY") {
    return applyMask(digits, "##/##/####".replace(/#/g, "#"))
  } else if (format === "DD/MM/YYYY") {
    return applyMask(digits, "##/##/####".replace(/#/g, "#"))
  } else {
    return applyMask(digits, "####-##-##".replace(/#/g, "#"))
  }
}

/**
 * Currency masking
 *
 * @param value - The value to mask as currency
 * @param locale - The locale to use for formatting (default: en-US)
 * @param currency - The currency code (default: USD)
 * @returns The masked currency value
 */
export function maskCurrency(value: string, locale = "en-US", currency = "USD"): string {
  // Remove all non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, "")

  // Ensure only one decimal point
  const parts = cleanValue.split(".")
  let result = parts[0] || "0"
  if (parts.length > 1) {
    result += "." + parts[1].substring(0, 2).padEnd(2, "0")
  }

  // Format as currency
  try {
    const numberValue = Number.parseFloat(result)
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numberValue)
  } catch (error) {
    // Fallback if Intl is not supported
    return `${currency} ${result}`
  }
}

/**
 * Social Security Number masking
 *
 * @param value - The SSN to mask
 * @returns The masked SSN
 */
export function maskSSN(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "")

  return applyMask(digits, "###-##-####".replace(/#/g, "#"))
}

/**
 * ZIP/Postal code masking
 *
 * @param value - The ZIP/Postal code to mask
 * @param format - The format to use (default: US)
 * @returns The masked ZIP/Postal code
 */
export function maskZip(value: string, format: "US" | "US_PLUS_4" | "CA" = "US"): string {
  // Remove all non-alphanumeric characters
  const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "")

  if (format === "US") {
    // US format: #####
    return applyMask(cleanValue, "#####".replace(/#/g, "#"))
  } else if (format === "US_PLUS_4") {
    // US+4 format: #####-####
    return applyMask(cleanValue, "#####-####".replace(/#/g, "#"))
  } else {
    // Canadian format: A#A #A#
    return applyMask(cleanValue, "A#A #A#".replace(/A/g, "A").replace(/#/g, "#"))
  }
}

/**
 * Create a masked input handler
 *
 * @param maskFn - The masking function to use
 * @param onChange - The onChange handler to call with the masked value
 * @returns A function to use as an onChange handler
 */
export function createMaskedInputHandler(
  maskFn: (value: string, ...args: any[]) => string,
  onChange: (value: string) => void,
  ...maskArgs: any[]
): (e: React.ChangeEvent<HTMLInputElement>) => void {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const maskedValue = maskFn(value, ...maskArgs)

    // Update the input value
    e.target.value = maskedValue

    // Call the original onChange
    onChange(maskedValue)
  }
}
