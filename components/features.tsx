"use client"

import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      title: "Eco-Friendly Products",
      description: "We use only non-toxic, biodegradable cleaning solutions safe for your family and pets.",
    },
    {
      title: "Experienced Professionals",
      description: "Our team consists of highly trained, vetted, and insured cleaning specialists.",
    },
    {
      title: "Customizable Plans",
      description:
        "Tailor your cleaning service to your exact needs, from one-time deep cleans to recurring maintenance.",
    },
    {
      title: "100% Satisfaction Guarantee",
      description: "If you're not happy, we'll re-clean for free. Your satisfaction is our priority.",
    },
    {
      title: "Flexible Scheduling",
      description: "Book appointments at your convenience, with easy online rescheduling options.",
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees. Get an instant quote and know exactly what you're paying for.",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            Why Choose Smiley Brooms?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We go above and beyond to ensure your home is sparkling clean and your experience is seamless.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">
                <CheckCircle className="h-10 w-10 text-blue-500" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
