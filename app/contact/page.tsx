"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, MapPin } from "lucide-react"
import { useFormValidation } from "@/hooks/use-form-validation"
import { validateEmail } from "@/lib/validation"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const { errors, validateField, validateForm } = useFormValidation(formData, {
    name: (value) => (value.trim() ? null : "Name is required."),
    email: (value) => (validateEmail(value) ? null : "Invalid email address."),
    subject: (value) => (value.trim() ? null : "Subject is required."),
    message: (value) => (value.trim() ? null : "Message is required."),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    validateField(id, value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Simulate form submission
      console.log("Form submitted:", formData)
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you shortly.",
      })
      setFormData({ name: "", email: "", subject: "", message: "" }) // Clear form
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
        Have questions or need assistance? Reach out to us!
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => validateField("name", formData.name)}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => validateField("email", formData.email)}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Inquiry about services"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={() => validateField("subject", formData.subject)}
                />
                {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => validateField("message", formData.message)}
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Our Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Email Us</h3>
                <p className="text-gray-700 dark:text-gray-300">info@smileybrooms.com</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">We typically respond within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Call Us</h3>
                <p className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mon-Fri, 9 AM - 5 PM EST</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Visit Our Office</h3>
                <p className="text-gray-700 dark:text-gray-300">123 Cleaning Lane</p>
                <p className="text-gray-700 dark:text-gray-300">Suite 100</p>
                <p className="text-gray-700 dark:text-gray-300">Clean City, CA 90210</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">By appointment only.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
