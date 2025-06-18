/* Don't modify beyond what is requested ever. */
import type { Metadata } from "next"
import { TechVersionsInfo } from "@/components/tech-versions-info"

export const metadata: Metadata = {
  title: "Technology Stack | SmileyBrooms",
  description: "Information about the technologies used in the SmileyBrooms platform",
}

export default function TechStackPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Our Technology Stack</h1>
        <p className="text-lg text-muted-foreground mb-8">
          SmileyBrooms is built with the latest web technologies to provide a fast, reliable, and secure experience.
          Below is information about the core technologies we use.
        </p>

        <TechVersionsInfo />
      </div>
    </div>
  )
}
