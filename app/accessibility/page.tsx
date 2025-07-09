export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { TrustLayer } from "@/components/trust/trust-layer"
import { EquipmentPreview } from "@/components/trust/equipment-preview"
import { CertificationBadge } from "@/components/trust/certification-badge"
import { LiveTimer } from "@/components/trust/live-timer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, XCircle, Info, Lightbulb, Volume2, Keyboard, Eye, Mail } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Accessibility - smileybrooms",
  description: "Our commitment to accessibility and features designed for everyone.",
}

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Our Commitment to <span className="text-primary">Accessibility</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We believe everyone deserves equal access to information and services. We are dedicated to making our website
          inclusive and user-friendly for all.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Our Standards
            </CardTitle>
            <CardDescription>We strive to meet and exceed industry accessibility guidelines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">WCAG 2.1 AA Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Our goal is to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, ensuring a
                  broad range of accessibility for people with disabilities.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Continuous Improvement</h3>
                <p className="text-sm text-muted-foreground">
                  Accessibility is an ongoing effort. We regularly review our website and implement improvements based
                  on user feedback and evolving standards.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-6 w-6 text-purple-500" />
              Key Features
            </CardTitle>
            <CardDescription>Explore the accessibility features built into our platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Volume2 className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Screen Reader Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Our website is designed to be fully navigable and understandable using screen readers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Keyboard className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Keyboard Navigation</h3>
                <p className="text-sm text-muted-foreground">
                  Access all interactive elements and content using only your keyboard.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Customizable Display</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust font sizes, contrast, and themes to suit your visual preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Assistance?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          If you encounter any accessibility barriers or have suggestions for improvement, please don&apos;t hesitate to
          reach out.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">
            <Mail className="h-5 w-5 mr-2" />
            Contact Support
          </Link>
        </Button>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Trust & Transparency</h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          We believe in full transparency regarding our team, equipment, and operational standards.
        </p>
        <TrustLayer variant="full" showLiveTimer showEquipment />
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Explore Our Certifications</h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Our team is fully certified, insured, and background-checked for your peace of mind.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CertificationBadge type="insured" expiry="2026-03-15" showDetails />
          <CertificationBadge type="bonded" expiry="2025-12-31" showDetails />
          <CertificationBadge type="certified" expiry="2025-06-30" showDetails />
          <CertificationBadge type="background_checked" showDetails />
          <CertificationBadge type="eco_friendly" showDetails />
          <CertificationBadge type="satisfaction_guarantee" showDetails />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Equipment</h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          We use only the best professional-grade equipment and eco-friendly supplies to ensure a sparkling clean.
        </p>
        <EquipmentPreview modal={false} />
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Live Service Status</h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Track our team in real-time when they are on a job.
        </p>
        <LiveTimer since="cleaning_started" teamName="The Sparkle Squad" location="123 Main St, Your City" />
      </section>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Report an Issue</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Found something that isn&apos;t quite right? Help us improve by reporting any accessibility issues.
        </p>
        <Button size="lg" variant="outline" asChild>
          <Link href="/contact">
            <XCircle className="h-5 w-5 mr-2" />
            Report an Issue
          </Link>
        </Button>
      </section>
    </div>
  )
}
