import { ShieldCheck, Users, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function OurCommitment() {
  const commitments = [
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      description: "We guarantee a spotless clean every time, backed by our satisfaction promise.",
    },
    {
      icon: Users,
      title: "Professional Team",
      description: "Our cleaners are thoroughly vetted, trained, and dedicated to excellence.",
    },
    {
      icon: Sparkles,
      title: "Eco-Friendly Practices",
      description: "We use sustainable products and methods for a healthier home and planet.",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {commitments.map((commitment, index) => {
        const Icon = commitment.icon
        return (
          <Card key={index} className="text-center p-6 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center">
              <Icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{commitment.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{commitment.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
