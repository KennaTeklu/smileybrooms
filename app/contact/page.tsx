"use client"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
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
        phone: "N/A", // Not used in contact form directly
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
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have questions or need a custom quote? Reach out to our friendly team.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions and privacy policy
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="grid gap-6">
                <Card>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600 dark:text-gray-400">info@smileybrooms.com</p>
                      <p className="text-gray-600 dark:text-gray-400">support@smileybrooms.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Main:{" "}
                        <a href="tel:6028000605" className="hover:underline">
                          (602) 800-0605
                        </a>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Support:{" "}
                        <a href="tel:6028000605" className="hover:underline">
                          (602) 800-0605
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600 dark:text-gray-400">We'll come to you!</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 6:00 AM - 9:00 PM</p>
                      <p className="text-gray-600 dark:text-gray-400">Saturday: 9:00 AM - 4:00 PM</p>
                      <p className="text-gray-600 dark:text-gray-400">Sunday: Closed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
