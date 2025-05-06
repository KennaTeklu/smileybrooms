/**
 * Enhanced Terms Modal Component
 *
 * IMPORTANT: Company name is always "smileybrooms" (lowercase, one word)
 */

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
  Scale,
  UserCheck,
  FileSignature,
  Globe,
  Server,
  ShieldAlert,
  Gavel,
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
  const [showAnimatedButtons, setShowAnimatedButtons] = useState(false)

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)

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
          Welcome to smileybrooms. These Terms and Conditions govern your use of our website, mobile applications, and
          services. By accessing or using our services, you agree to be bound by these Terms.
        </p>
        <p className={textStyles + " mt-4"}>
          This document constitutes a legally binding agreement between you (the "Customer") and smileybrooms LLC ("we,"
          "us," or "our"). Please read these terms carefully before using our services.
        </p>
        <p className={textStyles + " mt-4"}>
          By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by
          these Terms and Conditions. If you do not agree to these terms, you must not use our services.
        </p>
        <p className={textStyles + " mt-4"}>
          These Terms and Conditions were last updated on May 1, 2025, and are effective immediately for all users. We
          reserve the right to change these Terms at any time. Your continued use of our services following any changes
          constitutes your acceptance of the revised Terms.
        </p>
      </>
    ),
    "service-description": (
      <>
        <p className={textStyles}>
          smileybrooms provides professional cleaning services for residential and commercial properties. Our services
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
        <p className={textStyles + " mt-4"}>
          2.1. Service Availability: Our services are subject to availability in your geographic area. We reserve the
          right to refuse service to anyone for any reason at any time.
        </p>
        <p className={textStyles + " mt-4"}>
          2.2. Service Modifications: We may modify, suspend, or discontinue any aspect of our services at any time
          without prior notice or liability.
        </p>
        <p className={textStyles + " mt-4"}>
          2.3. Service Quality: While we strive to provide high-quality services, we do not guarantee that our services
          will meet your specific requirements or expectations. Results may vary based on the condition of your property
          and other factors beyond our control.
        </p>
        <p className={textStyles + " mt-4"}>
          2.4. Third-Party Services: We may recommend or facilitate third-party services. We are not responsible for the
          actions, content, products, or services of these third parties.
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
        <p className={textStyles + " mt-4"}>
          3.6. Recurring Bookings: For recurring service plans, you may cancel or modify your plan with at least 7 days'
          notice before your next scheduled service. Cancellations made less than 7 days before a scheduled service will
          be subject to our standard cancellation policy.
        </p>
        <p className={textStyles + " mt-4"}>
          3.7. Service Delays: We will make reasonable efforts to arrive at the scheduled time. However, delays may
          occur due to traffic, weather, or other unforeseen circumstances. We will notify you as soon as possible if a
          delay is expected.
        </p>
        <p className={textStyles + " mt-4"}>
          3.8. Access to Property: You are responsible for ensuring that our cleaning professionals have access to your
          property at the scheduled time. If we cannot access your property, it will be considered a no-show and charged
          accordingly.
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
        <p className={textStyles + " mt-4"}>
          4.5. Payment Processing: All payments are processed through secure third-party payment processors. By
          providing your payment information, you authorize us to charge the applicable fees to your payment method.
        </p>
        <p className={textStyles + " mt-4"}>
          4.6. Taxes: All fees are exclusive of applicable taxes. You are responsible for paying all taxes, levies, or
          duties imposed by taxing authorities.
        </p>
        <p className={textStyles + " mt-4"}>
          4.7. Refunds: Refunds are issued at our discretion and in accordance with our satisfaction guarantee. Refunds
          may be issued as credits toward future services rather than monetary refunds.
        </p>
        <p className={textStyles + " mt-4"}>
          4.8. Disputed Charges: If you dispute a charge, you must contact us within 30 days of the charge. We reserve
          the right to suspend service while a payment dispute is being resolved.
        </p>
        <p className={textStyles + " mt-4"}>
          4.9. Late Payments: For invoiced services, payments not received by the due date may incur a late fee of 1.5%
          per month or the maximum rate permitted by law, whichever is lower.
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
        <p className={textStyles + " mt-4"}>5.5. Limitations: Our satisfaction guarantee does not cover:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Areas that were not accessible during the original service</li>
          <li>Conditions that require specialized treatments beyond our standard services</li>
          <li>Damage that existed prior to our service</li>
          <li>Issues arising from customer's failure to meet their responsibilities</li>
          <li>Natural wear and tear or degradation of surfaces over time</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          5.6. Time Limit: All requests for re-cleaning must be submitted within 24 hours of service completion.
          Requests made after this period will be evaluated on a case-by-case basis.
        </p>
        <p className={textStyles + " mt-4"}>
          5.7. Resolution Process: If a re-clean does not resolve the issue to your satisfaction, we may offer a partial
          or full refund at our discretion, depending on the nature and extent of the concern.
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
        <p className={textStyles + " mt-4"}>
          6.5. Property Access: You must ensure that our cleaning professionals have safe and legal access to your
          property at the scheduled time. This includes providing necessary keys, codes, or other entry methods.
        </p>
        <p className={textStyles + " mt-4"}>6.6. Pre-Cleaning Preparation: Before our arrival, you should:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Clear floors of clothing, toys, and other items that may impede cleaning</li>
          <li>Secure or remove valuable, fragile, or sentimental items</li>
          <li>Inform us of any special instructions or areas requiring particular attention</li>
          <li>Identify any areas that should not be cleaned or products that should not be used</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          6.7. Utilities: You must ensure that your property has functioning electricity and water during the scheduled
          service time.
        </p>
        <p className={textStyles + " mt-4"}>
          6.8. Disclosure of Hazards: You must inform us of any known hazards, including but not limited to:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Pest infestations</li>
          <li>Mold or mildew problems</li>
          <li>Structural issues</li>
          <li>Biohazards or toxic substances</li>
          <li>Recent application of pesticides or chemicals</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          6.9. Respectful Treatment: You agree to treat our cleaning professionals with respect and dignity. Harassment,
          discrimination, or abusive behavior will not be tolerated and may result in immediate termination of service
          without refund.
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
          7.1. smileybrooms is insured for property damage caused directly by our cleaning professionals during service.
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
        <p className={textStyles + " mt-4"}>
          7.5. Limitation of Liability: TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
          SMILEYBROOMS, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT,
          PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR
          LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, THAT RESULT FROM THE USE OF, OR INABILITY TO
          USE, THE SERVICE OR ANY MATERIALS OR CONTENT ON THE SERVICE, EVEN IF SMILEYBROOMS HAS BEEN ADVISED OF THE
          POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p className={textStyles + " mt-4"}>
          7.6. Maximum Liability: TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SMILEYBROOMS'S AGGREGATE LIABILITY
          TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICE, WHETHER IN CONTRACT, TORT, OR OTHERWISE, IS
          LIMITED TO THE AMOUNT PAID BY YOU TO SMILEYBROOMS FOR THE SERVICE DURING THE TWELVE (12) MONTH PERIOD
          IMMEDIATELY PRECEDING THE DATE OF THE CLAIM.
        </p>
        <p className={textStyles + " mt-4"}>
          7.7. Indemnification: You agree to indemnify, defend, and hold harmless smileybrooms, its affiliates,
          officers, directors, employees, agents, and licensors from and against all losses, expenses, damages, and
          costs, including reasonable attorneys' fees, resulting from any violation by you of these Terms or any
          activity related to your account (including negligent or wrongful conduct).
        </p>
        <p className={textStyles + " mt-4"}>
          7.8. Force Majeure: smileybrooms shall not be liable for any failure to perform its obligations under these
          Terms where such failure results from any cause beyond smileybrooms's reasonable control, including, but not
          limited to, mechanical, electronic, or communications failure or degradation, acts of God, terrorism,
          pandemic, epidemic, or government restrictions.
        </p>
      </>
    ),
    accessibility: (
      <>
        <p className={textStyles}>
          8.1. smileybrooms is committed to providing accessible services to all customers, including those with
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
        <p className={textStyles + " mt-4"}>
          8.5. Reasonable Accommodations: We will make reasonable accommodations for customers with disabilities to
          ensure equal access to our services. Please contact us at least 48 hours before your scheduled service to
          discuss specific accommodations.
        </p>
        <p className={textStyles + " mt-4"}>
          8.6. Service Animals: Service animals are welcome on premises where we provide services. However, for the
          safety of the service animal and our cleaning professionals, we recommend securing service animals in a
          separate area during cleaning.
        </p>
        <p className={textStyles + " mt-4"}>
          8.7. Digital Accessibility: If you encounter any accessibility barriers on our website or mobile applications,
          please contact us at accessibility@smileybrooms.com. We are committed to addressing accessibility issues
          promptly.
        </p>
      </>
    ),
    "intellectual-property": (
      <>
        <p className={textStyles}>
          9.1. All content on our website and mobile applications, including text, graphics, logos, and software, is the
          property of smileybrooms and protected by copyright laws.
        </p>
        <p className={textStyles + " mt-4"}>
          9.2. Unauthorized use, reproduction, or distribution of our intellectual property is prohibited.
        </p>
        <p className={textStyles + " mt-4"}>
          9.3. The smileybrooms name, logo, and related marks are trademarks of smileybrooms LLC and may not be used
          without prior written permission.
        </p>
        <p className={textStyles + " mt-4"}>
          9.4. License: We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use
          our website and mobile applications for personal, non-commercial purposes in accordance with these Terms.
        </p>
        <p className={textStyles + " mt-4"}>9.5. Restrictions: You may not:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>
            Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works
            from, transfer, or sell any information or content obtained from our website or mobile applications
          </li>
          <li>Use our website or mobile applications for any commercial purpose without our express written consent</li>
          <li>Attempt to decompile, reverse engineer, disassemble, or hack any of our systems or components</li>
          <li>Use data mining, robots, or similar data gathering and extraction methods</li>
          <li>Frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          9.6. User Content: By submitting content to our website or mobile applications (such as reviews, comments, or
          feedback), you grant smileybrooms a worldwide, non-exclusive, royalty-free, perpetual, irrevocable, and fully
          sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from,
          distribute, and display such content in any media.
        </p>
        <p className={textStyles + " mt-4"}>
          9.7. DMCA Compliance: If you believe that your intellectual property rights have been violated, please contact
          us at legal@smileybrooms.com with information required under the Digital Millennium Copyright Act (DMCA).
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
        <p className={textStyles + " mt-4"}>
          10.5. Mandatory Arbitration: YOU AND SMILEYBROOMS AGREE THAT ANY DISPUTE, CLAIM, OR CONTROVERSY ARISING OUT OF
          OR RELATING TO THESE TERMS OR THE BREACH, TERMINATION, ENFORCEMENT, INTERPRETATION, OR VALIDITY THEREOF OR THE
          USE OF THE SERVICE (COLLECTIVELY, "DISPUTES") WILL BE SETTLED BY BINDING ARBITRATION, EXCEPT THAT EACH PARTY
          RETAINS THE RIGHT TO SEEK INJUNCTIVE OR OTHER EQUITABLE RELIEF IN A COURT OF COMPETENT JURISDICTION TO PREVENT
          THE ACTUAL OR THREATENED INFRINGEMENT, MISAPPROPRIATION, OR VIOLATION OF A PARTY'S COPYRIGHTS, TRADEMARKS,
          TRADE SECRETS, PATENTS, OR OTHER INTELLECTUAL PROPERTY RIGHTS.
        </p>
        <p className={textStyles + " mt-4"}>
          10.6. Class Action Waiver: YOU AND SMILEYBROOMS AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN
          YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR
          REPRESENTATIVE PROCEEDING. Further, unless both you and smileybrooms agree otherwise, the arbitrator may not
          consolidate more than one person's claims, and may not otherwise preside over any form of a representative or
          class proceeding.
        </p>
        <p className={textStyles + " mt-4"}>
          10.7. Governing Law: These Terms and any action related thereto will be governed by the laws of the State of
          Arizona without regard to its conflict of laws provisions.
        </p>
        <p className={textStyles + " mt-4"}>
          10.8. Venue: Any legal action or proceeding arising under these Terms will be brought exclusively in the
          federal or state courts located in Maricopa County, Arizona, and you hereby consent to personal jurisdiction
          and venue in those courts.
        </p>
        <p className={textStyles + " mt-4"}>
          10.9. Time Limitation: You agree that regardless of any statute or law to the contrary, any claim or cause of
          action arising out of or related to use of our services or these Terms must be filed within one (1) year after
          such claim or cause of action arose or be forever barred.
        </p>
      </>
    ),
    modifications: (
      <>
        <p className={textStyles}>
          11.1. smileybrooms reserves the right to modify these Terms and Conditions at any time.
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
        <p className={textStyles + " mt-4"}>
          11.5. Material Changes: If we make material changes to these Terms, we will provide at least 30 days' notice
          before the changes take effect. During this period, you may reject the changes by discontinuing your use of
          our services.
        </p>
        <p className={textStyles + " mt-4"}>
          11.6. Service Modifications: We reserve the right to modify, suspend, or discontinue any part of our services
          at any time without notice or liability.
        </p>
        <p className={textStyles + " mt-4"}>
          11.7. Pricing Changes: We may change our pricing for any of our services at any time. If you have a recurring
          service plan, we will provide at least 30 days' notice before implementing any price changes that would affect
          your plan.
        </p>
        <p className={textStyles + " mt-4"}>
          11.8. Severability: If any provision of these Terms is found to be unenforceable or invalid, that provision
          will be limited or eliminated to the minimum extent necessary so that the Terms will otherwise remain in full
          force and effect and enforceable.
        </p>
      </>
    ),
    "electronic-communications": (
      <>
        <p className={textStyles}>
          12.1. By using our services, you consent to receiving electronic communications from us. These communications
          may include notices about your account, promotional information, and other information concerning or related
          to our services.
        </p>
        <p className={textStyles + " mt-4"}>
          12.2. You agree that any notices, agreements, disclosures, or other communications that we send to you
          electronically will satisfy any legal communication requirements, including that such communications be in
          writing.
        </p>
        <p className={textStyles + " mt-4"}>
          12.3. You may opt out of receiving promotional communications by following the unsubscribe instructions
          provided in those communications. However, you may not opt out of receiving administrative or transactional
          communications related to your account or services.
        </p>
        <p className={textStyles + " mt-4"}>
          12.4. We may record telephone conversations for quality assurance and training purposes. By using our
          telephone services, you consent to such recording.
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
        <p className={textStyles + " mt-4"}>
          1.5. Location Information: With your consent, we may collect precise location information from your device to
          provide location-based services, such as finding nearby service providers.
        </p>
        <p className={textStyles + " mt-4"}>
          1.6. Communications: We collect and store communications between you and smileybrooms, including customer
          service inquiries, feedback, and survey responses.
        </p>
        <p className={textStyles + " mt-4"}>
          1.7. Third-Party Information: We may receive information about you from third-party sources, such as social
          media platforms, marketing partners, and public databases, in accordance with their privacy policies.
        </p>
        <p className={textStyles + " mt-4"}>
          1.8. Automatically Collected Information: We automatically collect certain information when you visit our
          website or use our mobile applications, including through cookies, web beacons, and similar technologies.
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
        <p className={textStyles + " mt-4"}>
          2.6. Service Provision and Improvement: We use your information to provide, maintain, and improve our
          services, including scheduling and performing cleaning services, processing payments, and responding to your
          requests.
        </p>
        <p className={textStyles + " mt-4"}>
          2.7. Personalization: We use your information to personalize your experience with our services, including
          remembering your preferences, suggesting services based on your past bookings, and providing customized
          content.
        </p>
        <p className={textStyles + " mt-4"}>
          2.8. Communication: We use your information to communicate with you about your account, services, promotions,
          and updates. This includes sending service confirmations, reminders, receipts, technical notices, and support
          messages.
        </p>
        <p className={textStyles + " mt-4"}>
          2.9. Marketing: With your consent, we use your information to send marketing communications about our
          services, special offers, and events. You can opt out of these communications at any time.
        </p>
        <p className={textStyles + " mt-4"}>
          2.10. Analytics and Research: We use your information to conduct analytics and research to better understand
          how users interact with our services and to improve our offerings.
        </p>
        <p className={textStyles + " mt-4"}>
          2.11. Legal Compliance: We use your information to comply with applicable laws, regulations, and legal
          processes, such as responding to subpoenas or court orders.
        </p>
        <p className={textStyles + " mt-4"}>
          2.12. Safety and Security: We use your information to protect the safety and security of our services, users,
          employees, and property, including detecting and preventing fraud, unauthorized access, and other harmful
          activities.
        </p>
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
        <p className={textStyles + " mt-4"}>
          3.5. Cleaning Professionals: We share necessary information with our cleaning professionals to provide the
          requested services, including your name, address, contact information, and specific cleaning instructions.
        </p>
        <p className={textStyles + " mt-4"}>
          3.6. Payment Processors: We share payment information with secure third-party payment processors to complete
          transactions. These processors are bound by strict confidentiality obligations and may not use your
          information for any other purposes.
        </p>
        <p className={textStyles + " mt-4"}>
          3.7. Marketing Partners: With your consent, we may share your information with marketing partners to offer you
          products or services that may be of interest to you.
        </p>
        <p className={textStyles + " mt-4"}>
          3.8. Analytics Providers: We share anonymized or aggregated information with analytics providers to help us
          understand how users interact with our services.
        </p>
        <p className={textStyles + " mt-4"}>
          3.9. Social Media Platforms: If you interact with our social media features, the corresponding social media
          platform may collect information about you. These interactions are governed by the privacy policy of the
          respective social media platform.
        </p>
        <p className={textStyles + " mt-4"}>
          3.10. Legal Compliance and Protection: We may disclose your information to comply with applicable laws,
          regulations, legal processes, or governmental requests, or to protect our rights, privacy, safety, or
          property, or that of our users or others.
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
        <p className={textStyles + " mt-4"}>4.5. Security Measures: Our security measures include:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Encryption of sensitive information during transmission using SSL technology</li>
          <li>Secure storage of personal information with restricted access</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Employee training on privacy and security practices</li>
          <li>Physical security measures at our facilities</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          4.6. Data Breach Notification: In the event of a data breach that compromises your personal information, we
          will notify you and relevant authorities as required by applicable laws.
        </p>
        <p className={textStyles + " mt-4"}>
          4.7. Your Responsibility: You are responsible for maintaining the confidentiality of any passwords or access
          credentials associated with your account. You should notify us immediately if you become aware of any
          unauthorized use of your account or credentials.
        </p>
        <p className={textStyles + " mt-4"}>
          4.8. Third-Party Security: While we take steps to ensure that our third-party service providers maintain
          appropriate security measures, we cannot guarantee the security of information processed by these providers.
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
        <p className={textStyles + " mt-4"}>
          5.5. Right to Access: You have the right to request information about the personal data we hold about you and
          to obtain a copy of that data.
        </p>
        <p className={textStyles + " mt-4"}>
          5.6. Right to Rectification: You have the right to request the correction of inaccurate or incomplete personal
          information concerning you.
        </p>
        <p className={textStyles + " mt-4"}>
          5.7. Right to Erasure: In certain circumstances, you have the right to request the deletion of your personal
          information. However, this right may be limited by legal requirements or legitimate interests.
        </p>
        <p className={textStyles + " mt-4"}>
          5.8. Right to Restrict Processing: You have the right to request the restriction of processing of your
          personal information under certain conditions.
        </p>
        <p className={textStyles + " mt-4"}>
          5.9. Right to Object: You have the right to object to the processing of your personal information for direct
          marketing purposes or based on legitimate interests.
        </p>
        <p className={textStyles + " mt-4"}>
          5.10. Right to Data Portability: You have the right to receive your personal information in a structured,
          commonly used, and machine-readable format, and to transmit that data to another controller.
        </p>
        <p className={textStyles + " mt-4"}>
          5.11. Right to Withdraw Consent: Where processing is based on consent, you have the right to withdraw your
          consent at any time, without affecting the lawfulness of processing based on consent before its withdrawal.
        </p>
        <p className={textStyles + " mt-4"}>
          5.12. Right to Lodge a Complaint: You have the right to lodge a complaint with a supervisory authority if you
          believe that our processing of your personal information violates applicable data protection laws.
        </p>
        <p className={textStyles + " mt-4"}>
          5.13. Exercising Your Rights: To exercise any of these rights, please contact us at privacy@smileybrooms.com.
          We will respond to your request within 30 days. We may need to verify your identity before fulfilling your
          request.
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
        <p className={textStyles + " mt-4"}>6.4. Types of Cookies and Similar Technologies:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Session Cookies: Temporary cookies that are deleted when you close your browser</li>
          <li>Persistent Cookies: Cookies that remain on your device for a specified period</li>
          <li>First-Party Cookies: Cookies set by our website</li>
          <li>
            Third-Party Cookies: Cookies set by third parties, such as analytics providers and advertising networks
          </li>
          <li>Web Beacons: Small graphic images that allow us to monitor user behavior and track page visits</li>
          <li>Pixel Tags: Small blocks of code on webpages that allow websites to read and place cookies</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          6.5. Cookie Management: Most web browsers allow you to control cookies through their settings. You can:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Delete all cookies from your browser</li>
          <li>Block all cookies from being set</li>
          <li>Block specific cookies from being set</li>
          <li>Allow only certain cookies to be set</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          6.6. Do Not Track: Some browsers have a "Do Not Track" feature that signals to websites that you do not want
          your online activities tracked. Our website does not currently respond to "Do Not Track" signals.
        </p>
        <p className={textStyles + " mt-4"}>
          6.7. Third-Party Analytics: We use third-party analytics services, such as Google Analytics, to help us
          understand how users interact with our website. These services may use cookies and similar technologies to
          collect information about your use of our website and other websites.
        </p>
        <p className={textStyles + " mt-4"}>
          6.8. Advertising: We may work with third-party advertising companies to serve ads when you visit our website.
          These companies may use cookies and similar technologies to collect information about your visits to our
          website and other websites to provide relevant advertisements.
        </p>
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
        <p className={textStyles + " mt-4"}>
          7.4. Parental Consent: If we learn that we have collected personal information from a child under the age of
          13, we will promptly delete that information unless we have received verifiable parental consent for the
          collection of that information.
        </p>
        <p className={textStyles + " mt-4"}>
          7.5. Parental Rights: Parents or guardians can review, update, or request the deletion of their child's
          personal information by contacting us using the information provided in the Contact Information section.
        </p>
        <p className={textStyles + " mt-4"}>
          7.6. Protection Measures: We implement special measures to protect the privacy and safety of children when we
          know we are collecting or storing personal information from them, in accordance with the Children's Online
          Privacy Protection Act (COPPA).
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
        <p className={textStyles + " mt-4"}>
          8.4. Third-Party Links: Our website and mobile applications may contain links to third-party websites,
          products, or services. These third-party sites have separate and independent privacy policies. We have no
          responsibility or liability for the content and activities of these linked sites.
        </p>
        <p className={textStyles + " mt-4"}>
          8.5. Social Media Features: Our website and mobile applications may include social media features, such as the
          Facebook Like button or Twitter sharing widgets. These features may collect your IP address, which page you
          are visiting on our site, and may set a cookie to enable the feature to function properly. Social media
          features are either hosted by a third party or hosted directly on our site. Your interactions with these
          features are governed by the privacy policy of the company providing them.
        </p>
        <p className={textStyles + " mt-4"}>
          8.6. Third-Party Service Providers: We may use third-party service providers to help us operate our business
          and our website or administer activities on our behalf, such as sending emails or processing payments. These
          third parties may have access to your personal information only to perform these tasks on our behalf and are
          obligated not to disclose or use it for any other purpose.
        </p>
        <p className={textStyles + " mt-4"}>
          8.7. Third-Party Analytics: We may use third-party analytics services, such as Google Analytics, to help us
          understand how users interact with our website. These services may use cookies and similar technologies to
          collect information about your use of our website and other websites.
        </p>
      </>
    ),
    "international-transfers": (
      <>
        <p className={textStyles}>
          9.1. Your information may be transferred to, and maintained on, computers located outside of your state,
          province, country, or other governmental jurisdiction where the data protection laws may differ from those in
          your jurisdiction.
        </p>
        <p className={textStyles + " mt-4"}>
          9.2. If you are located outside the United States and choose to provide information to us, please note that we
          transfer the information, including personal information, to the United States and process it there.
        </p>
        <p className={textStyles + " mt-4"}>
          9.3. Your consent to this Privacy Policy followed by your submission of such information represents your
          agreement to that transfer.
        </p>
        <p className={textStyles + " mt-4"}>
          9.4. Data Transfer Mechanisms: When transferring personal information from the European Economic Area (EEA),
          the United Kingdom, or Switzerland to countries that have not received an adequacy decision from the European
          Commission, we rely on appropriate safeguards, such as:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Standard Contractual Clauses approved by the European Commission</li>
          <li>Binding Corporate Rules for transfers within our corporate group</li>
          <li>Derogations for specific situations, such as with your explicit consent</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          9.5. International Data Protection: We take steps to ensure that your personal information receives an
          adequate level of protection in the countries where we process it. This includes implementing appropriate
          technical and organizational measures to protect your personal information.
        </p>
      </>
    ),
    changes: (
      <>
        <p className={textStyles}>10.1. We may update our Privacy Policy from time to time.</p>
        <p className={textStyles + " mt-4"}>
          10.2. We will notify you of any significant changes by posting the new Privacy Policy on our website or
          through other communication channels.
        </p>
        <p className={textStyles + " mt-4"}>
          10.3. The date of the last update will be indicated at the top of the Privacy Policy.
        </p>
        <p className={textStyles + " mt-4"}>
          10.4. We encourage you to review our Privacy Policy periodically to stay informed about how we are protecting
          your information.
        </p>
        <p className={textStyles + " mt-4"}>
          10.5. Material Changes: If we make material changes to this Privacy Policy, we will provide at least 30 days'
          notice before the changes take effect. During this period, you may reject the changes by discontinuing your
          use of our services.
        </p>
        <p className={textStyles + " mt-4"}>
          10.6. Notification Methods: We may notify you of changes to this Privacy Policy through various methods,
          including:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Email notifications to the email address associated with your account</li>
          <li>Prominent notices on our website or mobile applications</li>
          <li>Push notifications through our mobile applications</li>
          <li>Direct messages to your account</li>
        </ul>
        <p className={textStyles + " mt-4"}>
          10.7. Continued Use: Your continued use of our services after the effective date of any changes to this
          Privacy Policy constitutes your acceptance of the revised Privacy Policy.
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
        <p className={textStyles + " mt-4"}>
          11.1. Response Time: We will respond to your privacy-related inquiries within 30 days of receipt.
        </p>
        <p className={textStyles + " mt-4"}>
          11.2. Complaint Resolution: If you have a complaint about our privacy practices, we will work with you to
          resolve the issue. If we cannot resolve the issue directly, you have the right to contact your local data
          protection authority.
        </p>
        <p className={textStyles + " mt-4"}>
          11.3. California Privacy Rights: California residents may have additional rights regarding their personal
          information under the California Consumer Privacy Act (CCPA) and other California privacy laws. For more
          information, please contact us using the information provided above.
        </p>
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
      icon: <UserCheck className="h-4 w-4" />,
      important: true,
      content: termsContent["customer-responsibilities"],
    },
    {
      id: "liability",
      title: "Liability & Indemnification",
      icon: <ShieldAlert className="h-4 w-4" />,
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
      icon: <FileSignature className="h-4 w-4" />,
      content: termsContent["intellectual-property"],
    },
    {
      id: "dispute-resolution",
      title: "Dispute Resolution",
      icon: <Gavel className="h-4 w-4" />,
      important: true,
      content: termsContent["dispute-resolution"],
    },
    {
      id: "modifications",
      title: "Modifications to Terms",
      icon: <FileText className="h-4 w-4" />,
      content: termsContent.modifications,
    },
    {
      id: "electronic-communications",
      title: "Electronic Communications",
      icon: <Globe className="h-4 w-4" />,
      content: termsContent["electronic-communications"],
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
      icon: <Scale className="h-4 w-4" />,
      content: privacyContent["your-rights"],
    },
    {
      id: "cookies",
      title: "Cookies & Tracking",
      icon: <Server className="h-4 w-4" />,
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
      id: "international-transfers",
      title: "International Data Transfers",
      icon: <Globe className="h-4 w-4" />,
      content: privacyContent["international-transfers"],
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
    // Check if user has already accepted terms via browser permission
    if (typeof window !== "undefined") {
      const hasAccepted = localStorage.getItem("browserTermsAccepted") === "true"

      if (hasAccepted) {
        // Auto-accept terms if browser permission was previously granted
        setTimeout(() => {
          onAccept()
        }, 500)
      } else {
        // If not accepted and not on homepage, force show the terms modal
        const path = window.location.pathname
        if (path !== "/" && isOpen) {
          // Ensure modal is shown for all non-homepage entry points
          setShowConfirmationPopup(true)
        }
      }
    }

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

      // Add this new code to show animated buttons when progress is 100%
      if (progress === 100 && !showAnimatedButtons) {
        setShowAnimatedButtons(true)
      }

      // Check if we're at 75% of the content and show confirmation popup
      const isNearBottom = scrollTop + clientHeight >= scrollHeight * 0.75
      if (isNearBottom && !showConfirmationPopup) {
        setShowConfirmationPopup(true)
      }

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
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100

      // If we're near the bottom, mark all sections as viewed
      if (isAtBottom) {
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

      // Check if user has scrolled a small amount and request browser notification permission
      // This will trigger the browser's native permission popup
      const hasScrolledMinimum = scrollTop > 30
      if (hasScrolledMinimum && !localStorage.getItem("permissionRequested")) {
        // Mark that we've requested permission so we don't ask again
        localStorage.setItem("permissionRequested", "true")

        // Request notification permission which will show a native browser dialog
        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
          try {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                // Store that the user has accepted terms via browser permission
                localStorage.setItem("browserTermsAccepted", "true")

                // Show a small notification confirming acceptance
                const notification = new Notification("Terms Accepted", {
                  body: "Thank you for accepting our terms and conditions. You now have indefinite access to the website.",
                  icon: "/favicon.ico",
                })

                // Close notification after 3 seconds
                setTimeout(() => notification.close(), 3000)

                // Auto-accept terms
                onAccept()
              }
            })
          } catch (error) {
            console.error("Error requesting notification permission:", error)
          }
        }
      }
    }

    const scrollContainer = scrollContainerRef.current
    scrollContainer.addEventListener("scroll", handleScroll)

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [
    continuousScroll,
    activeTab,
    termsViewed,
    privacyViewed,
    showAnimatedButtons,
    allTermsViewed,
    allPrivacyViewed,
    showConfirmationPopup,
    onAccept,
  ])

  // Add this new useEffect to handle showing the animated buttons when all sections are viewed
  // Add after the useEffect that checks if all sections have been viewed
  useEffect(() => {
    if (allTermsViewed && allPrivacyViewed && !showAnimatedButtons) {
      setShowAnimatedButtons(true)
    }
  }, [allTermsViewed, allPrivacyViewed, showAnimatedButtons])

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
              <title>Terms and Privacy Policy - smileybrooms</title>
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

  // Handle continue to website
  const handleContinueToWebsite = () => {
    if (termsChecked && privacyChecked) {
      // Request notification permission which will show a native browser dialog
      if ("Notification" in window) {
        Notification.requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              // Store that the user has accepted terms via browser permission
              localStorage.setItem("browserTermsAccepted", "true")

              // Show a small notification confirming acceptance
              const notification = new Notification("Terms Accepted", {
                body: "Thank you for accepting our terms and conditions. You now have indefinite access to the website.",
                icon: "/favicon.ico",
              })

              // Close notification after 3 seconds
              setTimeout(() => notification.close(), 3000)
            }

            // Accept terms regardless of notification permission
            onAccept()
          })
          .catch((error) => {
            console.error("Error requesting notification permission:", error)
            // Fall back to regular acceptance if notification permission fails
            onAccept()
          })
      } else {
        // If notifications not supported, just accept terms
        onAccept()
      }
    } else {
      toast({
        title: "Please accept both agreements",
        description: "You must check both boxes to continue.",
        variant: "destructive",
      })
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-white dark:bg-gray-900">
        <div ref={modalRef} className="relative w-full h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 md:p-6 border-b border-gray-200 dark:border-gray-700r-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 z-10 shadow-sm">
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

            {/* Animated Accept/Decline Buttons */}
            {showAnimatedButtons && showAcceptButtons && !showConfirmationPopup && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 items-center"
              >
                <div className="text-center mb-2 sm:mb-0 sm:mr-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">You've completed reading!</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Please accept or decline our terms</p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleDecline}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                      forceAccept && "opacity-50 cursor-not-allowed",
                    )}
                    disabled={forceAccept}
                  >
                    Decline
                  </motion.button>
                  <motion.button
                    onClick={onAccept}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    Accept Terms
                  </motion.button>
                </div>
                <motion.button
                  onClick={() => setShowAnimatedButtons(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}

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

            {/* Confirmation Popup - Integrated into the modal */}
            <AnimatePresence>
              {showConfirmationPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-4 z-30"
                >
                  <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Browser Permission Required</h3>
                      <button
                        onClick={() => setShowConfirmationPopup(false)}
                        className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Your browser requires you to accept our Terms and Privacy Policy to continue. This permission will
                      allow you to access the website indefinitely without further prompts.
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center h-5">
                          <input
                            id="terms-checkbox"
                            type="checkbox"
                            checked={termsChecked}
                            onChange={(e) => setTermsChecked(e.target.checked)}
                            className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                          />
                        </div>
                        <label
                          htmlFor="terms-checkbox"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          I have read and agree to the{" "}
                          <button
                            onClick={() => scrollToSection("introduction")}
                            className="text-blue-600 dark:text-blue-500 font-semibold hover:underline"
                          >
                            Terms and Conditions
                          </button>
                        </label>
                      </div>

                      <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center h-5">
                          <input
                            id="privacy-checkbox"
                            type="checkbox"
                            checked={privacyChecked}
                            onChange={(e) => setPrivacyChecked(e.target.checked)}
                            className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
                          />
                        </div>
                        <label
                          htmlFor="privacy-checkbox"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          I have read and agree to the{" "}
                          <button
                            onClick={() => scrollToSection("information-collect")}
                            className="text-blue-600 dark:text-blue-500 font-semibold hover:underline"
                          >
                            Privacy Policy
                          </button>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowConfirmationPopup(false)}
                        className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors"
                      >
                        Continue Reading
                      </button>
                      <button
                        onClick={handleContinueToWebsite}
                        className={`flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 ${
                          !termsChecked || !privacyChecked ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={!termsChecked || !privacyChecked}
                      >
                        Grant Browser Permission
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="sticky bottom-0 p-4 md:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 z-10 shadow-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                © 2025 smileybrooms LLC. All rights reserved.
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
