"use client"

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
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

interface FeedbackCollectorProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (feedback: { rating: number; comment: string }) => void
}

export function FeedbackCollector({ isOpen, onClose, onSubmit }: FeedbackCollectorProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    onSubmit({ rating, comment })
    setRating(0)
    setComment("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve our service. Please take a moment to rate your experience.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Additional comments (optional)</Label>
            <Textarea
              id="comment"
              placeholder="Tell us what you liked or how we can improve..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
