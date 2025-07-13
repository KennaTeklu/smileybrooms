"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Email validation
    const enteredEmail = email.trim().toLowerCase()
    const allowedDomains = [
      "gmail.com",
      "outlook.com",
      "hotmail.com",
      "live.com",
      "yahoo.com",
      "aol.com",
      "protonmail.com",
      "proton.me",
      "icloud.com",
      "me.com",
      "yandex.com",
      "yandex.ru",
      "comcast.net",
      "verizon.net",
      "cox.net",
      "spectrum.net",
    ]

    const isValidEmail = allowedDomains.some((domain) => enteredEmail.endsWith(`@${domain}`))
    if (!isValidEmail) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address ending with one of the accepted domain names.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Terms validation
    if (!termsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Google Sheets integration
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

      // Extract the first sentence as a summary if message is long
      const messageSummary = message.length > 50 ? message.substring(0, 50).split(".")[0] + "..." : message

      // Analyze message content to suggest department
      const department =
        message.toLowerCase().includes("price") || message.toLowerCase().includes("cost")
          ? "Sales"
          : message.toLowerCase().includes("job") || message.toLowerCase().includes("career")
            ? "Careers"
            : message.toLowerCase().includes("clean") || message.toLowerCase().includes("service")
              ? "Operations"
              : "General"

      const formData = {
        name,
        email: enteredEmail,
        subject,
        message: `🔵 Contact: ${messageSummary}`,
        fullMessage: message,
        source: "Contact Form",
        meta: {
          formType: "contact",
          submitDate: new Date().toISOString(),
          browser: navigator.userAgent,
          page: window.location.pathname,
          referrer: document.referrer || "direct",
          device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
          consent: termsAccepted,
        },
        data: {
          suggestedDepartment: department,
          messageLength: message.length,
          wordCount: message.trim().split(/\s+/).length,
          priority: message.length > 500 ? "high" : "normal",
          messageCategory: department,
        },
      }

      // Submit form data to Google Sheets
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      })

      // Reset form
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
      setTermsAccepted(false)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Something went wrong",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
        We'd love to hear from you! Reach out to us with any questions or inquiries.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of your inquiry"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  rows={5}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and privacy policy
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Our Contact Information</CardTitle>
            <CardDescription>Reach us through various channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-700 dark:text-gray-300">info@smileybrooms.com</p>
                <p className="text-gray-700 dark:text-gray-300">support@smileybrooms.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Main:{" "}
                  <a href="tel:6028000605" className="hover:underline">
                    (602) 800-0605
                  </a>
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Support:{" "}
                  <a href="tel:6028000605" className="hover:underline">
                    (602) 800-0605
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-700 dark:text-gray-300">123 Cleaning Lane, Suite 100</p>
                <p className="text-gray-700 dark:text-gray-300">Sparkle City, CA 90210</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-gray-700 dark:text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-700 dark:text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-gray-700 dark:text-gray-300">Sunday: Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
