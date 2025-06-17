import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import FeedbackSurvey from "@/components/feedback-survey"
import PersonalizedMessage from "@/components/personalized-message"
import AdvancedSearchFilter from "@/components/advanced-search-filter" // Import the new component

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="container mx-auto">
          <MinimalHero />
        </div>
        <PersonalizedMessage />
        <AdvancedSearchFilter /> {/* Add the advanced search and filter component */}
        <FeedbackSurvey />
      </div>
    </ErrorBoundary>
  )
}
