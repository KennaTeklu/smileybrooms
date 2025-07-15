"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Gift } from "lucide-react"

interface DiscountRescueModalProps {
  onClose: () => void
  onAccept: () => void
}

export default function DiscountRescueModal({ onClose, onAccept }: DiscountRescueModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader className="flex flex-col items-center text-center">
          <Gift className="h-12 w-12 text-green-500 mb-4" />
          <DialogTitle className="text-2xl font-bold">Don't Leave Empty-Handed!</DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            We'd love to help you get your home sparkling clean. Here's a special offer just for you!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-center text-3xl font-extrabold text-green-600">10% OFF Your Entire Order!</div>
          <p className="text-sm text-muted-foreground text-center">
            Apply this discount now and complete your booking.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            No, thanks
          </Button>
          <Button onClick={onAccept} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
            Claim Discount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
