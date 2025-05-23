import type React from "react"
import DynamicFavicon from "@/components/dynamic-favicon"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <DynamicFavicon />
      {children}
    </>
  )
}
