"use client"

import { generateTOS, type TOSConfig } from "@/lib/legal/tos-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, PrinterIcon as Print, Share2 } from "lucide-react"
import Link from "next/link"

interface TermsPageProps {
  searchParams: {
    service?: string
    location?: string
    type?: "residential" | "commercial"
    clauses?: string
  }
}

export default function TermsPage({ searchParams }: TermsPageProps) {
  const config: TOSConfig = {
    service: searchParams.service || "regular_clean",
    location: searchParams.location || "CA",
    businessType: searchParams.type || "residential",
    additionalClauses: searchParams.clauses?.split(",") || [],
  }

  const sections = generateTOS(config)
  const generatedDate = new Date().toLocaleDateString()

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const content = sections
      .map((section) => `${section.title}\n${"=".repeat(section.title.length)}\n\n${section.content}\n\n`)
      .join("")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `SmileyBrooms_Terms_${config.service}_${config.location}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "SmileyBrooms Terms of Service",
        text: `Terms of Service for ${config.service} in ${config.location}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Print className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">Service: {config.service.replace("_", " ")}</Badge>
            <Badge variant="outline">Location: {config.location}</Badge>
            <Badge variant="outline">Type: {config.businessType}</Badge>
            <Badge variant="outline">Generated: {generatedDate}</Badge>
          </div>

          <p className="text-muted-foreground">
            These terms are specifically generated for your service type and location. Please review carefully before
            booking our services.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {index + 1}. {section.title}
                  {section.required && (
                    <Badge variant="destructive" className="ml-auto">
                      Required
                    </Badge>
                  )}
                  {section.jurisdiction && <Badge variant="secondary">{section.jurisdiction}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-sm leading-relaxed">{section.content}</div>
                {section.id === "privacy" && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    For detailed information on our data collection, usage, and sharing practices, including with
                    third-party services, please refer to our comprehensive{" "}
                    <Link href="/privacy" className="text-primary underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Questions about these terms?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about these terms of service, please contact us before booking.
          </p>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
