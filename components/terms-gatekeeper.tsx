"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Printer,
  Download,
  Copy,
  Share2,
  Bookmark,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Check,
  Clock,
  Settings,
  FileText,
  Volume2,
  VolumeX,
  AlertTriangle,
  HelpCircle,
  X,
  ArrowLeft,
  ArrowRight,
  Zap,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// Sample terms content
const termsContent = `
1. Introduction

These Terms of Service ("Terms") govern your use of the services provided by [Company Name] ("Company," "we," "our," or "us") and any related services, including our waitlist, website, and platform (the "Service"). By accessing or using the Service, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, you should refrain from using the Service.

2. Eligibility

You must be at least 18 years of age or have the legal capacity to enter into a binding agreement under the laws of your jurisdiction to use the Service. By using the Service, you represent and warrant that you meet these eligibility requirements.

3. Registration and Account

To join the waitlist, you may be required to provide certain personal information, including your name, email address, and phone number. You agree to provide accurate and complete information and to promptly update any changes to your account. You are responsible for maintaining the confidentiality of your account credentials and agree to notify us immediately of any unauthorized use of your account.

4. Use of Service

The Service is provided solely for your personal use. You may not use the Service for any unlawful purpose or in any manner that could damage, disable, overburden, or impair the Service. You agree not to engage in any activity that interferes with or disrupts the Service.

5. Privacy and Data Collection

Your use of the Service is also governed by our Privacy Policy, which outlines the types of data we collect, how we use that data, and your rights concerning your personal data. By using the Service, you consent to the collection and use of your data as described in the Privacy Policy.

6. Modifications

We reserve the right to modify, suspend, or discontinue the Service, or any portion thereof, at any time without notice. We also reserve the right to amend these Terms at our sole discretion. Any modifications will be effective upon posting the updated Terms on our website. Continued use of the Service after such modifications constitutes your acceptance of the updated Terms.

7. Limitation of Liability

To the fullest extent permitted by law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or related to your use of the Service. Our total liability under these Terms shall not exceed the amount you have paid to us, if any, for access to the Service.

8. Governing Law

These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the Company is headquartered, without regard to its conflict of law principles. Any disputes arising from or related to these Terms or the Service shall be resolved in the competent courts of that jurisdiction.

9. Intellectual Property

All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of the Company or its licensors and are protected by copyright, trademark, and other intellectual property laws.

10. User Contributions

By submitting content to the Service, you grant the Company a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with providing the Service.
`

// Sample simplified terms
const simplifiedTerms = `
1. What This Is

This is an agreement between you and our company when you use our service.

2. Who Can Use It

You must be at least 18 years old to use our service.

3. Your Account

You need to provide accurate information when you sign up. Keep your password safe.

4. How To Use Our Service

Use our service legally and don't break it or interfere with it.

5. Your Privacy

We collect some information about you. See our Privacy Policy for details.

6. Changes We Might Make

We might change our service or these terms at any time.

7. If Something Goes Wrong

We're not responsible for most problems that might happen when you use our service.

8. Legal Stuff

The laws of our country apply to this agreement.

9. Our Content

We own all the content on our service. Don't copy it without permission.

10. Your Content

When you post something on our service, you let us use it for our service.
`

// Sample important points
const importantPoints = [
  "You must be at least 18 years old to use our service",
  "We can change these terms at any time without notice",
  "We are not liable for most damages related to your use of the service",
  "You grant us a license to use any content you submit",
  "Your account can be terminated if you violate these terms",
  "We collect and use your personal data as described in our Privacy Policy",
  "Disputes will be resolved in the courts of our jurisdiction",
  "We can modify or discontinue the service at any time",
  "You are responsible for maintaining the confidentiality of your account",
  "Using our service means you accept these terms",
]

// Legal definitions
const legalDefinitions = {
  "Terms of Service": "The legal agreement between a service provider and a person who wants to use that service",
  "Privacy Policy": "A statement that discloses how a party gathers, uses, discloses, and manages a customer's data",
  Liability: "Legal responsibility for one's acts or omissions",
  Jurisdiction: "The official power to make legal decisions and judgments",
  "Intellectual Property":
    "Creations of the mind, such as inventions, literary and artistic works, designs, symbols, names and images used in commerce",
  License: "Permission to use something that would otherwise be forbidden",
  Confidentiality: "The state of keeping or being kept secret or private",
  Termination: "The action of ending something or the fact of being ended",
  Consent: "Permission for something to happen or agreement to do something",
  "Governing Law": "The law that will be used to resolve disputes arising from the contract",
}

// Font sizes
const fontSizes = [
  { id: "xs", name: "Extra Small", class: "text-xs" },
  { id: "sm", name: "Small", class: "text-sm" },
  { id: "base", name: "Medium", class: "text-base" },
  { id: "lg", name: "Large", class: "text-lg" },
  { id: "xl", name: "Extra Large", class: "text-xl" },
  { id: "2xl", name: "XX Large", class: "text-2xl" },
]

// Line heights
const lineHeights = [
  { id: "tight", name: "Tight", class: "leading-tight" },
  { id: "normal", name: "Normal", class: "leading-normal" },
  { id: "relaxed", name: "Relaxed", class: "leading-relaxed" },
  { id: "loose", name: "Loose", class: "leading-loose" },
]

// Section data
const sections = [
  { id: "intro", title: "Introduction", important: false },
  { id: "eligibility", title: "Eligibility", important: true },
  { id: "registration", title: "Registration and Account", important: false },
  { id: "use", title: "Use of Service", important: false },
  { id: "privacy", title: "Privacy and Data Collection", important: true },
  { id: "modifications", title: "Modifications", important: true },
  { id: "liability", title: "Limitation of Liability", important: true },
  { id: "governing", title: "Governing Law", important: false },
  { id: "intellectual", title: "Intellectual Property", important: false },
  { id: "contributions", title: "User Contributions", important: true },
]

interface TermsGatekeeperProps {
  companyName?: string
  companyLogo?: string
  version?: string
  onAccept?: () => void
  redirectPath?: string
  termsLastUpdated?: string
}

export function useTermsGatekeeper() {
  const [showTerms, setShowTerms] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const termsAccepted = localStorage.getItem("termsAccepted")
    const termsVersion = process.env.NEXT_PUBLIC_TERMS_VERSION || "1.0" // Get version from env
    const lastAcceptedVersion = localStorage.getItem("lastAcceptedTermsVersion")

    if (!termsAccepted || lastAcceptedVersion !== termsVersion) {
      setShowTerms(true)
    }
  }, [])

  const handleAcceptTerms = () => {
    if (agreed) {
      localStorage.setItem("termsAccepted", "true")
      localStorage.setItem("lastAcceptedTermsVersion", process.env.NEXT_PUBLIC_TERMS_VERSION || "1.0")
      setShowTerms(false)
      toast({
        title: "Terms Accepted!",
        description: "Thank you for accepting our Terms of Service.",
        variant: "default",
      })
    } else {
      toast({
        title: "Action Required",
        description: "Please agree to the Terms of Service to continue.",
        variant: "destructive",
      })
    }
  }

  const TermsDialog = () => (
    <Dialog open={showTerms} onOpenChange={setShowTerms}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Terms of Service Update</DialogTitle>
          <DialogDescription>
            Please review and accept our updated Terms of Service to continue using our platform.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4 text-sm text-gray-700 dark:text-gray-300">
          <h3 className="font-bold text-lg mb-2">1. Introduction</h3>
          <p className="mb-4">
            Welcome to SmileyBrooms! These Terms of Service ("Terms") govern your use of our website and services. By
            accessing or using our services, you agree to be bound by these Terms.
          </p>

          <h3 className="font-bold text-lg mb-2">2. Services Provided</h3>
          <p className="mb-4">
            SmileyBrooms provides professional cleaning services for residential and commercial properties. Our services
            include, but are not limited to, standard cleaning, deep cleaning, move-in/out cleaning, and specialty
            services.
          </p>

          <h3 className="font-bold text-lg mb-2">3. User Responsibilities</h3>
          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Provide accurate and complete information when booking services.</li>
            <li>Ensure a safe working environment for our cleaning professionals.</li>
            <li>Secure valuables and fragile items before service.</li>
            <li>Notify us of any special instructions or concerns prior to service.</li>
          </ul>

          <h3 className="font-bold text-lg mb-2">4. Payment and Cancellations</h3>
          <p className="mb-4">
            Payment is due upon completion of service. Cancellations must be made at least 24 hours in advance to avoid
            a cancellation fee.
          </p>

          <h3 className="font-bold text-lg mb-2">5. Limitation of Liability</h3>
          <p className="mb-4">
            SmileyBrooms is not liable for any indirect, incidental, special, consequential, or punitive damages, or any
            loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or
            other intangible losses, resulting from (a) your access to or use of or inability to access or use the
            services; (b) any conduct or content of any third party on the services; or (c) unauthorized access, use, or
            alteration of your transmissions or content.
          </p>

          <h3 className="font-bold text-lg mb-2">6. Governing Law</h3>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws of the State of California, without
            regard to its conflict of law provisions.
          </p>

          <h3 className="font-bold text-lg mb-2">7. Changes to Terms</h3>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a
            material change will be determined at our sole discretion.
          </p>

          <h3 className="font-bold text-lg mb-2">8. Contact Us</h3>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at info@smileybrooms.com.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center pt-4">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Checkbox id="terms-agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)} />
            <Label
              htmlFor="terms-agree"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link href="/terms" className="underline" onClick={() => setShowTerms(false)}>
                Terms of Service
              </Link>
            </Label>
          </div>
          <Button onClick={handleAcceptTerms} disabled={!agreed}>
            Accept and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return { TermsDialog }
}

export default function TermsGatekeeper({
  companyName = "smileybrooms",
  companyLogo = "/sparkling-home-service.png",
  version = "2.0",
  onAccept,
  redirectPath = "/",
  termsLastUpdated = "May 10, 2025",
}: TermsGatekeeperProps) {
  const router = useRouter()
  const { TermsDialog } = useTermsGatekeeper()

  // State for various features
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState("base")
  const [lineHeight, setLineHeight] = useState("normal")
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isSimplifiedLanguage, setIsSimplifiedLanguage] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [currentTab, setCurrentTab] = useState("full")
  const [isAgreementChecked, setIsAgreementChecked] = useState(false)
  const [readSections, setReadSections] = useState<Record<string, boolean>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([])
  const [readingProgress, setReadingProgress] = useState(0)
  const [isTextToSpeechActive, setIsTextToSpeechActive] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDefinitionsOpen, setIsDefinitionsOpen] = useState(false)
  const [deviceType, setDeviceType] = useState("desktop")
  const [orientation, setOrientation] = useState("landscape")
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [readingTime, setReadingTime] = useState(4) // minutes
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null)
  const [acceptanceTimestamp, setAcceptanceTimestamp] = useState<Date | null>(null)
  const [auditTrail, setAuditTrail] = useState<any[]>([])
  const [isSignatureRequired, setIsSignatureRequired] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showAccessDenied, setShowAccessDenied] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Refs
  const contentRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Calculate if all important sections have been read
  const allImportantSectionsRead = useMemo(() => {
    return sections.filter((section) => section.important).every((section) => readSections[section.id])
  }, [readSections])

  // Calculate if accept button should be enabled
  const canAccept = useMemo(() => {
    const hasRequiredReadingProgress = hasScrolledToBottom || allImportantSectionsRead
    const hasSignatureIfRequired = isSignatureRequired ? !!signature : true
    return isAgreementChecked && hasRequiredReadingProgress && hasSignatureIfRequired
  }, [isAgreementChecked, hasScrolledToBottom, allImportantSectionsRead, isSignatureRequired, signature])

  // Get content based on current tab and language settings
  const currentContent = useMemo(() => {
    if (currentTab === "simplified") {
      return simplifiedTerms
    }
    if (currentTab === "important") {
      return importantPoints.map((point, index) => `${index + 1}. ${point}`).join("\n\n")
    }
    return termsContent
  }, [currentTab])

  // Initialize on mount
  useEffect(() => {
    // Detect device type
    detectDeviceType()

    // Initialize expanded sections
    const initialExpandedSections: Record<string, boolean> = {}
    sections.forEach((section) => {
      initialExpandedSections[section.id] = true
    })
    setExpandedSections(initialExpandedSections)

    // Add audit trail entry
    addAuditTrailEntry("opened_terms_gatekeeper")

    // Check if terms have been previously accepted
    const termsAccepted = localStorage.getItem("termsAccepted") === "true"
    if (termsAccepted) {
      // If terms were previously accepted, show success message briefly then redirect
      setShowSuccessMessage(true)
      setTimeout(() => {
        if (onAccept) onAccept()
        router.push(redirectPath)
      }, 1500)
    }
  }, [onAccept, redirectPath, router])

  // Handle scroll to detect reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current

      // Calculate reading progress
      const progress = Math.min(Math.round((scrollTop / (scrollHeight - clientHeight)) * 100), 100)
      setReadingProgress(progress)
      setCurrentPosition(scrollTop)

      // Check if scrolled to bottom
      if (scrollTop + clientHeight >= scrollHeight - 50 && !hasScrolledToBottom) {
        setHasScrolledToBottom(true)
        addAuditTrailEntry("scrolled_to_bottom")
      }
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
  }, [hasScrolledToBottom])

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setOrientation("portrait")
      } else {
        setOrientation("landscape")
      }
    }

    handleOrientationChange() // Initial check
    window.addEventListener("resize", handleOrientationChange)

    if (typeof window.orientation !== "undefined") {
      window.addEventListener("orientationchange", handleOrientationChange)
    }

    return () => {
      window.removeEventListener("resize", handleOrientationChange)
      if (typeof window.orientation !== "undefined") {
        window.removeEventListener("orientationchange", handleOrientationChange)
      }
    }
  }, [])

  // Function to detect device type
  const detectDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (/ipad|tablet|playbook|silk|android(?!.*mobile)/i.test(userAgent)) {
      setDeviceType("tablet")
    } else if (/mobile|iphone|ipod|blackberry|android|palm|windows\s+phone/i.test(userAgent)) {
      setDeviceType("mobile")
    } else {
      setDeviceType("desktop")
    }
  }

  // Function to add audit trail entry
  const addAuditTrailEntry = (action: string, details: any = {}) => {
    const entry = {
      action,
      timestamp: new Date().toISOString(),
      details,
      deviceType,
      orientation,
      currentTab,
    }
    setAuditTrail((prev) => [...prev, entry])
  }

  // Function to toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))

    // Mark section as read when expanded
    if (!readSections[sectionId]) {
      setReadSections((prev) => ({
        ...prev,
        [sectionId]: true,
      }))
      addAuditTrailEntry("read_section", { sectionId })
    }
  }

  // Function to toggle bookmark
  const toggleBookmark = (sectionId: string) => {
    if (bookmarkedSections.includes(sectionId)) {
      setBookmarkedSections((prev) => prev.filter((id) => id !== sectionId))
      addAuditTrailEntry("removed_bookmark", { sectionId })
    } else {
      setBookmarkedSections((prev) => [...prev, sectionId])
      addAuditTrailEntry("added_bookmark", { sectionId })
    }
  }

  // Function to handle print
  const handlePrint = () => {
    addAuditTrailEntry("printed_terms")
    window.print()
  }

  // Function to handle download
  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([currentContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `Terms_of_Service_v${version}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    addAuditTrailEntry("downloaded_terms")
  }

  // Function to handle copy
  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent)
    addAuditTrailEntry("copied_terms")
  }

  // Function to handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Terms of Service v${version}`,
        text: "Please review our Terms of Service",
        url: window.location.href,
      })
      addAuditTrailEntry("shared_terms")
    }
  }

  // Function to handle text-to-speech
  const handleTextToSpeech = () => {
    if (!isTextToSpeechActive) {
      const utterance = new SpeechSynthesisUtterance(currentContent)
      window.speechSynthesis.speak(utterance)
      setIsTextToSpeechActive(true)
      addAuditTrailEntry("started_text_to_speech")
    } else {
      window.speechSynthesis.cancel()
      setIsTextToSpeechActive(false)
      addAuditTrailEntry("stopped_text_to_speech")
    }
  }

  // Function to start drawing
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()

    // Get coordinates
    let x, y
    if ("touches" in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX
      y = e.nativeEvent.offsetY
    }

    ctx.moveTo(x, y)
  }, [])

  // Function to draw
  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const canvas = signatureCanvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Get coordinates
      let x, y
      if ("touches" in e) {
        // Touch event
        const rect = canvas.getBoundingClientRect()
        x = e.touches[0].clientX - rect.left
        y = e.touches[0].clientY - rect.top
      } else {
        // Mouse event
        x = e.nativeEvent.offsetX
        y = e.nativeEvent.offsetY
      }

      ctx.lineTo(x, y)
      ctx.stroke()
    },
    [isDrawing],
  )

  // Function to stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false)

    const canvas = signatureCanvasRef.current
    if (!canvas) return

    // Save the signature as a data URL
    const dataUrl = canvas.toDataURL("image/png")
    setSignature(dataUrl)
  }, [])

  // Function to clear the signature
  const clearSignature = useCallback(() => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignature(null)
  }, [])

  // Function to initialize the canvas
  const initializeCanvas = useCallback(() => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const parent = canvas.parentElement
    if (parent) {
      canvas.width = parent.clientWidth
      canvas.height = 150
    }

    // Set drawing style
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = isDarkMode ? "white" : "black"
  }, [isDarkMode])

  // Function to save the signature and close the modal
  const saveSignature = useCallback(() => {
    if (!signature) {
      // Show error or alert that signature is required
      return
    }

    setIsSignatureModalOpen(false)
    addAuditTrailEntry("added_signature")
  }, [signature])

  // Function to handle acceptance
  const handleAccept = () => {
    if (!canAccept) return

    setIsAccepting(true)
    const timestamp = new Date()
    setAcceptanceTimestamp(timestamp)

    addAuditTrailEntry("accepted_terms", {
      timestamp: timestamp.toISOString(),
      readSections,
      readingProgress,
      signature: !!signature,
    })

    // Save acceptance to localStorage
    try {
      localStorage.setItem("termsAccepted", "true")
      localStorage.setItem("termsAcceptedDate", timestamp.toISOString())
      localStorage.setItem("termsAcceptedVersion", version)
    } catch (error) {
      console.error("Error saving terms acceptance to localStorage:", error)
    }

    // Show success message
    setShowSuccessMessage(true)

    // Redirect after a short delay
    setTimeout(() => {
      if (onAccept) onAccept()
      router.push(redirectPath)
    }, 2000)
  }

  // Function to handle decline
  const handleDecline = () => {
    setShowAccessDenied(true)
    addAuditTrailEntry("declined_terms")
  }

  // Function to expand all sections
  const expandAllSections = () => {
    const allExpanded: Record<string, boolean> = {}
    sections.forEach((section) => {
      allExpanded[section.id] = true
    })
    setExpandedSections(allExpanded)
    addAuditTrailEntry("expanded_all_sections")
  }

  // Function to collapse all sections
  const collapseAllSections = () => {
    const allCollapsed: Record<string, boolean> = {}
    sections.forEach((section) => {
      allCollapsed[section.id] = false
    })
    setExpandedSections(allCollapsed)
    addAuditTrailEntry("collapsed_all_sections")
  }

  // Function to scroll to section
  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(`section-${sectionId}`)
    if (sectionElement && contentRef.current) {
      contentRef.current.scrollTo({
        top: sectionElement.offsetTop - 20,
        behavior: "smooth",
      })

      // Expand the section if collapsed
      if (!expandedSections[sectionId]) {
        toggleSection(sectionId)
      }

      addAuditTrailEntry("scrolled_to_section", { sectionId })
    }
  }

  // Initialize canvas when signature modal opens
  useEffect(() => {
    if (isSignatureModalOpen) {
      setTimeout(initializeCanvas, 100)
    }
  }, [isSignatureModalOpen, initializeCanvas])

  // If terms were previously accepted and we're showing success message
  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center p-8 max-w-md">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Terms Accepted</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You have already accepted our terms of service. Redirecting you to the site...
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  // If user declined terms
  if (showAccessDenied) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center p-8 max-w-md">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You must accept the terms of service to access this site. Please try again when you're ready to accept our
            terms.
          </p>
          <Button onClick={() => setShowAccessDenied(false)}>Return to Terms</Button>
        </div>
      </div>
    )
  }

  // Determine content class based on settings
  const contentClass = cn(
    fontSizes.find((f) => f.id === fontSize)?.class || "text-base",
    lineHeights.find((l) => l.id === lineHeight)?.class || "leading-normal",
    {
      "text-black bg-white": !isDarkMode && !isHighContrast,
      "text-white bg-black": isDarkMode && !isHighContrast,
      "text-yellow-400 bg-black": isHighContrast,
    },
  )

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col",
        isDarkMode ? "bg-gray-950" : "bg-white",
        isHighContrast ? "bg-black" : "",
      )}
    >
      <TermsDialog />
      {/* Header */}
      <header
        className={cn(
          "border-b px-4 py-3",
          isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50",
          isHighContrast ? "border-yellow-400 bg-black" : "",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {companyLogo && (
              <div className="h-10 w-10 relative">
                <Image
                  src={companyLogo || "/placeholder.svg"}
                  alt={`${companyName} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className={cn("text-xl font-bold", isDarkMode || isHighContrast ? "text-white" : "text-gray-900")}>
                {companyName}
              </h1>
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                  isHighContrast ? "text-yellow-400" : "",
                )}
              >
                Terms of Service Agreement
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="hidden sm:flex">
              v{version}
            </Badge>

            <Badge variant="outline" className="hidden sm:flex">
              <Clock className="h-3 w-3 mr-1" />
              Updated: {termsLastUpdated}
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowHelp(!showHelp)}
              title="Help"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-64 border-r p-4 overflow-y-auto hidden md:block",
            isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50",
            isHighContrast ? "border-yellow-400 bg-black" : "",
          )}
        >
          <div className="space-y-6">
            {/* Progress */}
            <div>
              <h2
                className={cn(
                  "font-semibold mb-2 flex items-center",
                  isDarkMode || isHighContrast ? "text-white" : "text-gray-900",
                )}
              >
                <Zap className="h-4 w-4 mr-1" />
                Your Progress
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={isDarkMode || isHighContrast ? "text-gray-400" : "text-gray-600"}>
                    {readingProgress}% Complete
                  </span>
                  <Badge variant={readingProgress === 100 ? "success" : "outline"}>
                    {readingProgress === 100 ? "Completed" : "In Progress"}
                  </Badge>
                </div>
                <Progress value={readingProgress} className="h-2" />

                <div className="flex items-center justify-between text-sm mt-1">
                  <span className={isDarkMode || isHighContrast ? "text-gray-400" : "text-gray-600"}>
                    Est. reading time:
                  </span>
                  <span className={isDarkMode || isHighContrast ? "text-gray-300" : "text-gray-700"}>
                    {readingTime} minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2
                  className={cn(
                    "font-semibold flex items-center",
                    isDarkMode || isHighContrast ? "text-white" : "text-gray-900",
                  )}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Sections
                </h2>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="xs" onClick={expandAllSections} title="Expand All">
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="xs" onClick={collapseAllSections} title="Collapse All">
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded cursor-pointer",
                      readSections[section.id] ? "bg-green-50 dark:bg-green-900/20" : "",
                      isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
                      isHighContrast ? "hover:bg-gray-900" : "",
                    )}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <div className="flex items-center">
                      {readSections[section.id] ? (
                        <Check className="h-3 w-3 mr-2 text-green-500" />
                      ) : (
                        <ChevronRight className="h-3 w-3 mr-2" />
                      )}
                      <span
                        className={cn(
                          "text-sm truncate",
                          isDarkMode || isHighContrast ? "text-white" : "text-black",
                          section.important ? "font-semibold" : "",
                        )}
                      >
                        {section.title}
                      </span>
                    </div>
                    {section.important && (
                      <Badge variant="outline" className="ml-1 text-amber-500 border-amber-500">
                        !
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bookmarks */}
            <div>
              <h2
                className={cn(
                  "font-semibold mb-2 flex items-center",
                  isDarkMode || isHighContrast ? "text-white" : "text-gray-900",
                )}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Bookmarks
              </h2>
              {bookmarkedSections.length === 0 ? (
                <p className="text-sm text-gray-500">No bookmarks yet</p>
              ) : (
                <div className="space-y-1">
                  {bookmarkedSections.map((sectionId) => {
                    const section = sections.find((s) => s.id === sectionId)
                    if (!section) return null

                    return (
                      <div
                        key={sectionId}
                        className={cn(
                          "flex items-center justify-between p-2 rounded cursor-pointer",
                          isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
                          isHighContrast ? "hover:bg-gray-900" : "",
                        )}
                        onClick={() => scrollToSection(sectionId)}
                      >
                        <span
                          className={cn("text-sm truncate", isDarkMode || isHighContrast ? "text-white" : "text-black")}
                        >
                          {section.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(sectionId)
                          }}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove bookmark</span>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Reading Settings */}
            <div>
              <h2
                className={cn(
                  "font-semibold mb-2 flex items-center",
                  isDarkMode || isHighContrast ? "text-white" : "text-gray-900",
                )}
              >
                <Settings className="h-4 w-4 mr-1" />
                Reading Settings
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDarkMode || isHighContrast ? "text-white" : "text-black")}>
                    Font Size
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 bg-transparent"
                      onClick={() => {
                        const currentIndex = fontSizes.findIndex((f) => f.id === fontSize)
                        if (currentIndex > 0) {
                          setFontSize(fontSizes[currentIndex - 1].id)
                        }
                      }}
                      disabled={fontSize === fontSizes[0].id}
                    >
                      <span className="text-xs">A-</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 bg-transparent"
                      onClick={() => {
                        const currentIndex = fontSizes.findIndex((f) => f.id === fontSize)
                        if (currentIndex < fontSizes.length - 1) {
                          setFontSize(fontSizes[currentIndex + 1].id)
                        }
                      }}
                      disabled={fontSize === fontSizes[fontSizes.length - 1].id}
                    >
                      <span className="text-xs">A+</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDarkMode || isHighContrast ? "text-white" : "text-black")}>
                    Line Spacing
                  </span>
                  <select
                    value={lineHeight}
                    onChange={(e) => setLineHeight(e.target.value)}
                    className={cn(
                      "text-xs p-1 rounded border",
                      isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black",
                      isHighContrast ? "bg-black border-yellow-400 text-yellow-400" : "",
                    )}
                  >
                    {lineHeights.map((lh) => (
                      <option key={lh.id} value={lh.id}>
                        {lh.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDarkMode || isHighContrast ? "text-white" : "text-black")}>
                    High Contrast
                  </span>
                  <Switch checked={isHighContrast} onCheckedChange={setIsHighContrast} />
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDarkMode || isHighContrast ? "text-white" : "text-black")}>
                    Simplified Language
                  </span>
                  <Switch
                    checked={isSimplifiedLanguage}
                    onCheckedChange={(checked) => {
                      setIsSimplifiedLanguage(checked)
                      if (checked) {
                        setCurrentTab("simplified")
                      } else {
                        setCurrentTab("full")
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn("text-sm", isDarkMode || isHighContrast ? "text-white" : "text-black")}>
                    Text-to-Speech
                  </span>
                  <Button
                    variant={isTextToSpeechActive ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleTextToSpeech}
                  >
                    {isTextToSpeechActive ? (
                      <>
                        <VolumeX className="h-3 w-3 mr-1" /> Stop
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3 w-3 mr-1" /> Start
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h2
                className={cn(
                  "font-semibold mb-2 flex items-center",
                  isDarkMode || isHighContrast ? "text-white" : "text-gray-900",
                )}
              >
                <FileText className="h-4 w-4 mr-1" />
                Document Actions
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs h-8 bg-transparent">
                  <Printer className="h-3 w-3 mr-1" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs h-8 bg-transparent">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs h-8 bg-transparent">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="text-xs h-8 bg-transparent">
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col">
          {/* Tabs */}
          <div
            className={cn(
              "px-4 py-2 border-b",
              isDarkMode ? "border-gray-800" : "border-gray-200",
              isHighContrast ? "border-yellow-400" : "",
            )}
          >
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="full">Full Terms</TabsTrigger>
                <TabsTrigger value="simplified">Summary</TabsTrigger>
                <TabsTrigger value="important">Important Points</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <div ref={contentRef} className={cn("flex-1 overflow-y-auto p-4 md:p-6", contentClass)}>
            {currentTab === "important" ? (
              <div className="max-w-4xl mx-auto">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-800 dark:text-amber-300">Important Notice</h3>
                      <p className="text-amber-700 dark:text-amber-400 text-sm">
                        These are the key points from our terms of service. Please review them carefully before
                        accepting.
                      </p>
                    </div>
                  </div>
                </div>

                <h2
                  className={cn("text-xl font-bold mb-4", isDarkMode || isHighContrast ? "text-white" : "text-black")}
                >
                  Important Points
                </h2>
                <div className="space-y-4">
                  {importantPoints.map((point, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded border",
                        isDarkMode ? "border-gray-800" : "border-gray-200",
                        isHighContrast ? "border-yellow-400" : "",
                      )}
                    >
                      <div className="flex items-start">
                        <Badge className="mt-1 mr-3 bg-amber-500">{index + 1}</Badge>
                        <p>{point}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    id={`section-${section.id}`}
                    className={cn(
                      "mb-6 pb-6 border-b",
                      isDarkMode ? "border-gray-800" : "border-gray-200",
                      isHighContrast ? "border-yellow-400" : "",
                    )}
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer transition-all duration-200 ease-in-out"
                      onClick={() => toggleSection(section.id)}
                    >
                      <h2
                        className={cn(
                          "text-xl font-bold flex items-center",
                          isDarkMode || isHighContrast ? "text-white" : "text-black",
                        )}
                      >
                        {expandedSections[section.id] ? (
                          <ChevronDown className="h-5 w-5 mr-2" />
                        ) : (
                          <ChevronRight className="h-5 w-5 mr-2" />
                        )}
                        {section.title}
                        {section.important && (
                          <Badge variant="outline" className="ml-2 text-amber-500 border-amber-500">
                            Important
                          </Badge>
                        )}
                        {readSections[section.id] && (
                          <Badge variant="outline" className="ml-2 text-green-500 border-green-500">
                            Read
                          </Badge>
                        )}
                      </h2>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(section.id)
                          }}
                          title={bookmarkedSections.includes(section.id) ? "Remove Bookmark" : "Add Bookmark"}
                        >
                          <Bookmark
                            className={cn("h-4 w-4", bookmarkedSections.includes(section.id) ? "fill-current" : "")}
                          />
                          <span className="sr-only">
                            {bookmarkedSections.includes(section.id) ? "Remove Bookmark" : "Add Bookmark"}
                          </span>
                        </Button>
                      </div>
                    </div>

                    {expandedSections[section.id] && (
                      <div className="mt-4 whitespace-pre-line transition-all duration-200 ease-in-out">
                        {currentTab === "simplified" ? (
                          <p>{simplifiedTerms.split("\n\n")[sections.indexOf(section)]}</p>
                        ) : (
                          <p>{termsContent.split("\n\n")[sections.indexOf(section) + 1]}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Extra space at bottom to ensure content is scrollable past the fixed footer */}
            <div className="h-32"></div>
          </div>
        </main>
      </div>

      {/* Fixed footer */}
      <footer
        className={cn(
          "border-t p-4 shadow-md",
          isDarkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50",
          isHighContrast ? "border-yellow-400 bg-black" : "",
        )}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "p-2 rounded-full",
                !hasScrolledToBottom && !allImportantSectionsRead
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
              )}
            >
              {!hasScrolledToBottom && !allImportantSectionsRead ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className={cn("font-medium", isDarkMode || isHighContrast ? "text-white" : "text-gray-900")}>
                {!hasScrolledToBottom && !allImportantSectionsRead
                  ? "Please read all important sections or scroll to the bottom"
                  : "You've completed the required reading"}
              </p>
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                  isHighContrast ? "text-yellow-400" : "",
                )}
              >
                {readingProgress}% of document reviewed
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreement"
                checked={isAgreementChecked}
                onCheckedChange={(checked) => {
                  setIsAgreementChecked(checked as boolean)
                  addAuditTrailEntry("toggled_agreement", { checked })
                }}
              />
              <Label
                htmlFor="agreement"
                className={cn("font-medium", isDarkMode || isHighContrast ? "text-white" : "text-black")}
              >
                I have read and agree to the Terms of Service
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              {isSignatureRequired && (
                <Button
                  variant="outline"
                  onClick={() => setIsSignatureModalOpen(true)}
                  className="flex items-center"
                  disabled={isAccepting}
                >
                  {signature ? "View Signature" : "Add Signature"}
                  {signature && <Check className="ml-1 h-3 w-3 text-green-500" />}
                </Button>
              )}

              <Button variant="outline" onClick={handleDecline} disabled={isAccepting}>
                Decline
              </Button>

              <Button
                onClick={handleAccept}
                disabled={!canAccept || isAccepting}
                className={cn(canAccept && !isAccepting ? "bg-green-600 hover:bg-green-700" : "", "min-w-[100px]")}
              >
                {isAccepting ? <span className="inline-block">Processing...</span> : "Accept"}
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp} className="transition-opacity duration-200">
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How to Review Terms of Service</DialogTitle>
            <DialogDescription>Follow these steps to properly review and accept our terms.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start space-x-3">
              <div
                className={cn(
                  "flex items-center justify-center h-6 w-6 rounded-full text-white font-medium text-sm",
                  currentStep >= 1 ? "bg-green-500" : "bg-gray-400",
                )}
              >
                1
              </div>
              <div>
                <h3 className="font-medium">Read the Terms</h3>
                <p className="text-sm text-gray-500">
                  Scroll through the document or use the section navigation to read all important sections.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div
                className={cn(
                  "flex items-center justify-center h-6 w-6 rounded-full text-white font-medium text-sm",
                  currentStep >= 2 ? "bg-green-500" : "bg-gray-400",
                )}
              >
                2
              </div>
              <div>
                <h3 className="font-medium">Add Your Signature</h3>
                <p className="text-sm text-gray-500">
                  Click the "Add Signature" button to draw your digital signature.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div
                className={cn(
                  "flex items-center justify-center h-6 w-6 rounded-full text-white font-medium text-sm",
                  currentStep >= 3 ? "bg-green-500" : "bg-gray-400",
                )}
              >
                3
              </div>
              <div>
                <h3 className="font-medium">Check the Agreement Box</h3>
                <p className="text-sm text-gray-500">Check the box to confirm you have read and agree to the terms.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div
                className={cn(
                  "flex items-center justify-center h-6 w-6 rounded-full text-white font-medium text-sm",
                  currentStep >= 4 ? "bg-green-500" : "bg-gray-400",
                )}
              >
                4
              </div>
              <div>
                <h3 className="font-medium">Click Accept</h3>
                <p className="text-sm text-gray-500">
                  Click the "Accept" button to complete the process and gain access to the site.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentStep < 4) {
                  setCurrentStep(currentStep + 1)
                } else {
                  setShowHelp(false)
                }
              }}
            >
              {currentStep < 4 ? (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "Close"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signature Modal */}
      <Dialog
        open={isSignatureModalOpen}
        onOpenChange={setIsSignatureModalOpen}
        className="transition-opacity duration-200"
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Digital Signature</DialogTitle>
            <DialogDescription>Please sign below to indicate your acceptance of the terms.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col space-y-4">
            <div className="border-2 rounded-md p-1 border-gray-300 dark:border-gray-700">
              <canvas
                ref={signatureCanvasRef}
                className="w-full cursor-crosshair bg-gray-50 dark:bg-gray-800"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                aria-label="Signature canvas"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={clearSignature}>
                Clear
              </Button>
              <Button size="sm" onClick={saveSignature} disabled={!signature}>
                Save Signature
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
