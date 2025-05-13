"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, Lock, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  initialTab?: "terms" | "privacy"
}

// Error boundary for modal content
class ModalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-md flex flex-col items-center justify-center h-full">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">Failed to load terms.</p>
          <p>Please try again later or contact support.</p>
        </div>
      )
    }
    return this.props.children
  }
}

// Throttle function for scroll events
function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): (...args: Parameters<T>) => void {
  const lastCall = useRef(0)

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall.current >= delay) {
      callback(...args)
      lastCall.current = now
    }
  }
}

// Modal variants for animations
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
}

// Tab content variants
const tabContentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.15 },
  },
  exit: { opacity: 0, x: -20 },
}

export default function TermsModal({ isOpen, onClose, onAccept, initialTab = "terms" }: TermsModalProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">(initialTab)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [acceptanceDate, setAcceptanceDate] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isContentLoaded, setIsContentLoaded] = useState(false)
  const [termsVersion, setTermsVersion] = useState("2023.2") // Current version

  const termsContentRef = useRef<HTMLDivElement>(null)
  const privacyContentRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Check if terms have been accepted and version
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const accepted = localStorage.getItem("termsAccepted") === "true"
        setTermsAccepted(accepted)

        const date = localStorage.getItem("termsAcceptedDate")
        setAcceptanceDate(date)

        const savedVersion = localStorage.getItem("termsVersion")
        if (savedVersion !== termsVersion && accepted) {
          // Terms version changed, require re-acceptance
          localStorage.setItem("termsAccepted", "false")
          setTermsAccepted(false)
        }

        setMounted(true)
        // Simulate content loading
        setTimeout(() => setIsContentLoaded(true), 500)
      } catch (error) {
        console.error("Error accessing localStorage:", error)
        toast({
          title: "Storage Error",
          description: "Failed to access browser storage. Please check your privacy settings.",
          variant: "destructive",
        })
      }
    }
  }, [toast, termsVersion])

  // Handle scroll event to detect when user reaches bottom
  const handleScroll = useThrottle(() => {
    const contentRef = activeTab === "terms" ? termsContentRef.current : privacyContentRef.current

    if (contentRef) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20
      setHasScrolledToBottom(isAtBottom)
    }
  }, 100)

  useEffect(() => {
    const contentRef = activeTab === "terms" ? termsContentRef.current : privacyContentRef.current

    if (contentRef) {
      contentRef.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (contentRef) {
        contentRef.removeEventListener("scroll", handleScroll)
      }
    }
  }, [activeTab, handleScroll])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!termsAccepted) {
          // Prevent closing if not accepted
          toast({
            title: "Terms Required",
            description: "You must accept the terms to continue.",
            duration: 3000,
          })
          return
        }
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
  }, [isOpen, onClose, termsAccepted, toast])

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!termsAccepted) return // Prevent closing if not accepted
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, onClose, termsAccepted])

  // Accessibility focus management
  useEffect(() => {
    if (isOpen) {
      const firstFocusable = modalRef.current?.querySelector("button")
      if (firstFocusable && firstFocusable instanceof HTMLElement) {
        firstFocusable.focus()
      }
    }
  }, [isOpen])

  // Handle acceptance
  const handleAccept = () => {
    try {
      const now = new Date().toLocaleDateString()
      localStorage.setItem("termsAccepted", "true")
      localStorage.setItem("termsAcceptedDate", now)
      localStorage.setItem("termsVersion", termsVersion)
      setTermsAccepted(true)
      setAcceptanceDate(now)
      onAccept()

      toast({
        title: "Terms Accepted",
        description: "Thank you for accepting our terms and conditions.",
      })
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      toast({
        title: "Storage Error",
        description: "Failed to save acceptance. Check browser storage settings.",
        variant: "destructive",
      })
    }
  }

  // Handle decline
  const handleDecline = () => {
    toast({
      title: "Terms Required",
      description: "You must accept terms to use our services",
      duration: 3000,
      variant: "destructive",
    })
  }

  if (!mounted) return null
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center" id="modal-title">
                <FileText className="h-5 w-5 mr-2" />
                Terms & Conditions
                <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
                  v{termsVersion}
                </span>
              </h2>
              {termsAccepted && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 relative">
              <button
                onClick={() => setActiveTab("terms")}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium",
                  activeTab === "terms"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                )}
                aria-selected={activeTab === "terms"}
                role="tab"
              >
                <div className="flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </div>
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium",
                  activeTab === "privacy"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                )}
                aria-selected={activeTab === "privacy"}
                role="tab"
              >
                <div className="flex items-center justify-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Privacy Policy
                </div>
              </button>

              {/* Animated tab indicator */}
              <motion.div
                className="absolute bottom-0 h-[2px] bg-blue-600 dark:bg-blue-400"
                animate={{
                  width: "50%",
                  x: activeTab === "terms" ? "0%" : "50%",
                }}
                transition={{ type: "tween", duration: 0.2 }}
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ModalErrorBoundary>
                {!isContentLoaded ? (
                  <div className="h-[70vh] flex items-center justify-center">
                    <div className="space-y-4 w-full max-w-md px-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mx-auto"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3 mt-8"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Terms Content */}
                    <AnimatePresence mode="wait">
                      {activeTab === "terms" && (
                        <motion.div
                          key="terms"
                          variants={tabContentVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          ref={termsContentRef}
                          className="h-[70vh] md:h-[70vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                          aria-labelledby="modal-title"
                        >
                          <h3 className="text-lg font-semibold mb-4">1. Introduction</h3>
                          <p className="mb-4">
                            Welcome to our service. These Terms and Conditions govern your use of our website and
                            services offered by our company.
                          </p>
                          <p className="mb-4">
                            By accessing or using our service, you agree to be bound by these Terms. If you disagree
                            with any part of the terms, you may not access the service.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">2. Use License</h3>
                          <p className="mb-4">
                            Permission is granted to temporarily download one copy of the materials on our website for
                            personal, non-commercial transitory viewing only.
                          </p>
                          <p className="mb-4">
                            This is the grant of a license, not a transfer of title, and under this license you may not:
                          </p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose</li>
                            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                            <li>
                              Transfer the materials to another person or "mirror" the materials on any other server
                            </li>
                          </ul>
                          <h3 className="text-lg font-semibold mb-4 mt-6">3. Disclaimer</h3>
                          <p className="mb-4">
                            The materials on our website are provided on an 'as is' basis. We make no warranties,
                            expressed or implied, and hereby disclaims and negates all other warranties including,
                            without limitation, implied warranties or conditions of merchantability, fitness for a
                            particular purpose, or non-infringement of intellectual property or other violation of
                            rights.
                          </p>
                          <p className="mb-4">
                            Further, we do not warrant or make any representations concerning the accuracy, likely
                            results, or reliability of the use of the materials on its website or otherwise relating to
                            such materials or on any sites linked to this site.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">4. Limitations</h3>
                          <p className="mb-4">
                            In no event shall our company or its suppliers be liable for any damages (including, without
                            limitation, damages for loss of data or profit, or due to business interruption) arising out
                            of the use or inability to use the materials on our website, even if we or a authorized
                            representative has been notified orally or in writing of the possibility of such damage.
                          </p>
                          <p className="mb-4">
                            Because some jurisdictions do not allow limitations on implied warranties, or limitations of
                            liability for consequential or incidental damages, these limitations may not apply to you.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">5. Accuracy of Materials</h3>
                          <p className="mb-4">
                            The materials appearing on our website could include technical, typographical, or
                            photographic errors. We do not warrant that any of the materials on its website are
                            accurate, complete or current. We may make changes to the materials contained on its website
                            at any time without notice. However we do not make any commitment to update the materials.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">6. Links</h3>
                          <p className="mb-4">
                            We have not reviewed all of the sites linked to its website and is not responsible for the
                            contents of any such linked site. The inclusion of any link does not imply endorsement by us
                            of the site. Use of any such linked website is at the user's own risk.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">7. Modifications</h3>
                          <p className="mb-4">
                            We may revise these terms of service for its website at any time without notice. By using
                            this website you are agreeing to be bound by the then current version of these terms of
                            service.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">8. Governing Law</h3>
                          <p className="mb-4">
                            These terms and conditions are governed by and construed in accordance with the laws and you
                            irrevocably submit to the exclusive jurisdiction of the courts in that location.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">9. Contact Information</h3>
                          <p className="mb-4">
                            If you have any questions about these Terms, please contact us at support@example.com.
                          </p>
                          <div className="h-20"></div> {/* Extra space to ensure scrolling is needed */}
                        </motion.div>
                      )}

                      {/* Privacy Content */}
                      {activeTab === "privacy" && (
                        <motion.div
                          key="privacy"
                          variants={tabContentVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          ref={privacyContentRef}
                          className="h-[70vh] md:h-[70vh] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                          aria-labelledby="modal-title"
                        >
                          <h3 className="text-lg font-semibold mb-4">1. Information We Collect</h3>
                          <p className="mb-4">
                            We collect several different types of information for various purposes to provide and
                            improve our service to you.
                          </p>
                          <h4 className="font-medium mb-2">Personal Data</h4>
                          <p className="mb-4">
                            While using our Service, we may ask you to provide us with certain personally identifiable
                            information that can be used to contact or identify you. Personally identifiable information
                            may include, but is not limited to:
                          </p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>Email address</li>
                            <li>First name and last name</li>
                            <li>Phone number</li>
                            <li>Address, State, Province, ZIP/Postal code, City</li>
                            <li>Cookies and Usage Data</li>
                          </ul>
                          <h3 className="text-lg font-semibold mb-4 mt-6">2. Use of Data</h3>
                          <p className="mb-4">We use the collected data for various purposes:</p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>To provide and maintain our Service</li>
                            <li>To notify you about changes to our Service</li>
                            <li>
                              To allow you to participate in interactive features of our Service when you choose to do
                              so
                            </li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information so that we can improve our Service</li>
                            <li>To monitor the usage of our Service</li>
                            <li>To detect, prevent and address technical issues</li>
                          </ul>
                          <h3 className="text-lg font-semibold mb-4 mt-6">3. Transfer of Data</h3>
                          <p className="mb-4">
                            Your information, including Personal Data, may be transferred to — and maintained on —
                            computers located outside of your state, province, country or other governmental
                            jurisdiction where the data protection laws may differ from those of your jurisdiction.
                          </p>
                          <p className="mb-4">
                            If you are located outside United States and choose to provide information to us, please
                            note that we transfer the data, including Personal Data, to United States and process it
                            there.
                          </p>
                          <p className="mb-4">
                            Your consent to this Privacy Policy followed by your submission of such information
                            represents your agreement to that transfer.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">4. Disclosure of Data</h3>
                          <h4 className="font-medium mb-2">Legal Requirements</h4>
                          <p className="mb-4">
                            We may disclose your Personal Data in the good faith belief that such action is necessary
                            to:
                          </p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>To comply with a legal obligation</li>
                            <li>To protect and defend the rights or property of our company</li>
                            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
                            <li>To protect the personal safety of users of the Service or the public</li>
                            <li>To protect against legal liability</li>
                          </ul>
                          <h3 className="text-lg font-semibold mb-4 mt-6">5. Security of Data</h3>
                          <p className="mb-4">
                            The security of your data is important to us but remember that no method of transmission
                            over the Internet or method of electronic storage is 100% secure. While we strive to use
                            commercially acceptable means to protect your Personal Data, we cannot guarantee its
                            absolute security.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">6. Your Rights</h3>
                          <p className="mb-4">
                            We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of
                            your Personal Data.
                          </p>
                          <p className="mb-4">
                            If you wish to be informed about what Personal Data we hold about you and if you want it to
                            be removed from our systems, please contact us.
                          </p>
                          <p className="mb-4">
                            In certain circumstances, you have the following data protection rights:
                          </p>
                          <ul className="list-disc pl-6 mb-4">
                            <li>The right to access, update or delete the information we have on you</li>
                            <li>The right of rectification</li>
                            <li>The right to object</li>
                            <li>The right of restriction</li>
                            <li>The right to data portability</li>
                            <li>The right to withdraw consent</li>
                          </ul>
                          <h3 className="text-lg font-semibold mb-4 mt-6">7. Service Providers</h3>
                          <p className="mb-4">
                            We may employ third party companies and individuals to facilitate our Service ("Service
                            Providers"), provide the Service on our behalf, perform Service-related services or assist
                            us in analyzing how our Service is used.
                          </p>
                          <p className="mb-4">
                            These third parties have access to your Personal Data only to perform these tasks on our
                            behalf and are obligated not to disclose or use it for any other purpose.
                          </p>
                          <h3 className="text-lg font-semibold mb-4 mt-6">8. Contact Us</h3>
                          <p className="mb-4">
                            If you have any questions about this Privacy Policy, please contact us at
                            privacy@example.com.
                          </p>
                          <div className="h-20"></div> {/* Extra space to ensure scrolling is needed */}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </ModalErrorBoundary>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center">
              {!termsAccepted ? (
                <>
                  {!hasScrolledToBottom && (
                    <p className="text-sm text-gray-500 mb-3">Scroll to bottom to enable acceptance.</p>
                  )}
                  <div className="flex gap-3 w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDecline}
                      className="flex-1 py-2 px-4 rounded-md text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Decline
                    </motion.button>
                    <motion.button
                      whileHover={hasScrolledToBottom ? { scale: 1.02 } : {}}
                      whileTap={hasScrolledToBottom ? { scale: 0.98 } : {}}
                      onClick={handleAccept}
                      disabled={!hasScrolledToBottom}
                      className={cn(
                        "flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors",
                        hasScrolledToBottom
                          ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                          : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed",
                      )}
                      aria-live="polite"
                    >
                      Accept Terms & Conditions
                    </motion.button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center text-green-600 dark:text-green-400"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Accepted on {acceptanceDate}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
