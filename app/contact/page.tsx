"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
    // Here you would typically send the data to an API
    alert("Thank you for your message! We will get back to you soon.")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const companyPhoneNumber = "6028000605"

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">Get in Touch</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          We'd love to hear from you! Whether you have a question about our services, need support, or just want to
          provide feedback, feel free to reach out.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              Contact Information
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Reach out to us through various channels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-50">Phone</h3>
                <a href={`tel:${companyPhoneNumber}`} className="text-gray-600 dark:text-gray-400 hover:underline">
                  {companyPhoneNumber}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-50">Email</h3>
                <a href="mailto:info@smileybrooms.com" className="text-gray-600 dark:text-gray-400 hover:underline">
                  info@smileybrooms.com
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-50">Address</h3>
                <p className="text-gray-600 dark:text-gray-400">123 Clean Street, Sparkle City, SC 12345</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-50">Business Hours</h3>
                <p className="text-gray-600 dark:text-gray-400">Mon - Fri: 9:00 AM - 5:00 PM</p>
                <p className="text-gray-600 dark:text-gray-400">Sat: 10:00 AM - 3:00 PM</p>
                <p className="text-gray-600 dark:text-gray-400">Sun: Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Send Us a Message</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" value={formData.message} onChange={handleChange} rows={5} required />
              </div>
              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
