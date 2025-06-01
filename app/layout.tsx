import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"
import { FloatingControlsProvider } from "@/lib/floating-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "smileybrooms - Professional Cleaning Services",
  description: "Professional cleaning services for homes and offices with a smile.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <FloatingControlsProvider>
          <ClientLayout>{children}</ClientLayout>
        </FloatingControlsProvider>
      </body>
    </html>
  )
}
