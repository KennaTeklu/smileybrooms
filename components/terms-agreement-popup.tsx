"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TermsAgreementPopupProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export default function TermsAgreementPopup({ isOpen, onClose, onAccept }: TermsAgreementPopupProps) {
  const [activeTab, setActiveTab] = useState("terms")
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Handle escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, onClose])

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle external links
  const handleExternalLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute("href")
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer")
    }
  }

  if (!mounted) return null
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="terms-modal-title" className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Terms and Conditions
          </h2>
          <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-300">
            Please read and accept our terms and conditions before proceeding.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab("terms")}
            className={cn(
              "flex-1 py-3 px-4 text-sm md:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
              activeTab === "terms"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-900"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
            )}
            aria-selected={activeTab === "terms"}
            role="tab"
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={cn(
              "flex-1 py-3 px-4 text-sm md:text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
              activeTab === "privacy"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-900"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
            )}
            aria-selected={activeTab === "privacy"}
            role="tab"
          >
            Privacy Policy
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "terms" && (
            <div className="p-6 space-y-4 text-left">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">1. Introduction</h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to Smiley Brooms. These Terms and Conditions govern your use of our website, mobile
                applications, and services. By accessing or using our services, you agree to be bound by these Terms.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                2. Service Description
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Smiley Brooms provides professional cleaning services for residential and commercial properties. Our
                services include but are not limited to standard cleaning, deep cleaning, move-in/move-out cleaning, and
                specialized cleaning services.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                3. Booking and Cancellation
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                3.1. Bookings can be made through our website, mobile app, or by contacting our customer service.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                3.2. Cancellations must be made at least 24 hours before the scheduled service. Late cancellations may
                incur a fee of up to 50% of the service cost.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                3.3. No-shows will be charged the full service amount.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">4. Payment Terms</h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                4.1. Payment is required at the time of booking unless otherwise specified.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                4.2. We accept credit/debit cards, PayPal, and other payment methods as specified on our platform.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                4.3. Recurring service plans will be automatically charged according to the selected frequency.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                5. Service Guarantee
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                5.1. We strive to provide high-quality cleaning services. If you are not satisfied with our service,
                please notify us within 24 hours, and we will re-clean the areas of concern at no additional cost.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                5.2. Our satisfaction guarantee is subject to reasonable expectations and does not cover pre-existing
                damage or conditions.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                6. Customer Responsibilities
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                6.1. Customers must provide a safe and accessible environment for our cleaning professionals.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                6.2. Valuable or fragile items should be secured or removed from the cleaning area.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                6.3. Customers are responsible for providing accurate information about the property and specific
                cleaning requirements.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">7. Liability</h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                7.1. Smiley Brooms is insured for property damage caused directly by our cleaning professionals during
                service.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                7.2. Claims must be reported within 24 hours of service completion with supporting documentation.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                7.3. We are not liable for pre-existing damage, normal wear and tear, or damage resulting from customer
                negligence.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                8. Accessibility Compliance
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                8.1. Smiley Brooms is committed to providing accessible services to all customers, including those with
                disabilities.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                8.2. Our website and mobile applications are designed to be accessible according to WCAG 2.1 guidelines.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                8.3. Customers with specific accessibility needs can contact our customer service for accommodations.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                9. Intellectual Property
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                9.1. All content on our website and mobile applications, including text, graphics, logos, and software,
                is the property of Smiley Brooms and protected by copyright laws.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                9.2. Unauthorized use, reproduction, or distribution of our intellectual property is prohibited.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                10. Dispute Resolution
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                10.1. Any disputes arising from our services shall first be addressed through our customer service.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                10.2. If a resolution cannot be reached, disputes will be resolved through arbitration in accordance
                with the laws of the state where the service was provided.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                11. Modifications to Terms
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                11.1. Smiley Brooms reserves the right to modify these Terms and Conditions at any time.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                11.2. Changes will be effective upon posting to our website. Continued use of our services constitutes
                acceptance of the modified terms.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                12. Contact Information
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                For questions or concerns regarding these Terms and Conditions, please contact us at:
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Email:{" "}
                <a href="mailto:legal@smileybrooms.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  legal@smileybrooms.com
                </a>
                <br />
                Phone: (602) 800-0605
                <br />
                Address: 123 Cleaning Street, Suite 100, Sparkle City, SC 12345
              </p>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="p-6 space-y-4 text-left">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                1. Information We Collect
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                1.1. Personal Information: We collect information such as your name, email address, phone number,
                billing and service addresses, and payment information.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                1.2. Service Information: We collect details about the cleaning services you request, including property
                size, service frequency, and special instructions.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                1.3. Usage Information: We collect information about how you interact with our website and mobile
                applications, including IP address, browser type, pages visited, and time spent.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                2. How We Use Your Information
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                2.1. To provide and improve our cleaning services.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                2.2. To process payments and manage your account.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                2.3. To communicate with you about your bookings, promotions, and updates.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                2.4. To analyze usage patterns and enhance our website and applications.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                2.5. To comply with legal obligations.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                3. Information Sharing
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                3.1. Service Providers: We may share your information with third-party service providers who assist us
                in operating our business, such as payment processors and cleaning professionals.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                3.2. Legal Requirements: We may disclose your information if required by law or to protect our rights,
                property, or safety.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                3.3. Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may
                be transferred as part of the transaction.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">4. Data Security</h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                4.1. We implement appropriate technical and organizational measures to protect your personal information
                from unauthorized access, disclosure, alteration, or destruction.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                4.2. While we strive to protect your information, no method of transmission over the Internet or
                electronic storage is 100% secure.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">5. Your Rights</h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                5.1. Access and Correction: You have the right to access and correct your personal information.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                5.2. Deletion: You may request the deletion of your personal information, subject to legal requirements.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                5.3. Opt-Out: You can opt out of marketing communications at any time.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                6. Cookies and Tracking Technologies
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                6.1. We use cookies and similar tracking technologies to collect information about your browsing
                activities and preferences.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                6.2. You can manage your cookie preferences through your browser settings, but disabling cookies may
                affect the functionality of our website.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                7. Children's Privacy
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                7.1. Our services are not intended for individuals under the age of 18.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                7.2. We do not knowingly collect personal information from children. If we become aware that we have
                collected personal information from a child without parental consent, we will take steps to delete that
                information.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                8. Third-Party Links
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                8.1. Our website and applications may contain links to third-party websites or services.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                8.2. We are not responsible for the privacy practices or content of these third-party sites.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                9. Changes to Privacy Policy
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                9.1. We may update our Privacy Policy from time to time.
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                9.2. We will notify you of any significant changes by posting the new Privacy Policy on our website or
                through other communication channels.
              </p>

              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
                10. Contact Information
              </h3>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                For questions or concerns regarding our Privacy Policy, please contact us at:
              </p>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Email:{" "}
                <a href="mailto:privacy@smileybrooms.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  privacy@smileybrooms.com
                </a>
                <br />
                Phone: (602) 800-0605
                <br />
                Address: 123 Cleaning Street, Suite 100, Sparkle City, SC 12345
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Accept Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  )
}
