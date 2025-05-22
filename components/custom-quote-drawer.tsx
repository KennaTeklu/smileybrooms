"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { ClipboardList, Calendar, Phone, User, Home, Sparkles } from "lucide-react"

interface CustomQuoteDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomQuoteDrawer({ open, onOpenChange }: CustomQuoteDrawerProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    propertyType: "residential",
    serviceType: "standard",
    squareFootage: "",
    rooms: "",
    bathrooms: "",
    specialRequests: "",
    preferredDate: "",
    preferredTime: "",
    contactPreference: "email",
    agreeToTerms: false,
  })

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Process form submission
    console.log("Form submitted:", formData)
    // Close the drawer
    onOpenChange(false)
    // Show success message
    alert("Your custom quote request has been submitted. We'll contact you shortly!")
  }

  const Content = (
    <>
      <div className={isDesktop ? "p-6" : "p-4"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <ScrollArea className={isDesktop ? "h-[calc(100vh-200px)]" : "h-[calc(100vh-180px)]"} type="always">
            <div className="space-y-6 pr-4">
              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Contact Information
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="(123) 456-7890"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Property Details
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Property Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="123 Main St, City, State, ZIP"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <RadioGroup
                      value={formData.propertyType}
                      onValueChange={(value) => handleChange("propertyType", value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="residential" id="residential" />
                        <Label htmlFor="residential" className="cursor-pointer">
                          Residential
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="commercial" id="commercial" />
                        <Label htmlFor="commercial" className="cursor-pointer">
                          Commercial
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="squareFootage">Square Footage</Label>
                      <Input
                        id="squareFootage"
                        type="number"
                        value={formData.squareFootage}
                        onChange={(e) => handleChange("squareFootage", e.target.value)}
                        placeholder="1500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <Input
                        id="rooms"
                        type="number"
                        value={formData.rooms}
                        onChange={(e) => handleChange("rooms", e.target.value)}
                        placeholder="4"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleChange("bathrooms", e.target.value)}
                      placeholder="2"
                    />
                  </div>
                </div>
              </div>

              {/* Service Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Service Details
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <RadioGroup
                      value={formData.serviceType}
                      onValueChange={(value) => handleChange("serviceType", value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          Standard Cleaning
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deep" id="deep" />
                        <Label htmlFor="deep" className="cursor-pointer">
                          Deep Cleaning
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="move" id="move" />
                        <Label htmlFor="move" className="cursor-pointer">
                          Move In/Out Cleaning
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specialty" id="specialty" />
                        <Label htmlFor="specialty" className="cursor-pointer">
                          Specialty Services
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => handleChange("specialRequests", e.target.value)}
                      placeholder="Please describe any special requirements or areas that need extra attention..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Preferred Schedule
                </h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => handleChange("preferredDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <select
                      id="preferredTime"
                      value={formData.preferredTime}
                      onChange={(e) => handleChange("preferredTime", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a time</option>
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 4PM)</option>
                      <option value="evening">Evening (4PM - 8PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Preference */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Preference
                </h3>
                <div className="space-y-2">
                  <Label>How would you prefer to be contacted?</Label>
                  <RadioGroup
                    value={formData.contactPreference}
                    onValueChange={(value) => handleChange("contactPreference", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email-pref" />
                      <Label htmlFor="email-pref" className="cursor-pointer">
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone-pref" />
                      <Label htmlFor="phone-pref" className="cursor-pointer">
                        Phone
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text-pref" />
                      <Label htmlFor="text-pref" className="cursor-pointer">
                        Text Message
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleChange("agreeToTerms", checked === true)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions and privacy policy
                  </Label>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2">
            {isDesktop ? (
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            ) : (
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            )}
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </div>
    </>
  )

  return isDesktop ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90%] sm:w-[540px] sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Request Custom Quote
          </SheetTitle>
          <SheetDescription>
            Fill out the form below to request a custom quote tailored to your specific needs.
          </SheetDescription>
        </SheetHeader>
        {Content}
      </SheetContent>
    </Sheet>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-xl flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Request Custom Quote
          </DrawerTitle>
          <DrawerDescription>
            Fill out the form below to request a custom quote tailored to your specific needs.
          </DrawerDescription>
        </DrawerHeader>
        {Content}
      </DrawerContent>
    </Drawer>
  )
}
