import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/lib/cart-context"
import ClientLayout from "./client-layout"
import PageViewTracker from "@/components/page-view-tracker"

export const metadata = {
  title: "Smiley Brooms Cleaning Service",
  description: "Professional cleaning services for homes and businesses",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CartProvider>
            <ClientLayout>
              <PageViewTracker />
              {children}
              <Toaster />
            </ClientLayout>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
