"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/lib/cart-context" // Import useCart

export function MinimalHero() {
  const { addToCart } = useCart() // Use addToCart from context

  const handleAddToCart = () => {
    // Example item to add to cart
    addToCart({ id: "cleaning-service-1", name: "Standard Cleaning Service", price: 100 }, 1)
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Professional Cleaning Services for a Sparkling Home
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Experience the joy of a spotless home with our reliable and affordable cleaning services.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button onClick={handleAddToCart}>Add Sample Item to Cart</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Get a Free Quote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Enter your email" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea className="min-h-[100px]" id="message" placeholder="Tell us about your cleaning needs" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">I agree to the terms and conditions</Label>
                </div>
                <Button className="w-full">Request Quote</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
