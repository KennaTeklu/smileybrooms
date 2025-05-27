import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import { RequestQuoteButton } from "@/components/request-quote-button"

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <MinimalHero />

        {/* Quick Custom Quote Section */}
        <section className="py-12 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Need a Custom Quote?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Every space is unique. Get a personalized cleaning quote that fits your specific needs and budget.
              </p>
              <RequestQuoteButton
                showIcon={true}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              />
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  )
}
