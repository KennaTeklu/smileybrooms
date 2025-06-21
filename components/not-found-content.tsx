"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"

const gamifiedMessages = [
  "You've stumbled into the cleaning dimension! This page is sparkling clean... as in, it's not here.",
  "Oops! Our brooms missed this spot. Page not found.",
  "Looks like this page got swept away. Try heading back to the main floor!",
  "Error 404: Page is on a coffee break. Please try again later.",
  "This page is so clean, it's invisible! (404 Not Found)",
  "Did you check under the couch? Page not found.",
  "Our cleaning crew couldn't find this page. It's truly gone!",
  "Lost in the suds? This page doesn't exist.",
  "This page has been professionally cleaned... right out of existence.",
  "404: Our robots couldn't locate this file.",
  "You've reached the void. No pages here, just dust bunnies.",
  "This page is currently being polished. Please return to the main site.",
  "We searched high and low, but this page is nowhere to be found.",
  "It's not you, it's us. We lost this page.",
  "This page is on vacation. Enjoy the silence.",
  "The page you requested has evaporated.",
  "Our digital mop couldn't find this page.",
  "This URL is spotless, because there's nothing here.",
  "404: Page went out for a walk and never came back.",
  "Consider this page a blank canvas. Nothing here yet!",
]

export default function NotFoundContent() {
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * gamifiedMessages.length)
    setMessage(gamifiedMessages[randomIndex])
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // In a real application, you would redirect to a search results page
      // For now, we'll just log it or simulate a redirect
      console.log(`Searching for: ${searchTerm}`)
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <Card className="w-full max-w-lg md:max-w-xl lg:max-w-2xl">
        <CardHeader className="space-y-4">
          <CardTitle className="text-7xl font-extrabold text-primary md:text-8xl">404</CardTitle>
          <CardDescription className="text-xl text-muted-foreground md:text-2xl">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6 md:p-8">
          <p className="text-2xl font-semibold text-foreground md:text-3xl">{message}</p>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">What can you do next?</h3>
            <form onSubmit={handleSearch} className="relative flex w-full max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Try searching for something..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                aria-label="Search input"
              />
              <Button type="submit" size="icon" className="absolute right-0 top-0 h-full rounded-l-none">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Quick Links:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" passHref>
                <Button variant="outline">Go Home</Button>
              </Link>
              <Link href="/pricing" passHref>
                <Button variant="outline">View Pricing</Button>
              </Link>
              <Link href="/about" passHref>
                <Button variant="outline">About Us</Button>
              </Link>
              <Link href="/contact" passHref>
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-2">
            <p className="text-muted-foreground">If you believe this is an error, please let us know:</p>
            <Link href="/contact?subject=404_Error" passHref>
              <Button variant="secondary">Report an Issue</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
