"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Star, Users, ShieldCheck } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      title: "Customizable Cleaning Plans",
      description: "Tailor your cleaning service to your exact needs, from room selection to specific tasks.",
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Experienced & Vetted Professionals",
      description: "Our team consists of highly trained, background-checked, and insured cleaning experts.",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Eco-Friendly Products",
      description: "We use environmentally safe and non-toxic cleaning solutions for a healthier home.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-purple-500" />,
      title: "100% Satisfaction Guarantee",
      description: "If you're not completely satisfied, we'll re-clean at no extra charge.",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50">Why Choose Smiley Brooms?</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Experience the difference with our commitment to quality, reliability, and customer satisfaction.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div className="mb-4">{feature.icon}</div>
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-gray-500 dark:text-gray-400">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
