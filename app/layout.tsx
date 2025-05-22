import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientLayout"

export const metadata: Metadata = {
  title: "smileybrooms - Professional Cleaning Services",
  description: "Professional cleaning services for homes and offices with a smile.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout children={children} />
}


import './globals.css'