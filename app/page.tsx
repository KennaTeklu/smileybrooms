import ClientHomePage from "@/app/client-page"
import { getHomepageContent } from "@/lib/data/homepage-data"
import type { Metadata } from "next"

// Dynamic Metadata for the homepage
export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomepageContent() // Fetch content to use in metadata

  const ogImageUrl = new URL("/api/og", "https://www.smileybrooms.com") // Replace with your actual domain
  ogImageUrl.searchParams.set("title", content.headline)
  ogImageUrl.searchParams.set("description", content.description)

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
          url: ogImageUrl.toString(), // Use the dynamically generated OG image
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
      images: [ogImageUrl.toString()], // Same dynamic image as Open Graph
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
  return <ClientHomePage />
}
