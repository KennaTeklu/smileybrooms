"use client"

import type React from "react"

import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProviderWrapper } from "@/components/providers/query-client-provider"
import { AccessibilityProvider } from "@/lib/accessibility-context"
import { CartProvider } from "@/lib/cart-context" // Import CartProvider

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProviderWrapper>
            <AccessibilityProvider>
              <CartProvider>
                {" "}
                {/* Wrap children with CartProvider */}
                {children}
              </CartProvider>
            </AccessibilityProvider>
          </QueryClientProviderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
