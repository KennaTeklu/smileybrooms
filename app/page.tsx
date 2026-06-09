import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="container mx-auto">
          <MinimalHero />
        </div>
      </div>
    </ErrorBoundary>
  )
}
