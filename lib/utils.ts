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

export function calculateVideoDiscount(totalPrice: number): number {
  const percentageDiscount = totalPrice * 0.1 // 10% of total
  const fixedDiscount = 25 // $25 fixed
  return Math.min(percentageDiscount, fixedDiscount)
}
