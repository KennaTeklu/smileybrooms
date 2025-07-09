"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/types/supabase"
import { revalidatePath } from "next/cache"

// --- Profiles Table Actions ---
export async function getProfile(userId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching profile:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function updateProfile(profile: TablesUpdate<"profiles">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("profiles").update(profile).eq("id", profile.id!).select().single()

  if (error) {
    console.error("Error updating profile:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/dashboard/profile") // Revalidate path where profile might be displayed
  return { success: true, data }
}

// --- Customers Table Actions ---
export async function createCustomer(customer: TablesInsert<"customers">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("customers").insert(customer).select().single()

  if (error) {
    console.error("Error creating customer:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/customers")
  return { success: true, data }
}

export async function getCustomer(customerId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("customers").select("*").eq("id", customerId).single()

  if (error) {
    console.error("Error fetching customer:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function updateCustomer(customer: TablesUpdate<"customers">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("customers").update(customer).eq("id", customer.id!).select().single()

  if (error) {
    console.error("Error updating customer:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/customers")
  return { success: true, data }
}

export async function deleteCustomer(customerId: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("customers").delete().eq("id", customerId)

  if (error) {
    console.error("Error deleting customer:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/customers")
  return { success: true, message: "Customer deleted successfully." }
}

// --- Services Table Actions ---
export async function createService(service: TablesInsert<"services">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("services").insert(service).select().single()

  if (error) {
    console.error("Error creating service:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/services")
  revalidatePath("/pricing") // If services affect pricing page
  return { success: true, data }
}

export async function getService(serviceId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("services").select("*").eq("id", serviceId).single()

  if (error) {
    console.error("Error fetching service:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function getAllServices() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("services").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching all services:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function updateService(service: TablesUpdate<"services">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("services").update(service).eq("id", service.id!).select().single()

  if (error) {
    console.error("Error updating service:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/services")
  revalidatePath("/pricing")
  return { success: true, data }
}

export async function deleteService(serviceId: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("services").delete().eq("id", serviceId)

  if (error) {
    console.error("Error deleting service:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/services")
  revalidatePath("/pricing")
  return { success: true, message: "Service deleted successfully." }
}

// --- Bookings Table Actions ---
export async function createBooking(booking: TablesInsert<"bookings">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("bookings").insert(booking).select().single()

  if (error) {
    console.error("Error creating booking:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/bookings")
  revalidatePath("/dashboard/bookings")
  return { success: true, data }
}

export async function getBooking(bookingId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("bookings")
    .select("*, customers(*), services(*)") // Fetch related customer and service data
    .eq("id", bookingId)
    .single()

  if (error) {
    console.error("Error fetching booking:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function getUserBookings(userId: string) {
  const supabase = createServerSupabaseClient()
  // First, get the customer ID associated with the user ID
  const { data: customerData, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("user_id", userId)
    .single()

  if (customerError || !customerData) {
    console.error(
      "Error fetching customer for user bookings:",
      customerError?.message || "Customer not found for user.",
    )
    return { success: false, error: customerError?.message || "Customer not found." }
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("*, services(*)") // Fetch related service data
    .eq("customer_id", customerData.id)
    .order("booking_date", { ascending: false })

  if (error) {
    console.error("Error fetching user bookings:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function updateBooking(booking: TablesUpdate<"bookings">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("bookings").update(booking).eq("id", booking.id!).select().single()

  if (error) {
    console.error("Error updating booking:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/bookings")
  revalidatePath("/dashboard/bookings")
  return { success: true, data }
}

export async function deleteBooking(bookingId: string) {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.from("bookings").delete().eq("id", bookingId)

  if (error) {
    console.error("Error deleting booking:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/bookings")
  revalidatePath("/dashboard/bookings")
  return { success: true, message: "Booking deleted successfully." }
}

// --- Payments Table Actions ---
export async function createPayment(payment: TablesInsert<"payments">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("payments").insert(payment).select().single()

  if (error) {
    console.error("Error creating payment:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/payments")
  revalidatePath("/dashboard/payments")
  return { success: true, data }
}

export async function getPayment(paymentId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("payments")
    .select("*, bookings(*)") // Fetch related booking data
    .eq("id", paymentId)
    .single()

  if (error) {
    console.error("Error fetching payment:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function getPaymentsForBooking(bookingId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", bookingId)
    .order("payment_date", { ascending: false })

  if (error) {
    console.error("Error fetching payments for booking:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function updatePayment(payment: TablesUpdate<"payments">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("payments").update(payment).eq("id", payment.id!).select().single()

  if (error) {
    console.error("Error updating payment:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/payments")
  revalidatePath("/dashboard/payments")
  return { success: true, data }
}

// --- Users Table Actions (Basic) ---
// Note: Supabase Auth handles most user management. These are for custom user table fields if any.
export async function getUserById(userId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function updateUser(user: TablesUpdate<"users">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("users").update(user).eq("id", user.id!).select().single()

  if (error) {
    console.error("Error updating user:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/users")
  return { success: true, data }
}

// --- Feedback Table Actions ---
export async function createFeedback(feedback: TablesInsert<"feedback">) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from("feedback").insert(feedback).select().single()

  if (error) {
    console.error("Error creating feedback:", error.message)
    return { success: false, error: error.message }
  }
  revalidatePath("/admin/feedback")
  return { success: true, data }
}

export async function getFeedback(feedbackId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("feedback")
    .select("*, users(email)") // Fetch related user email
    .eq("id", feedbackId)
    .single()

  if (error) {
    console.error("Error fetching feedback:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}

export async function getAllFeedback() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("feedback")
    .select("*, users(email)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all feedback:", error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}
