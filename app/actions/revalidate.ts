"use server"

import { revalidatePath } from "next/cache"

/**
 * Revalidates the homepage path to ensure fresh data is displayed.
 * This action can be called from client components or other server components.
 */
export async function revalidateHomepage() {
  console.log("Revalidating homepage path: /")
  revalidatePath("/")
  // If you have a locale-based routing, you might want to revalidate all locales
  // For example, if your path is /[locale]/, you'd revalidate '/[locale]'
  revalidatePath("/[locale]")
  console.log("Homepage revalidation initiated.")
}
