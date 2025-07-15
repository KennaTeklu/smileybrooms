"use client"

import Link from "next/link"

import { Separator } from "@/components/ui/separator"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Mail, Home, MessageSquare, CheckCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { sendCustomQuoteRequest } from "@/lib/custom-quote-email-utils" // Assuming this server action exists

interface FormData {
  name: string
  email: string
  phone: string
  propertyType: string
  bedrooms: number | ""
  bathrooms: number | ""
  squareFootage: number | ""
  serviceType: string
  preferredDate: string
  message: string
}

type Step = "contact" | "property" | "service" | "review" | "success"

export default function CustomQuoteWizard() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<Step>("contact")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    serviceType: "",
    preferredDate: "",
    message: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const stepsOrder: Step[] = ["contact", "property", "service", "review", "success"]
  const currentStepIndex = stepsOrder.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / (stepsOrder.length - 1)) * 100 // Exclude success from progress bar

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (step: Step): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    let isValid = true

    if (step === "contact") {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required"
        isValid = false
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format"
        isValid = false
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required"
        isValid = false
      } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number"
        isValid = false
      }
    } else if (step === "property") {
      if (!formData.propertyType) {
        newErrors.propertyType = "Property type is required"
        isValid = false
      }
      if (formData.propertyType === "residential") {
        if (formData.bedrooms === "" || formData.bedrooms < 0) {
          newErrors.bedrooms = "Number of bedrooms is required"
          isValid = false
        }
        if (formData.bathrooms === "" || formData.bathrooms < 0) {
          newErrors.bathrooms = "Number of bathrooms is required"
          isValid = false
        }
      }
      if (formData.squareFootage === "" || formData.squareFootage <= 0) {
        newErrors.squareFootage = "Square footage is required and must be greater than 0"
        isValid = false
      }
    } else if (step === "service") {
      if (!formData.serviceType) {
        newErrors.serviceType = "Service type is required"
        isValid = false
      }
      if (!formData.preferredDate) {
        newErrors.preferredDate = "Preferred date is required"
        isValid = false
      }
    }
    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextIndex = currentStepIndex + 1
      if (nextIndex < stepsOrder.length) {
        setCurrentStep(stepsOrder[nextIndex])
      }
    } else {
      toast({
        title: "Please correct the errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      })
    }
  }

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(stepsOrder[prevIndex])
    }
  }

  const handleSubmitQuote = async () => {
    if (validateStep("review")) {
      // Validate all fields one last time
      setIsSubmitting(true)
      try {
        const result = await sendCustomQuoteRequest(formData)
        if (result.success) {
          toast({
            title: "Quote Request Sent!",
            description: "We've received your request and will get back to you shortly.",
            variant: "success",
          })
          setCurrentStep("success")
        } else {
          toast({
            title: "Submission Failed",
            description: result.error || "An error occurred. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error submitting quote:", error)
        toast({
          title: "Submission Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      toast({
        title: "Please review your information",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case "contact":
        return (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Your Contact Information
              </CardTitle>
              <CardDescription>Tell us how to reach you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )
      case "property":
        return (
          <motion.div
            key="property"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Details
              </CardTitle>
              <CardDescription>Tell us about the property to be cleaned.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="propertyType">Property Type</Label>
                <Select value={formData.propertyType} onValueChange={(value) => handleChange("propertyType", value)}>
                  <SelectTrigger className={errors.propertyType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
              </div>
              {formData.propertyType === "residential" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleChange("bedrooms", Number.parseInt(e.target.value) || "")}
                      className={errors.bedrooms ? "border-red-500" : ""}
                    />
                    {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleChange("bathrooms", Number.parseInt(e.target.value) || "")}
                      className={errors.bathrooms ? "border-red-500" : ""}
                    />
                    {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="squareFootage">Approx. Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) => handleChange("squareFootage", Number.parseInt(e.target.value) || "")}
                  className={errors.squareFootage ? "border-red-500" : ""}
                />
                {errors.squareFootage && <p className="text-red-500 text-sm mt-1">{errors.squareFootage}</p>}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )
      case "service":
        return (
          <motion.div
            key="service"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Service Details
              </CardTitle>
              <CardDescription>Tell us what kind of cleaning you need.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="serviceType">Type of Service</Label>
                <Select value={formData.serviceType} onValueChange={(value) => handleChange("serviceType", value)}>
                  <SelectTrigger className={errors.serviceType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Cleaning</SelectItem>
                    <SelectItem value="deep">Deep Cleaning</SelectItem>
                    <SelectItem value="move-in-out">Move-in/Move-out Cleaning</SelectItem>
                    <SelectItem value="post-construction">Post-Construction Cleaning</SelectItem>
                    <SelectItem value="custom">Custom Request</SelectItem>
                  </SelectContent>
                </Select>
                {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
              </div>
              <div>
                <Label htmlFor="preferredDate">Preferred Service Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleChange("preferredDate", e.target.value)}
                  className={errors.preferredDate ? "border-red-500" : ""}
                />
                {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
              </div>
              <div>
                <Label htmlFor="message">Additional Details / Special Instructions</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="e.g., specific areas to focus on, pet information, entry instructions"
                  rows={5}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )
      case "review":
        return (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Review Your Request
              </CardTitle>
              <CardDescription>Please review the details before submitting your quote request.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Contact Information</h3>
                <p>Name: {formData.name}</p>
                <p>Email: {formData.email}</p>
                <p>Phone: {formData.phone}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Property Details</h3>
                <p>Property Type: {formData.propertyType}</p>
                {formData.propertyType === "residential" && (
                  <>
                    <p>Bedrooms: {formData.bedrooms}</p>
                    <p>Bathrooms: {formData.bathrooms}</p>
                  </>
                )}
                <p>Approx. Square Footage: {formData.squareFootage} sq ft</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Service Details</h3>
                <p>Service Type: {formData.serviceType}</p>
                <p>Preferred Date: {formData.preferredDate}</p>
                {formData.message && <p>Instructions: {formData.message}</p>}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSubmitQuote} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )
      case "success":
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 py-12"
          >
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
            <h2 className="text-3xl font-bold">Request Submitted Successfully!</h2>
            <p className="text-lg text-muted-foreground">
              Thank you for your custom quote request. We will review your details and get back to you within 1-2
              business days.
            </p>
            <Button asChild size="lg">
              <Link href="/">Back to Home</Link>
            </Button>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="shadow-lg">
        <div className="p-6">
          <Progress value={progress} className="h-2 mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            Step {currentStepIndex + 1} of {stepsOrder.length - 1}
          </p>
        </div>
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </Card>
    </div>
  )
}
