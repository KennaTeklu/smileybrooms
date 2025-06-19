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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import TermsModal from "./terms-modal"
import PrivacyModal from "./privacy-modal"

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address ending with one of the accepted domain names.",
        variant: "destructive",
      })
      return
    }

    // Phone validation
    const enteredPhone = phone.trim()
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im
    const isValidPhone = phoneRegex.test(enteredPhone)
    if (!isValidPhone) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Google Sheets integration
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

      // Enhanced data structure
      const formData = {
        name,
        email: enteredEmail,
        phone: `${countryCode}${enteredPhone}`,
        message: `🟢 Waitlist: New waitlist signup from website`,
        source: "Waitlist Form",
        meta: {
          formType: "waitlist",
          submitDate: new Date().toISOString(),
          browser: navigator.userAgent,
          page: window.location.pathname,
          referrer: document.referrer || "direct",
          device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
          consent: termsAccepted,
        },
        data: {
          waitlistType: "early_access",
          signupLocation: window.location.pathname,
        },
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

      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      })

      // Reset form and close modal
      setName("")
      setEmail("")
      setPhone("")
      setCountryCode("+1")
      setTermsAccepted(false)
      onClose()
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Join Our Waitlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
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
              <Label htmlFor="phone">Phone Number</Label>
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
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555-123-4567"
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                required
              />
              <Label htmlFor="terms" className="text-sm">
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </>
  )
}
