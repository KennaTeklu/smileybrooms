import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"
import EnhancedHeader from "@/components/enhanced-header"
import EnhancedFooter from "@/components/enhanced-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "smileybrooms - Professional Cleaning Services",
  description: "Professional cleaning services with a smile. Making your space sparkle.",
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
        <ClientLayout>
          <EnhancedHeader />
          <main>{children}</main>
          <EnhancedFooter />
        </ClientLayout>
      </body>
    </html>
  )
}
