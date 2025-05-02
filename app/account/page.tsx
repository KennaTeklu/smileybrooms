"use client"

import { Button } from "@/components/ui/button"

export default function AccountPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      <p>Welcome to your account page!</p>
      <p>This page is publicly accessible.</p>

      <Button onClick={() => (window.location.href = "/pricing")} className="mt-4">
        Book a new service
      </Button>

      {/* Alternatively, using Next.js Link: */}
      {/* <Button asChild className="mt-4">
        <Link href="/pricing">Book a new service</Link>
      </Button> */}
    </div>
  )
}
