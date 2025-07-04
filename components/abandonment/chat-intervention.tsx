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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Send } from "lucide-react"
import { useState } from "react"

interface ChatInterventionProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatIntervention({ isOpen, onClose }: ChatInterventionProps) {
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your message and email address.",
        variant: "destructive",
      })
      return
    }

    // Simulate sending message to support
    console.log("Chat message sent:", { email, message })
    toast({
      title: "Message Sent!",
      description: "Our support team will get back to you shortly.",
      variant: "success",
    })
    setMessage("")
    setEmail("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Need Help? Chat with Us!
          </DialogTitle>
          <DialogDescription>
            It looks like you've been inactive for a while. How can we assist you today?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us how we can help..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
