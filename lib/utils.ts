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
