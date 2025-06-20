"use client"

import type React from "react"

import { useState } from "react"
import { X, MessageSquare, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export default function QuestionBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [question, setQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsExpanded(false)
    }
  }

  const expandForm = () => {
    setIsExpanded(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter your question",
        variant: "destructive",
      })
      return
    }

    if (isExpanded) {
      if (!name.trim()) {
        toast({
          title: "Name required",
          description: "Please enter your name",
          variant: "destructive",
        })
        return
      }

      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({
          title: "Valid email required",
          description: "Please enter a valid email address",
          variant: "destructive",
        })
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Google Sheets integration
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxSSfjUlwZ97Y0iQnagSRH7VxMz-oRSSvQ0bXU5Le1abfULTngJ_BFAQg7c4428DmaK/exec"

      const formData = {
        name: name || "Anonymous User",
        email: email || "not provided",
        message: `❓ Question: ${question}`,
        fullMessage: question,
        source: "Question Box",
        meta: {
          formType: "question",
          submitDate: new Date().toISOString(),
          browser: navigator.userAgent,
          page: window.location.pathname,
          referrer: document.referrer || "direct",
          device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
        },
        data: {
          isExpanded: isExpanded,
          questionLength: question.length,
          priority: "high", // Questions get high priority
          responseNeeded: true,
        },
      }

      // Submit form data to Google Sheets
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      toast({
        title: "Question sent!",
        description: "We'll get back to you as soon as possible.",
      })

      // Reset form
      setName("")
      setEmail("")
      setQuestion("")
      setIsExpanded(false)
      setIsOpen(false)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Something went wrong",
        description: "There was an error sending your question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 rounded-lg border bg-background shadow-lg animate-in slide-in-from-bottom-10 duration-300">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="font-semibold">Ask a Question</h3>
            <Button variant="ghost" size="icon" onClick={toggleOpen} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="space-y-4">
              {isExpanded && (
                <>
                  <div className="space-y-2">
                    <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Textarea
                  placeholder="Type your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="resize-none"
                  onFocus={expandForm}
                />
              </div>

              <div className="flex justify-between items-center">
                {!isExpanded && (
                  <Button type="button" variant="ghost" size="sm" onClick={expandForm}>
                    Add contact info
                  </Button>
                )}
                <Button type="submit" className={cn("ml-auto", isExpanded ? "w-full" : "")} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Question
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      <Button onClick={toggleOpen} size="lg" className="rounded-full h-14 w-14 shadow-lg" aria-label="Ask a question">
        <MessageSquare className={cn("h-6 w-6", isOpen ? "hidden" : "animate-bounce")} />
      </Button>
    </div>
  )
}
