"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
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
  const [phone, setPhone] = useState("")
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

    // Phone validation
    const enteredPhone = phone.trim()
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
    const isValidPhone = phoneRegex.test(enteredPhone)
    if (!isValidPhone && phone.length > 0) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
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

      const formData = {
        name,
        email: enteredEmail,
        phone: enteredPhone,
        message,
        timestamp: new Date().toISOString(),
        source: "Contact Form",
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
      setPhone("")
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
      <Header />

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
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
                      <p className="text-gray-600 dark:text-gray-400">Main: (555) 123-4567</p>
                      <p className="text-gray-600 dark:text-gray-400">Support: (555) 987-6543</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        123 Cleaning Street, Suite 100
                        <br />
                        Sparkle City, SC 12345
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-start space-x-4 p-6">
                    <Clock className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p className="text-gray-600 dark:text-gray-400">Saturday: 9:00 AM - 4:00 PM</p>
                      <p className="text-gray-600 dark:text-gray-400">Sunday: Closed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Find Us</h2>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Map integration will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
