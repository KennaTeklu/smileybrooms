"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * gamifiedMessages.length)
    setMessage(gamifiedMessages[randomIndex])
  }, [])

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-primary">404</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xl font-medium text-foreground">{message}</p>
          <Link href="/" passHref>
            <Button className="w-full bg-black text-white hover:bg-gray-800">Go Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
