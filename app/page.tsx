import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import Link from "next/link"

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen container mx-auto">
        <MinimalHero />
        <div className="flex justify-center mt-8">
          <Link href="/pricing">
            <button className="bg-[#2563EB] text-white font-medium py-3 px-8 rounded-full text-lg hover:bg-blue-600 transition-colors">
              Book Now!
            </button>
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  )
}
