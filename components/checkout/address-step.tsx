"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, MapPin, AlertCircle } from "lucide-react"
import { AZ_CITIES, SERVICE_AREA_MESSAGE, CONTACT_INFO } from "@/lib/location-data"
import { addressSchema } from "@/lib/validation/address-validation"

type AddressFormData = z.infer<typeof addressSchema>

interface AddressStepProps {
  onNext: (data: AddressFormData) => void
  onBack: () => void
  initialData?: Partial<AddressFormData>
}

export default function AddressStep({ onNext, onBack, initialData }: AddressStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      state: "AZ",
      ...initialData,
    },
  })

  const selectedCity = watch("city")

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true)
    try {
      onNext(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactDownload = () => {
    const contactData = `
SmileyBrooms Cleaning Service
Website: ${CONTACT_INFO.website}
Phone: ${CONTACT_INFO.phone}
Email: ${CONTACT_INFO.email}

Available Payment Methods:
- Cash (in person)
- Zelle
- Phone payment
- Credit/Debit card over phone

Call us to complete your booking!
    `.trim()

    const blob = new Blob([contactData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "smileybrooms-contact.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Address
          </CardTitle>
          <CardDescription>Please provide your address for our cleaning service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{SERVICE_AREA_MESSAGE}</AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-red-500" : ""} />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-red-500" : ""} />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" {...register("phone")} className={errors.phone ? "border-red-500" : ""} />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" {...register("address")} className={errors.address ? "border-red-500" : ""} />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Select onValueChange={(value) => setValue("city", value as any)}>
                  <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {AZ_CITIES.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value="Arizona" disabled className="bg-gray-50" />
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input id="zipCode" {...register("zipCode")} className={errors.zipCode ? "border-red-500" : ""} />
                {errors.zipCode && <p className="text-sm text-red-500 mt-1">{errors.zipCode.message}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Processing..." : "Continue to Payment"}
              </Button>
            </div>
          </form>

          <div className="border-t pt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Need help or have questions about our service area?</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${CONTACT_INFO.phone}`, "_self")}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call {CONTACT_INFO.phone}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleContactDownload}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <MapPin className="h-4 w-4" />
                  Download Contact Info
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
