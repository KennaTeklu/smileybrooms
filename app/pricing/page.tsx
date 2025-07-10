import PricingContent from "@/components/pricing-content"
import Footer from "@/components/footer"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold">Build Your Cleaning Plan</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Select your rooms and customize your cleaning service to fit your needs.
            </p>
          </div>
        </div>
        <PricingContent />
      </main>
      <Footer />
    </div>
  )
}
