"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CalculatorRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect after a short delay so users see the apology message first
    const timer = setTimeout(() => {
      router.replace("/pricing")
    }, 0)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Calculator Page Unavailable</h1>
      <p className="text-lg mb-8">
        Sorry, our calculator page is no longer available. <br />
        Please check out our{" "}
        <a href="/pricing" className="text-primary underline">
          Pricing
        </a>{" "}
        page for detailed quotes and services.
      </p>
      <p className="text-sm text-muted-foreground">You’ll be redirected automatically in a few seconds.</p>
    </div>
  )
}
