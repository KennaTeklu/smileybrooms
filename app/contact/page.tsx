"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { openGmailWithFormData } from "@/lib/email-utils" // Import the utility function

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call or actual submission logic
    // For demonstration, we'll use the openGmailWithFormData
    // In a real application, you'd send this data to a backend API
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    // Open Gmail with the form data
    openGmailWithFormData(
      {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: "Not provided", // You might want to add a phone field to your form
          address: "Not provided", // You might want to add address fields to your form
          specialInstructions: formData.message,
          allowVideoRecording: false, // Example, adjust as needed
        },
        service: {
          roomName: formData.subject, // Using subject as a placeholder for service type
          roomCount: 1, // Example, adjust as needed
          selectedTier: "Standard", // Example, adjust as needed
          frequency: "one-time", // Example, adjust as needed
          selectedAddOns: [],
          selectedReductions: [],
        },
        pricing: {
          basePrice: 0, // Example, adjust as needed
          videoRecordingDiscount: 0, // Example, adjust as needed
          finalPrice: 0, // Example, adjust as needed
        },
      },
      "info@smileybrooms.com",
    ) // Replace with your actual recipient email

    setIsSubmitting(false)
    setFormData({ name: "", email: "", subject: "", message: "" })
    toast({
      title: "Message Sent!",
      description: "Your message has been successfully sent. We will get back to you shortly.",
      variant: "default",
    })
  }

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-700 md:text-xl dark:text-gray-300">
              Have questions, feedback, or need a custom quote? Reach out to us! Our friendly team is here to help you
              with all your cleaning needs.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <a href="mailto:info@smileybrooms.com" className="hover:underline">
                  info@smileybrooms.com
                </a>
              </div>
              <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200">
                <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <a href="tel:+15551234567" className="hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>We'll come to you!</span>
              </div>
              <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>Mon - Fri: 9:00 AM - 5:00 PM (EST)</span>
              </div>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-lg md:h-80 lg:h-96">
              <Image
                src="/smiling-support-agent.png"
                alt="Support Agent"
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
            </div>
          </div>
          <Card className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm shadow-xl border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-gray-100/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-gray-100/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Regarding a cleaning service"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-gray-100/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Your message here..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-gray-100/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
