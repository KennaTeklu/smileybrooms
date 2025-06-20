"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateTOS } from "@/lib/legal/tos-generator"
import ClientOnlyWrapper from "@/components/client-only-wrapper" // Corrected to default import
import { Printer, Download, Share2 } from "lucide-react" // Using Lucide React icons

export default function TermsPage() {
  const [terms, setTerms] = useState<string | null>(null)
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null)

  const handleGenerateTOS = useCallback(() => {
    const generatedTerms = generateTOS()
    setTerms(generatedTerms)
  }, [])

  const handlePrint = useCallback(() => {
    if (terms) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Terms of Service</title>
              <style>
                body { font-family: sans-serif; margin: 20px; }
                pre { white-space: pre-wrap; word-wrap: break-word; }
              </style>
            </head>
            <body>
              <h1>Terms of Service</h1>
              <pre>${terms}</pre>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }, [terms])

  const handleDownload = useCallback(() => {
    if (terms) {
      const blob = new Blob([terms], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "terms_of_service.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [terms])

  const handleShare = useCallback(async () => {
    if (terms && navigator.share) {
      try {
        await navigator.share({
          title: "SmileyBrooms Terms of Service",
          text: "Check out our Terms of Service:",
          url: window.location.href, // Shares the current page URL
        })
        console.log("Terms shared successfully")
      } catch (error) {
        console.error("Error sharing terms:", error)
      }
    } else {
      alert("Web Share API is not supported in your browser.")
    }
  }, [terms])

  const togglePanel = (panelId: string) => {
    setExpandedPanel(expandedPanel === panelId ? null : panelId)
  }

  const panelData = [
    {
      id: "introduction",
      title: "Introduction",
      content:
        'Welcome to SmileyBrooms! These Terms of Service ("Terms") govern your access to and use of our cleaning services and website. By accessing or using our services, you agree to be bound by these Terms and all policies incorporated by reference.',
    },
    {
      id: "services",
      title: "Our Services",
      content:
        "SmileyBrooms provides professional cleaning services for residential and commercial properties. Our services include, but are not limited to, standard cleaning, deep cleaning, move-in/move-out cleaning, and specialized cleaning. All services are subject to availability and our service area.",
    },
    {
      id: "bookings",
      title: "Booking and Cancellations",
      content:
        "Bookings can be made through our website or by contacting us directly. Cancellations or rescheduling must be made at least 24 hours in advance to avoid a cancellation fee. Late cancellations or no-shows may incur the full service charge.",
    },
    {
      id: "payments",
      title: "Payments and Billing",
      content:
        "Payment is due upon completion of services. We accept various payment methods, including credit/debit cards. All prices are listed in USD and are subject to change. For recurring services, billing will occur automatically after each scheduled cleaning.",
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content:
        "SmileyBrooms is committed to providing high-quality services. However, we are not liable for damages resulting from pre-existing conditions, improper use of cleaning products by clients, or acts of nature. Our liability for any damage caused by our team is limited to the cost of the service provided.",
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      content:
        "Your privacy is important to us. Our Privacy Policy, which is incorporated by reference into these Terms, explains how we collect, use, and protect your personal information. By using our services, you consent to our data practices as described in the Privacy Policy.",
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content:
        "SmileyBrooms reserves the right to modify these Terms at any time. We will notify you of any significant changes by posting the updated Terms on our website or through other communication channels. Your continued use of our services after such modifications constitutes your acceptance of the revised Terms.",
    },
    {
      id: "contact",
      title: "Contact Us",
      content:
        "If you have any questions about these Terms or our services, please contact us at support@smileybrooms.com or call us at tel:6028000605.",
    },
  ]

  return (
    <ClientOnlyWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>

        <div className="flex flex-col gap-4">
          {panelData.map((panel, index) => (
            <Card
              key={panel.id}
              className={`transition-all duration-300 ease-in-out cursor-pointer ${
                expandedPanel === panel.id ? "scale-105 shadow-lg z-10" : "scale-95 opacity-70"
              }`}
              onClick={() => togglePanel(panel.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{panel.title}</span>
                  <Badge variant="secondary">{index + 1}</Badge>
                </CardTitle>
              </CardHeader>
              {expandedPanel === panel.id && (
                <CardContent className="text-gray-700 dark:text-gray-300">
                  <p>{panel.content}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={handleGenerateTOS}>Generate Terms</Button>
          <Button onClick={handlePrint} disabled={!terms} variant="outline" className="bg-black text-white">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={handleDownload} disabled={!terms} variant="outline" className="bg-black text-white">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button onClick={handleShare} disabled={!terms} variant="outline" className="bg-black text-white">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>

        {terms && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Generated Terms of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">{terms}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientOnlyWrapper>
  )
}
