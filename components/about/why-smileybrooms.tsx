"use client"

import { Card, CardContent } from "@/components/ui/card"

export function WhySmileybrooms() {
  return (
    <section className="h-full flex items-center justify-center bg-gradient-to-b from-primary/5 to-transparent py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why "smileybrooms"?</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-lg">
                <p>
                  Our name reflects our philosophy: cleaning should bring happiness. The "smiley" represents the
                  satisfaction and joy that comes from a clean, healthy space. The "brooms" symbolize our commitment to
                  traditional cleaning values combined with modern techniques.
                </p>
                <p className="mt-4">
                  We believe that when we leave your space spotless, it creates a ripple effect of positivity in your
                  life. That's why we're not just cleaning—we're creating smiles, one broom at a time.
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
