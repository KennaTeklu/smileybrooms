"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X, ChevronLeft, ChevronRight, Calculator, MessageSquare, User, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CustomQuoteWizardProps {
  isOpen: boolean
  onClose: () => void
}

type QuoteStep = "service-type" | "special-requests" | "contact-info" | "review"

const STEP_TITLES = {
  "service-type": "Service Type",
  "special-requests": "Special Requests",
  "contact-info": "Contact Information",
  review: "Review & Submit",
}

const STEP_DESCRIPTIONS = {
  "service-type": "Select your cleaning service type",
  "special-requests": "Add any special requirements",
  "contact-info": "Provide your contact details",
  review: "Review and submit your quote request",
}

const STEP_ICONS = {
  "service-type": Calculator,
  "special-requests": MessageSquare,
  "contact-info": User,
  review: FileText,
}

export function CustomQuoteWizard({ isOpen, onClose }: CustomQuoteWizardProps) {
  const [currentStep, setCurrentStep] = useState<QuoteStep>("service-type")
  const [formData, setFormData] = useState({
    serviceType: "",
    propertyType: "",
    squareFootage: "",
    frequency: "",
    specialRequests: [] as string[],
    customRequest: "",
    urgency: "",
    budget: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    preferredContact: "",
    additionalNotes: "",
  })

  const { toast } = useToast()

  // Auto-scroll to sidebar when opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the sidebar is rendered
      setTimeout(() => {
        // Scroll the sidebar into view smoothly
        const sidebar = document.querySelector('[data-sidebar="custom-quote"]')
        if (sidebar) {
          sidebar.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          })
        }

        // Also scroll the page to bring focus to the right side
        window.scrollTo({
          left: window.innerWidth * 0.3, // Scroll right to show sidebar better
          behavior: "smooth",
        })
      }, 100)
    }
  }, [isOpen])

  // Steps configuration
  const steps: QuoteStep[] = ["service-type", "special-requests", "contact-info", "review"]
  const currentStepIndex = steps.indexOf(currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (!isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1])
    }
  }, [currentStepIndex, isLastStep, steps])

  const goToPreviousStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1])
    }
  }, [currentStepIndex, isFirstStep, steps])

  // Form handlers
  const updateFormData = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleSpecialRequest = useCallback((request: string) => {
    setFormData((prev) => ({
      ...prev,
      specialRequests: prev.specialRequests.includes(request)
        ? prev.specialRequests.filter((r) => r !== request)
        : [...prev.specialRequests, request],
    }))
  }, [])

  const handleSubmitQuote = useCallback(() => {
    try {
      // Create quote request object
      const quoteRequest = {
        id: `quote-${Date.now()}`,
        timestamp: new Date().toISOString(),
        serviceType: formData.serviceType,
        propertyType: formData.propertyType,
        squareFootage: formData.squareFootage,
        frequency: formData.frequency,
        specialRequests: formData.specialRequests,
        customRequest: formData.customRequest,
        urgency: formData.urgency,
        budget: formData.budget,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          preferredContact: formData.preferredContact,
        },
        additionalNotes: formData.additionalNotes,
      }

      // Submit to Google Sheets (using existing waitlist endpoint)
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

      const submitData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: `Custom Quote Request:
Service Type: ${formData.serviceType}
Property Type: ${formData.propertyType}
Square Footage: ${formData.squareFootage}
Frequency: ${formData.frequency}
Special Requests: ${formData.specialRequests.join(", ")}
Custom Request: ${formData.customRequest}
Urgency: ${formData.urgency}
Budget: ${formData.budget}
Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}
Preferred Contact: ${formData.preferredContact}
Additional Notes: ${formData.additionalNotes}`,
        source: "Custom Quote Request",
      }

      fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      }).catch((error) => {
        console.error("Error submitting quote request:", error)
      })

      toast({
        title: "Quote Request Submitted",
        description: "We'll contact you within 24 hours with a custom quote.",
        duration: 5000,
      })

      onClose()
    } catch (error) {
      console.error("Error submitting quote:", error)
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }, [formData, toast, onClose])

  // Validation for next button
  const canProceedToNext = useCallback(() => {
    switch (currentStep) {
      case "service-type":
        return formData.serviceType && formData.propertyType
      case "special-requests":
        return true // Always can proceed
      case "contact-info":
        return formData.fullName && formData.email && formData.phone
      case "review":
        return false // Last step
      default:
        return false
    }
  }, [currentStep, formData])

  if (!isOpen) return null

  const CurrentIcon = STEP_ICONS[currentStep]

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        {/* Panel */}
        <div
          className="relative ml-auto w-full max-w-lg bg-white dark:bg-gray-900 shadow-xl flex flex-col max-h-screen"
          data-sidebar="custom-quote"
        >
          {/* Header - Fixed */}
          <div className="flex-shrink-0 border-b p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CurrentIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-semibold">{STEP_TITLES[currentStep]}</h2>
                  <p className="text-sm text-gray-500">{STEP_DESCRIPTIONS[currentStep]}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    index <= currentStepIndex ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Step {currentStepIndex + 1}</span>
              <span>{steps.length} steps</span>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {currentStep === "service-type" && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => updateFormData("serviceType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential Cleaning</SelectItem>
                      <SelectItem value="commercial">Commercial Cleaning</SelectItem>
                      <SelectItem value="deep-clean">Deep Cleaning</SelectItem>
                      <SelectItem value="move-in-out">Move In/Out Cleaning</SelectItem>
                      <SelectItem value="post-construction">Post-Construction Cleanup</SelectItem>
                      <SelectItem value="carpet-cleaning">Carpet Cleaning</SelectItem>
                      <SelectItem value="window-cleaning">Window Cleaning</SelectItem>
                      <SelectItem value="pressure-washing">Pressure Washing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => updateFormData("propertyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="retail">Retail Space</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="medical">Medical Facility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <Select
                    value={formData.squareFootage}
                    onValueChange={(value) => updateFormData("squareFootage", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select square footage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-1000">Under 1,000 sq ft</SelectItem>
                      <SelectItem value="1000-2000">1,000 - 2,000 sq ft</SelectItem>
                      <SelectItem value="2000-3000">2,000 - 3,000 sq ft</SelectItem>
                      <SelectItem value="3000-5000">3,000 - 5,000 sq ft</SelectItem>
                      <SelectItem value="over-5000">Over 5,000 sq ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="frequency">Cleaning Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => updateFormData("frequency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === "special-requests" && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Special Requests</Label>
                  <p className="text-sm text-gray-500 mb-4">Select any additional services you need</p>
                  <div className="space-y-3">
                    {[
                      "Pet-friendly cleaning products",
                      "Eco-friendly/green cleaning",
                      "Inside oven cleaning",
                      "Inside refrigerator cleaning",
                      "Inside cabinet cleaning",
                      "Garage cleaning",
                      "Basement cleaning",
                      "Attic cleaning",
                      "Window cleaning (interior)",
                      "Window cleaning (exterior)",
                      "Carpet steam cleaning",
                      "Upholstery cleaning",
                      "Tile and grout cleaning",
                      "Hardwood floor polishing",
                      "Organizing services",
                    ].map((request) => (
                      <div key={request} className="flex items-center space-x-2">
                        <Checkbox
                          id={request}
                          checked={formData.specialRequests.includes(request)}
                          onCheckedChange={() => toggleSpecialRequest(request)}
                        />
                        <Label htmlFor={request} className="text-sm">
                          {request}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="customRequest">Custom Request</Label>
                  <Textarea
                    id="customRequest"
                    placeholder="Describe any specific cleaning needs or requirements..."
                    value={formData.customRequest}
                    onChange={(e) => updateFormData("customRequest", e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select value={formData.urgency} onValueChange={(value) => updateFormData("urgency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When do you need this service?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP (within 24 hours)</SelectItem>
                      <SelectItem value="this-week">This week</SelectItem>
                      <SelectItem value="next-week">Next week</SelectItem>
                      <SelectItem value="this-month">This month</SelectItem>
                      <SelectItem value="flexible">Flexible timing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={formData.budget} onValueChange={(value) => updateFormData("budget", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-200">Under $200</SelectItem>
                      <SelectItem value="200-500">$200 - $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                      <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                      <SelectItem value="over-2000">Over $2,000</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === "contact-info" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={(e) => updateFormData("zipCode", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                    <Select
                      value={formData.preferredContact}
                      onValueChange={(value) => updateFormData("preferredContact", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How would you like us to contact you?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="text">Text Message</SelectItem>
                        <SelectItem value="any">Any method</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quote Request Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Service Type:</span>
                        <p>{formData.serviceType}</p>
                      </div>
                      <div>
                        <span className="font-medium">Property Type:</span>
                        <p>{formData.propertyType}</p>
                      </div>
                      <div>
                        <span className="font-medium">Square Footage:</span>
                        <p>{formData.squareFootage || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span>
                        <p>{formData.frequency || "Not specified"}</p>
                      </div>
                    </div>

                    {formData.specialRequests.length > 0 && (
                      <div>
                        <span className="font-medium">Special Requests:</span>
                        <ul className="list-disc list-inside text-sm mt-1">
                          {formData.specialRequests.map((request, index) => (
                            <li key={index}>{request}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {formData.customRequest && (
                      <div>
                        <span className="font-medium">Custom Request:</span>
                        <p className="text-sm">{formData.customRequest}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Urgency:</span>
                        <p>{formData.urgency || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span>
                        <p>{formData.budget || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <span className="font-medium">Contact Information:</span>
                      <div className="text-sm mt-2">
                        <p>{formData.fullName}</p>
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                        {formData.address && (
                          <p>
                            {formData.address}
                            {formData.city && `, ${formData.city}`}
                            {formData.state && `, ${formData.state}`}
                            {formData.zipCode && ` ${formData.zipCode}`}
                          </p>
                        )}
                        {formData.preferredContact && <p>Preferred contact: {formData.preferredContact}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Next Steps:</strong> We'll review your request and contact you within 24 hours with a
                    detailed quote. Our team will work with you to create a customized cleaning plan that meets your
                    specific needs and budget.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 border-t bg-white dark:bg-gray-900 p-4">
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button variant="outline" onClick={goToPreviousStep} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}

              {isLastStep ? (
                <Button onClick={handleSubmitQuote} className="flex-1">
                  Submit Quote Request
                </Button>
              ) : (
                <Button onClick={goToNextStep} className="flex-1" disabled={!canProceedToNext()}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
