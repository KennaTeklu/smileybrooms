"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import {
  isValidUSZip,
  isValidStreetAddress,
  isValidCity,
  isValidUSState,
  formatUSZip,
} from "@/lib/validation/address-validation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { generateOutOfServiceMailtoLink } from "@/lib/email-utils"
import Link from "next/link"

interface AddressStepProps {
  data: {
    street: string
    city: string
    state: string
    zip: string
    unit?: string
    fullName?: string // Inherited from contact step
    email?: string // Inherited from contact step
    phone?: string // Inherited from contact step
  }
  onNext: (data: any) => void
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

export function AddressStep({ data, onNext, onBack }: AddressStepProps) {
  const [street, setStreet] = useState(data.street || "")
  const [city, setCity] = useState(data.city || "")
  const [state, setState] = useState(data.state || "")
  const [zip, setZip] = useState(data.zip || "")
  const [unit, setUnit] = useState(data.unit || "")

  const [streetError, setStreetError] = useState<string | null>(null)
  const [cityError, setCityError] = useState<string | null>(null)
  const [stateError, setStateError] = useState<string | null>(null)
  const [zipError, setZipError] = useState<string | null>(null)

  const [showOutOfServiceDialog, setShowOutOfServiceDialog] = useState(false)

  useEffect(() => {
    setStreet(data.street || "")
    setCity(data.city || "")
    setState(data.state || "")
    setZip(data.zip || "")
    setUnit(data.unit || "")
  }, [data])

  const validateForm = () => {
    let isValid = true

    if (!street.trim() || !isValidStreetAddress(street)) {
      setStreetError("Please enter a valid street address.")
      isValid = false
    } else {
      setStreetError(null)
    }

    if (!city.trim() || !isValidCity(city)) {
      setCityError("Please enter a valid city.")
      isValid = false
    } else {
      setCityError(null)
    }

    if (!state.trim() || !isValidUSState(state)) {
      setStateError("Please select a state.")
      isValid = false
    } else {
      setStateError(null)
    }

    if (!zip.trim() || !isValidUSZip(zip)) {
      setZipError("Please enter a valid 5-digit ZIP code.")
      isValid = false
    } else {
      setZipError(null)
    }

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (state === "AZ") {
        onNext({ street, city, state, zip, unit })
      } else {
        setShowOutOfServiceDialog(true)
      }
    }
  }

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUSZip(e.target.value)
    setZip(formatted)
    if (zipError && isValidUSZip(formatted)) {
      setZipError(null)
    }
  }

  const mailtoLink = generateOutOfServiceMailtoLink(state)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          value={street}
          onChange={(e) => {
            setStreet(e.target.value)
            if (streetError && isValidStreetAddress(e.target.value)) {
              setStreetError(null)
            }
          }}
          placeholder="123 Main St"
          required
          aria-invalid={streetError ? "true" : "false"}
          aria-describedby={streetError ? "street-error" : undefined}
        />
        {streetError && (
          <p id="street-error" className="text-red-500 text-sm">
            {streetError}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit">Unit/Apt/Suite (Optional)</Label>
        <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Apt 4B" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              if (cityError && isValidCity(e.target.value)) {
                setCityError(null)
              }
            }}
            placeholder="Anytown"
            required
            aria-invalid={cityError ? "true" : "false"}
            aria-describedby={cityError ? "city-error" : undefined}
          />
          {cityError && (
            <p id="city-error" className="text-red-500 text-sm">
              {cityError}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="state">State</Label>
          <Select
            value={state}
            onValueChange={(value) => {
              setState(value)
              if (stateError && isValidUSState(value)) {
                setStateError(null)
              }
            }}
            required
          >
            <SelectTrigger
              id="state"
              aria-invalid={stateError ? "true" : "false"}
              aria-describedby={stateError ? "state-error" : undefined}
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
          {stateError && (
            <p id="state-error" className="text-red-500 text-sm">
              {stateError}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="zip">ZIP Code</Label>
        <Input
          id="zip"
          value={zip}
          onChange={handleZipChange}
          placeholder="12345"
          maxLength={5}
          required
          aria-invalid={zipError ? "true" : "false"}
          aria-describedby={zipError ? "zip-error" : undefined}
        />
        {zipError && (
          <p id="zip-error" className="text-red-500 text-sm">
            {zipError}
          </p>
        )}
      </div>
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Contact
        </Button>
        <Button type="submit">Continue to Payment</Button>
      </div>

      <Dialog open={showOutOfServiceDialog} onOpenChange={setShowOutOfServiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Not Available in Your Area</DialogTitle>
            <DialogDescription>
              Unfortunately, Smiley Brooms currently only operates in Arizona. We're working hard to expand our
              services!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              We'd love to hear from you and understand your interest in our services in {state}. Please send us an
              email, and we'll keep you updated on our expansion plans.
            </p>
            <Button asChild className="w-full">
              <Link href={mailtoLink} target="_blank" rel="noopener noreferrer">
                Email Us About Service in {state}
              </Link>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOutOfServiceDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
