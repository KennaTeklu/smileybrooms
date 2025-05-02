import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import FixedFooter from "@/components/fixed-footer"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smiley Brooms - Professional Cleaning Services",
  description: "Book professional cleaning services for your home or office",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProvider>
            <div className="flex min-h-screen flex-col pb-16">
              {/* Single, unified header component */}
              <Header />
              {/* Add padding-top to account for fixed header */}
              <main className="flex-1 pt-16">
                <Suspense>{children}</Suspense>
              </main>
              <Toaster />
              <FixedFooter />
              <Analytics />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
