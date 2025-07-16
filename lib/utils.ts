import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function isClient(): boolean {
  return typeof window !== "undefined"
}

export function calculateVideoDiscount(hasVideo: boolean, basePrice: number): number {
  if (!hasVideo) return 0

  // 5% discount for customers who provide video walkthrough
  return Math.round(basePrice * 0.05 * 100) / 100
}

/**
 * Formats a 10-digit US phone number into (XXX) XXX-XXXX.
 */
export function formatUSPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "").slice(-10)
  return digits.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
}

/**
 * Builds a single-line address string from parts (ignores empty values).
 */
export function formatAddress(parts: {
  line1?: string
  line2?: string
  city?: string
  state?: string
  zip?: string
}): string {
  return [parts.line1, parts.line2, [parts.city, parts.state].filter(Boolean).join(", "), parts.zip]
    .filter(Boolean)
    .join(" ")
    .trim()
}
