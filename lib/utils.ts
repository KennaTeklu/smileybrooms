import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AddressData } from "@/app/checkout/page"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateVideoDiscount(subtotal: number): number {
  // Example: 10% discount for video recording, up to a max of $50
  const discountRate = 0.1
  const maxDiscount = 50
  const discount = subtotal * discountRate
  return Math.min(discount, maxDiscount)
}

/**
 * Formats a 10-digit US phone number into (XXX) XXX-XXXX.
 * Handles partial input for real-time formatting.
 * @param phoneNumber The phone number string.
 * @returns Formatted phone number string.
 */
export function formatUSPhone(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  // Handle partial input
  if (cleaned.length > 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }
  if (cleaned.length > 3) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}`
  }
  if (cleaned.length > 0) {
    return `(${cleaned.slice(0, 3)}`
  }
  return phoneNumber
}

/**
 * Formats a 5-digit US ZIP code.
 * Handles partial input for real-time formatting.
 * @param zipCode The ZIP code string.
 * @returns Formatted ZIP code string.
 */
export function formatUSZip(zipCode: string): string {
  const cleaned = zipCode.replace(/\D/g, "")
  return cleaned.slice(0, 5) // Ensure only first 5 digits are kept
}

/**
 * Formats an address object into a single string.
 * @param address The address object.
 * @returns Formatted address string.
 */
export function formatAddress(address: AddressData): string {
  const parts = []
  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.zipCode) parts.push(address.zipCode)
  return parts.join(", ")
}
