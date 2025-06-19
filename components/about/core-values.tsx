/* Don't modify beyond what is requested ever. */
/*  
 * STRICT DIRECTIVE: Modify ONLY what is explicitly requested.  
 * - No refactoring, cleanup, or "improvements" outside the stated task.  
 * - No behavioral changes unless specified.  
 * - No formatting, variable renaming, or unrelated edits.  
 * - Reject all "while you're here" temptations.  
 *  
 * VIOLATIONS WILL BREAK PRODUCTION.  
 */  
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Leaf, Award, Users } from "lucide-react"

export function CoreValues() {
  const values = [
    {
      icon: Heart,
      title: "Trust",
      description:
        "We build lasting relationships with our clients through honesty, reliability, and consistent quality.",
    },
    {
      icon: Shield,
      title: "Quality",
      description: "We're committed to excellence in every cleaning job, no matter how big or small.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We use eco-friendly products and practices to protect your health and our planet.",
    },
    {
      icon: Award,
      title: "Professionalism",
      description: "Our trained and vetted cleaning specialists take pride in their work and attention to detail.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We're proud to serve our local community and contribute to making homes healthier and happier.",
    },
  ]

  return (
    <section className="h-full flex items-center justify-center bg-gradient-to-b from-primary/5 to-transparent py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
