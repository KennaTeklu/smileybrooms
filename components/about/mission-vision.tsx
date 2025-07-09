"use client"

import { Card, CardContent } from "@/components/ui/card"

export function MissionVision() {
  return (
    <section className="h-full flex items-center justify-center bg-gradient-to-b from-primary/10 to-transparent py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Mission</h3>
                  <p className="text-lg">
                    To provide exceptional cleaning services that create healthier, happier spaces while treating our
                    team members with respect and offering sustainable career opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Vision</h3>
                  <p className="text-lg">
                    To transform the cleaning industry by setting new standards for quality, sustainability, and
                    customer satisfaction, one spotless space at a time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default MissionVision
