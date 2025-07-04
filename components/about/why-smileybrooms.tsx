import { Star, ShieldCheck, Users, Leaf, Smile } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function WhySmileyBrooms() {
  const reasons = [
    {
      icon: Star,
      title: "Exceptional Quality",
      description: "We go above and beyond to ensure every corner sparkles.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Professionals",
      description: "Our team is vetted, trained, and insured for your peace of mind.",
    },
    {
      icon: Users,
      title: "Personalized Service",
      description: "Tailored cleaning plans to meet your unique needs.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Approach",
      description: "Safe for your family, pets, and the planet.",
    },
    {
      icon: Smile,
      title: "100% Satisfaction",
      description: "We're not happy until you're absolutely delighted with our service.",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reasons.map((reason, index) => {
        const Icon = reason.icon
        return (
          <Card key={index} className="text-center p-6 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center">
              <Icon className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{reason.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
