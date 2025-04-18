import { Suspense } from "react"
import Hero from "@/components/hero"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import CallToAction from "@/components/call-to-action"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <Testimonials />
      </Suspense>
      <FAQ />
      <CallToAction />
    </div>
  )
}
