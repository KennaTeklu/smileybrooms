import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import { getHomepageContent } from "@/lib/data/homepage-data"
import { revalidateHomepage } from "@/app/actions/revalidate"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const content = await getHomepageContent()

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <div className="container mx-auto py-8">
          <MinimalHero />

          <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Dynamic Server Content</h2>
            <p className="text-lg mb-2">{content.headline}</p>
            <p className="text-gray-600 dark:text-gray-300">{content.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last fetched: {new Date(content.timestamp).toLocaleString()}
            </p>
            <form action={revalidateHomepage} className="mt-4">
              <Button type="submit">Revalidate Homepage Data</Button>
            </form>
          </section>
        </div>
      </div>
    </ErrorBoundary>
  )
}
