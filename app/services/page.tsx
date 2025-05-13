"use client"

import { useState } from "react"
import { MinimalHero } from "@/components/minimal-hero"
import { ServiceShowcase } from "@/components/service-showcase"
import { ServiceTypeSelector } from "@/components/service-type-selector"
import { PriceCalculator } from "@/components/price-calculator"
import { CleanlinessSlider } from "@/components/cleanliness-slider"
import { FAQ } from "@/components/faq"
import { CallToAction } from "@/components/call-to-action"
import { PageViewTracker } from "@/components/page-view-tracker"
import { ErrorBoundary } from "@/components/error-boundary"

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState("")
  const [cleanlinessLevel, setCleanlinessLevel] = useState(50)

  return (
    <main>
      <PageViewTracker pageName="services" />
      <MinimalHero
        title="Our Cleaning Services"
        description="Professional cleaning services tailored to your needs"
        imageSrc="/professional-cleaning-service.png"
      />

      <div className="container mx-auto px-4 py-12">
        <ErrorBoundary fallback={<div>Something went wrong with the service selector. Please try again later.</div>}>
          <ServiceTypeSelector selectedService={selectedService} onSelectService={setSelectedService} />
        </ErrorBoundary>

        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Customize Your Cleaning</h2>
          <ErrorBoundary
            fallback={<div>Something went wrong with the cleanliness slider. Please try again later.</div>}
          >
            <CleanlinessSlider value={cleanlinessLevel} onChange={setCleanlinessLevel} />
          </ErrorBoundary>
        </div>

        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Calculate Your Price</h2>
          <ErrorBoundary fallback={<div>Something went wrong with the price calculator. Please try again later.</div>}>
            <PriceCalculator />
          </ErrorBoundary>
        </div>

        <div className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Services</h2>
          <ErrorBoundary fallback={<div>Something went wrong with the service showcase. Please try again later.</div>}>
            <ServiceShowcase />
          </ErrorBoundary>
        </div>

        <ErrorBoundary fallback={<div>Something went wrong with the FAQ section. Please try again later.</div>}>
          <FAQ />
        </ErrorBoundary>
      </div>

      <CallToAction />
    </main>
  )
}
