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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { processFormSubmission } from "@/lib/form-utils"
import { cn } from "@/lib/utils"

interface FeedbackSurveyProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackSurvey({ isOpen, onClose }: FeedbackSurveyProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [comments, setComments] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === null) {
      toast({
        title: "Rating required",
        description: "Please select a star rating.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec" // Re-using the same Google Sheets script URL

      const baseData = {
        rating: rating,
        comments: comments || "No comments provided",
        email: email || "not provided",
        message: `⭐ Feedback: ${rating} stars`, // Main message for spreadsheet
      }

      const metaData = {
        formType: "feedback",
        page: window.location.pathname,
        ratingValue: rating,
        commentLength: comments.length,
      }

      await processFormSubmission(scriptURL, "feedback", baseData, metaData)

      toast({
        title: "Feedback submitted!",
        description: "Thank you for your valuable feedback.",
      })

      // Reset form and close
      setRating(null)
      setComments("")
      setEmail("")
      onClose()
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Submission failed",
        description: "There was an error sending your feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>We'd love to hear about your experience.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rating">Overall Rating</Label>
            <RadioGroup
              onValueChange={(value) => setRating(Number.parseInt(value))}
              value={rating?.toString() || ""}
              className="flex gap-1"
            >
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Label
                  key={starValue}
                  htmlFor={`star-${starValue}`}
                  className={cn(
                    "cursor-pointer text-gray-400 hover:text-yellow-500 transition-colors",
                    rating && starValue <= rating && "text-yellow-500",
                  )}
                >
                  <RadioGroupItem
                    value={starValue.toString()}
                    id={`star-${starValue}`}
                    className="sr-only" // Hide the actual radio button
                  />
                  <Star className="h-8 w-8 fill-current" />
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Tell us what you think..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Your Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
