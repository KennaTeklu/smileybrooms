import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      description: "Essential features for small businesses",
      price: "$29.99",
      features: ["5 user accounts", "10GB storage", "Basic analytics", "Email support"],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Premium",
      description: "Advanced features for growing businesses",
      price: "$49.99",
      features: ["25 user accounts", "50GB storage", "Advanced analytics", "Priority support", "API access"],
      popular: true,
      buttonText: "Get Premium",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      description: "Complete solution for large organizations",
      price: "$99.99",
      features: [
        "Unlimited users",
        "500GB storage",
        "Custom analytics",
        "24/7 dedicated support",
        "API access",
        "Custom integrations",
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="py-8">
          <h1 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Choose the plan that's right for your business
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={`flex flex-col ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4 text-3xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground"> /month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant={plan.buttonVariant} className="w-full" asChild>
                    <Link href="/">{plan.buttonText}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
