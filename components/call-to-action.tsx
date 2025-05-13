"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CallToAction() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready for a Cleaner Space?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-primary-foreground/90">
            Book your cleaning service today and experience the difference.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link href="/pricing">Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
