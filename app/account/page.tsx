"use client"

import { Button } from "@/components/ui/button"

export default function AccountPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      <p className="mb-4">Welcome to your account dashboard!</p>
      <p className="mb-6">Please log in to view your account details.</p>

      <Button onClick={() => (window.location.href = "/pricing")} className="mt-4">
        Book a new service
      </Button>
    </div>
  )
}
