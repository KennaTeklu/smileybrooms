"use client"

import { StarIcon } from "lucide-react"

// Define the TESTIMONIALS constant here to avoid import issues
const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    rating: 5,
    content: "The cleaning team was professional, thorough, and friendly. My home has never looked better!",
    image: "/woman-portrait.png",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Owner",
    rating: 5,
    content:
      "We've been using their services for our office for over a year now. Always reliable and excellent quality.",
    image: "/thoughtful-man-portrait.png",
  },
  {
    id: 3,
    name: "Robert Williams",
    role: "Property Manager",
    rating: 4,
    content: "Great service for our rental properties. Tenants are always happy with the move-in condition.",
    image: "/confident-businessman.png",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Working Professional",
    rating: 5,
    content: "As a busy professional, having a clean home without the stress is priceless. Highly recommend!",
    image: "/professional-woman.png",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">What Our Customers Say</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Don't just take our word for it. Here's what our satisfied customers have to say.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col h-full"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
