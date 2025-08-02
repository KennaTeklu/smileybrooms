import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./accessibility.css"
import "./device-themes.css"
import "./payment-themes.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import ClientLayout from "./client-layout"
import PageAnalyticsTracker from "@/components/page-analytics-tracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms - Professional Cleaning Services",
  description:
    "Professional residential and commercial cleaning services. Book online and get your space sparkling clean!",
  keywords: "cleaning services, house cleaning, office cleaning, residential cleaning, commercial cleaning",
  authors: [{ name: "SmileyBrooms" }],
  creator: "SmileyBrooms",
  publisher: "SmileyBrooms",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://smileybrooms.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SmileyBrooms - Professional Cleaning Services",
    description:
      "Professional residential and commercial cleaning services. Book online and get your space sparkling clean!",
    url: "/",
    siteName: "SmileyBrooms",
    images: [
      {
        url: "/sparkling-clean-home.png",
        width: 1200,
        height: 630,
        alt: "SmileyBrooms Professional Cleaning Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmileyBrooms - Professional Cleaning Services",
    description:
      "Professional residential and commercial cleaning services. Book online and get your space sparkling clean!",
    images: ["/sparkling-clean-home.png"],
    creator: "@smileybrooms",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SmileyBrooms" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <PageAnalyticsTracker>
            <ClientLayout>{children}</ClientLayout>
          </PageAnalyticsTracker>
          <Toaster />
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  )
}
