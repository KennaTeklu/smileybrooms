"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { sendEmailSummary } from "@/lib/email-actions" // Assuming this is a server action

interface EmailSummaryData {
  success: boolean
  message: string
  summary?: string
  details?: Record<string, any>
}

export default function EmailSummaryPage() {
  const searchParams = useSearchParams()
  const [summaryData, setSummaryData] = useState<EmailSummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    const dataParam = searchParams.get("data")
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam))
        setSummaryData(decodedData)
      } catch (error) {
        console.error("Failed to parse email summary data:", error)
        setSummaryData({ success: false, message: "Invalid summary data provided." })
      }
    } else {
      setSummaryData({ success: false, message: "No summary data found." })
    }
    setLoading(false)
  }, [searchParams])

  const handleSendEmail = async () => {
    if (!summaryData?.summary) {
      toast({
        title: "Error",
        description: "No summary content to send.",
        variant: "destructive",
      })
      return
    }

    setSendingEmail(true)
    try {
      const result = await sendEmailSummary(summaryData.summary)
      if (result.success) {
        toast({
          title: "Email Sent!",
          description: "Your cleaning service summary has been sent to your email.",
        })
      } else {
        toast({
          title: "Email Failed",
          description: result.message || "Could not send email summary.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending the email.",
        variant: "destructive",
      })
    } finally {
      setSendingEmail(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="ml-4 text-lg">Loading summary...</p>
      </div>
    )
  }

  if (!summaryData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">No Summary Available</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">There was an issue loading your email summary.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Cleaning Service Summary</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {summaryData.success ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                Summary Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{summaryData.message}</p>
              {summaryData.summary && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <h3 className="font-semibold mb-2">Generated Summary:</h3>
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{summaryData.summary}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {summaryData.details && (
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(summaryData.details, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSendEmail} disabled={!summaryData.summary || sendingEmail} className="w-full">
                {sendingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Summary to Email"
                )}
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => window.print()}>
                Print Summary
              </Button>
              <Button variant="link" className="w-full" onClick={() => history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
