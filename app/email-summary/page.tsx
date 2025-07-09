"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ServiceEmailSummary from "@/components/service-email-summary"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EmailSummaryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    // Try to get form data from localStorage
    const storedData = localStorage.getItem("serviceFormData")
    if (storedData) {
      try {
        setFormData(JSON.parse(storedData))
      } catch (error) {
        console.error("Error parsing stored form data:", error)
      }
    }
  }, [])

  const handleClose = () => {
    // Clear the stored data
    localStorage.removeItem("serviceFormData")
    // Navigate back to calculator
    router.push("/calculator")
  }

  if (!formData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Service Data Found</h1>
        <p className="mb-8">Please complete the service calculator form to generate an email summary.</p>
        <Button onClick={() => router.push("/calculator")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go to Calculator
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={handleClose}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Calculator
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">Email Service Summary</h1>

      <ServiceEmailSummary formData={formData} onClose={handleClose} />
    </div>
  )
}
