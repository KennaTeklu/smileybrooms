"use client"

import { Sparkles, Clock, Shield, Users, Leaf, Calendar, CreditCard, Star } from "lucide-react"

export default function Features() {
  const features = [
    {
      name: "Premium Quality",
      description: "Our professional cleaners use high-quality equipment and eco-friendly products.",
      icon: Sparkles,
    },
    {
      name: "Flexible Scheduling",
      description: "Book a cleaning service that fits your schedule, including evenings and weekends.",
      icon: Clock,
    },
    {
      name: "Insured & Bonded",
      description: "All our cleaning professionals are fully insured and bonded for your peace of mind.",
      icon: Shield,
    },
    {
      name: "Vetted Professionals",
      description: "Our cleaners undergo thorough background checks and professional training.",
      icon: Users,
    },
    {
      name: "Eco-Friendly Products",
      description: "We use environmentally friendly cleaning products that are safe for your family and pets.",
      icon: Leaf,
    },
    {
      name: "Easy Booking",
      description: "Book and manage your cleaning services online with just a few clicks.",
      icon: Calendar,
    },
    {
      name: "Transparent Pricing",
      description: "No hidden fees or surprises. Get an accurate quote before booking.",
      icon: CreditCard,
    },
    {
      name: "Satisfaction Guaranteed",
      description: "If you're not 100% satisfied, we'll re-clean at no additional cost.",
      icon: Star,
    },
  ]

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Smiley Brooms?</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            We deliver exceptional cleaning services with attention to detail and customer satisfaction.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="rounded-xl bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-medium">{feature.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
