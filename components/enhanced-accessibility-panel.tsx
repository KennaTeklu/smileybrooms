/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
/* Don't modify beyond what is requested ever. */
"use client"

import { Button } from "@/components/ui/button"
import { openGmailWithFormData, generateMailtoLink } from "@/lib/email-utils"
import { Mail } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface EmailFormDataProps {
  formData: Record<string, any>
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  label?: string
  emailTo?: string
  onSuccess?: () => void
}

export default function EmailFormData({
  formData,
  className,
  variant = "default",
  size = "default",
  label = "Email Service Details",
  emailTo = "customize@smileybrooms.com",
  onSuccess,
}: EmailFormDataProps) {
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendEmail = () => {
    setIsSending(true)

    try {
      // Try to open Gmail directly first
      openGmailWithFormData(formData, emailTo)

      // Show success toast
      toast({
        title: "Email client opened",
        description: "Your email client has been opened with the service details.",
      })

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error opening email client:", error)

      // Fallback to regular mailto link
      const mailtoLink = generateMailtoLink(formData, emailTo)
      window.location.href = mailtoLink

      toast({
        title: "Opening email client",
        description: "Your default email client should open with the service details.",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleSendEmail} disabled={isSending}>
      <Mail className="mr-2 h-4 w-4" />
      {isSending ? "Opening Email..." : label}
    </Button>
  )
}
