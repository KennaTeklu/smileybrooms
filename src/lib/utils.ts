// This file is assumed to be provided by shadcn/ui.
// It's included here as a placeholder to show it's part of the project.
// You would typically import it from '@/lib/utils'.
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
