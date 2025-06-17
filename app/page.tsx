import MinimalHero from "@/components/minimal-hero"
import ErrorBoundary from "@/components/error-boundary"
import { getHomepageContent } from "@/lib/data/homepage-data"
import { revalidateHomepage } from "@/app/actions/revalidate"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next" // Import Metadata type

// Dynamic Metadata for the homepage
export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent() // Fetch content to use in metadata

  return {
    title: content.headline,
    description: content.description,
    keywords: ["cleaning service", "home cleaning", "professional cleaners", "house cleaning", "smileybrooms"],
    openGraph: {
      title: content.headline,
      description: content.description,
      url: "https://www.smileybrooms.com", // Replace with your actual domain
      siteName: "SmileyBrooms",
      images: [
        {
          url: "https://www.smileybrooms.com/professional-cleaning-service.png", // Replace with a high-quality image for social sharing
          width: 1200,
          height: 630,
          alt: "Professional Cleaning Service by SmileyBrooms",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content.headline,
      description: content.description,
      creator: "@smileybrooms", // Replace with your Twitter handle
      images: ["https://www.smileybrooms.com/professional-cleaning-service.png"], // Same image as Open Graph
    },
    alternates: {
      canonical: "https://www.smileybrooms.com", // Replace with your actual domain
      languages: {
        "en-US": "https://www.smileybrooms.com/en",
        "es-ES": "https://www.smileybrooms.com/es",
      },
    },
  }
}

export default async function Home() {
  const content = await getHomepageContent()

  // JSON-LD Schema Markup for LocalBusiness
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "SmileyBrooms Professional Cleaning Services",
    image: "https://www.smileybrooms.com/professional-cleaning-service.png", // A good image of your business
    url: "https://www.smileybrooms.com",
    telephone: "+1-800-CLEAN-NOW", // Your business phone number
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Cleaning Lane", // Your business street address
      addressLocality: "Clean City", // Your business city
      addressRegion: "CA", // Your business state/region
      postalCode: "90210", // Your business postal code
      addressCountry: "US",
    },
    priceRange: "$$", // Example: "$$" for moderate
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
    hasMap: "https://maps.app.goo.gl/your-business-map-link", // Link to your Google Maps listing
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.052235, // Your business latitude
      longitude: -118.243683, // Your business longitude
    },
    sameAs: [
      "https://www.facebook.com/smileybrooms", // Your Facebook page
      "https://twitter.com/smileybrooms", // Your Twitter page
      "https://www.instagram.com/smileybrooms", // Your Instagram page
    ],
  }

  return (
    <ErrorBoundary>
      {/* JSON-LD Script */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

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
