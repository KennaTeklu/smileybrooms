"use client"

import React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, Info, Download, MapPin } from "lucide-react"
import { addressFormSchema, type AddressFormData, validateAndFormatZip } from "@/lib/validation/address-validation"
import { AZ_CITIES, SERVICE_AREA_MESSAGE, CONTACT_INFO, getCityByZipCode } from "@/lib/location-data"
import { createContactDownload } from "@/lib/payment-config"

interface AddressStepProps {
  data: Partial<AddressFormData>
  onSave: (data: AddressFormData) => void
  onNext: () => void
  onPrevious: () => void
}

export default function AddressStep({ data, onSave, onNext, onPrevious }: AddressStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [zipError, setZipError] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || undefined,
      state: "AZ",
      zipCode: data.zipCode || "",
      specialInstructions: data.specialInstructions || "",
    },
  })

  const zipCode = watch("zipCode")
  const selectedCity = watch("city")

  // Auto-detect city from ZIP code
  React.useEffect(() => {
    if (zipCode && zipCode.length === 5) {
      const detectedCity = getCityByZipCode(zipCode)
      if (detectedCity && detectedCity !== selectedCity) {
        setValue("city", detectedCity as any)
        setZipError("")
      } else if (!detectedCity) {
        setZipError("We currently serve Phoenix, Glendale, and Peoria areas only")
      }
    } else {
      setZipError("")
    }
  }, [zipCode, selectedCity, setValue])

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const { formatted } = validateAndFormatZip(value)
    setValue("zipCode", formatted)
  }

  const onSubmit = async (formData: AddressFormData) => {
    setIsSubmitting(true)
    try {
      const { isValid } = validateAndFormatZip(formData.zipCode)
      if (!isValid) {
        setZipError("We currently serve Phoenix, Glendale, and Peoria areas only")
        setIsSubmitting(false)
        return
      }

      onSave(formData)
      onNext()
    } catch (error) {
      console.error("Error submitting address:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactDownload = () => {
    const contactData = createContactDownload()
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
    <div className="p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Service Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>{SERVICE_AREA_MESSAGE}</AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Enter your first name"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Enter your last name"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="Enter your phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Enter your street address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Select onValueChange={(value) => setValue("city", value as any)} value={selectedCity}>
                  <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {AZ_CITIES.map((city) => (
                      <SelectItem key={city.value} value={city.value}>
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" value="Arizona" disabled className="bg-gray-50" />
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  onChange={handleZipChange}
                  placeholder="85001"
                  maxLength={5}
                  className={errors.zipCode || zipError ? "border-red-500" : ""}
                />
                {(errors.zipCode || zipError) && (
                  <p className="text-sm text-red-600 mt-1">{errors.zipCode?.message || zipError}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <Textarea
                id="specialInstructions"
                {...register("specialInstructions")}
                placeholder="Gate code, parking instructions, pet information, etc."
                rows={3}
                className={errors.specialInstructions ? "border-red-500" : ""}
              />
              {errors.specialInstructions && (
                <p className="text-sm text-red-600 mt-1">{errors.specialInstructions.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button type="button" variant="outline" onClick={onPrevious} className="flex-1 bg-transparent">
                Previous
              </Button>
              <Button type="submit" disabled={isSubmitting || !!zipError} className="flex-1">
                {isSubmitting ? "Validating..." : "Continue to Payment"}
              </Button>
            </div>
          </form>

          <div className="border-t pt-6 mt-6">
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
                  Call {CONTACT_INFO.displayPhone}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleContactDownload}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Download className="h-4 w-4" />
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
