"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Calculate Your Price",
      description: "Use our easy price calculator to get an instant quote based on your specific cleaning needs.",
    },
    {
      number: "02",
      title: "Book Your Service",
      description: "Select a date and time that works for you and provide your address and access details.",
    },
    {
      number: "03",
      title: "Get Matched",
      description: "We'll match you with a professional cleaner who specializes in your requested services.",
    },
    {
      number: "04",
      title: "Enjoy a Clean Space",
      description: "Relax while our professionals clean your space to perfection, with a 100% satisfaction guarantee.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Booking a cleaning service with us is simple and hassle-free.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800"
            >
              <div className="absolute -top-4 left-6 rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-3 mt-4 text-xl font-bold">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/calculator">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
