import { TikTokScroll } from "@/components/tiktok-scroll"
import { OurStory } from "@/components/about/our-story"
import { MissionVision } from "@/components/about/mission-vision"
import { CoreValues } from "@/components/about/core-values"
import { OurCommitment } from "@/components/about/our-commitment"
import { WhySmileybrooms } from "@/components/about/why-smileybrooms"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col" data-no-accessibility-toolbar>
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">About smileybrooms</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're on a mission to make cleaning a happy experience for everyone.
            </p>
          </div>
        </div>

        {/* TikTok-style scrolling pages */}
        <div className="flex-1 min-h-[calc(100vh-16rem)]">
          <TikTokScroll
            pages={[
              <OurStory key="story" />,
              <MissionVision key="mission" />,
              <CoreValues key="values" />,
              <OurCommitment key="commitment" />,
              <WhySmileybrooms key="why" />,
            ]}
          />
        </div>
      </main>
    </div>
  )
}
