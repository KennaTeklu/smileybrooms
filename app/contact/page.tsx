"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useFormSecurity } from "@/lib/security" // Import the security hook

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])

  // Initialize form security for the contact form
  const { csrf, honeypot, rateLimit, validateSecurity, recordSubmission, securityFields } = useFormSecurity({
    formId: "contact-form",
    action: "contact-submission",
    // You can customize rateLimitOptions and honeypotOptions here if needed
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormErrors([])

    const formData = new FormData(event.currentTarget)

    // Client-side security validation
    const { valid, errors } = validateSecurity(formData)
    if (!valid) {
      setFormErrors(errors)
      toast({
        title: "Security Alert",
        description: errors.join(", "),
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Record the submission attempt for rate limiting
    const { limited, resetTime } = await recordSubmission()
    if (limited) {
      setFormErrors([`Too many attempts. Please try again after ${new Date(resetTime || 0).toLocaleTimeString()}.`])
      toast({
        title: "Rate Limit Exceeded",
        description: `Please try again after ${new Date(resetTime || 0).toLocaleTimeString()}.`,
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Simulate form submission to a server action or API route
    try {
      // In a real application, you would send this formData to a server action or API route
      // Example: const response = await submitContactForm(formData);
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you shortly.",
        variant: "default",
      })

      // Clear form fields (optional)
      event.currentTarget.reset()
    } catch (error) {
      console.error("Contact form submission error:", error)
      setFormErrors(["Failed to send message. Please try again."])
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="lg:flex">
          {/* Contact Info Section */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-blue-600 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-extrabold mb-4">Get in Touch</h2>
              <p className="text-blue-100 mb-8 text-lg">Have questions or need a custom quote? Reach out to us!</p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="h-6 w-6 mr-4 text-blue-200" />
                  <a href="mailto:info@smileybrooms.com" className="text-lg hover:underline">
                    info@smileybrooms.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 mr-4 text-blue-200" />
                  <a href="tel:+15551234567" className="text-lg hover:underline">
                    (555) 123-4567
                  </a>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mr-4 text-blue-200 flex-shrink-0 mt-1" />
                  <p className="text-lg">
                    123 Cleaning Lane, Suite 100
                    <br />
                    Sparkle City, CA 90210
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <p className="text-blue-200 text-sm">We typically respond within 24 business hours.</p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Your Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="mt-2 h-12 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="mt-2 h-12 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Inquiry about services"
                  className="mt-2 h-12 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-base font-medium text-gray-700 dark:text-gray-300">
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="mt-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Security Fields (CSRF and Honeypot) */}
              {securityFields}

              {formErrors.length > 0 && (
                <div className="text-red-500 text-sm mt-4">
                  {formErrors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-3 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
