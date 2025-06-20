import type React from "react"
import type { Metadata } from "next"
import { PanelCollisionProvider } from "@/contexts/panel-collision-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PanelCollisionProvider>{children}</PanelCollisionProvider>
      </body>
    </html>
  )
}
