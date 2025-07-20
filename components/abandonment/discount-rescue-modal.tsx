"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Gift } from "lucide-react"
import { useState } from "react"

interface DiscountRescueModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyDiscount: (code: string) => void
  discountPercentage: number
}

export function DiscountRescueModal({
  isOpen,
  onClose,
  onApplyDiscount,
  discountPercentage,
}: DiscountRescueModalProps) {
  const [discountCode, setDiscountCode] = useState("")

  const handleApply = () => {
    onApplyDiscount(discountCode)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-purple-200 dark:border-gray-700 rounded-xl shadow-lg">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Gift className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-bounce" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Don't Leave Empty-Handed!
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
            We noticed you're about to leave. Here's a special offer just for you!
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 text-center">
          <p className="text-5xl font-extrabold text-purple-700 dark:text-purple-300 mb-4">{discountPercentage}% OFF</p>
          <p className="text-lg text-gray-700 dark:text-gray-200 font-semibold">Your Entire Booking!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Use code:{" "}
            <span className="font-mono font-bold text-purple-600 dark:text-purple-400">SAVE{discountPercentage}</span>
          </p>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discountCode" className="text-right text-gray-700 dark:text-gray-300">
              Code
            </Label>
            <Input
              id="discountCode"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="col-span-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              placeholder={`SAVE${discountPercentage}`}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row-reverse sm:justify-between gap-3 mt-4">
          <Button
            type="submit"
            onClick={handleApply}
            className="w-full sm:w-auto bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-all duration-200"
          >
            <Sparkles className="h-4 w-4 mr-2" /> Apply Discount
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
          >
            No Thanks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
