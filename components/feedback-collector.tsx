"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon } from "lucide-react"

interface FeedbackCollectorProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (feedback: { rating: number; comment: string }) => void
}

export function FeedbackCollector({ isOpen, onClose, onSubmit }: FeedbackCollectorProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    onSubmit({ rating, comment })
    setRating(0)
    setComment("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>How was your experience with our pricing calculator?</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                <StarIcon
                  className={`h-8 w-8 ${rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Tell us what you think..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
