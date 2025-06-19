"use client"

/* Don't modify beyond what is requested ever. */
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: () => void
  version?: string
}

// Terms content sections for demonstration
const termsSections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `These Terms of Service ("Terms") govern your use of the services provided by [Company Name] ("Company," "we," "our," or "us") and any related services, including our waitlist, website, and platform (the "Service"). By accessing or using the Service, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you should refrain from using the Service.`,
    isImportant: true,
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: `You must be at least 18 years of age or have the legal capacity to enter into a binding agreement under the laws of your jurisdiction to use the Service. By using the Service, you represent and warrant that you meet these eligibility requirements.`,
    isImportant: true,
  },
  {
    id: "registration",
    title: "3. Registration and Account",
    content: `To join the waitlist, you may be required to provide certain personal information, including your name, email address, and phone number. You agree to provide accurate and complete information and to promptly update any changes to your account. You are responsible for maintaining the confidentiality of your account credentials and agree to notify us immediately of any unauthorized use of your account.`,
    isImportant: false,
  },
  {
    id: "use",
    title: "4. Use of Service",
    content: `The Service is provided solely for your personal use. You may not use the Service for any unlawful purpose or in any manner that could damage, disable, overburden, or impair the Service. You agree not to engage in any activity that interferes with or disrupts the Service.`,
    isImportant: true,
  },
  {
    id: "privacy",
    title: "5. Privacy and Data Collection",
    content: `Your use of the Service is also governed by our Privacy Policy, which outlines the types of data we collect, how we use that data, and your rights concerning your personal data. By using the Service, you consent to the collection and use of your data as described in the Privacy Policy.`,
    isImportant: true,
  },
  {
    id: "modifications",
    title: "6. Modifications",
    content: `We reserve the right to modify, suspend, or discontinue the Service, or any portion thereof, at any time without notice. We also reserve the right to amend these Terms at our sole discretion. Any modifications will be effective upon posting the updated Terms on our website. Continued use of the Service after such modifications constitutes your acceptance of the updated Terms.`,
    isImportant: false,
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: `To the fullest extent permitted by law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Service. Our total liability under these Terms shall not exceed the amount you have paid to us, if any, for access to the Service.`,
    isImportant: true,
  },
  {
    id: "governing",
    title: "8. Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Company is headquartered, without regard to its conflict of law principles. Any disputes arising from or related to these Terms or the Service shall be resolved in the competent courts of that jurisdiction.`,
    isImportant: false,
  },
]

export default function ImprovedTermsModal({ isOpen, onClose, onAccept, version = "1.0" }: TermsModalProps) {
  const [readSections, setReadSections] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isAgreementChecked, setIsAgreementChecked] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setReadSections([])
      setExpandedSections([])
      setIsAgreementChecked(false)
      setHasScrolledToBottom(false)
    }
  }, [isOpen])

  // Handle scroll to detect when user has read sections
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current

      // Check if scrolled to bottom
      if (scrollTop + clientHeight >= scrollHeight - 50 && !hasScrolledToBottom) {
        setHasScrolledToBottom(true)
      }

      // Check which sections are visible
      const sections = contentRef.current.querySelectorAll("[data-section-id]")
      sections.forEach((section) => {
        const sectionId = section.getAttribute("data-section-id")
        if (!sectionId) return

        const rect = section.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0

        if (isVisible && !readSections.includes(sectionId)) {
          setReadSections((prev) => [...prev, sectionId])
        }
      })
    }

    const currentRef = contentRef.current
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll)
      }
    }
  }, [readSections, hasScrolledToBottom])

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId))
    } else {
      setExpandedSections([...expandedSections, sectionId])
      if (!readSections.includes(sectionId)) {
        setReadSections([...readSections, sectionId])
      }
    }
  }

  // Expand all sections
  const expandAllSections = () => {
    setExpandedSections(termsSections.map((section) => section.id))
    // Mark all as read
    const newReadSections = termsSections
      .filter((section) => !readSections.includes(section.id))
      .map((section) => section.id)

    setReadSections([...readSections, ...newReadSections])
  }

  // Collapse all sections
  const collapseAllSections = () => {
    setExpandedSections([])
  }

  // Calculate if accept button should be enabled
  const isAcceptEnabled = () => {
    const allImportantSectionsRead = termsSections
      .filter((section) => section.isImportant)
      .every((section) => readSections.includes(section.id))

    return (allImportantSectionsRead || hasScrolledToBottom) && isAgreementChecked
  }

  // Calculate read percentage
  const readPercentage = Math.min(100, Math.round((readSections.length / termsSections.length) * 100))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 h-[90vh] flex flex-col">
        <DialogHeader className="px-6 py-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Terms of Service v{version}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={expandAllSections} className="h-8 text-xs px-2">
                <ChevronDown className="h-4 w-4 mr-1" />
                Expand All
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAllSections} className="h-8 text-xs px-2">
                <ChevronUp className="h-4 w-4 mr-1" />
                Collapse All
              </Button>
              <DialogClose className="h-8 w-8 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        {/* Content Area - MAXIMIZED */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {termsSections.map((section) => (
              <div
                key={section.id}
                data-section-id={section.id}
                className={cn(
                  "border rounded-lg overflow-hidden",
                  section.isImportant && "border-amber-200 dark:border-amber-800",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-between p-3 cursor-pointer",
                    section.isImportant && "bg-amber-50 dark:bg-amber-900/20",
                    !section.isImportant && "bg-gray-50 dark:bg-gray-800",
                  )}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{section.title}</h3>
                    {section.isImportant && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                      >
                        Important
                      </Badge>
                    )}
                    {readSections.includes(section.id) && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Read
                      </Badge>
                    )}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-gray-400 transition-transform",
                      expandedSections.includes(section.id) ? "transform rotate-180" : "",
                    )}
                  />
                </div>

                {expandedSections.includes(section.id) && (
                  <div className="p-4 bg-white dark:bg-gray-900 border-t">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{section.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Extra space at bottom to ensure content is scrollable past the fixed footer */}
          <div className="h-16"></div>
        </div>

        {/* Fixed footer with action buttons - Always visible */}
        <div className="border-t p-4 sticky bottom-0 bg-background">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreement"
                checked={isAgreementChecked}
                onCheckedChange={(checked) => setIsAgreementChecked(checked as boolean)}
              />
              <Label htmlFor="agreement" className="font-medium">
                I have read and agree to the Terms of Service
              </Label>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 dark:bg-green-600 rounded-full"
                    style={{ width: `${readPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{readPercentage}% Read</span>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Decline
                </Button>
                <Button onClick={onAccept} disabled={!isAcceptEnabled()}>
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
