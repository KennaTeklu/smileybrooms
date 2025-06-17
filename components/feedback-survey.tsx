"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { processFormSubmission } from "@/lib/form-utils" // Assuming this utility exists

interface FeedbackSurveyProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackSurvey({ isOpen, onClose }: FeedbackSurveyProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionStatus("idle")

    const formData = new FormData()
    formData.append("rating", rating.toString())
    formData.append("comment", comment)
    if (email) {
      formData.append("email", email)
    }
    formData.append("formType", "feedback_survey") // Identify form type for Google Sheets

    try {
      // Assuming processFormSubmission sends data to Google Sheets or similar backend
      const response = await processFormSubmission(formData)

      if (response.success) {
        setSubmissionStatus("success")
        // Optionally clear form after success
        setRating(0)
        setComment("")
        setEmail("")
        setTimeout(onClose, 2000) // Close after a short delay
      } else {
        setSubmissionStatus("error")
      }
    } catch (error) {
      console.error("Feedback submission error:", error)
      setSubmissionStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            We'd love to hear about your experience. Your feedback helps us improve!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rating">Overall Rating</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-8 w-8 cursor-pointer transition-colors",
                    rating >= star ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300",
                  )}
                  onClick={() => setRating(star)}
                  aria-label={`${star} star rating`}
                />
              ))}
            </div>
            {rating === 0 && submissionStatus === "error" && (
              <p className="text-sm text-red-500">Please provide a rating.</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comments (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Tell us what you think..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            {submissionStatus === "success" && (
              <p className="text-green-600 text-sm mr-4">Thank you for your feedback!</p>
            )}
            {submissionStatus === "error" && (
              <p className="text-red-600 text-sm mr-4">Failed to submit feedback. Please try again.</p>
            )}
            <Button type="submit" disabled={isSubmitting || rating === 0}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
