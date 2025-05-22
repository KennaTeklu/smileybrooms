"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  ClipboardList,
  Calendar,
  User,
  Home,
  Sparkles,
  Droplets,
  AlertTriangle,
  Briefcase,
  Building,
  Hammer,
  Trash2,
  Leaf,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CustomQuoteDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomQuoteDrawer({ open, onOpenChange }: CustomQuoteDrawerProps) {
  const [formData, setFormData] = useState({
    // Contact Information
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",

    // Property Details
    propertyType: "residential",
    squareFootage: "",
    rooms: "",
    bathrooms: "",

    // Service Details
    serviceType: "standard",
    emergencyResponse: false,
    waterDamage: false,
    moldRemediation: false,
    fireSmokeDamage: false,
    commercialCleaning: false,
    constructionCleanup: false,
    moveInOut: false,
    deepCleaning: false,

    // Emergency Details
    damageExtent: "minor",
    timeOfIncident: "",
    insuranceProvider: "",
    policyNumber: "",

    // Schedule
    preferredDate: "",
    preferredTime: "",
    flexibleTiming: false,
    urgencyLevel: "standard",

    // Additional Information
    specialRequests: "",
    howDidYouHear: "",
    contactPreference: "email",
    agreeToTerms: false,
  })

  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [step, setStep] = useState(1)
  const [showEmergencyFields, setShowEmergencyFields] = useState(false)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Show emergency fields if emergency response is selected
    if (field === "emergencyResponse") {
      setShowEmergencyFields(value as boolean)
    }
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

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
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
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      {/* Add other states */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleChange("zip", e.target.value)}
                  placeholder="12345"
                  required
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Property Details
            </h3>
            <div className="grid gap-4">
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="industrial" id="industrial" />
                    <Label htmlFor="industrial" className="cursor-pointer">
                      Industrial
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
        )
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Service Details
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Primary Service Type</Label>
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
                <Label className="text-base">Additional Services Needed</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emergencyResponse"
                      checked={formData.emergencyResponse}
                      onCheckedChange={(checked) => handleChange("emergencyResponse", checked === true)}
                    />
                    <Label htmlFor="emergencyResponse" className="cursor-pointer flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                      Emergency Response
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="waterDamage"
                      checked={formData.waterDamage}
                      onCheckedChange={(checked) => handleChange("waterDamage", checked === true)}
                    />
                    <Label htmlFor="waterDamage" className="cursor-pointer flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5 text-blue-500" />
                      Water Damage
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="moldRemediation"
                      checked={formData.moldRemediation}
                      onCheckedChange={(checked) => handleChange("moldRemediation", checked === true)}
                    />
                    <Label htmlFor="moldRemediation" className="cursor-pointer flex items-center gap-1">
                      <Leaf className="h-3.5 w-3.5 text-green-500" />
                      Mold Remediation
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fireSmokeDamage"
                      checked={formData.fireSmokeDamage}
                      onCheckedChange={(checked) => handleChange("fireSmokeDamage", checked === true)}
                    />
                    <Label htmlFor="fireSmokeDamage" className="cursor-pointer flex items-center gap-1">
                      <Trash2 className="h-3.5 w-3.5 text-orange-500" />
                      Fire/Smoke Damage
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="commercialCleaning"
                      checked={formData.commercialCleaning}
                      onCheckedChange={(checked) => handleChange("commercialCleaning", checked === true)}
                    />
                    <Label htmlFor="commercialCleaning" className="cursor-pointer flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-gray-500" />
                      Commercial Cleaning
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="constructionCleanup"
                      checked={formData.constructionCleanup}
                      onCheckedChange={(checked) => handleChange("constructionCleanup", checked === true)}
                    />
                    <Label htmlFor="constructionCleanup" className="cursor-pointer flex items-center gap-1">
                      <Hammer className="h-3.5 w-3.5 text-yellow-500" />
                      Construction Cleanup
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="moveInOut"
                      checked={formData.moveInOut}
                      onCheckedChange={(checked) => handleChange("moveInOut", checked === true)}
                    />
                    <Label htmlFor="moveInOut" className="cursor-pointer flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                      Move In/Out
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="deepCleaning"
                      checked={formData.deepCleaning}
                      onCheckedChange={(checked) => handleChange("deepCleaning", checked === true)}
                    />
                    <Label htmlFor="deepCleaning" className="cursor-pointer flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                      Deep Cleaning
                    </Label>
                  </div>
                </div>
              </div>

              {showEmergencyFields && (
                <div className="space-y-4 p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/10 dark:border-red-800/30">
                  <h4 className="font-medium text-red-700 dark:text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Emergency Details
                  </h4>

                  <div className="space-y-2">
                    <Label htmlFor="damageExtent">Extent of Damage</Label>
                    <Select
                      value={formData.damageExtent}
                      onValueChange={(value) => handleChange("damageExtent", value)}
                    >
                      <SelectTrigger id="damageExtent">
                        <SelectValue placeholder="Select damage extent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Minor - Small area affected</SelectItem>
                        <SelectItem value="moderate">Moderate - Multiple areas affected</SelectItem>
                        <SelectItem value="severe">Severe - Extensive damage</SelectItem>
                        <SelectItem value="critical">Critical - Entire property affected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeOfIncident">When did the incident occur?</Label>
                    <Input
                      id="timeOfIncident"
                      type="datetime-local"
                      value={formData.timeOfIncident}
                      onChange={(e) => handleChange("timeOfIncident", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Insurance Provider (if applicable)</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => handleChange("insuranceProvider", e.target.value)}
                      placeholder="Insurance company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number (if applicable)</Label>
                    <Input
                      id="policyNumber"
                      value={formData.policyNumber}
                      onChange={(e) => handleChange("policyNumber", e.target.value)}
                      placeholder="Policy number"
                    />
                  </div>
                </div>
              )}

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
        )
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Scheduling & Preferences
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
                <Select value={formData.preferredTime} onValueChange={(value) => handleChange("preferredTime", value)}>
                  <SelectTrigger id="preferredTime">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                    <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="flexibleTiming"
                  checked={formData.flexibleTiming}
                  onCheckedChange={(checked) => handleChange("flexibleTiming", checked === true)}
                />
                <Label htmlFor="flexibleTiming" className="cursor-pointer">
                  I'm flexible with timing
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgencyLevel">Urgency Level</Label>
                <Select value={formData.urgencyLevel} onValueChange={(value) => handleChange("urgencyLevel", value)}>
                  <SelectTrigger id="urgencyLevel">
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency - Need service immediately</SelectItem>
                    <SelectItem value="urgent">Urgent - Need service within 24 hours</SelectItem>
                    <SelectItem value="standard">Standard - Within the next few days</SelectItem>
                    <SelectItem value="flexible">Flexible - Anytime in the next 2 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="howDidYouHear">How did you hear about us?</Label>
                <Select value={formData.howDidYouHear} onValueChange={(value) => handleChange("howDidYouHear", value)}>
                  <SelectTrigger id="howDidYouHear">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search">Search Engine</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="friend">Friend/Family Referral</SelectItem>
                    <SelectItem value="ad">Advertisement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-4">
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
        )
      default:
        return null
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-between items-center mb-6 px-2">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`flex flex-col items-center ${
              stepNumber < step ? "text-primary" : stepNumber === step ? "text-primary" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                stepNumber < step
                  ? "bg-primary text-white"
                  : stepNumber === step
                    ? "border-2 border-primary text-primary"
                    : "border border-gray-300 text-gray-400"
              }`}
            >
              {stepNumber < step ? "✓" : stepNumber}
            </div>
            <span className="text-xs hidden md:block">
              {stepNumber === 1
                ? "Contact"
                : stepNumber === 2
                  ? "Property"
                  : stepNumber === 3
                    ? "Services"
                    : "Schedule"}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const Content = (
    <>
      <div className={isDesktop ? "p-6" : "p-4"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepIndicator()}

          <ScrollArea className={isDesktop ? "h-[calc(100vh-280px)]" : "h-[calc(100vh-260px)]"} type="always">
            <div className="space-y-6 pr-4">{renderStepContent()}</div>
          </ScrollArea>

          <div className="flex justify-between gap-2 pt-4 border-t">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={!formData.agreeToTerms}>
                Submit Request
              </Button>
            )}
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
