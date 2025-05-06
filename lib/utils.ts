export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This utility function remains largely the same
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
