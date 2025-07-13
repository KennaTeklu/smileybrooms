import { MissionVision } from "@/components/about/mission-vision"
import { OurStory } from "@/components/about/our-story"
import { CoreValues } from "@/components/about/core-values"
import { WhySmileyBrooms } from "@/components/about/why-smileybrooms"
import { CallToAction } from "@/components/call-to-action"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { HowItWorks } from "@/components/how-it-works"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <OurStory />
        <MissionVision />
        <CoreValues />
        <WhySmileyBrooms />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CallToAction />
      </main>
    </div>
  )
}
