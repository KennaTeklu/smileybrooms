import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      title: "Standard Cleaning",
      description: "Regular cleaning service for maintained homes",
      price: "From $110",
      features: [
        "Dusting all accessible surfaces",
        "Vacuuming floors and carpets",
        "Mopping hard floors",
        "Cleaning bathrooms",
        "Cleaning kitchen surfaces",
        "Emptying trash bins",
      ],
      popular: false,
      href: "/pricing",
    },
    {
      title: "Premium Detailing",
      description: "Deep cleaning service for thorough results",
      price: "From $198",
      features: [
        "Everything in Standard Cleaning",
        "Inside appliance cleaning",
        "Deep fixture cleaning",
        "Hard-to-reach areas",
        "Cabinet interiors",
        "Window sills and tracks",
      ],
      popular: true,
      href: "/pricing",
    },
    {
      title: "Move In/Out Cleaning",
      description: "Comprehensive cleaning for property transitions",
      price: "From $250",
      features: [
        "Everything in Premium Detailing",
        "Inside all cabinets and drawers",
        "Inside oven and refrigerator",
        "Window cleaning",
        "Baseboard detailed cleaning",
        "Wall spot cleaning",
      ],
      popular: false,
      href: "/pricing",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Cleaning Services</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Professional cleaning services tailored to your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <Card key={index} className={`overflow-hidden ${service.popular ? "border-primary shadow-lg" : ""}`}>
            {service.popular && (
              <div className="bg-primary text-white text-center py-1 text-sm font-medium">Most Popular</div>
            )}
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
              <div className="mt-2 text-2xl font-bold">{service.price}</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <Link href={service.href}>
                  Book Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          We offer customized cleaning plans for special requirements. Contact us to discuss your specific needs.
        </p>
        <Button asChild variant="outline" size="lg">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}
