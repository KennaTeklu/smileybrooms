import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Users, Leaf } from "lucide-react"

export default function OurCommitment() {
  const commitments = [
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "Rigorous training and quality checks ensure every clean meets our high standards.",
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Fully insured and bonded professionals for your peace of mind.",
    },
    {
      icon: Users,
      title: "Professional Team",
      description: "Experienced, vetted, and friendly cleaning specialists dedicated to your satisfaction.",
    },
    {
      icon: Leaf,
      title: "Eco-Conscious Cleaning",
      description: "Using non-toxic, biodegradable products for a healthier home and planet.",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-blue-50 dark:bg-blue-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Commitment to You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {commitments.map((commitment, index) => {
            const Icon = commitment.icon
            return (
              <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto p-4 rounded-full bg-white dark:bg-gray-800 text-blue-600 mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{commitment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{commitment.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
