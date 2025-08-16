"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowDown, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MinimalHero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const fullTexts = [
    "You rest, we take care of the rest!",
    "Professional cleaning at your fingertips!",
    "Sparkling clean, every time!",
    "Your home deserves the best!",
  ]
  const typingSpeed = 50
  const erasingSpeed = 30
  const pauseDuration = 2000
  const textRef = useRef(fullTexts[0])

  const downloadVCardAndCall = () => {
    // Create vCard data
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:smileybrooms.com cleaning services
ORG:Smiley Brooms
TEL:+16027301144
URL:https://smileybrooms.com
EMAIL:smileybrooms@gmail.com
NOTE:Professional cleaning services - Always accessible and flexible for your needs
END:VCARD`

    // Create and download vCard
    const blob = new Blob([vCardData], { type: "text/vcard" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "smileybrooms-cleaning-services.vcf"
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    // Show custom modal instead of alert
    setShowDownloadModal(true)
    setCountdown(3)

    // Start countdown and redirect
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          redirectToDownloads()
          setShowDownloadModal(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const redirectToDownloads = () => {
    const userAgent = navigator.userAgent.toLowerCase()

    try {
      if (userAgent.includes("chrome") && !userAgent.includes("edg")) {
        // Chrome
        window.open("chrome://downloads/", "_blank")
      } else if (userAgent.includes("edg")) {
        // Edge
        window.open("edge://downloads/", "_blank")
      } else if (userAgent.includes("firefox")) {
        // Firefox
        window.open("about:downloads", "_blank")
      } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
        // Safari - try to open downloads
        const a = document.createElement("a")
        a.href = "x-apple-systempreferences:com.apple.preference.downloads"
        a.click()
      } else {
        // Fallback - try generic approaches
        if (window.navigator && window.navigator.msSaveBlob) {
          // IE/Edge legacy
          alert("Please check your Downloads folder for 'smileybrooms-cleaning-services.vcf'")
        } else {
          // Modern browsers fallback
          const downloadHint = document.createElement("div")
          downloadHint.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px; border-radius: 8px; z-index: 10000; font-family: Arial, sans-serif;">
              <strong>✅ Contact Downloaded!</strong><br>
              Look for: "smileybrooms-cleaning-services.vcf"<br>
              <small>Check your Downloads folder</small>
            </div>
          `
          document.body.appendChild(downloadHint)
          setTimeout(() => {
            document.body.removeChild(downloadHint)
          }, 5000)
        }
      }
    } catch (error) {
      console.log("Redirect failed, showing fallback message")
      // Fallback notification
      const notification = document.createElement("div")
      notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #2196F3; color: white; padding: 15px; border-radius: 8px; z-index: 10000; font-family: Arial, sans-serif; max-width: 300px;">
          <strong>📱 Contact Downloaded!</strong><br>
          File: "smileybrooms-cleaning-services.vcf"<br>
          <small>1. Find it in your Downloads<br>2. Import to contacts<br>3. Call us from there!</small>
        </div>
      `
      document.body.appendChild(notification)
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 8000)
    }
  }

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes("chrome") && !userAgent.includes("edg")) {
      return { name: "Chrome", shortcut: "Ctrl+J" }
    } else if (userAgent.includes("edg")) {
      return { name: "Edge", shortcut: "Ctrl+J" }
    } else if (userAgent.includes("firefox")) {
      return { name: "Firefox", shortcut: "Ctrl+Shift+Y" }
    } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      return { name: "Safari", shortcut: "⌘+Option+L" }
    }
    return { name: "your browser", shortcut: "Downloads folder" }
  }

  // Typing effect
  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isTyping) {
      if (displayText.length < textRef.current.length) {
        timeout = setTimeout(() => {
          setDisplayText(textRef.current.substring(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false)
        }, pauseDuration)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1))
        }, erasingSpeed)
      } else {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % fullTexts.length)
        textRef.current = fullTexts[(currentTextIndex + 1) % fullTexts.length]
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isTyping, currentTextIndex, fullTexts])

  const scrollToBooking = () => {
    // Instead of scrolling or navigating to calculator, navigate to pricing
    window.location.href = "/pricing"
  }

  const browserInfo = getBrowserInfo()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pattern">
      {/* Background overlay with consistent opacity */}
      <div className="absolute inset-0 bg-image-overlay" />

      {/* Download Success Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Downloaded!</h3>
            <p className="text-gray-700 mb-4">
              <strong>"smileybrooms-cleaning-services.vcf"</strong>
              <br />
              has been saved to your Downloads folder.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-800">
                <strong>Next steps:</strong>
                <br />
                1. Open the downloaded contact file
                <br />
                2. Import it to your contacts
                <br />
                3. Call us directly from your contacts
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Opening your {browserInfo.name} downloads in <strong>{countdown}</strong> seconds...
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  redirectToDownloads()
                  setShowDownloadModal(false)
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Open Downloads Now
              </Button>
              <Button onClick={() => setShowDownloadModal(false)} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 animate-glow">
              smiley<span className="inline-block bg-yellow-300 text-gray-900 px-2 rounded-md">brooms</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8 h-16"
          >
            <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 typing-effect">{displayText}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={scrollToBooking}
                size="lg"
                className="group relative overflow-hidden rounded-full px-8 py-6 neon-button transition-transform duration-200"
              >
                <span className="relative z-10 text-lg font-medium">Book Online</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 transition-transform duration-300 group-hover:translate-y-1">
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                </span>
              </Button>
            </motion.div>

            <span className="text-gray-700 dark:text-gray-300 text-lg font-medium mx-4">or</span>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={downloadVCardAndCall}
                size="lg"
                className="group relative overflow-hidden rounded-full px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Phone className="mr-2 h-5 w-5" />
                <span className="relative z-10 text-lg font-medium">Call Now</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
