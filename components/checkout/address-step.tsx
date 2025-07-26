"use client"

import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Arizona ZIP code validation
const isValidArizonaZip = (zipCode: string): boolean => {
  const arizonaZipRanges = [
    { min: 85001, max: 85099 }, // Phoenix area
    { min: 85201, max: 85299 }, // Mesa/Tempe area
    { min: 85301, max: 85399 }, // Glendale/Peoria area
    { min: 85501, max: 85599 }, // Globe area
    { min: 85601, max: 85699 }, // Sierra Vista area
    { min: 85701, max: 85799 }, // Tucson area
    { min: 86001, max: 86099 }, // Flagstaff area
    { min: 86301, max: 86399 }, // Prescott area
    { min: 86401, max: 86499 }, // Kingman area
    { min: 86501, max: 86599 }, // Yuma area
  ]

  const cleanZip = zipCode.replace(/\D/g, "").substring(0, 5)
  if (cleanZip.length !== 5) return false

  const zipNum = Number.parseInt(cleanZip, 10)
  return arizonaZipRanges.some((range) => zipNum >= range.min && zipNum <= range.max)
}

const addressSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.enum(["Glendale", "Phoenix", "Peoria"], {
    errorMap: () => ({ message: "Please select a valid city." }),
  }),
  state: z.literal("AZ", {
    errorMap: () => ({ message: "Only Arizona is supported." }),
  }),
  zipCode: z.string().refine((val) => isValidArizonaZip(val), {
    message: "Please enter a valid Arizona ZIP code.",
  }),
})

type AddressSchemaType = z.infer<typeof addressSchema>

interface AddressStepProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: AddressSchemaType) => void
}

const AddressStep: React.FC<AddressStepProps> = ({ open, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressSchemaType>({
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "AZ",
      zipCode: "",
    },
  })

  // LOCAL Zod validation (no external resolver needed)
  const onValid = (values: AddressSchemaType) => {
    const parsed = addressSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AddressSchemaType
        setError(field, { message: issue.message })
      })
      return
    }
    onSubmit(values)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shipping Address</DialogTitle>
          <DialogDescription>Enter your shipping address to complete your order.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="123 Main St" {...register("address")} />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Select onValueChange={(value) => setValue("city", value)} defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Glendale">Glendale</SelectItem>
                  <SelectItem value="Phoenix">Phoenix</SelectItem>
                  <SelectItem value="Peoria">Peoria</SelectItem>
                </SelectContent>
              </Select>
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Select onValueChange={(value) => setValue("state", value)} defaultValue="AZ">
                <SelectTrigger>
                  <SelectValue placeholder="Arizona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AZ">Arizona</SelectItem>
                </SelectContent>
              </Select>
              {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" placeholder="12345" {...register("zipCode")} />
            {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode.message}</p>}
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Review My Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddressStep
