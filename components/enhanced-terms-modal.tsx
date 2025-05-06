"use client"

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ExternalLink,
  FileText,
  Shield,
  CreditCard,
  Calendar,
  HelpCircle,
  AlertTriangle,
  Info,
  List,
  Type,
  Home,
  Check,
  Lock,
  BookOpen,
  Download,
  Printer,
  Copy,
  Search,
  Moon,
  Sun,
  ArrowUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/components/ui/use-toast"
import { getScrollPosition, saveScrollPosition, getSectionsViewed, saveSectionsViewed } from "@/lib/terms-utils"
import { Input } from "@/components/ui/input"

interface EnhancedTermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  initialTab?: "terms" | "privacy"
  continuousScroll?: boolean
  forceAccept?: boolean
}

// Section type for the table of contents
interface Section {
  id: string
  title: string
  icon?: React.ReactNode
  important?: boolean
  content: React.ReactNode
}

export default function EnhancedTermsModal({
  isOpen,
  onClose,
  onAccept,
  initialTab = "terms",
  continuousScroll = false,
  forceAccept = false,
}: EnhancedTermsModalProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">(initialTab)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<
    Array<{ sectionId: string; tab: "terms" | "privacy"; text: string }>
  >([])
  const [activeSection, setActiveSection] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [showTableOfContents, setShowTableOfContents] = useState(false)
  const [textSize, setTextSize] = useState<"small" | "normal" | "large" | "xl">("normal")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [showDeclineDialog, setShowDeclineDialog] = useState(false)
  const [termsViewed, setTermsViewed] = useState<Record<string, boolean>>({})
  const [privacyViewed, setPrivacyViewed] = useState<Record<string, boolean>>({})
  const [allTermsViewed, setAllTermsViewed] = useState(false)
  const [allPrivacyViewed, setAllPrivacyViewed] = useState(false)
  const [showAcceptButtons, setShowAcceptButtons] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  const modalRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)

  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Update viewport dimensions on resize
  useEffect(() => {
    const updateViewportDimensions = () => {
      setViewportHeight(window.innerHeight)
      setViewportWidth(window.innerWidth)
    }

    // Initial set
    updateViewportDimensions()

    // Add event listener
    window.addEventListener("resize", updateViewportDimensions)

    // Cleanup
    return () => window.removeEventListener("resize", updateViewportDimensions)
  }, [])

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== "undefined") {
        // Check for dark mode preference or system preference
        const isDark =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches
        setIsDarkMode(isDark)
      }
    }

    checkDarkMode()

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkDarkMode()
        }
      })
    })

    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, { attributes: true })
    }

    return () => observer.disconnect()
  }, [])

  // Add this to the termsContent and privacyContent items to ensure proper text wrapping
  const textStyles = "text-gray-700 dark:text-gray-300 break-words hyphens-auto"

  // Terms sections content
  const termsContent = {
    introduction: (
      <>
        <p className={textStyles}>
          Welcome to Smiley Brooms. These Terms and Conditions govern your use of our website, mobile applications, and
          services. By accessing or using our services, you agree to be bound by these Terms.
        </p>
        <p className={textStyles + " mt-4"}>
          This document constitutes a legally binding agreement between you (the "Customer") and Smiley Brooms LLC
          ("we," "us," or "our"). Please read these terms carefully before using our services.
        </p>
      </>
    ),
    "service-description": (
      <>
        <p className={textStyles}>
          Smiley Brooms provides professional cleaning services for residential and commercial properties. Our services
          include but are not limited to:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Standard cleaning services</li>
          <li>Deep cleaning services</li>
          <li>Move-in/move-out cleaning services</li>
          <li>Office and commercial cleaning services</li>
          <li>Specialized cleaning services</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          The specific details, scope, and pricing of each service are described on our website and in the service
          agreement provided at the time of booking.
        </p>
      </>
    ),
    "booking-cancellation": (
      <>
        <p className={textStyles}>
          3.1. Bookings can be made through our website, mobile app, or by contacting our customer service.
        </p>
        <p className={textStyles + " mt-4"}>
          3.2. Cancellations must be made at least 24 hours before the scheduled service. Late cancellations may incur a
          fee of up to 50% of the service cost.
        </p>
        <p className={textStyles + " mt-4"}>3.3. No-shows will be charged the full service amount.</p>
        <p className={textStyles + " mt-4"}>
          3.4. Rescheduling requests should be made at least 24 hours in advance and are subject to availability.
        </p>
        <p className={textStyles + " mt-4"}>
          3.5. We reserve the right to cancel or reschedule appointments due to unforeseen circumstances, including but
          not limited to severe weather conditions, staff illness, or equipment failure. In such cases, we will notify
          you as soon as possible and offer alternative dates or a full refund.
        </p>
      </>
    ),
    "payment-terms": (
      <>
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 dark:border-amber-600 p-4 rounded-r-md mb-6">
          <h3 className="text-amber-800 dark:text-amber-400 font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Important Information
          </h3>
          <p className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
            This section contains critical information about payment processing, recurring charges, and refund policies.
            Please read carefully.
          </p>
        </div>
        <p className={textStyles}>
          4.1. Payment is required at the time of booking unless otherwise specified in a written agreement.
        </p>
        <p className={textStyles + " mt-4"}>
          4.2. We accept credit/debit cards, PayPal, and other payment methods as specified on our platform.
        </p>
        <p className={textStyles + " mt-4"}>
          4.3. Recurring service plans will be automatically charged according to the selected frequency. You will
          receive an email notification before each charge.
        </p>
        <p className={textStyles + " mt-4"}>
          4.4. Prices are subject to change. For recurring services, we will provide at least 30 days' notice before
          implementing any price changes.
        </p>
      </>
    ),
    "service-guarantee": (
      <>
        <p className={textStyles}>
          5.1. We strive to provide high-quality cleaning services. If you are not satisfied with our service, please
          notify us within 24 hours, and we will re-clean the areas of concern at no additional cost.
        </p>
        <p className={textStyles + " mt-4"}>
          5.2. Our satisfaction guarantee is subject to reasonable expectations and does not cover pre-existing damage
          or conditions.
        </p>
        <p className={textStyles + " mt-4"}>
          5.3. To request a re-clean, you must provide specific details about the areas of concern and allow our team
          reasonable access to address the issues.
        </p>
        <p className={textStyles + " mt-4"}>
          5.4. The satisfaction guarantee applies only to services that have been paid for in full.
        </p>
      </>
    ),
    "customer-responsibilities": (
      <>
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 dark:border-amber-600 p-4 rounded-r-md mb-6">
          <h3 className="text-amber-800 dark:text-amber-400 font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Important Information
          </h3>
          <p className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
            This section outlines your responsibilities as a customer to ensure a successful cleaning service. Failure
            to meet these responsibilities may affect our ability to provide services as expected.
          </p>
        </div>
        <p className={textStyles}>
          6.1. Customers must provide a safe and accessible environment for our cleaning professionals.
        </p>
        <p className={textStyles + " mt-4"}>
          6.2. Valuable or fragile items should be secured or removed from the cleaning area.
        </p>
        <p className={textStyles + " mt-4"}>
          6.3. Customers are responsible for providing accurate information about the property and specific cleaning
          requirements.
        </p>
        <p className={textStyles + " mt-4"}>
          6.4. Pets should be secured or removed from the cleaning area during service.
        </p>
      </>
    ),
    liability: (
      <>
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 dark:border-amber-600 p-4 rounded-r-md mb-6">
          <h3 className="text-amber-800 dark:text-amber-400 font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Important Information
          </h3>
          <p className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
            This section contains important information about liability limitations and damage claims. Please read
            carefully.
          </p>
        </div>
        <p className={textStyles}>
          7.1. Smiley Brooms is insured for property damage caused directly by our cleaning professionals during
          service.
        </p>
        <p className={textStyles + " mt-4"}>
          7.2. Claims must be reported within 24 hours of service completion with supporting documentation.
        </p>
        <p className={textStyles + " mt-4"}>
          7.3. We are not liable for pre-existing damage, normal wear and tear, or damage resulting from customer
          negligence.
        </p>
        <p className={textStyles + " mt-4"}>
          7.4. Our liability is limited to the cost of the cleaning service provided.
        </p>
      </>
    ),
    accessibility: (
      <>
        <p className={textStyles}>
          8.1. Smiley Brooms is committed to providing accessible services to all customers, including those with
          disabilities.
        </p>
        <p className={textStyles + " mt-4"}>
          8.2. Our website and mobile applications are designed to be accessible according to WCAG 2.1 guidelines.
        </p>
        <p className={textStyles + " mt-4"}>
          8.3. Customers with specific accessibility needs can contact our customer service for accommodations.
        </p>
        <p className={textStyles + " mt-4"}>
          8.4. We strive to ensure that our services are accessible to all individuals and welcome feedback on how we
          can improve accessibility.
        </p>
      </>
    ),
    "intellectual-property": (
      <>
        <p className={textStyles}>
          9.1. All content on our website and mobile applications, including text, graphics, logos, and software, is the
          property of Smiley Brooms and protected by copyright laws.
        </p>
        <p className={textStyles + " mt-4"}>
          9.2. Unauthorized use, reproduction, or distribution of our intellectual property is prohibited.
        </p>
        <p className={textStyles + " mt-4"}>
          9.3. The Smiley Brooms name, logo, and related marks are trademarks of Smiley Brooms LLC and may not be used
          without prior written permission.
        </p>
      </>
    ),
    "dispute-resolution": (
      <>
        <p className={textStyles}>
          10.1. Any disputes arising from our services shall first be addressed through our customer service.
        </p>
        <p className={textStyles + " mt-4"}>
          10.2. If a resolution cannot be reached, disputes will be resolved through arbitration in accordance with the
          laws of the state where the service was provided.
        </p>
        <p className={textStyles + " mt-4"}>
          10.3. The arbitration shall be conducted by a single arbitrator in accordance with the rules of the American
          Arbitration Association.
        </p>
        <p className={textStyles + " mt-4"}>
          10.4. The decision of the arbitrator shall be final and binding on both parties.
        </p>
      </>
    ),
    modifications: (
      <>
        <p className={textStyles}>
          11.1. Smiley Brooms reserves the right to modify these Terms and Conditions at any time.
        </p>
        <p className={textStyles + " mt-4"}>
          11.2. Changes will be effective upon posting to our website. Continued use of our services constitutes
          acceptance of the modified terms.
        </p>
        <p className={textStyles + " mt-4"}>
          11.3. For significant changes, we will make reasonable efforts to notify customers through email or prominent
          notices on our website.
        </p>
        <p className={textStyles + " mt-4"}>
          11.4. It is your responsibility to review these Terms periodically to stay informed of any updates.
        </p>
      </>
    ),
    contact: (
      <>
        <p className={textStyles}>
          For questions or concerns regarding these Terms and Conditions, please contact us at:
        </p>
        <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <p className={textStyles}>
            Email:{" "}
            <a href="mailto:legal@smileybrooms.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              legal@smileybrooms.com
            </a>
          </p>
          <p className={textStyles}>Phone: (602) 800-0605</p>
          <p className={textStyles}>Address: 123 Cleaning Street, Suite 100, Sparkle City, SC 12345</p>
          <p className={textStyles + " mt-2"}>Business Hours: Monday - Friday, 9:00 AM - 5:00 PM EST</p>
        </div>
      </>
    ),
  }

  // Privacy policy content
  const privacyContent = {
    "information-collect": (
      <>
        <p className={textStyles}>
          1.1. Personal Information: We collect information such as your name, email address, phone number, billing and
          service addresses, and payment information.
        </p>
        <p className={textStyles + " mt-4"}>
          1.2. Service Information: We collect details about the cleaning services you request, including property size,
          service frequency, and special instructions.
        </p>
        <p className={textStyles + " mt-4"}>
          1.3. Usage Information: We collect information about how you interact with our website and mobile
          applications, including IP address, browser type, pages visited, and time spent.
        </p>
        <p className={textStyles + " mt-4"}>
          1.4. Device Information: We may collect information about the devices you use to access our services,
          including device type, operating system, and unique device identifiers.
        </p>
      </>
    ),
    "information-use": (
      <>
        <p className={textStyles}>We use the information we collect for the following purposes:</p>
        <p className={textStyles + " mt-4"}>2.1. To provide and improve our cleaning services.</p>
        <p className={textStyles + " mt-4"}>2.2. To process payments and manage your account.</p>
        <p className={textStyles + " mt-4"}>
          2.3. To communicate with you about your bookings, promotions, and updates.
        </p>
        <p className={textStyles + " mt-4"}>2.4. To analyze usage patterns and enhance our website and applications.</p>
        <p className={textStyles + " mt-4"}>2.5. To comply with legal obligations.</p>
      </>
    ),
    "information-sharing": (
      <>
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 dark:border-amber-600 p-4 rounded-r-md mb-6">
          <h3 className="text-amber-800 dark:text-amber-400 font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Important Information
          </h3>
          <p className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
            This section describes how and with whom we share your personal information. Please read carefully to
            understand our data sharing practices.
          </p>
        </div>
        <p className={textStyles}>
          3.1. Service Providers: We may share your information with third-party service providers who assist us in
          operating our business, such as payment processors and cleaning professionals.
        </p>
        <p className={textStyles + " mt-4"}>
          3.2. Legal Requirements: We may disclose your information if required by law or to protect our rights,
          property, or safety.
        </p>
        <p className={textStyles + " mt-4"}>
          3.3. Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be
          transferred as part of the transaction.
        </p>
        <p className={textStyles + " mt-4"}>
          3.4. With Your Consent: We may share your information with third parties when you have given us your consent
          to do so.
        </p>
      </>
    ),
    "data-security": (
      <>
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 dark:border-amber-600 p-4 rounded-r-md mb-6">
          <h3 className="text-amber-800 dark:text-amber-400 font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Important Information
          </h3>
          <p className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
            This section describes how we protect your personal information and the limitations of our security
            measures.
          </p>
        </div>
        <p className={textStyles}>
          4.1. We implement appropriate technical and organizational measures to protect your personal information from
          unauthorized access, disclosure, alteration, or destruction.
        </p>
        <p className={textStyles + " mt-4"}>
          4.2. While we strive to protect your information, no method of transmission over the Internet or electronic
          storage is 100% secure.
        </p>
        <p className={textStyles + " mt-4"}>
          4.3. We regularly review and update our security practices to enhance protection of your information.
        </p>
        <p className={textStyles + " mt-4"}>
          4.4. We limit access to personal information to employees, contractors, and agents who need to know that
          information to process it for us and are subject to strict contractual confidentiality obligations.
        </p>
      </>
    ),
    "your-rights": (
      <>
        <p className={textStyles}>
          Depending on your location, you may have certain rights regarding your personal information:
        </p>
        <p className={textStyles + " mt-4"}>
          5.1. Access and Correction: You have the right to access and correct your personal information.
        </p>
        <p className={textStyles + " mt-4"}>
          5.2. Deletion: You may request the deletion of your personal information, subject to legal requirements.
        </p>
        <p className={textStyles + " mt-4"}>5.3. Opt-Out: You can opt out of marketing communications at any time.</p>
        <p className={textStyles + " mt-4"}>
          5.4. Data Portability: You may request a copy of your personal information in a structured, commonly used, and
          machine-readable format.
        </p>
      </>
    ),
    cookies: (
      <>
        <p className={textStyles}>
          6.1. We use cookies and similar tracking technologies to collect information about your browsing activities
          and preferences.
        </p>
        <p className={textStyles + " mt-4"}>
          6.2. You can manage your cookie preferences through your browser settings, but disabling cookies may affect
          the functionality of our website.
        </p>
        <p className={textStyles + " mt-4"}>6.3. We use the following types of cookies:</p>
        <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Essential cookies: Necessary for the website to function properly</li>
          <li>Preference cookies: Remember your preferences and settings</li>
          <li>Analytics cookies: Help us understand how visitors interact with our website</li>
          <li>Marketing cookies: Track your online activity to help advertisers deliver more relevant advertising</li>
        </ul>
      </>
    ),
    "childrens-privacy": (
      <>
        <p className={textStyles}>7.1. Our services are not intended for individuals under the age of 18.</p>
        <p className={textStyles + " mt-4"}>
          7.2. We do not knowingly collect personal information from children. If we become aware that we have collected
          personal information from a child without parental consent, we will take steps to delete that information.
        </p>
        <p className={textStyles + " mt-4"}>
          7.3. If you believe we might have any information from or about a child, please contact us using the
          information provided in the Contact Information section.
        </p>
      </>
    ),
    "third-party": (
      <>
        <p className={textStyles}>
          8.1. Our website and applications may contain links to third-party websites or services.
        </p>
        <p className={textStyles + " mt-4"}>
          8.2. We are not responsible for the privacy practices or content of these third-party sites.
        </p>
        <p className={textStyles + " mt-4"}>
          8.3. We encourage you to read the privacy policies of any third-party websites you visit.
        </p>
      </>
    ),
    changes: (
      <>
        <p className={textStyles}>9.1. We may update our Privacy Policy from time to time.</p>
        <p className={textStyles + " mt-4"}>
          9.2. We will notify you of any significant changes by posting the new Privacy Policy on our website or through
          other communication channels.
        </p>
        <p className={textStyles + " mt-4"}>
          9.3. The date of the last update will be indicated at the top of the Privacy Policy.
        </p>
        <p className={textStyles + " mt-4"}>
          9.4. We encourage you to review our Privacy Policy periodically to stay informed about how we are protecting
          your information.
        </p>
      </>
    ),
    "privacy-contact": (
      <>
        <p className={textStyles}>For questions or concerns regarding our Privacy Policy, please contact us at:</p>
        <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <p className={textStyles}>
            Email:{" "}
            <a href="mailto:privacy@smileybrooms.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              privacy@smileybrooms.com
            </a>
          </p>
          <p className={textStyles}>Phone: (602) 800-0605</p>
          <p className={textStyles}>Address: 123 Cleaning Street, Suite 100, Sparkle City, SC 12345</p>
          <p className={textStyles + " mt-2"}>Data Protection Officer: privacy-officer@smileybrooms.com</p>
        </div>
      </>
    ),
  }

  // Sections for the table of contents
  const termsSections: Section[] = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <FileText className="h-4 w-4" />,
      content: termsContent.introduction,
    },
    {
      id: "service-description",
      title: "Service Description",
      icon: <Info className="h-4 w-4" />,
      content: termsContent["service-description"],
    },
    {
      id: "booking-cancellation",
      title: "Booking & Cancellation",
      icon: <Calendar className="h-4 w-4" />,
      content: termsContent["booking-cancellation"],
    },
    {
      id: "payment-terms",
      title: "Payment Terms",
      icon: <CreditCard className="h-4 w-4" />,
      important: true,
      content: termsContent["payment-terms"],
    },
    {
      id: "service-guarantee",
      title: "Service Guarantee",
      icon: <Shield className="h-4 w-4" />,
      content: termsContent["service-guarantee"],
    },
    {
      id: "customer-responsibilities",
      title: "Customer Responsibilities",
      icon: <AlertTriangle className="h-4 w-4" />,
      important: true,
      content: termsContent["customer-responsibilities"],
    },
    {
      id: "liability",
      title: "Liability",
      icon: <AlertTriangle className="h-4 w-4" />,
      important: true,
      content: termsContent.liability,
    },
    {
      id: "accessibility",
      title: "Accessibility Compliance",
      icon: <HelpCircle className="h-4 w-4" />,
      content: termsContent.accessibility,
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <FileText className="h-4 w-4" />,
      content: termsContent["intellectual-property"],
    },
    {
      id: "dispute-resolution",
      title: "Dispute Resolution",
      icon: <AlertTriangle className="h-4 w-4" />,
      content: termsContent["dispute-resolution"],
    },
    {
      id: "modifications",
      title: "Modifications to Terms",
      icon: <FileText className="h-4 w-4" />,
      content: termsContent.modifications,
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: <Info className="h-4 w-4" />,
      content: termsContent.contact,
    },
  ]

  const privacySections: Section[] = [
    {
      id: "information-collect",
      title: "Information We Collect",
      icon: <FileText className="h-4 w-4" />,
      content: privacyContent["information-collect"],
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: <Info className="h-4 w-4" />,
      content: privacyContent["information-use"],
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: <ExternalLink className="h-4 w-4" />,
      important: true,
      content: privacyContent["information-sharing"],
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Shield className="h-4 w-4" />,
      important: true,
      content: privacyContent["data-security"],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      icon: <Shield className="h-4 w-4" />,
      content: privacyContent["your-rights"],
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: <Info className="h-4 w-4" />,
      content: privacyContent["cookies"],
    },
    {
      id: "childrens-privacy",
      title: "Children's Privacy",
      icon: <AlertTriangle className="h-4 w-4" />,
      content: privacyContent["childrens-privacy"],
    },
    {
      id: "third-party",
      title: "Third-Party Links",
      icon: <ExternalLink className="h-4 w-4" />,
      content: privacyContent["third-party"],
    },
    {
      id: "changes",
      title: "Changes to Privacy Policy",
      icon: <FileText className="h-4 w-4" />,
      content: privacyContent["changes"],
    },
    {
      id: "privacy-contact",
      title: "Contact Information",
      icon: <Info className="h-4 w-4" />,
      content: privacyContent["privacy-contact"],
    },
  ]

  // Initialize viewed sections tracking
  useEffect(() => {
    if (isOpen) {
      // Load previously viewed sections from localStorage
      const savedTermsViewed = getSectionsViewed("terms")
      const savedPrivacyViewed = getSectionsViewed("privacy")

      // Initialize terms viewed state if empty
      if (Object.keys(savedTermsViewed).length === 0) {
        const initialTermsViewed: Record<string, boolean> = {}
        termsSections.forEach((section) => {
          initialTermsViewed[section.id] = false
        })
        setTermsViewed(initialTermsViewed)
      } else {
        setTermsViewed(savedTermsViewed)
      }

      // Initialize privacy viewed state if empty
      if (Object.keys(savedPrivacyViewed).length === 0) {
        const initialPrivacyViewed: Record<string, boolean> = {}
        privacySections.forEach((section) => {
          initialPrivacyViewed[section.id] = false
        })
        setPrivacyViewed(initialPrivacyViewed)
      } else {
        setPrivacyViewed(savedPrivacyViewed)
      }

      // Set initial scroll position based on saved position
      if (continuousScroll && scrollContainerRef.current) {
        // For continuous scroll, find the appropriate position
        const savedPosition = getScrollPosition(activeTab)
        if (savedPosition > 0) {
          setTimeout(() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = savedPosition
            }
          }, 100)
        }
      }
    }
  }, [isOpen, activeTab, continuousScroll])

  // Check if all sections have been viewed
  useEffect(() => {
    // Check if all terms sections have been viewed
    const allTerms = Object.values(termsViewed).every((viewed) => viewed)
    setAllTermsViewed(allTerms)

    // Check if all privacy sections have been viewed
    const allPrivacy = Object.values(privacyViewed).every((viewed) => viewed)
    setAllPrivacyViewed(allPrivacy)

    // Show accept buttons only when all sections of both documents have been viewed
    // or if forceAccept is true
    setShowAcceptButtons((allTerms && allPrivacy) || forceAccept)

    // Save viewed sections to localStorage
    saveSectionsViewed("terms", termsViewed)
    saveSectionsViewed("privacy", privacyViewed)
  }, [termsViewed, privacyViewed, forceAccept])

  // Handle scroll events for continuous scrolling mode
  useEffect(() => {
    if (!continuousScroll || !scrollContainerRef.current) return

    const handleScroll = () => {
      if (!scrollContainerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      const scrollPosition = scrollTop

      // Show/hide back to top button
      setShowBackToTop(scrollTop > 300)

      // Calculate reading progress
      const progress = Math.min(Math.ceil((scrollTop / (scrollHeight - clientHeight)) * 100), 100)
      setReadingProgress(progress)

      // Save scroll position
      saveScrollPosition(activeTab, scrollPosition)

      // Determine which section is currently visible
      const sections = document.querySelectorAll("[data-section-id]")
      let currentSection = ""

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        // If the section is in view
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.getAttribute("data-section-id") || ""
          setActiveSection(currentSection)

          // Mark section as viewed
          const sectionId = currentSection
          if (sectionId) {
            // Determine if it's a terms or privacy section
            if (termsSections.some((s) => s.id === sectionId)) {
              setTermsViewed((prev) => ({ ...prev, [sectionId]: true }))
            } else if (privacySections.some((s) => s.id === sectionId)) {
              setPrivacyViewed((prev) => ({ ...prev, [sectionId]: true }))
            }
          }
        }
      })

      // Check if we're near the bottom of the content
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

      // If we're near the bottom, mark all sections as viewed
      if (isNearBottom) {
        const allTermsIds = termsSections.map((s) => s.id)
        const allPrivacyIds = privacySections.map((s) => s.id)

        const updatedTermsViewed = { ...termsViewed }
        allTermsIds.forEach((id) => {
          updatedTermsViewed[id] = true
        })

        const updatedPrivacyViewed = { ...privacyViewed }
        allPrivacyIds.forEach((id) => {
          updatedPrivacyViewed[id] = true
        })

        setTermsViewed(updatedTermsViewed)
        setPrivacyViewed(updatedPrivacyViewed)
      }
    }

    const scrollContainer = scrollContainerRef.current
    scrollContainer.addEventListener("scroll", handleScroll)

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [continuousScroll, activeTab, termsViewed, privacyViewed])

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !forceAccept) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose, forceAccept])

  // Handle focus on search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const results: Array<{ sectionId: string; tab: "terms" | "privacy"; text: string }> = []

    // Search in Terms sections
    termsSections.forEach((section) => {
      const sectionText = document.getElementById(section.id)?.textContent || ""
      if (sectionText.toLowerCase().includes(query)) {
        results.push({
          sectionId: section.id,
          tab: "terms",
          text: highlightSearchQuery(sectionText, query),
        })
      }
    })

    // Search in Privacy sections
    privacySections.forEach((section) => {
      const sectionText = document.getElementById(section.id)?.textContent || ""
      if (sectionText.toLowerCase().includes(query)) {
        results.push({
          sectionId: section.id,
          tab: "privacy",
          text: highlightSearchQuery(sectionText, query),
        })
      }
    })

    setSearchResults(results)
  }, [searchQuery])

  // Helper function to highlight search query in text
  const highlightSearchQuery = (text: string, query: string): string => {
    const maxLength = 100
    const index = text.toLowerCase().indexOf(query)

    if (index === -1) return text.substring(0, maxLength) + "..."

    const start = Math.max(0, index - 50)
    const end = Math.min(text.length, index + query.length + 50)
    const excerpt = text.substring(start, end)

    return (start > 0 ? "..." : "") + excerpt + (end < text.length ? "..." : "")
  }

  // Scroll to section with smooth animation
  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (continuousScroll && scrollContainerRef.current) {
        const section = document.querySelector(`[data-section-id="${sectionId}"]`)
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" })
          setShowTableOfContents(false)
        }
      } else {
        // For tabbed mode
        const sections = activeTab === "terms" ? termsSections : privacySections
        const sectionIndex = sections.findIndex((section) => section.id === sectionId)
        if (sectionIndex !== -1) {
          setActiveSection(sectionId)
        }
      }
    },
    [activeTab, continuousScroll],
  )

  // Handle search result click
  const handleSearchResultClick = (sectionId: string, tab: "terms" | "privacy") => {
    if (!continuousScroll) {
      setActiveTab(tab)
    }

    setTimeout(() => {
      scrollToSection(sectionId)
      setIsSearchOpen(false)
      setSearchQuery("")
    }, 100)
  }

  // Handle print
  const handlePrint = () => {
    const printContent = document.getElementById("continuous-content")?.innerHTML
    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Terms and Privacy Policy - Smiley Brooms</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
                h1 { color: #2563eb; margin-top: 20px; }
                h2 { color: #4b5563; margin-top: 20px; }
                p { margin-bottom: 10px; }
                .important { background-color: #fffbeb; padding: 10px; border-left: 4px solid #f59e0b; }
              </style>
            </head>
            <body>
              <h1>Terms and Conditions & Privacy Policy</h1>
              ${printContent}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  // Handle copy
  const handleCopy = () => {
    const content = document.getElementById("continuous-content")
    if (content) {
      navigator.clipboard
        .writeText(content.innerText)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
          toast({
            title: "Copied to clipboard",
            description: "Terms and Privacy Policy copied to clipboard.",
            duration: 2000,
          })
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
          toast({
            title: "Failed to copy",
            description: "Please try again or select and copy manually.",
            variant: "destructive",
          })
        })
    }
  }

  // Handle download as text
  const handleDownload = () => {
    const content = document.getElementById("continuous-content")
    if (content) {
      const blob = new Blob([content.innerText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "terms-and-privacy-policy.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Downloaded",
        description: "Terms and Privacy Policy downloaded as text file.",
        duration: 2000,
      })
    }
  }

  // Toggle text size
  const cycleTextSize = () => {
    const sizes: Array<"small" | "normal" | "large" | "xl"> = ["small", "normal", "large", "xl"]
    const currentIndex = sizes.indexOf(textSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setTextSize(sizes[nextIndex])

    toast({
      title: "Text size changed",
      description: `Text size set to ${sizes[nextIndex]}`,
      duration: 1000,
    })
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    // Toggle dark class on document element
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark")
      setIsDarkMode(!isDarkMode)
    }
  }

  // Function to make the prose content scale based on the text size
  const getTextSizeClass = () => {
    switch (textSize) {
      case "small":
        return "text-sm prose-sm"
      case "normal":
        return "text-base prose-base"
      case "large":
        return "text-lg prose-lg"
      case "xl":
        return "text-xl prose-xl"
      default:
        return "text-base prose-base"
    }
  }

  // Calculate content height based on viewport and header/footer
  const getContentHeight = () => {
    // Header height + progress indicator + tabs + footer + buffer
    const headerHeight = 72 // Header
    const progressHeight = 36 // Progress indicator
    const footerHeight = 80 // Footer
    const buffer = 20 // Buffer
    const nonContentHeight = headerHeight + progressHeight + footerHeight + buffer
    return viewportHeight - nonContentHeight
  }

  // Scroll to top of content
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  // Handle decline
  const handleDecline = () => {
    if (forceAccept) {
      toast({
        title: "Terms Acceptance Required",
        description: "You must accept the Terms and Privacy Policy to continue.",
        variant: "destructive",
      })
    } else {
      setShowDeclineDialog(true)
    }
  }

  // Handle go to homepage
  const handleGoToHomepage = () => {
    window.location.href = "/"
  }

  // Handle goodbye (close window)
  const handleGoodbye = () => {
    window.close()
    // Fallback if window.close() doesn't work (most browsers block it)
    setTimeout(() => {
      window.location.href = "/"
    }, 500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-white dark:bg-gray-900">
        <div ref={modalRef} className="relative w-full h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Terms and Privacy Policy
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Last updated: May 1, 2025</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Search"
                title="Search"
              >
                <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setShowTableOfContents(!showTableOfContents)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={showTableOfContents ? "Hide table of contents" : "Show table of contents"}
                title="Table of Contents"
              >
                <List className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={cycleTextSize}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Change text size"
                title="Change Text Size"
              >
                <Type className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>
              {!forceAccept && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close dialog"
                  title="Close"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Search Panel */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4">
                  <div className="relative">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search terms and privacy policy..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div
                      ref={searchResultsRef}
                      className="mt-4 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      {searchResults.map((result, index) => (
                        <button
                          key={`${result.sectionId}-${index}`}
                          className="p-3 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-start"
                          onClick={() => handleSearchResultClick(result.sectionId, result.tab)}
                        >
                          <div className="mr-2 mt-1">
                            {result.tab === "terms" ? (
                              <FileText className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Shield className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {result.tab === "terms"
                                ? termsSections.find((s) => s.id === result.sectionId)?.title
                                : privacySections.find((s) => s.id === result.sectionId)?.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {result.tab === "terms" ? "Terms & Conditions" : "Privacy Policy"}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {result.text}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && (
                    <div className="mt-4 p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-md">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Indicator */}
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                <span>Reading Progress:</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full mr-1",
                      allTermsViewed ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600",
                    )}
                  />
                  <span>Terms</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full mr-1",
                      allPrivacyViewed ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600",
                    )}
                  />
                  <span>Privacy</span>
                </div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-300 ease-in-out"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
          </div>

          {/* Table of Contents Sidebar */}
          <AnimatePresence>
            {showTableOfContents && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">Table of Contents</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrint}
                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                        title="Print"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                        title="Copy to Clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                        title="Download as Text"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-y-auto pr-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Terms and Conditions</h4>
                        <ul className="space-y-1">
                          {termsSections.map((section) => (
                            <li key={section.id}>
                              <button
                                onClick={() => scrollToSection(section.id)}
                                className="w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              >
                                {section.icon}
                                <span>{section.title}</span>
                                {section.important && (
                                  <span className="ml-auto bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 text-xs px-1.5 py-0.5 rounded-full">
                                    Important
                                  </span>
                                )}
                                {termsViewed[section.id] && <Check className="h-3.5 w-3.5 text-green-500 ml-auto" />}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Privacy Policy</h4>
                        <ul className="space-y-1">
                          {privacySections.map((section) => (
                            <li key={section.id}>
                              <button
                                onClick={() => scrollToSection(section.id)}
                                className="w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                              >
                                {section.icon}
                                <span>{section.title}</span>
                                {section.important && (
                                  <span className="ml-auto bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 text-xs px-1.5 py-0.5 rounded-full">
                                    Important
                                  </span>
                                )}
                                {privacyViewed[section.id] && <Check className="h-3.5 w-3.5 text-green-500 ml-auto" />}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content area */}
          <div className="flex-1 overflow-hidden" ref={contentRef} style={{ height: getContentHeight() }}>
            {/* Continuous scroll mode */}
            <div ref={scrollContainerRef} className="h-full overflow-y-auto p-4 md:p-6" id="continuous-content">
              <div className={cn("prose dark:prose-invert max-w-3xl mx-auto w-full", getTextSizeClass())}>
                {/* Terms and Conditions Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms and Conditions</h1>
                  <p className="text-gray-600 dark:text-gray-400">Last updated: May 1, 2025</p>
                </div>

                {/* Terms Sections */}
                {termsSections.map((section, index) => (
                  <div key={section.id} data-section-id={section.id} className="mb-12 scroll-mt-24" id={section.id}>
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 md:p-3 rounded-full mr-3 md:mr-4 flex-shrink-0">
                        {section.icon ? (
                          React.cloneElement(section.icon as React.ReactElement, {
                            className: "h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400",
                          })
                        ) : (
                          <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white m-0 break-words">
                        {index + 1}. {section.title}
                        {section.important && (
                          <span className="ml-2 inline-flex items-center bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Important
                          </span>
                        )}
                      </h2>
                    </div>

                    <div className="mt-4 max-w-full break-words">{section.content}</div>
                  </div>
                ))}

                {/* Privacy Policy Header */}
                <div className="mb-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
                  <p className="text-gray-600 dark:text-gray-400">Last updated: May 1, 2025</p>
                </div>

                {/* Privacy Sections */}
                {privacySections.map((section, index) => (
                  <div key={section.id} data-section-id={section.id} className="mb-12 scroll-mt-24" id={section.id}>
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 md:p-3 rounded-full mr-3 md:mr-4 flex-shrink-0">
                        {section.icon ? (
                          React.cloneElement(section.icon as React.ReactElement, {
                            className: "h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400",
                          })
                        ) : (
                          <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white m-0 break-words">
                        {index + 1}. {section.title}
                        {section.important && (
                          <span className="ml-2 inline-flex items-center bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Important
                          </span>
                        )}
                      </h2>
                    </div>

                    <div className="mt-4 max-w-full break-words">{section.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Back to top button */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-24 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg z-20 hover:bg-blue-700 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}

          {/* Footer */}
          <div className="sticky bottom-0 p-4 md:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 shadow-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              © 2025 Smiley Brooms LLC. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {showAcceptButtons ? (
                <>
                  <button
                    onClick={handleDecline}
                    className={cn(
                      "w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                      forceAccept && "opacity-50 cursor-not-allowed",
                    )}
                    disabled={forceAccept}
                  >
                    Decline
                  </button>
                  <button
                    onClick={onAccept}
                    className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Accept Terms & Conditions
                  </button>
                </>
              ) : (
                <div className="w-full flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Lock className="h-4 w-4" />
                  <span>Please read both documents completely to continue</span>
                </div>
              )}
            </div>
          </div>

          {/* Decline Dialog */}
          <AnimatePresence>
            {showDeclineDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    We're sorry to see you go
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    You've declined our Terms and Conditions. We understand that you may have concerns, and we respect
                    your decision. What would you like to do next?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowDeclineDialog(false)}
                      className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleGoToHomepage}
                      className="flex-1 py-2 px-4 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Home className="h-4 w-4" />
                      Homepage
                    </button>
                    <button
                      onClick={handleGoodbye}
                      className="flex-1 py-2 px-4 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-800/30 text-rose-700 dark:text-rose-400 rounded-md transition-colors"
                    >
                      Goodbye
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatePresence>
  )
}
