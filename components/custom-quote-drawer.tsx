"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useDeviceDetection } from "@/hooks/use-device-detection"
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
  Mail,
  Copy,
  Check,
  Info,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CustomQuoteDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Required field indicator component
const RequiredIndicator = () => (
  <span className="text-red-500 ml-0.5" aria-hidden="true">
    *
  </span>
)

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

  // Track validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { isMobile } = useDeviceDetection()
  const [step, setStep] = useState(1)
  const [showEmergencyFields, setShowEmergencyFields] = useState(false)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field when it's changed
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Show emergency fields if emergency response is selected
    if (field === "emergencyResponse") {
      setShowEmergencyFields(value as boolean)
    }
  }

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formattedMessage, setFormattedMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)

  const formatFormData = () => {
    // Format property type
    const propertyTypeLabels = {
      residential: "Residential",
      commercial: "Commercial",
      industrial: "Industrial",
    }

    // Format service type
    const serviceTypeLabels = {
      standard: "Standard Cleaning",
      deep: "Deep Cleaning",
      move: "Move In/Out Cleaning",
      specialty: "Specialty Services",
    }

    // Format urgency level
    const urgencyLabels = {
      emergency: "Emergency - Need service immediately",
      urgent: "Urgent - Need service within 24 hours",
      standard: "Standard - Within the next few days",
      flexible: "Flexible - Anytime in the next 2 weeks",
    }

    // Format contact preference
    const contactPrefLabels = {
      email: "Email",
      phone: "Phone",
      text: "Text Message",
    }

    // Format damage extent
    const damageExtentLabels = {
      minor: "Minor - Small area affected",
      moderate: "Moderate - Multiple areas affected",
      severe: "Severe - Extensive damage",
      critical: "Critical - Entire property affected",
    }

    // Format preferred time
    const timeLabels = {
      morning: "Morning (8AM - 12PM)",
      afternoon: "Afternoon (12PM - 4PM)",
      evening: "Evening (4PM - 8PM)",
    }

    // Collect selected services
    const selectedServices = []
    if (formData.emergencyResponse) selectedServices.push("Emergency Response")
    if (formData.waterDamage) selectedServices.push("Water Damage")
    if (formData.moldRemediation) selectedServices.push("Mold Remediation")
    if (formData.fireSmokeDamage) selectedServices.push("Fire/Smoke Damage")
    if (formData.commercialCleaning) selectedServices.push("Commercial Cleaning")
    if (formData.constructionCleanup) selectedServices.push("Construction Cleanup")
    if (formData.moveInOut) selectedServices.push("Move In/Out")
    if (formData.deepCleaning) selectedServices.push("Deep Cleaning")

    // Format the message
    return `
CUSTOM QUOTE REQUEST

CONTACT INFORMATION
------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
City: ${formData.city}
State: ${formData.state}
ZIP: ${formData.zip}

PROPERTY DETAILS
---------------
Property Type: ${propertyTypeLabels[formData.propertyType as keyof typeof propertyTypeLabels] || formData.propertyType}
Square Footage: ${formData.squareFootage || "Not specified"}
Number of Rooms: ${formData.rooms || "Not specified"}
Number of Bathrooms: ${formData.bathrooms || "Not specified"}

SERVICE DETAILS
--------------
Primary Service: ${serviceTypeLabels[formData.serviceType as keyof typeof serviceTypeLabels] || formData.serviceType}
Additional Services: ${selectedServices.length > 0 ? selectedServices.join(", ") : "None selected"}

${
  formData.emergencyResponse
    ? `
EMERGENCY DETAILS
----------------
Damage Extent: ${damageExtentLabels[formData.damageExtent as keyof typeof damageExtentLabels] || formData.damageExtent}
Time of Incident: ${formData.timeOfIncident || "Not specified"}
Insurance Provider: ${formData.insuranceProvider || "Not specified"}
Policy Number: ${formData.policyNumber || "Not specified"}
`
    : ""
}

SCHEDULING PREFERENCES
--------------------
Preferred Date: ${formData.preferredDate || "Not specified"}
Preferred Time: ${formData.preferredTime ? timeLabels[formData.preferredTime as keyof typeof timeLabels] || formData.preferredTime : "Not specified"}
Flexible Timing: ${formData.flexibleTiming ? "Yes" : "No"}
Urgency Level: ${urgencyLabels[formData.urgencyLevel as keyof typeof urgencyLabels] || formData.urgencyLevel}

ADDITIONAL INFORMATION
--------------------
Special Requests: ${formData.specialRequests || "None provided"}
How They Heard About Us: ${formData.howDidYouHear || "Not specified"}
Preferred Contact Method: ${contactPrefLabels[formData.contactPreference as keyof typeof contactPrefLabels] || formData.contactPreference}

This request was submitted through the SmileBrooms website on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.
`.trim()
  }

  // Validate the current step
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    switch (currentStep) {
      case 1: // Contact Information
        if (!formData.name.trim()) {
          newErrors.name = "Name is required"
          isValid = false
        }

        if (!formData.email.trim()) {
          newErrors.email = "Email is required"
          isValid = false
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address"
          isValid = false
        }

        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required"
          isValid = false
        }

        if (!formData.address.trim()) {
          newErrors.address = "Address is required"
          isValid = false
        }

        if (!formData.city.trim()) {
          newErrors.city = "City is required"
          isValid = false
        }

        if (!formData.state) {
          newErrors.state = "State is required"
          isValid = false
        }

        if (!formData.zip.trim()) {
          newErrors.zip = "ZIP code is required"
          isValid = false
        }
        break

      case 3: // Service Details
        if (formData.emergencyResponse) {
          if (!formData.damageExtent) {
            newErrors.damageExtent = "Please select the extent of damage"
            isValid = false
          }
        }
        break

      case 4: // Scheduling & Preferences
        if (!formData.urgencyLevel) {
          newErrors.urgencyLevel = "Please select an urgency level"
          isValid = false
        }

        if (!formData.contactPreference) {
          newErrors.contactPreference = "Please select a contact preference"
          isValid = false
        }

        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = "You must agree to the terms and conditions"
          isValid = false
        }
        break
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all steps before submission
    const step1Valid = validateStep(1)
    const step3Valid = validateStep(3)
    const step4Valid = validateStep(4)

    if (!step1Valid) {
      setStep(1)
      return
    } else if (!step3Valid) {
      setStep(3)
      return
    } else if (!step4Valid) {
      return
    }

    // Format the data into a readable message
    const message = formatFormData()
    setFormattedMessage(message)

    // Show confirmation dialog
    setShowConfirmation(true)
  }

  const handleCopyToClipboard = () => {
    if (messageRef.current) {
      const text = messageRef.current.innerText
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSendEmail = () => {
    const subject = `Custom Quote Request - ${formData.name}`
    const encodedSubject = encodeURIComponent(subject)
    const encodedBody = encodeURIComponent(formattedMessage)

    if (isMobile) {
      // For mobile devices, use mailto: which should open the default mail app (Gmail if set as default)
      const mailtoLink = `mailto:custom@smileybrooms.com?subject=${encodedSubject}&body=${encodedBody}`
      window.location.href = mailtoLink
    } else {
      // For desktop, open Gmail in a new tab
      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=custom@smileybrooms.com&su=${encodedSubject}&body=${encodedBody}`
      window.open(gmailLink, "_blank")
    }

    // Close the drawer after sending
    onOpenChange(false)
  }

  const nextStep = () => {
    // Validate current step before proceeding
    if (validateStep(step)) {
      setStep(step + 1)
    }
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
                <Label htmlFor="name" className="flex items-center">
                  Full Name
                  <RequiredIndicator />
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                  className={errors.name ? "border-red-500" : ""}
                  required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  Email Address
                  <RequiredIndicator />
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center">
                  Phone Number
                  <RequiredIndicator />
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(123) 456-7890"
                  className={errors.phone ? "border-red-500" : ""}
                  required
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center">
                  Street Address
                  <RequiredIndicator />
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="123 Main St"
                  className={errors.address ? "border-red-500" : ""}
                  required
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center">
                    City
                    <RequiredIndicator />
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="City"
                    className={errors.city ? "border-red-500" : ""}
                    required
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="flex items-center">
                    State
                    <RequiredIndicator />
                  </Label>
                  <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                    <SelectTrigger id="state" className={errors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="HI">Hawaii</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="IA">Iowa</SelectItem>
                      <SelectItem value="KS">Kansas</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                      <SelectItem value="LA">Louisiana</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="MN">Minnesota</SelectItem>
                      <SelectItem value="MS">Mississippi</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="NM">New Mexico</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="ND">North Dakota</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="OK">Oklahoma</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="SC">South Carolina</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="WV">West Virginia</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                      <SelectItem value="DC">District of Columbia</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip" className="flex items-center">
                  ZIP Code
                  <RequiredIndicator />
                </Label>
                <Input
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleChange("zip", e.target.value)}
                  placeholder="12345"
                  className={errors.zip ? "border-red-500" : ""}
                  required
                />
                {errors.zip && <p className="text-sm text-red-500">{errors.zip}</p>}
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
                <Label className="flex items-center">
                  Property Type
                  <RequiredIndicator />
                </Label>
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
                <Label className="flex items-center">
                  Primary Service Type
                  <RequiredIndicator />
                </Label>
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
                    <Label htmlFor="damageExtent" className="flex items-center">
                      Extent of Damage
                      <RequiredIndicator />
                    </Label>
                    <Select
                      value={formData.damageExtent}
                      onValueChange={(value) => handleChange("damageExtent", value)}
                    >
                      <SelectTrigger id="damageExtent" className={errors.damageExtent ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select damage extent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Minor - Small area affected</SelectItem>
                        <SelectItem value="moderate">Moderate - Multiple areas affected</SelectItem>
                        <SelectItem value="severe">Severe - Extensive damage</SelectItem>
                        <SelectItem value="critical">Critical - Entire property affected</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.damageExtent && <p className="text-sm text-red-500">{errors.damageExtent}</p>}
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
                <Label htmlFor="urgencyLevel" className="flex items-center">
                  Urgency Level
                  <RequiredIndicator />
                </Label>
                <Select value={formData.urgencyLevel} onValueChange={(value) => handleChange("urgencyLevel", value)}>
                  <SelectTrigger id="urgencyLevel" className={errors.urgencyLevel ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency - Need service immediately</SelectItem>
                    <SelectItem value="urgent">Urgent - Need service within 24 hours</SelectItem>
                    <SelectItem value="standard">Standard - Within the next few days</SelectItem>
                    <SelectItem value="flexible">Flexible - Anytime in the next 2 weeks</SelectItem>
                  </SelectContent>
                </Select>
                {errors.urgencyLevel && <p className="text-sm text-red-500">{errors.urgencyLevel}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center">
                  How would you prefer to be contacted?
                  <RequiredIndicator />
                </Label>
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
                {errors.contactPreference && <p className="text-sm text-red-500">{errors.contactPreference}</p>}
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
                  className={errors.agreeToTerms ? "border-red-500 data-[state=checked]:bg-red-500" : ""}
                  required
                />
                <Label htmlFor="terms" className="text-sm flex items-center">
                  I agree to the terms and conditions and privacy policy
                  <RequiredIndicator />
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
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

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-4 flex items-start gap-2 text-sm">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-blue-700 dark:text-blue-300">
              Fields marked with a <span className="text-red-500">*</span> are required.
            </p>
          </div>

          <ScrollArea className={isDesktop ? "h-[calc(100vh-340px)]" : "h-[calc(100vh-320px)]"} type="always">
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

  if (showConfirmation) {
    return (
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Your Custom Quote Request
            </DialogTitle>
            <DialogDescription>
              Your request has been prepared. You can send it directly to our team or copy the details.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 mb-6">
            <div
              className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border text-sm font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto"
              ref={messageRef}
            >
              {formattedMessage}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleCopyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button className="flex items-center gap-2" onClick={handleSendEmail}>
              <Mail className="h-4 w-4" />
              Send Email to custom@smileybrooms.com
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

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
