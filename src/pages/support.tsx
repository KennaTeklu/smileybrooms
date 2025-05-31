"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Siren, MessageSquareText } from "lucide-react"

export default function SupportPage() {
  const [issueDescription, setIssueDescription] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleEmergencySOS = async () => {
    if (!confirm("Are you sure you want to send an emergency SOS? This will alert dispatch immediately.")) {
      return
    }
    setSubmitting(true)
    setMessage("")
    try {
      // Simulate API call to an emergency endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setMessage("Emergency SOS sent! Help is on the way.")
    } catch (error) {
      setMessage("Failed to send SOS. Please try again or call directly.")
      console.error("SOS error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleIssueReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")
    try {
      // Simulate API call to an issue reporting endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setMessage("Issue reported successfully! We will get back to you shortly.")
      setIssueDescription("")
      setContactEmail("")
    } catch (error) {
      setMessage("Failed to report issue. Please try again.")
      console.error("Issue report error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Support Center</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Siren className="h-5 w-5 text-red-500" /> Emergency SOS
            </CardTitle>
            <CardDescription>
              Use this button only in critical situations requiring immediate assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleEmergencySOS} disabled={submitting} className="w-full bg-red-600 hover:bg-red-700">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Send Emergency SOS
            </Button>
            {message && message.includes("SOS") && (
              <p className={`mt-2 text-center ${message.includes("sent") ? "text-green-500" : "text-red-500"}`}>
                {message}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5" /> Report an Issue
            </CardTitle>
            <CardDescription>Describe any non-emergency issues you are experiencing.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIssueReport} className="space-y-4">
              <div>
                <Label htmlFor="issueDescription">Issue Description</Label>
                <Textarea
                  id="issueDescription"
                  placeholder="Describe the issue in detail..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  required
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Report
              </Button>
              {message && !message.includes("SOS") && (
                <p
                  className={`mt-2 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}
                >
                  {message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
