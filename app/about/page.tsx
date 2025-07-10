import OurStory from "@/components/about/our-story"
import MissionVision from "@/components/about/mission-vision"
import CoreValues from "@/components/about/core-values"
import WhySmileybrooms from "@/components/about/why-smileybrooms"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <OurStory />
        <MissionVision />
        <CoreValues />
        <WhySmileybrooms />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
