"use server"

import { createClient } from "@supabase/supabase-js"
import type { CartItem, CheckoutData } from "@/lib/types"

// Initialize Supabase client for server-side operations
// Use the service role key for operations that require bypassing Row Level Security (RLS)
// This is suitable for backend operations like saving order data.
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    persistSession: false, // No session persistence on the server
  },
})

interface SaveBookingParams {
  checkoutData: CheckoutData
  cartItems: CartItem[]
  totalAmount: number
}

export async function saveBookingToSupabase({ checkoutData, cartItems, totalAmount }: SaveBookingParams) {
  try {
    const { contact, address, payment } = checkoutData

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        customer_info: contact,
        address_info: address,
        payment_preferences: payment,
        cart_items: cartItems,
        total_amount: totalAmount,
        status: "pending", // Initial status
      })
      .select("*") // Select the inserted row to get its ID

    if (error) {
      console.error("Supabase insert error:", error)
      throw new Error(`Failed to save booking to Supabase: ${error.message}`)
    }

    console.log("Booking saved to Supabase:", data)
    return data[0].id as string // Return the ID of the newly created booking
  } catch (error: any) {
    console.error("Error in saveBookingToSupabase:", error)
    throw new Error(`Could not save booking: ${error.message || "Unknown error"}`)
  }
}
