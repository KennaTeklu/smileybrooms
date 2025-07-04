import { Lightbulb, Handshake, Leaf, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function CoreValues() {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously seeking new and better ways to deliver exceptional cleaning services.",
    },
    {
      icon: Handshake,
      title: "Integrity",
      description: "Operating with honesty, transparency, and ethical practices in all our interactions.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Committed to eco-friendly practices and products for a healthier planet.",
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description: "Prioritizing our clients' needs and satisfaction above all else.",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {values.map((value, index) => {
        const Icon = value.icon
        return (
          <Card key={index} className="text-center p-6 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center">
              <Icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
