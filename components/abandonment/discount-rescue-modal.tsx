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
import { Gift, X } from "lucide-react"

interface DiscountRescueModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyDiscount: () => void
}

export function DiscountRescueModal({ isOpen, onClose, onApplyDiscount }: DiscountRescueModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 text-center">
        <DialogHeader className="flex flex-col items-center">
          <Gift className="h-16 w-16 text-green-500 mb-4 animate-bounce" />
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Don't Leave Empty-Handed!
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
            We noticed you're about to leave. Here's a special offer to make your day brighter!
          </DialogDescription>
        </DialogHeader>
        <div className="my-6">
          <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">15% OFF</p>
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Your Entire Order!</p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            No, Thanks
          </Button>
          <Button onClick={onApplyDiscount} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
            <Gift className="h-4 w-4 mr-2" /> Claim Discount
          </Button>
        </DialogFooter>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
      </DialogContent>
    </Dialog>
  )
}
