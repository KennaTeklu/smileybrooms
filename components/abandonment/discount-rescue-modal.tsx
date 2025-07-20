"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DiscountRescueModalProps {
  isOpen: boolean
  onClose: () => void
  discount: {
    percentage: number
    code: string
  }
  onApplyDiscount: (code: string) => void
  onContinueBooking: () => void
}

export function DiscountRescueModal({
  isOpen,
  onClose,
  discount,
  onApplyDiscount,
  onContinueBooking,
}: DiscountRescueModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(discount.code)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Discount code copied to clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-700 dark:text-purple-300">
            Don't Leave Yet!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400 mt-2">
            We noticed you're about to leave. Here's a special offer just for you!
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 text-center">
          <p className="text-5xl font-extrabold text-purple-800 dark:text-purple-200">{discount.percentage}% OFF</p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">Your entire booking!</p>
          <div className="mt-6">
            <Label htmlFor="discount-code" className="sr-only">
              Discount Code
            </Label>
            <div className="flex items-center justify-center space-x-2">
              <Input
                id="discount-code"
                type="text"
                value={discount.code}
                readOnly
                className="w-48 text-center font-mono text-lg border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800 bg-transparent"
                aria-label="Copy discount code"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              onApplyDiscount(discount.code)
              onClose()
            }}
            className="w-full bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            Apply Discount & Continue
          </Button>
          <Button
            variant="ghost"
            onClick={onContinueBooking}
            className="w-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            No Thanks, Continue Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
