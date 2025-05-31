"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface CleanerProfile {
  name: string
  phone: string
  vehicle_make?: string
  vehicle_model?: string
  vehicle_color?: string
  payment_preference?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<CleanerProfile>({ name: "", phone: "" })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // In a real app, fetch current cleaner profile from an API
    const fetchProfile = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setProfile({
          name: "John Doe",
          phone: "+15551234567",
          vehicle_make: "Toyota",
          vehicle_model: "Camry",
          vehicle_color: "Silver",
          payment_preference: "Bank Transfer",
        })
      } catch (error) {
        setMessage("Failed to load profile.")
        console.error("Fetch profile error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setProfile((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage("Profile updated successfully!")
      } else {
        setMessage(data.error || "Profile update failed.")
      }
    } catch (error) {
      setMessage("An unexpected error occurred during profile update.")
      console.error("Profile update error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Cleaner Information</CardTitle>
          <CardDescription>Update your contact, vehicle, and payment details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={profile.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={profile.phone} onChange={handleChange} required />
              </div>
            </div>

            <h2 className="text-xl font-semibold">Vehicle Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="vehicle_make">Make</Label>
                <Input id="vehicle_make" value={profile.vehicle_make || ""} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="vehicle_model">Model</Label>
                <Input id="vehicle_model" value={profile.vehicle_model || ""} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="vehicle_color">Color</Label>
                <Input id="vehicle_color" value={profile.vehicle_color || ""} onChange={handleChange} />
              </div>
            </div>

            <h2 className="text-xl font-semibold">Payment Preferences</h2>
            <div>
              <Label htmlFor="payment_preference">Preferred Method</Label>
              <Input id="payment_preference" value={profile.payment_preference || ""} onChange={handleChange} />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Changes
            </Button>
            {message && <p className={message.includes("success") ? "text-green-500" : "text-red-500"}>{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
