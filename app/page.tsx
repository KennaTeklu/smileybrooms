/* Don't modify beyond what is requested ever. */
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
