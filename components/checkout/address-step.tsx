"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  isValidStreetAddress,
  isValidCity,
  isValidUSState,
  isValidUSZip,
  formatUSZip,
} from "@/lib/validation/address-validation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { generateOutOfServiceMailtoLink } from "@/lib/email-utils"

interface AddressStepProps {
  initialData: {
    street: string
    city: string
    state: string
    zip: string
    fullName: string // From contact step
    email: string // From contact step
    phone: string // From contact step
  }
  onNext: (data: { street: string; city: string; state: string; zip: string }) => void
  onBack: () => void
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]

export function AddressStep({ initialData, onNext, onBack }: AddressStepProps) {
  const [street, setStreet] = useState(initialData.street)
  const [city, setCity] = useState(initialData.city)
  const [state, setState] = useState(initialData.state)
  const [zip, setZip] = useState(initialData.zip)
  const [errors, setErrors] = useState({ street: "", city: "", state: "", zip: "" })
  const [showOutOfServiceDialog, setShowOutOfServiceDialog] = useState(false)

  const validateForm = () => {
    let valid = true
    const newErrors = { street: "", city: "", state: "", zip: "" }

    if (!street.trim() || !isValidStreetAddress(street)) {
      newErrors.street = "A valid street address is required."
      valid = false
    }
    if (!city.trim() || !isValidCity(city)) {
      newErrors.city = "A valid city is required."
      valid = false
    }
    if (!state || !isValidUSState(state)) {
      newErrors.state = "Please select a state."
      valid = false
    }
    if (!zip.trim() || !isValidUSZip(zip)) {
      newErrors.zip = "A valid 5-digit ZIP code is required."
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (state !== "AZ") {
        setShowOutOfServiceDialog(true)
      } else {
        onNext({ street, city, state, zip })
      }
    }
  }

  const handleEmailInquiry = () => {
    const mailtoLink = generateOutOfServiceMailtoLink(state)
    window.open(mailtoLink, "_blank")
    setShowOutOfServiceDialog(false) // Close dialog after opening email client
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Service Address</CardTitle>
          <CardDescription>Where would you like us to provide the cleaning service?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => {
                setStreet(e.target.value)
                setErrors((prev) => ({ ...prev, street: "" }))
              }}
              placeholder="123 Main St"
              className={cn({ "border-red-500": errors.street })}
              aria-invalid={!!errors.street}
              aria-describedby="street-error"
            />
            {errors.street && (
              <p id="street-error" className="text-sm text-red-500">
                {errors.street}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value)
                  setErrors((prev) => ({ ...prev, city: "" }))
                }}
                placeholder="Phoenix"
                className={cn({ "border-red-500": errors.city })}
                aria-invalid={!!errors.city}
                aria-describedby="city-error"
              />
              {errors.city && (
                <p id="city-error" className="text-sm text-red-500">
                  {errors.city}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={state}
                onValueChange={(value) => {
                  setState(value)
                  setErrors((prev) => ({ ...prev, state: "" }))
                }}
              >
                <SelectTrigger
                  className={cn({ "border-red-500": errors.state })}
                  aria-invalid={!!errors.state}
                  aria-describedby="state-error"
                >
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && (
                <p id="state-error" className="text-sm text-red-500">
                  {errors.state}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              value={zip}
              onChange={(e) => {
                const formatted = formatUSZip(e.target.value)
                setZip(formatted)
                setErrors((prev) => ({ ...prev, zip: "" }))
              }}
              placeholder="85001"
              maxLength={5}
              className={cn({ "border-red-500": errors.zip })}
              aria-invalid={!!errors.zip}
              aria-describedby="zip-error"
            />
            {errors.zip && (
              <p id="zip-error" className="text-sm text-red-500">
                {errors.zip}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to Contact
          </Button>
          <Button type="submit">Continue to Payment</Button>
        </CardFooter>
      </form>

      <Dialog open={showOutOfServiceDialog} onOpenChange={setShowOutOfServiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Not Available in {state}</DialogTitle>
            <DialogDescription>
              Currently, Smiley Brooms only operates in Arizona. We'd love to hear from you if you're interested in our
              services in {state}!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOutOfServiceDialog(false)}>
              Close
            </Button>
            <Button onClick={handleEmailInquiry}>Email Us Your Inquiry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
