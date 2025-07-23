"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatFormDataForEmail, openGmailWithFormData } from "@/lib/email-utils"
import { Mail, Copy, Check, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ServiceEmailSummaryProps {
  formData: Record<string, any>
  onClose?: () => void
  emailTo?: string
}

export default function ServiceEmailSummary({
  formData,
  onClose,
  emailTo = "customize@smileybrooms.com",
}: ServiceEmailSummaryProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const emailContent = formatFormDataForEmail(formData)

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(emailContent)
      setIsCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The service details have been copied to your clipboard.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy text: ", error)
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = () => {
    setIsSending(true)
    try {
      openGmailWithFormData(formData, emailTo)
      toast({
        title: "Opening Gmail",
        description: "Gmail should open with your service details.",
      })
      if (onClose) {
        setTimeout(onClose, 1000)
      }
    } catch (error) {
      console.error("Error opening Gmail:", error)
      toast({
        title: "Could not open Gmail",
        description: "Please try the copy option and paste into your email client.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          Service Summary Email
        </CardTitle>
        <CardDescription>Review your service details and send them directly to SmileBrooms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-800 whitespace-pre-wrap font-mono text-sm overflow-auto max-h-96">
          {emailContent}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="outline" onClick={handleCopyToClipboard} className="w-full sm:w-auto">
          {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {isCopied ? "Copied" : "Copy to Clipboard"}
        </Button>
        <Button onClick={handleSendEmail} disabled={isSending} className="w-full sm:w-auto">
          <Mail className="mr-2 h-4 w-4" />
          {isSending ? "Opening Gmail..." : "Open in Gmail"}
          {!isSending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
