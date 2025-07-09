"use client"
export const dynamic = "force-dynamic"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"
import AccessibilityToolbar from "@/components/accessibility-toolbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Briefcase, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

// Position-specific questions
const positionQuestions = {
  "professional-cleaner": [
    {
      id: "cleaning_experience",
      label: "Do you have previous cleaning experience?",
      type: "select",
      options: ["Yes, professional", "Yes, personal", "No"],
    },
    {
      id: "availability",
      label: "What is your availability?",
      type: "select",
      options: ["Weekdays", "Weekends", "Evenings", "Flexible"],
    },
    {
      id: "transportation",
      label: "Do you have reliable transportation?",
      type: "select",
      options: ["Yes", "No"],
    },
    {
      id: "lifting",
      label: "Are you comfortable lifting up to 25 pounds?",
      type: "select",
      options: ["Yes", "No", "With accommodation"],
    },
  ],
  "team-lead": [
    {
      id: "management_experience",
      label: "How many years of management experience do you have?",
      type: "select",
      options: ["None", "Less than 1 year", "1-3 years", "3-5 years", "5+ years"],
    },
    {
      id: "team_size",
      label: "What is the largest team you've managed?",
      type: "select",
      options: ["1-3 people", "4-6 people", "7-10 people", "10+ people"],
    },
    {
      id: "conflict_resolution",
      label: "Describe your approach to conflict resolution",
      type: "textarea",
    },
    {
      id: "quality_control",
      label: "How do you ensure quality standards are met?",
      type: "textarea",
    },
  ],
  "customer-service-representative": [
    {
      id: "customer_service_experience",
      label: "How many years of customer service experience do you have?",
      type: "select",
      options: ["None", "Less than 1 year", "1-3 years", "3-5 years", "5+ years"],
    },
    {
      id: "communication_skills",
      label: "Rate your written communication skills",
      type: "select",
      options: ["Beginner", "Intermediate", "Advanced", "Expert"],
    },
    {
      id: "software_experience",
      label: "What scheduling or CRM software have you used?",
      type: "textarea",
    },
    {
      id: "difficult_customer",
      label: "Describe how you handled a difficult customer situation",
      type: "textarea",
    },
  ],
  "operations-manager": [
    {
      id: "operations_experience",
      label: "How many years of operations management experience do you have?",
      type: "select",
      options: ["None", "Less than 1 year", "1-3 years", "3-5 years", "5+ years"],
    },
    {
      id: "budget_management",
      label: "Have you managed operational budgets?",
      type: "select",
      options: ["Yes, under $100K", "Yes, $100K-$500K", "Yes, $500K+", "No"],
    },
    {
      id: "process_improvement",
      label: "Describe a process improvement you implemented",
      type: "textarea",
    },
    {
      id: "leadership_style",
      label: "What is your leadership philosophy?",
      type: "textarea",
    },
  ],
}

// Position titles mapping
const positionTitles = {
  "professional-cleaner": "Professional Cleaner",
  "team-lead": "Team Lead",
  "customer-service-representative": "Customer Service Representative",
  "operations-manager": "Operations Manager",
}

