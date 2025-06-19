"use client"
/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TermsModal from "./terms-modal"
import PrivacyModal from "./privacy-modal"

interface WaitlistOverlayProps {
  onSubmit: () => void
}

export default function WaitlistOverlay({ onSubmit }: WaitlistOverlayProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Email validation
    const enteredEmail = email.trim().toLowerCase()
    const isValidEmail = allowedDomains.some((domain) => enteredEmail.endsWith(`@${domain}`))
    if (!isValidEmail) {
      alert("Please enter a valid email address ending with one of the accepted domain names (gmail, yahoo, etc.)")
      return
    }

    // Phone validation
    const enteredPhone = phone.trim()
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
    const isValidPhone = phoneRegex.test(enteredPhone)
    if (!isValidPhone) {
      alert("Please enter a valid phone number.")
      return
    }

    try {
      // Replace with your actual form submission endpoint
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

      const formData = {
        name,
        email: enteredEmail,
        phone: `${countryCode}${enteredPhone}`,
      }

      // Submit form data
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // Call the onSubmit callback to hide the waitlist and show the main content
      onSubmit()
    } catch (error) {
      console.error("Error:", error)
      alert("There was an error submitting the form. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-12 max-w-xl w-[90%] text-center animate-slideUp">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Join Our Waitlist</h1>
        <p className="text-lg text-gray-600 mb-8">
          Be the first to know when we launch! Please provide your details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full p-4 text-base"
            />
          </div>

          <div>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full p-4 text-base"
            />
          </div>

          <div className="flex">
            <Select value={countryCode} onValueChange={setCountryCode}>
              <SelectTrigger className="w-24 rounded-r-none">
                <SelectValue placeholder="+1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+1">+1</SelectItem>
                <SelectItem value="+44">+44</SelectItem>
                <SelectItem value="+52">+52</SelectItem>
                <SelectItem value="+91">+91</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
              className="flex-1 rounded-l-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="termsCheckbox"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              required
            />
            <Label htmlFor="termsCheckbox" className="text-sm">
              I agree to the{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setShowTermsModal(true)}
              >
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setShowPrivacyModal(true)}
              >
                Privacy Policy
              </Button>
            </Label>
          </div>

          <Button type="submit" className="w-full py-6 text-lg">
            Join Waitlist
          </Button>
        </form>
      </div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  )
}
