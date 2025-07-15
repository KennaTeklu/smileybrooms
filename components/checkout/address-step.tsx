"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import {
  isValidStreetAddress,
  isValidCity,
  isValidUSState,
  isValidUSZip,
  formatUSZip,
} from "@/lib/validation/address-validation"
import { generateOutOfServiceMailtoLink } from "@/lib/email-utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import Link from "next/link"

interface AddressStepProps {
  onNext: (data: {
    fullName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zip: string
  }) => void
  onBack: () => void
  initialData: {
    fullName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zip: string
  }
}

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

export function AddressStep({ onNext, onBack, initialData }: AddressStepProps) {
  const [street, setStreet] = useState(initialData.street || "")
  const [city, setCity] = useState(initialData.city || "")
  const [state, setState] = useState(initialData.state || "")
  const [zip, setZip] = useState(initialData.zip || "")
  const [errors, setErrors] = useState<{
    street?: string
    city?: string
    state?: string
    zip?: string
  }>({})
  const [showOutOfServiceDialog, setShowOutOfServiceDialog] = useState(false)

  useEffect(() => {
    setStreet(initialData.street || "")
    setCity(initialData.city || "")
    setState(initialData.state || "")
    setZip(initialData.zip || "")
    setErrors({}) // Clear errors when initialData changes
  }, [initialData])

  const validateForm = () => {
    const newErrors: { street?: string; city?: string; state?: string; zip?: string } = {}
    if (!street.trim() || !isValidStreetAddress(street)) {
      newErrors.street = "A valid street address is required."
    }
    if (!city.trim() || !isValidCity(city)) {
      newErrors.city = "A valid city is required."
    }
    if (!state || !isValidUSState(state)) {
      newErrors.state = "Please select a valid state."
    }
    if (!zip.trim() || !isValidUSZip(zip)) {
      newErrors.zip = "A valid 5-digit ZIP code is required."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      if (state !== "AZ") {
        setShowOutOfServiceDialog(true)
      } else {
        onNext({ ...initialData, street, city, state, zip })
      }
    }
  }

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedZip = formatUSZip(e.target.value)
    setZip(formattedZip)
    if (errors.zip) {
      setErrors((prev) => ({ ...prev, zip: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Service Address</CardTitle>
        <CardDescription>Where would you like us to provide the cleaning service?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              type="text"
              placeholder="123 Main St"
              value={street}
              onChange={(e) => {
                setStreet(e.target.value)
                if (errors.street) setErrors((prev) => ({ ...prev, street: undefined }))
              }}
              required
            />
            {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="Phoenix"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value)
                  if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }))
                }}
                required
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={state}
                onValueChange={(value) => {
                  setState(value)
                  if (errors.state) setErrors((prev) => ({ ...prev, state: undefined }))
                }}
                required
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              type="text"
              placeholder="85001"
              value={zip}
              onChange={handleZipChange}
              maxLength={5}
              required
            />
            {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}
          </div>
          <div className="flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="w-full bg-transparent">
              Back to Contact
            </Button>
            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>

      <Dialog open={showOutOfServiceDialog} onOpenChange={setShowOutOfServiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Service Not Available in Your Area</DialogTitle>
            <DialogDescription>
              Currently, Smiley Brooms only operates in Arizona. We are working hard to expand our services!
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            If you'd like to inquire about future service in {state}, please send us an email.
          </p>
          <DialogFooter>
            <Button asChild>
              <Link
                href={generateOutOfServiceMailtoLink(state, initialData.email)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Email Us About {state}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setShowOutOfServiceDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
