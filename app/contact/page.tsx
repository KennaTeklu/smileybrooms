"use client"

import { Phone, Mail, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeviceOptimizedContactForm } from "@/components/device-optimized-contact-form"
import { Separator } from "@/components/ui/separator"
import { MinimalHero } from "@/components/minimal-hero"

const companyPhoneNumber = "6028000605"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MinimalHero title="Contact Us" description="We're here to help with all your cleaning needs." />

      <main className="flex-1 py-12 px-4 md:px-6 lg:py-16">
        <div className="container mx-auto grid gap-8 md:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get in Touch</h2>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Have questions, need a custom quote, or ready to book your cleaning service? Reach out to us using the
              form below or through our direct contact information.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-primary" />
                <a href={`tel:${companyPhoneNumber}`} className="text-lg font-medium hover:underline">
                  {companyPhoneNumber}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <a href="mailto:info@smileybrooms.com" className="text-lg font-medium hover:underline">
                  info@smileybrooms.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg font-medium">
                  123 Clean Street, Sparkling City, SC 12345
                  <br />
                  United States
                </p>
              </div>
            </div>
            <Separator />
            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 dark:text-gray-300">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </CardContent>
            </Card>
          </div>
          <DeviceOptimizedContactForm />
        </div>
      </main>
    </div>
  )
}
