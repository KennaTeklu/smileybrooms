import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <MinimalHero />
      </div>
    </ErrorBoundary>
  )
}