export default function CareerApplicationPage({ params }: { params: { position: string } }) {
  const position = params.position
  const positionTitle = positionTitles[position as keyof typeof positionTitles] || "Unknown Position"
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resumeText: "",
    resumeFile: null as File | null,
    coverLetter: "",
    experience: "",
    agreeToTerms: false,
  })

  const [positionAnswers, setPositionAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePositionQuestionChange = (id: string, value: string) => {
    setPositionAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resumeFile: e.target.files![0] }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Google Sheets integration
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

      // Calculate experience level based on years
      const getExperienceLevel = (years: string) => {
        switch (years) {
          case "0-1":
            return "Entry Level"
          case "1-3":
            return "Junior"
          case "3-5":
            return "Mid-Level"
          case "5+":
            return "Senior"
          default:
            return "Not Specified"
        }
      }

      // Extract key skills from resume and cover letter
      const extractSkills = (text: string) => {
        const skillKeywords = [
          "cleaning",
          "customer service",
          "management",
          "attention to detail",
          "organization",
          "leadership",
          "communication",
          "sales",
          "marketing",
        ]
        const foundSkills = skillKeywords.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()))
        return foundSkills.length > 0 ? foundSkills.join(", ") : "None identified"
      }

      const combinedText = `${formData.resumeText} ${formData.coverLetter}`
      const extractedSkills = extractSkills(combinedText)
      const experienceLevel = getExperienceLevel(formData.experience)

      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `🟡 Job Application: Position - ${positionTitle}. Experience: ${formData.experience}. Resume Summary: ${formData.resumeText.substring(0, 100)}...`,
        source: "Careers Application",
        meta: {
          formType: "career",
          submitDate: new Date().toISOString(),
          browser: navigator.userAgent,
          page: window.location.pathname,
          referrer: document.referrer || "direct",
          device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
          consent: formData.agreeToTerms,
        },
        data: {
          position: positionTitle,
          experienceYears: formData.experience,
          experienceLevel: experienceLevel,
          resumeText: formData.resumeText,
          coverLetter: formData.coverLetter,
          identifiedSkills: extractedSkills,
          applicationSource: "website",
          hasRelevantExperience:
            combinedText.toLowerCase().includes("cleaning") || combinedText.toLowerCase().includes("customer service"),
          positionAnswers: positionAnswers,
          hasResumeFile: formData.resumeFile ? true : false,
        },
      }

      // Submit to the Google Sheet
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      // Handle file upload separately if needed
      if (formData.resumeFile) {
        // In a real implementation, you would upload the file to a storage service
        console.log("Would upload file:", formData.resumeFile.name)
      }

      toast({
        title: "Application submitted!",
        description: "Thank you for your application. We'll review it and contact you soon!",
      })

      // Redirect back to careers page
      setTimeout(() => {
        router.push("/careers")
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get questions for this position
  const questions = positionQuestions[position as keyof typeof positionQuestions] || []

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Apply for {positionTitle}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join our team and help us deliver exceptional cleaning services to our customers.
            </p>
          </div>
        </div>

        {/* Job Application Form */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Application Form: {positionTitle}
                </CardTitle>
                <CardDescription>Fill out the form below to apply for this position at Smiley Brooms</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => handleSelectChange("experience", value)}
                    >
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select your experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Position-specific questions */}
                  {questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label htmlFor={question.id}>{question.label}</Label>
                      {question.type === "select" ? (
                        <Select
                          value={positionAnswers[question.id] || ""}
                          onValueChange={(value) => handlePositionQuestionChange(question.id, value)}
                        >
                          <SelectTrigger id={question.id}>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Textarea
                          id={question.id}
                          value={positionAnswers[question.id] || ""}
                          onChange={(e) => handlePositionQuestionChange(question.id, e.target.value)}
                          placeholder="Your answer"
                          rows={3}
                        />
                      )}
                    </div>
                  ))}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="resumeFile">Resume</Label>
                      <div className="text-sm text-gray-500">Upload your resume or paste it in the text area below</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label
                          htmlFor="resumeFile"
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 px-3 py-4 text-center hover:border-primary"
                        >
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.resumeFile ? formData.resumeFile.name : "Click to upload resume"}
                          </span>
                          <input
                            id="resumeFile"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="resumeText">Or paste your resume here</Label>
                      <Textarea
                        id="resumeText"
                        name="resumeText"
                        value={formData.resumeText}
                        onChange={handleInputChange}
                        placeholder="Paste your resume or summarize your qualifications here"
                        rows={5}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {!formData.resumeFile && !formData.resumeText
                          ? "Either upload a file or paste your resume text"
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      placeholder="Tell us why you're interested in this position and why you'd be a great fit"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleCheckboxChange("agreeToTerms", checked as boolean)}
                      required
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I understand and agree that the information provided will be used for hiring purposes
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <AccessibilityToolbar />
      <Footer />
    </div>
  )
}
