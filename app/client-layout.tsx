import type React from "react"
import AddAllToCartModal from "@/components/add-all-to-cart-modal"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <AddAllToCartModal />
    </>
  )
}
