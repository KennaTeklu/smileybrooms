import type React from "react"
import { InteractivePhoneNumber } from "@/components/interactive-phone-number"

// Regular expression to match phone numbers in various formats
const PHONE_REGEX = /(\+?1[-\s.]?)?($$?\d{3}$$?[-\s.]?)\d{3}[-\s.]\d{4}/g

/**
 * Converts plain text phone numbers in a string to interactive phone number components
 * @param text The text that may contain phone numbers
 * @returns An array of text and InteractivePhoneNumber components
 */
export function convertPhoneNumbers(text: string): React.ReactNode[] {
  if (!text) return [text]

  // Split the text by phone numbers
  const parts = text.split(PHONE_REGEX)
  const matches = text.match(PHONE_REGEX) || []

  // If no phone numbers found, return the original text
  if (matches.length === 0) return [text]

  // Build the result array with text and phone number components
  const result: React.ReactNode[] = []

  for (let i = 0; i < parts.length; i++) {
    // Add the text part if it exists
    if (parts[i]) {
      result.push(parts[i])
    }

    // Add the phone number component if it exists
    if (matches[i - 1]) {
      result.push(<InteractivePhoneNumber key={`phone-${i}`} phoneNumber={matches[i - 1]} variant="link" />)
    }
  }

  return result
}

/**
 * React component that renders text with interactive phone numbers
 */
export function TextWithPhoneNumbers({ text }: { text: string }) {
  const content = convertPhoneNumbers(text)
  return <>{content}</>
}
