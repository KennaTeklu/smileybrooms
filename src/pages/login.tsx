"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [phone, setPhone] = useState("")
  const [pin, setPin] = useState("")
  const [message, setMessage] = useState("")
  const [isResettingPin, setIsResettingPin] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin }),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage("Login successful! Redirecting to dashboard...")
        // In a real app, you'd store a token and redirect
        window.location.href = "/dashboard"
      } else {
        setMessage(data.error || "Login failed.")
      }
    } catch (error) {
      setMessage("An unexpected error occurred.")
      console.error("Login error:", error)
    }
  }

  const handlePinReset = async () => {
    setMessage("")
    try {
      const response = await fetch("/api/auth/reset-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage("PIN reset SMS sent. Please check your phone.")
        setIsResettingPin(false)
      } else {
        setMessage(data.error || "PIN reset failed.")
      }
    } catch (error) {
      setMessage("An unexpected error occurred during PIN reset.")
      console.error("PIN reset error:", error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Cleaner Login</CardTitle>
          <CardDescription>Enter your phone number and PIN to access the portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone Number (e.g., +15551234567)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="pin" className="sr-only">
                PIN
              </label>
              <Input
                id="pin"
                type="password"
                placeholder="PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {message && <p className={message.includes("successful") ? "text-green-500" : "text-red-500"}>{message}</p>}
            <Button variant="link" onClick={() => setIsResettingPin(true)} className="mt-2">
              Forgot PIN?
            </Button>
          </div>

          {isResettingPin && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your phone number to receive a new PIN via SMS.
              </p>
              <Input
                type="tel"
                placeholder="Phone Number for PIN Reset"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full"
              />
              <Button onClick={handlePinReset} className="w-full">
                Send Reset SMS
              </Button>
              <Button variant="outline" onClick={() => setIsResettingPin(false)} className="w-full">
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
