"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface DiscountRescueModalProps {
  isOpen: boolean
  onClose: () => void
  onEmailCapture?: (email: string) => void
}

export function DiscountRescueModal({ isOpen, onClose, onEmailCapture }: DiscountRescueModalProps) {
  const [email, setEmail] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes in seconds
  const router = useRouter()

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isOpen) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isOpen])

  useEffect(() => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValid(emailRegex.test(email))
  }, [email])

  const handleSubmit = () => {
    if (isValid && onEmailCapture) {
      onEmailCapture(email)
    }

    // Redirect to cart or a support page
    router.push("/contact") // Redirect to contact page for help
    onClose()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Wait! Need Assistance?</DialogTitle>
          <DialogDescription className="text-center pt-2">
            <span className="block text-xl font-bold text-gray-800">We're here to help you complete your booking!</span>
            <span className="block mt-2">Let us know how we can assist you.</span>
            <div className="mt-4 text-amber-600 font-semibold">
              Offer for immediate help expires in: {formatTime(countdown)}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-gray-500">Enter your email so we can reach out and help:</p>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-3"
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="sm:w-auto w-full order-2 sm:order-1 bg-transparent"
          >
            No thanks
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="sm:w-auto w-full order-1 sm:order-2 bg-blue-600 hover:bg-blue-700"
          >
            Get Help Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
