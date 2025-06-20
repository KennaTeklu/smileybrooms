import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

// Metadata is not used in client components, but kept for consistency if this were a server component
export const metadata: Metadata = {
  title: "Smiley Brooms",
  description: "Professional cleaning services for your home and office.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'