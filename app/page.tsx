"use client"

import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { CallToAction } from "@/components/call-to-action"
import { ProductCatalog } from "@/components/product-catalog"
import { ServiceMap } from "@/components/service-map"
import { CleaningChecklist } from "@/components/cleaning-checklist"
import { CleaningTeamSelector } from "@/components/cleaning-team-selector"
import { CleaningTimeEstimator } from "@/components/cleaning-time-estimator"
import { ServiceDetailsModal } from "@/components/service-details-modal"
import { ServiceTypeSelector } from "@/components/service-type-selector"
import { RoomConfigurator } from "@/components/room-configurator"
import { MultiStepCustomizationWizard } from "@/components/multi-step-customization-wizard"
import { DynamicFormGeneration } from "@/components/dynamic-form-generation"
import { ConditionalField } from "@/components/conditional-field"
import { ErrorBoundary } from "@/components/error-boundary"
import { CustomQuoteWizard } from "@/components/custom-quote-wizard"
import { ServiceComparisonTable } from "@/components/service-comparison-table"
import { CleanlinessSlider } from "@/components/cleanliness-slider"
import { RoomCategory } from "@/components/room-category"
import { defaultTiers, defaultAddOns, defaultReductions } from "@/lib/room-tiers"

export default function Home() {
  const coreRooms = ["bedroom", "bathroom", "kitchen", "livingRoom", "diningRoom"]
  const additionalSpaces = ["homeOffice", "laundryRoom", "entryway", "hallway", "stairs"]

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />

        {/* New Room Category Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Cleaning Spaces</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Select the rooms and areas you need cleaned. Customize each space for a perfect fit.
                </p>
              </div>
            </div>
            <div className="space-y-8">
              <RoomCategory
                title="Core Living Spaces"
                description="Essential rooms for a sparkling home."
                rooms={coreRooms}
                variant="primary"
              />
              <RoomCategory
                title="Additional Areas"
                description="Extend your clean to every corner of your home."
                rooms={additionalSpaces}
                variant="secondary"
              />
            </div>
          </div>
        </section>

        {/* Example of other components that could be integrated */}
        {process.env.NEXT_PUBLIC_FEATURE_PRODUCT_CATALOG === "true" && <ProductCatalog />}
        {process.env.NEXT_PUBLIC_FEATURE_SERVICE_MAP === "true" && <ServiceMap />}
        {process.env.NEXT_PUBLIC_FEATURE_CLEANING_CHECKLIST === "true" && <CleaningChecklist />}
        {process.env.NEXT_PUBLIC_FEATURE_CLEANING_TEAM_SELECTOR === "true" && <CleaningTeamSelector />}
        {process.env.NEXT_PUBLIC_FEATURE_CLEANING_TIME_ESTIMATOR === "true" && <CleaningTimeEstimator />}
        {process.env.NEXT_PUBLIC_FEATURE_SERVICE_DETAILS_MODAL === "true" && <ServiceDetailsModal />}
        {process.env.NEXT_PUBLIC_FEATURE_SERVICE_TYPE_SELECTOR === "true" && <ServiceTypeSelector />}
        {process.env.NEXT_PUBLIC_FEATURE_ROOM_CONFIGURATOR === "true" && (
          <RoomConfigurator
            roomType="bedroom"
            tiers={defaultTiers.bedroom}
            addOns={defaultAddOns.bedroom}
            reductions={defaultReductions.bedroom}
          />
        )}
        {process.env.NEXT_PUBLIC_FEATURE_MULTI_STEP_CUSTOMIZATION_WIZARD === "true" && (
          <MultiStepCustomizationWizard
            isOpen={false}
            onClose={() => {}}
            roomType="bedroom"
            roomName="Bedroom"
            roomIcon="🛏️"
            roomCount={1}
            config={{
              roomName: "Bedroom",
              selectedTier: "ESSENTIAL CLEAN",
              selectedAddOns: [],
              selectedReductions: [],
              basePrice: 0,
              tierUpgradePrice: 0,
              addOnsPrice: 0,
              reductionsPrice: 0,
              totalPrice: 0,
            }}
            onConfigChange={() => {}}
          />
        )}
        {process.env.NEXT_PUBLIC_FEATURE_DYNAMIC_FORM_GENERATION === "true" && <DynamicFormGeneration />}
        {process.env.NEXT_PUBLIC_FEATURE_CONDITIONAL_FIELDS === "true" && <ConditionalField />}
        {process.env.NEXT_PUBLIC_FEATURE_ERROR_BOUNDARY === "true" && <ErrorBoundary />}
        {process.env.NEXT_PUBLIC_FEATURE_CLEANLINESS_SLIDER === "true" && (
          <CleanlinessSlider value={3} onChange={() => {}} />
        )}
        {process.env.NEXT_PUBLIC_FEATURE_CUSTOM_QUOTE_WIZARD === "true" && <CustomQuoteWizard />}
        {process.env.NEXT_PUBLIC_FEATURE_SERVICE_COMPARISON_TABLE === "true" && <ServiceComparisonTable />}

        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
    </div>
  )
}
