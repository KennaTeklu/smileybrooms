import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smile, Leaf, ShieldCheck, Star } from "lucide-react"

export default function WhySmileyBrooms() {
  const reasons = [
    {
      icon: Smile,
      title: "Customer Satisfaction",
      description: "We guarantee a smile on your face with our thorough and reliable cleaning services.",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Approach",
      description: "We use non-toxic, sustainable cleaning products for a healthier home and planet.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Professionals",
      description: "Our team is fully vetted, trained, and insured for your peace of mind.",
    },
    {
      icon: Star,
      title: "Customized Cleaning",
      description: "Tailored services to meet your unique needs and preferences.",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Smiley Brooms?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
