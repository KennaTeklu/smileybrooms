import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen container mx-auto">
        <MinimalHero />
      </div>
    </ErrorBoundary>
  )
}
