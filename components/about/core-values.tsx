import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Handshake, Leaf, Heart } from "lucide-react"

export default function CoreValues() {
  const values = [
    {
      icon: Sparkles,
      title: "Excellence in Cleanliness",
      description:
        "We are committed to delivering the highest standards of cleanliness, ensuring every corner sparkles.",
    },
    {
      icon: Handshake,
      title: "Trust & Reliability",
      description: "Building lasting relationships through consistent, dependable, and trustworthy service.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Practices",
      description: "Utilizing sustainable products and methods to protect your home and the planet.",
    },
    {
      icon: Heart,
      title: "Customer Happiness",
      description:
        "Your satisfaction is our priority. We go the extra mile to ensure you're delighted with our service.",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
