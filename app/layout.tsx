import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import { TermsProvider } from "@/lib/terms-context"
import { GlobalErrorBoundary } from "@/components/global-error-boundary"
import { QueryClientProvider } from "@/components/query-client-provider"

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GlobalErrorBoundary>
            <CartProvider>
              <TermsProvider>
                <QueryClientProvider>
                  {children}
                  <Toaster />
                </QueryClientProvider>
              </TermsProvider>
            </CartProvider>
          </GlobalErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
