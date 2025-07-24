"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { US_STATES, AZ_CITIES, SERVICE_AREA_MESSAGE, isValidArizonaZip } from "@/lib/location-data"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { Label } from "@/components/ui/label"

const addressFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z
    .string()
    .refine((value) => /^\d{5}$/.test(value), {
      message: "Zip code must be a 5-digit number.",
    })
    .refine((value) => isValidArizonaZip(value), {
      message: "We currently only service Arizona addresses.",
    }),
})

interface AddressStepProps {
  addressData: z.infer<typeof addressFormSchema>
  setAddressData: (data: z.infer<typeof addressFormSchema>) => void
  onNext: () => void
}

export function AddressStep({ addressData, setAddressData, onNext }: AddressStepProps) {
  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: addressData,
    mode: "onChange",
  })

  function onSubmit(data: z.infer<typeof addressFormSchema>) {
    setAddressData(data)
    onNext()
  }

  const handleChange = (field: string, value: string) => {
    setAddressData({ ...addressData, [field]: value })
  }

  const errors = form.formState.errors

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John"
                  {...field}
                  className={`h-11 rounded-lg ${errors.firstName ? "border-red-500" : ""}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Doe"
                  {...field}
                  className={`h-11 rounded-lg ${errors.lastName ? "border-red-500" : ""}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St"
                  {...field}
                  className={`h-11 rounded-lg ${errors.address ? "border-red-500" : ""}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label htmlFor="city" className="text-base">
            City
          </Label>
          <Select value={addressData.city} onValueChange={(value) => handleChange("city", value)}>
            <SelectTrigger id="city" className={`mt-2 h-11 rounded-lg ${errors.city ? "border-red-500" : ""}`}>
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
          {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city}</p>}
        </div>

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={`h-11 rounded-lg ${errors.state ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Zip code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="85001"
                    {...field}
                    className={`h-11 rounded-lg ${errors.zipCode ? "border-red-500" : ""}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full h-11">
          Next
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Service Area</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">{SERVICE_AREA_MESSAGE}</p>
            </div>
          </div>
        </motion.div>
      </form>
    </Form>
  )
}
