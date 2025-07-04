import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function PricingPage() {
  const pricingTiers = [
    {
      name: "Standard Clean",
      price: "$99",
      frequency: "starting from",
      features: [
        "Basic dusting & wiping",
        "Vacuuming & mopping floors",
        "Bathroom sanitization",
        "Kitchen surface wipe-down",
        "Trash removal",
      ],
      buttonText: "Get Standard Quote",
      link: "/calculator",
      highlight: false,
    },
    {
      name: "Deep Clean",
      price: "$149",
      frequency: "starting from",
      features: [
        "Includes Standard Clean",
        "Detailed dusting (baseboards, blinds)",
        "Deep kitchen cleaning (inside microwave)",
        "Deep bathroom cleaning (grout scrubbing)",
        "Vent cleaning",
        "Light organization",
      ],
      buttonText: "Get Deep Clean Quote",
      link: "/calculator",
      highlight: true,
    },
    {
      name: "Elite Clean",
      price: "$199",
      frequency: "starting from",
      features: [
        "Includes Deep Clean",
        "Interior window cleaning",
        "Wall spot cleaning",
        "Appliance exterior polishing",
        "Cabinet exterior wipe-down",
        "Post-event tidying",
        "Eco-friendly products only",
      ],
      buttonText: "Get Elite Quote",
      link: "/calculator",
      highlight: false,
    },
  ]

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-10">Our Flexible Pricing Plans</h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
        Choose the perfect cleaning service that fits your needs and budget.
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        {pricingTiers.map((tier, index) => (
          <Card
            key={index}
            className={`flex flex-col shadow-lg ${tier.highlight ? "border-2 border-primary-foreground shadow-xl" : ""}`}
          >
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold">{tier.name}</CardTitle>
              <div className="mt-2">
                <span className="text-5xl font-extrabold text-primary">{tier.price}</span>
                <span className="text-lg text-gray-600 dark:text-gray-400">/{tier.frequency}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between p-6">
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`w-full text-lg py-3 ${tier.highlight ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : ""}`}
              >
                <Link href={tier.link}>{tier.buttonText}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-12" />

      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Need a Custom Quote?</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          For larger homes, commercial spaces, or specialized cleaning needs, we offer personalized quotes.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Contact Us for a Custom Quote</Link>
        </Button>
      </div>
    </div>
  )
}
