"use client"
export const dynamic = "force-dynamic"

import { Card, CardContent } from "@/components/ui/card"

export function WhySmileybrooms() {
  return (
    <section className="h-full flex items-center justify-center bg-gradient-to-b from-primary/5 to-transparent py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why "
            <span className="inline-flex items-center">
              smiley
              <span className="rounded-md px-1 py-0.5 bg-brooms-bg-emphasis text-brooms-text-emphasis">brooms</span>
            </span>
            "?
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-lg">
                <p>
                  Our name reflects our philosophy: cleaning should bring happiness. The "smiley" represents the
                  satisfaction and joy that comes from a clean, healthy space. The "
                  <span className="inline-flex items-center">
                    smiley
                    <span className="rounded-md px-1 py-0.5 bg-brooms-bg-emphasis text-brooms-text-emphasis">
                      brooms
                    </span>
                  </span>
                  " symbolize our commitment to traditional cleaning values combined with modern techniques.
                </p>
                <p className="mt-4">
                  We believe that when we leave your space spotless, it creates a ripple effect of positivity in your
                  life. That's why we're not just cleaning—we're creating smiles, one{" "}
                  <span className="inline-flex items-center rounded-md px-1 py-0.5 bg-brooms-bg-emphasis text-brooms-text-emphasis">
                    broom
                  </span>{" "}
                  at a time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default WhySmileybrooms
