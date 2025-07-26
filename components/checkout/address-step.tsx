"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, Info } from "lucide-react"
import { addressFormSchema } from "@/lib/validation/address-validation"
import { AZ_CITIES, SERVICE_AREA_MESSAGE, CONTACT_INFO } from "@/lib/location-data"
import type { z } from "zod"

type AddressFormData = z.infer<typeof addressFormSchema>

interface AddressStepProps {
  onNext: (data: AddressFormData) => void
  initialData?: Partial<AddressFormData>
}

export default function AddressStep({ onNext, initialData }: AddressStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      city: initialData?.city || undefined,
      state: "AZ",
      zipCode: initialData?.zipCode || "",
    },
  })

  const selectedCity = watch("city")

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true)
    try {
      onNext(data)
    } catch (error) {
      console.error("Error submitting address:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Service Address</CardTitle>
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
              <Input id="firstName" {...register("firstName")} placeholder="Enter your first name" />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} placeholder="Enter your last name" />
              {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register("email")} placeholder="Enter your email address" />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" {...register("phone")} placeholder="Enter your phone number" />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input id="address" {...register("address")} placeholder="Enter your street address" />
            {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Select onValueChange={(value) => setValue("city", value as any)} value={selectedCity}>
                <SelectTrigger>
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
              <Input id="zipCode" {...register("zipCode")} placeholder="85001" maxLength={5} />
              {errors.zipCode && <p className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Validating..." : "Continue to Payment"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
              onClick={() => window.open(`tel:${CONTACT_INFO.phone}`, "_self")}
            >
              <Phone className="h-4 w-4" />
              Call {CONTACT_INFO.displayPhone}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
