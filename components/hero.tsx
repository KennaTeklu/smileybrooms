"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import WaitlistModal from "@/components/waitlist-modal"

export default function Hero() {
  const [showWaitlist, setShowWaitlist] = useState(false)

  return (
    <div className="relative">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: "url(https://cs11.pikabu.ru/images/big_size_comm_an/2019-11_3/1573828410128078961.gif)",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-white/80 to-white dark:from-gray-950 dark:via-gray-950/80 dark:to-gray-950" />

      <Header />

      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              <span className="mr-2 rounded-full bg-primary h-2 w-2" />
              Professional Cleaning Services
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Sparkling Clean Spaces, <span className="text-primary">Happy Faces</span>
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
              Experience the joy of coming home to a perfectly clean space. Our professional cleaning services are
              tailored to your needs, schedule, and budget.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button asChild size="lg" className="text-base">
                <Link href="/pricing">
                  Calculate Your Price <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base" onClick={() => setShowWaitlist(true)}>
                Join Waitlist
              </Button>
            </div>
            <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-6 sm:space-y-0">
              {["Trusted Professionals", "100% Satisfaction", "Eco-Friendly"].map((item) => (
                <div key={item} className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative h-[400px] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="/placeholder.svg?height=800&width=600"
                alt="Professional cleaning service"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <div className="mb-2 text-sm font-medium">Featured Service</div>
                <h3 className="mb-1 text-xl font-bold">Deep Home Cleaning</h3>
                <p className="mb-3 text-sm opacity-90">
                  A thorough cleaning of your entire home, from ceiling to floor.
                </p>
                <Button size="sm" variant="secondary" asChild>
                  <Link href="/services/deep-cleaning">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WaitlistModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </div>
  )
}
