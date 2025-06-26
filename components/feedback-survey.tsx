"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquareHeart, Loader2 } from "lucide-react"
import { processFormSubmission } from "@/lib/form-utils"

export default function FeedbackSurvey() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState<string>("")
  const [comment, setComment] = useState<string>("")
  const [suggestions, setSuggestions] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec" // Re-using the same Google Sheets endpoint

      const baseData = {
        rating: rating,
        comment: comment || "No comment provided",
        suggestions: suggestions || "No suggestions provided",
        message: `[FEEDBACK] User Feedback: Rating ${rating}/5`, // Main message for spreadsheet
      }

      const metaData = {
        formType: "feedback",
        submitDate: new Date().toISOString(),
        browser: navigator.userAgent,
        page: window.location.pathname,
        referrer: document.referrer || "direct",
        device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
      }

      const extraData = {
        ratingValue: Number.parseInt(rating),
        commentLength: comment.length,
        suggestionsLength: suggestions.length,
      }

      await processFormSubmission(scriptURL, "feedback", baseData, metaData, extraData)

      toast({
        title: "Feedback submitted!",
        description: "Thank you for your valuable feedback.",
      })

      // Reset form and close dialog
      setRating("")
      setComment("")
      setSuggestions("")
      setIsOpen(false)
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 left-6 rounded-full h-14 w-14 shadow-lg z-50"
          aria-label="Provide feedback"
        >
          <MessageSquareHeart className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rating">Overall Rating</Label>
            <RadioGroup
              id="rating"
              value={rating}
              onValueChange={setRating}
              className="flex justify-between"
              aria-label="Overall rating"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(value)} id={`rating-${value}`} />
                  <Label htmlFor={`rating-${value}`}>{value}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comments (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="What did you like or dislike?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="suggestions">Suggestions for Improvement (Optional)</Label>
            <Textarea
              id="suggestions"
              placeholder="How can we make your experience better?"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              rows={3}
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

export { FeedbackSurvey }
