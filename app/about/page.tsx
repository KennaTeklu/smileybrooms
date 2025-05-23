"use client"

import { useEffect } from "react"
import { ScrollToSection } from "@/components/scroll-to-section"
import OurStory from "@/components/about/our-story"
import MissionVision from "@/components/about/mission-vision"
import CoreValues from "@/components/about/core-values"
import OurCommitment from "@/components/about/our-commitment"
import WhySmileybrooms from "@/components/about/why-smileybrooms"

// Define sections for the scroll-to-section component
const sections = [
  { id: "our-story", label: "Our Story" },
  { id: "mission-vision", label: "Mission & Vision" },
  { id: "core-values", label: "Core Values" },
  { id: "our-commitment", label: "Our Commitment" },
  { id: "why-smileybrooms", label: "Why Choose Us" },
]

export default function AboutPage() {
  // Handle hash navigation on page load
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const id = hash.replace("#", "")
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          const topPosition = element.offsetTop - 120
          window.scrollTo({
            top: topPosition,
            behavior: "smooth",
          })
        }, 100)
      }
    }
  }, [])

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About SmileBrooms</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn about our journey, mission, and commitment to providing exceptional cleaning services.
          </p>
        </div>
      </div>

      <ScrollToSection sections={sections} />

      <div className="container mx-auto px-4 py-8">
        <section id="our-story" className="py-12">
          <OurStory />
        </section>

        <section id="mission-vision" className="py-12">
          <MissionVision />
        </section>

        <section id="core-values" className="py-12">
          <CoreValues />
        </section>

        <section id="our-commitment" className="py-12">
          <OurCommitment />
        </section>

        <section id="why-smileybrooms" className="py-12">
          <WhySmileybrooms />
        </section>
      </div>
    </div>
  )
}
