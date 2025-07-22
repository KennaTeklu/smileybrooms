"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import Stripe from "stripe"
import { cookies } from "next/headers"

import { createBooking, createTour, deleteTour, updateTour } from "@/lib/db/queries"
import { BookingSchema, CreateTourSchema, TourSchema } from "@/lib/validation"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function createNewTour(formData: FormData) {
  const values = Object.fromEntries(formData.entries())

  const { name, description, city, country, imageUrl, price, category, spots, startDate, endDate } =
    CreateTourSchema.parse(values)

  const tour = await createTour({
    name,
    description,
    city,
    country,
    imageUrl,
    price,
    category,
    spots,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    userId: "user_2cZunkYj9JE9a84j6W6aQ6jJ39V",
  })

  revalidatePath("/")
  redirect(`/tours/${tour.id}`)
}

export async function updateExistingTour(formData: FormData, tourId: string) {
  const values = Object.fromEntries(formData.entries())

  const { name, description, city, country, imageUrl, price, category, spots, startDate, endDate } =
    TourSchema.parse(values)

  const tour = await updateTour({
    id: tourId,
    name,
    description,
    city,
    country,
    imageUrl,
    price,
    category,
    spots,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  })

  revalidatePath("/")
  redirect(`/tours/${tour.id}`)
}

export async function deleteExistingTour(tourId: string) {
  await deleteTour(tourId)
  revalidatePath("/")
  redirect("/")
}

export async function createNewBooking(formData: FormData) {
  const values = Object.fromEntries(formData.entries())

  const { tourId, userId, spots } = BookingSchema.parse(values)

  await createBooking({
    tourId,
    userId,
    spots,
  })

  revalidatePath("/")
}

export async function generateCheckoutSession(tourId: string, spots: number) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tour Booking",
          },
          unit_amount: 100,
        },
        quantity: spots,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tours/${tourId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tours/${tourId}`,
  })

  cookies().set("stripe_session_id", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })

  return redirect(session.url!)
}
