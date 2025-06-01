import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import Link from "next/link"

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen container mx-auto">
        <MinimalHero />

      </div>
    </ErrorBoundary>
  )
}
