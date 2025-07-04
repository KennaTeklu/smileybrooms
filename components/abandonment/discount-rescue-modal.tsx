"use client"

import type React from "react"

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
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Gift, Percent } from "lucide-react"
import { useState } from "react"

interface DiscountRescueModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DiscountRescueModal({ isOpen, onClose }: DiscountRescueModalProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")

  const handleClaimDiscount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email to claim the discount.",
        variant: "destructive",
      })
      return
    }

    // Simulate sending discount code
    console.log("Discount claimed by:", email)
    toast({
      title: "Discount Sent!",
      description: "A special discount code has been sent to your email. Check your inbox!",
      variant: "success",
    })
    setEmail("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Wait! Don't Go Yet!
          </DialogTitle>
          <DialogDescription>We noticed you're about to leave. Here's a special offer just for you!</DialogDescription>
        </DialogHeader>
        <div className="text-center py-4">
          <Percent className="h-20 w-20 mx-auto text-green-500 animate-bounce" />
          <h3 className="text-3xl font-bold text-green-600 mt-2">GET 15% OFF</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Your next cleaning service!</p>
        </div>
        <form onSubmit={handleClaimDiscount} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Enter your email to claim your discount:</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleClaimDiscount}>
            Claim My Discount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
