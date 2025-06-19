/* Don't modify beyond what is requested ever. */
/*
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.
 * - No refactoring, cleanup, or "improvements" outside the stated task.
 * - No behavioral changes unless specified.
 * - No formatting, variable renaming, or unrelated edits.
 * - Reject all "while you're here" temptations.
 *
 * VIOLATIONS WILL BREAK PRODUCTION.
 */
import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import SettingsPage from "@/app/settings/page" // Import SettingsPage
import SharePanel from "@/components/share-panel" // Import SharePanel

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen container mx-auto py-8">
        {" "}
        {/* Added py-8 for spacing */}
        <MinimalHero />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {" "}
          {/* Added a grid for layout */}
          <SettingsPage />
          <SharePanel />
        </div>
      </div>
    </ErrorBoundary>
  )
}
