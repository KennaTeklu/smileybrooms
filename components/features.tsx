import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SparklesIcon, ClockIcon, ShieldCheckIcon, HandshakeIcon, LeafIcon, StarIcon } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <SparklesIcon className="h-8 w-8 text-blue-500" />,
      title: "Sparkling Clean Guarantee",
      description: "We ensure every corner of your home shines, backed by our satisfaction guarantee.",
    },
    {
      icon: <ClockIcon className="h-8 w-8 text-green-500" />,
      title: "Flexible Scheduling",
      description: "Book one-time, weekly, bi-weekly, or monthly cleanings to fit your busy life.",
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-purple-500" />,
      title: "Trusted Professionals",
      description: "Our team is thoroughly vetted, insured, and trained to deliver exceptional service.",
    },
    {
      icon: <HandshakeIcon className="h-8 w-8 text-yellow-500" />,
      title: "Transparent Pricing",
      description: "No hidden fees. Get an instant, accurate quote based on your specific needs.",
    },
    {
      icon: <LeafIcon className="h-8 w-8 text-emerald-500" />,
      title: "Eco-Friendly Products",
      description: "We use safe, non-toxic, and environmentally responsible cleaning solutions.",
    },
    {
      icon: <StarIcon className="h-8 w-8 text-red-500" />,
      title: "Customizable Services",
      description: "Tailor your cleaning plan with specific room selections and add-on services.",
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50">Why Choose Smiley Brooms?</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Experience the difference with our commitment to quality, flexibility, and trust.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col items-center text-center p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">{feature.icon}</CardHeader>
              <CardContent className="space-y-2">
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
