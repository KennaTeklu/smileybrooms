"use client"
export const dynamic = "force-dynamic"

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
  discountPercentage: number
  onEmailCapture?: (email: string) => void
}

export function DiscountRescueModal({ isOpen, onClose, discountPercentage, onEmailCapture }: DiscountRescueModalProps) {
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

    // Apply discount to localStorage
    localStorage.setItem("appliedDiscount", discountPercentage.toString())

    // Redirect to cart
    router.push("/cart")
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
          <DialogTitle className="text-2xl font-bold text-center">Wait! Special Offer Just For You</DialogTitle>
          <DialogDescription className="text-center pt-2">
            <span className="block text-3xl font-bold text-green-600">{discountPercentage}% OFF</span>
            <span className="block mt-2">Complete your booking now and save!</span>
            <div className="mt-4 text-amber-600 font-semibold">Offer expires in: {formatTime(countdown)}</div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-gray-500">Enter your email to claim this exclusive discount:</p>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-3"
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto w-full order-2 sm:order-1">
            No thanks
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="sm:w-auto w-full order-1 sm:order-2 bg-green-600 hover:bg-green-700"
          >
            Claim {discountPercentage}% Discount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
