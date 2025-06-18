import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import FeedbackSurvey from "@/components/feedback-survey"

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="container mx-auto">
          <MinimalHero />
        </div>
        <FeedbackSurvey />
      </div>
    </ErrorBoundary>
  )
}
