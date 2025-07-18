import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ClientLayout from "./client-layout" // Import the client layout
import { PanelVisibilityProvider } from "@/contexts/panel-visibility-context" // New import

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmileyBrooms",
  description: "Professional cleaning services for your home and office.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PanelVisibilityProvider>
            {" "}
            {/* Wrap with the new provider */}
            <ClientLayout>{children}</ClientLayout>
          </PanelVisibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
