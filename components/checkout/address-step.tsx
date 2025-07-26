"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  US_STATES,
  AZ_CITIES,
  SERVICE_AREA_MESSAGE,
  isValidArizonaZip,
  getCityByZipCode,
  getContactInfo,
} from "@/lib/location-data"
import { Phone } from "lucide-react"

const addressFormSchema = z.object({
  street: z.string().min(1, "Street address is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required.").default("AZ"), // Default to AZ
  zipCode: z
    .string()
    .min(5, "ZIP code must be 5 digits.")
    .max(5, "ZIP code must be 5 digits.")
    .refine(isValidArizonaZip, "Invalid Arizona ZIP code for our service area."),
})

type AddressFormValues = z.infer<typeof addressFormSchema>

interface AddressStepProps {
  onNext: (data: AddressFormValues) => void
  initialData?: AddressFormValues
}

export default function AddressStep({ onNext, initialData }: AddressStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: initialData || {
      street: "",
      city: "",
      state: "AZ", // Ensure default state is AZ
      zipCode: "",
    },
  })

  const zipCode = watch("zipCode")
  const state = watch("state")
  const { phoneFormatted } = getContactInfo()

  useEffect(() => {
    if (zipCode && isValidArizonaZip(zipCode)) {
      const detectedCity = getCityByZipCode(zipCode)
      if (detectedCity) {
        setValue("city", detectedCity, { shouldValidate: true })
      }
    } else if (zipCode.length === 5 && !isValidArizonaZip(zipCode)) {
      // Clear city if ZIP is invalid for our service area
      setValue("city", "")
    }
  }, [zipCode, setValue])

  const onSubmit = (data: AddressFormValues) => {
    onNext(data)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Address</CardTitle>
        <CardDescription>Please provide your service address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" placeholder="123 Main St" {...register("street")} />
              {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  onValueChange={(value) => setValue("city", value, { shouldValidate: true })}
                  value={watch("city")}
                >
                  <SelectTrigger id="city">
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
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  onValueChange={(value) => setValue("state", value, { shouldValidate: true })}
                  value={watch("state")}
                  disabled // State is fixed to AZ
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((stateOption) => (
                      <SelectItem key={stateOption.value} value={stateOption.value}>
                        {stateOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input id="zipCode" placeholder="85001" {...register("zipCode")} maxLength={5} />
                {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
              </div>
            </div>
          </div>
          {(errors.city || errors.zipCode) && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <p className="font-medium">{SERVICE_AREA_MESSAGE}</p>
              </div>
            </div>
          )}
          <Button type="submit" className="w-full">
            Continue to Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
