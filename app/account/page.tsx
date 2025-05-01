"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
    } else if (status === "unauthenticated") {
      router.push("/login")
    } else {
      setIsLoading(false)
    }
  }, [status, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Not authenticated.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account</h1>
      <p>Welcome, {session?.user?.name}!</p>
      <p>Email: {session?.user?.email}</p>

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
