import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { PageViewTracker } from "@/components/page-view-tracker"
import { ErrorBoundary } from "@/components/error-boundary"
import { DeploymentStatus } from "@/components/deployment-status"
import { validateEnv } from "@/lib/env"

// Validate environment variables
try {
  validateEnv()
} catch (error) {
  console.error("Environment validation error:", error)
  // We don't throw here to allow the app to build,
  // but this will log errors during runtime
}

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smiley Brooms - Professional Cleaning Services",
  description: "Book professional cleaning services for your home or office.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <EnhancedNavigation />
          <main className="min-h-screen pt-16">{children}</main>
          <PageViewTracker />
          <DeploymentStatus />
        </ErrorBoundary>
      </body>
    </html>
  )
}
