import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TourProvider } from "../contexts/tour-context"
import WebsiteTour from "../components/tour/website-tour"
import "../components/tour/tour.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CleanPro - Professional House Cleaning Service",
  description:
    "Customizable house cleaning service with transparent pricing. Choose your rooms, cleaning intensity, and add-ons.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TourProvider>
          {children}
          <WebsiteTour />
        </TourProvider>
      </body>
    </html>
  )
}
