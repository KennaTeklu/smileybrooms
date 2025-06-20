"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react" // Added MessageSquare for chat icon
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

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
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setFormData({ name: "", email: "", subject: "", message: "" })
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We will get back to you shortly.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            We'd love to hear from you! Reach out with any questions or inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-6">
            <CardHeader className="mb-6">
              <CardTitle className="text-2xl font-semibold">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-base">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base">
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-base">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Inquiry about services"
                    required
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-base">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message here..."
                    rows={5}
                    required
                    className="mt-2"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <CardHeader className="mb-4">
                <CardTitle className="text-2xl font-semibold">Our Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">info@smileybrooms.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <a href="tel:6028000605" className="text-gray-600 dark:text-gray-400 hover:underline">
                      (602) 800-0605
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      123 Cleaning Lane, Suite 100
                      <br />
                      Phoenix, AZ 85001
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Business Hours</h4>
                    <p className="text-gray-600 dark:text-gray-400">Mon - Fri: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600 dark:text-gray-400">Sat: 10:00 AM - 3:00 PM</p>
                    <p className="text-gray-600 dark:text-gray-400">Sun: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 text-center">
              <CardContent className="space-y-4">
                <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <h3 className="text-xl font-semibold">Need immediate assistance?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Chat with our AI assistant for quick answers to common questions.
                </p>
                <Button className="w-full h-12 text-lg">Start Chat</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
