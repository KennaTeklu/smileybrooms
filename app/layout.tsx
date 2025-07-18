import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { PanelCollapseProvider } from "@/contexts/panel-collapse-context"
import { MasterCollapseButton } from "@/components/master-collapse-button"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"
import ClientLayout from "@/components/client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <PanelCollapseProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <ClientLayout>{children}</ClientLayout>
            </div>
            <Toaster />
            <MasterCollapseButton />
          </ThemeProvider>
        </PanelCollapseProvider>
      </body>
    </html>
  )
}
